/* ============================================================
   ARSIP PROPERTI — Service worker (sw.js)
   Hanya menyimpan daftar tetap file tampilan supaya aplikasi bisa
   dibuka tanpa internet dan menampilkan pesan yang jelas.
   Jawaban API dan apa pun dari Google TIDAK PERNAH disimpan.

   Setiap kali file tampilan berubah, naikkan nomor VERSI di bawah.
   Cara kerja: file tampilan SELALU diambil dari internet lebih dulu, sehingga pembaruan
   langsung terpasang. Simpanan hanya dipakai bila internet mati atau terlalu lambat.
   ============================================================ */

const VERSI = 'app-v17';
const FILE_TAMPILAN = [
  './',
  './index.html',
  './stylesheet.css',
  './javascript.js',
  './manifest.webmanifest',
  './wa-putih.svg',
  './wa-hijau.svg',
  './wilayah.json',
  './marka.png',
  './hero-rumah.jpg',
  './papan.jpg',
  './bg-masuk.jpg',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(VERSI)
      .then(function (c) {
        // Satu file yang hilang tidak boleh menggagalkan seluruh pemasangan versi baru.
        return Promise.all(FILE_TAMPILAN.map(function (f) { return c.add(new Request(f, { cache: 'reload' })).catch(function () { /* lewati */ }); }));
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (kunci) {
        return Promise.all(kunci.filter(function (k) { return k !== VERSI; }).map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  const req = e.request;
  if (req.method !== 'GET') return;                 // kiriman API (POST) tidak disentuh
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;  // Google, font, dan API tidak disentuh

  const lingkup = new URL(self.registration.scope);
  let jalur = url.pathname;
  if (jalur.indexOf(lingkup.pathname) !== 0) return;
  jalur = './' + jalur.slice(lingkup.pathname.length);
  if (jalur === './index.html' || req.mode === 'navigate') jalur = './';
  if (FILE_TAMPILAN.indexOf(jalur) < 0) return;

  const alamat = new URL(jalur, self.registration.scope).href;
  e.respondWith(
    ambilDulu(alamat, jalur)
  );
});

/** Internet dulu (maksimal 6 detik); bila gagal atau lambat, pakai simpanan. */
function ambilDulu(alamat, jalur) {
  const pengendali = new AbortController();
  const waktu = setTimeout(function () { pengendali.abort(); }, 6000);
  return fetch(alamat, { cache: 'no-cache', signal: pengendali.signal })
    .then(function (res) {
      clearTimeout(waktu);
      if (res && res.ok) {
        const salin = res.clone();
        caches.open(VERSI).then(function (c) { return c.put(jalur, salin); });
        return res;
      }
      return dariSimpanan(jalur, res);
    })
    .catch(function () {
      clearTimeout(waktu);
      return dariSimpanan(jalur, null);
    });
}

function dariSimpanan(jalur, cadangan) {
  return caches.open(VERSI).then(function (c) { return c.match(jalur); }).then(function (s) {
    return s || cadangan || Response.error();
  });
}
