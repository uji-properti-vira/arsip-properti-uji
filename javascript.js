/* VERSI UJI — akun virakhususgame@gmail.com */
/* ============================================================
   ARSIP PROPERTI — Logika tampilan (javascript.js)
   Versi 5.3 — 4 November 2026. Butuh Code.gs 2.9. Baru: gambar promo agen di menu Listing (maks 3, tanpa watermark) dan gaya gambar "Banner Gading Pro" di layar promo. Sebelumnya (5.1): data lama (arsip) tetap muncul di pencarian dengan label Arsip;
   daftar panjang tampil bertahap saat digulir; Listing punya panjang x lebar, keterangan tambahan masuk ke catatan,
   umur listing; baris kecil di Beranda yang menunjukkan ukuran dan lama muat data.
   Versi 5.0 — 2 November 2026. Butuh Code.gs 2.5. Baru: menu Listing untuk info properti dari grup WhatsApp agen lain
   (tombol Tempel dari WA, pembaca pesan tanpa AI, isian kuning bila kurang yakin, pencocokan dengan pembeli Anda,
   status dan komisi kesepakatan). Lencana merah menu Listing = jumlah yang masih berstatus Baru.
   Versi 4.7 — 2 November 2026. Urusan hampers dihapus dari tampilan. Angka di Beranda dan tab Segera
   kini sama: ulang tahun hari ini sampai H-3 yang belum diucapkan. Code.gs tidak berubah (tetap 2.4).
   Versi 4.5 revisi lengkap — 2 November 2026. Butuh Code.gs 2.4. Baru: fasilitas properti (ukuran tanah,
   carport, listrik, air, menghadap), harga promo dan BU, filter Diskon dan BU, ulang tahun klien di Beranda,
   gambar promo untuk banyak foto, dan pengingat pembeli yang sudah dapat tidak diingatkan lagi.
   Ada dua paket: ASLI (akun Pak Pudji, tanpa pita) dan UJI (pita VERSI UJI). Isi kedua paket sama
   kecuali CONFIG.MODE dan API_URL.
   Versi 4.6 — 1 November 2026. Baru di 4.6: KTP, NPWP, dan Sertifikat disimpan dua versi
   (ber-watermark untuk dilihat dan dibagikan, asli tanpa watermark untuk arsip). Unduh versi asli
   hanya setelah konfirmasi dan dicatat. Ubah jenis foto lama ke KTP/NPWP/Sertifikat juga dibuatkan
   dua versi. Butuh Code.gs 2.4.
   Versi 4.5 awal — 1 November 2026: menu Gambar promo (4:5) di profil penjual, per properti.
   Versi 4.4 — 1 November 2026
   Baru di 4.4: area dipecah jadi Area + Kota dengan saran otomatis dari daftar wilayah
   baku (wilayah.json); pencocokan tiga tingkat (cocok, hampir cocok, alternatif di atas
   budget); watermark logo Gading Pro + nama agen di tengah foto properti saat disimpan
   (marka.png); foto di layar Bagikan tampil 2 kolom, 6 per halaman. Butuh Code.gs 2.3.
   Versi 4.3 — 1 November 2026 (API_URL diarahkan ke akun Pak Pudji, 1 Nov 2026)
   Baru di 4.3 (hasil audit keamanan kedua): foto yang belum tersimpan dibuang dari HP
   saat sesi berakhir atau saat aplikasi dibuka tanpa tiket yang sah; KTP/NPWP disaring
   lagi tepat sebelum menu Bagikan dibuka (juga bila fotonya sudah ada di memori).
   Versi 4.2 — 31 Oktober 2026
   Baru di 4.2: tombol WhatsApp memakai logo resmi WhatsApp (berkas dari Meta
   Brand Resource Center, dipakai apa adanya tanpa diubah warnanya); tulisan
   tombol chat diperjelas jadi "di WhatsApp (tanpa foto)" supaya tidak terbaca SMS.
   Versi 4.1 — 31 Oktober 2026
   Baru di 4.1 (hasil audit keamanan): aplikasi menolak dibuka di dalam bingkai
   situs lain, dan foto untuk dibagikan diminta dengan tanda khusus supaya
   KTP/NPWP ikut ditolak server. Butuh Code.gs 2.1 untuk pagar servernya.
   Versi 4.0 — 27 Oktober 2026
   Baru: harga jual/sewa, ukuran, sertifikat, komisi, Deal/Sold dengan pita,
         status pembeli + pencocokan otomatis, pengingat hubungi lagi,
         tulisan dirapikan otomatis, tetap masuk 14 hari, foto aman di HP,
         foto kecil di daftar, bagikan ke WhatsApp, hapus + Baru dihapus,
         ubah jenis dokumen, cek klien ganda, rapikan area.
   Butuh Code.gs versi 2.0.
   ============================================================ */
'use strict';

/* ════════════════════════════════════════════════════════════
   PENOLAK BINGKAI (anti-clickjacking)
   Situs lain bisa memuat aplikasi ini di dalam bingkai tak terlihat, lalu
   memancing agen menekan tombol yang tidak dia maksud (misalnya Hapus).
   GitHub Pages tidak bisa mengatur ini dari server, jadi dijaga di sini.
   ════════════════════════════════════════════════════════════ */
(function () {
  let dibingkai = false;
  try {
    dibingkai = window.top !== window.self;
  } catch (e) {
    dibingkai = true;   // tidak boleh dibaca = memang beda situs
  }
  if (!dibingkai) return;
  try { window.top.location = window.self.location; } catch (e) { /* diblokir, lanjut ke pesan */ }
  document.addEventListener('DOMContentLoaded', function () {
    document.body.textContent = '';
    const p = document.createElement('p');
    p.style.cssText = 'font:16px/1.6 sans-serif;padding:24px;text-align:center';
    p.textContent = 'Aplikasi ini tidak bisa dibuka dari dalam halaman lain. Buka langsung dari ikon Arsip Properti di layar utama.';
    document.body.appendChild(p);
  });
  // Hentikan sisa file supaya tidak ada data yang dimuat di dalam bingkai.
  throw new Error('Dibuka di dalam bingkai: dihentikan.');
})();

/* ════════════════════════════════════════════════════════════
   CONFIG — SATU-SATUNYA TEMPAT ALAMAT DITULIS
   Keduanya bukan rahasia, aman berada di GitHub.
   ════════════════════════════════════════════════════════════ */
const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbzoqgHmIXoUB4V3qbhN2vuQCW7R-1Bv2fcAJe06bqbkAJYFHpNGQ4y2bg0jAwjDvN4/exec',
  GOOGLE_CLIENT_ID: '76556701841-t7gj13v1g4dvser39d2cs6e9f5qu2lbh.apps.googleusercontent.com',
  MODE: 'uji',                // 'uji' menampilkan pita VERSI UJI; 'asli' tidak menampilkan apa pun
  NAMA_PEMILIK: 'Pudji',      // nama agen, tampil di sapaan, layar masuk, dan pesan WhatsApp
  FOTO_SISI_MAKS: 1600,       // sisi terpanjang foto setelah dikecilkan (px)
  FOTO_KUALITAS: 0.7,         // kualitas JPEG (0 sampai 1)
  MINI_SISI: 320,             // sisi terpanjang foto kecil untuk daftar (px)
  BATAS_WAKTU_MS: 60000,      // batas tunggu panggilan biasa
  BATAS_WAKTU_UNGGAH_MS: 120000,
  BATAS_WAKTU_PDF_MS: 330000,
  PDF_MAKS_FOTO: 30,          // harus sama dengan PDF_MAKS_FOTO di Code.gs
  BATAS_BUDGET_HAMPIR: 0.30,  // harga sampai 30% di atas budget = "hampir cocok"
  BATAS_BUDGET_ALT: 0.60,     // 30% sampai 60% di atas budget = "alternatif"
  MARKA_TEKS: 'Pudji',        // tulisan di bawah logo watermark foto properti
  NO_HP_PEMILIK: '0813 8279 9845',   // kaki gambar promo dan isian Nama dan HP agen
  NAMA_BANNER: 'PUJI TAN',           // nama di strip Gaya Banner Gading Pro (QR qr-wa.png dibuat dari nomor ini)
  FOTO_PER_HALAMAN: 6,        // foto per halaman di layar Bagikan (2 kolom x 3 baris)
  VERSI_SERVER_MIN: '2.9'     // versi Code.gs yang dibutuhkan tampilan ini
};

/* ── Daftar tetap ─────────────────────────────────────────── */
const JENIS_DOK = ['KTP', 'NPWP', 'PBB', 'Sertifikat', 'Foto properti', 'Lainnya'];
const DOK_KLIEN = ['KTP', 'NPWP'];
const DOK_PROPERTI = ['PBB', 'Sertifikat', 'Foto properti'];
const DOK_BOLEH_DIBAGIKAN = ['PBB', 'Sertifikat'];   // hanya dengan persetujuan penjual; KTP dan NPWP tidak pernah
// Disimpan dua versi: ber-watermark (untuk dilihat, dibagikan, PDF) dan asli tanpa watermark (arsip, unduh terbatas).
const DOK_DUA_VERSI = ['KTP', 'NPWP', 'Sertifikat', 'Foto properti'];   // 5.3: foto properti ikut, supaya banner bisa memakai foto asli
const DOK_SUDAH_MARKA = ['KTP', 'NPWP', 'Sertifikat', 'Foto properti'];   // foto jenis ini yang sudah ada sudah ber-watermark
const JENIS_PROP = ['Rumah', 'Tanah', 'Ruko', 'Lainnya'];
const ARAH_HADAP = ['Utara', 'Timur Laut', 'Timur', 'Tenggara', 'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'];
const LISTRIK_VA = ['900', '1300', '2200', '3500', '4400', '5500'];
const KONDISI = ['Baru', 'Second'];
const SERTIFIKAT = ['SHM', 'HGB', 'AJB', 'Girik', 'Lainnya'];
const PROGRES_PROP = ['Tersedia', 'Negosiasi', 'Deal', 'Sold', 'Batal', 'Agen lain'];
const STATUS_BELI = ['Mencari', 'Sudah dapat', 'Tidak lanjut'];
const FOTO_BATCH_MAKS = 20;   // paling banyak foto dalam satu kali simpan
const BAGIKAN_FOTO_MAKS = 10; // paling banyak foto dalam satu kiriman WhatsApp
const SESI_MAKS_MS = 14 * 24 * 60 * 60 * 1000;   // sama dengan SESI_MAKS_HARI di Code.gs

/* ── Keadaan aplikasi (hanya di memori halaman) ───────────── */
const S = {
  tiket: null,
  data: null,              // { klien:[], properti:[], dokumen:[] }
  layar: null,             // layar yang sedang tampil
  baruDibuka: [],          // id klien saja
  sibuk: false,            // true selama proses yang tidak boleh ditinggal
  bannerBerikut: null,     // banner untuk layar berikutnya
  bannerTertunda: null,
  urlFoto: new Map(),      // id_dokumen -> { url, blob } foto besar sementara (memori)
  mini: new Map(),         // id_dokumen -> alamat foto kecil (memori)
  miniGagal: new Set(),    // foto kecil yang belum tersedia di server (dicoba lagi saat aplikasi dibuka ulang)
  foto: null,              // foto yang baru diambil dan belum tersimpan (juga disimpan di HP)
  pdf: null,               // PDF terakhir yang dibuat
  tutupDialog: null,
  gisJanji: null,
  gisSiap: false,
  dibangunkan: false,
  perluMuatUlang: false,
  ukuranData: 0,           // ukuran jawaban muatData terakhir (huruf)
  waktuMuat: 0,            // lama muatData terakhir (ms)
  menyegarkan: false
};

/* ════════════════════════════════════════════════════════════
   PEMBANTU TAMPILAN
   Semua teks dari data ditulis dengan textContent, bukan innerHTML.
   ════════════════════════════════════════════════════════════ */

function el(tag, props) {
  const e = document.createElement(tag);
  if (props) {
    Object.keys(props).forEach(function (k) {
      const v = props[k];
      if (v === undefined || v === null || v === false) return;
      if (k === 'class') e.className = v;
      else if (k === 'text') e.textContent = v;
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') e.addEventListener(k.slice(2), v);
      else if (v === true) e.setAttribute(k, '');
      else e.setAttribute(k, String(v));
    });
  }
  for (let i = 2; i < arguments.length; i++) tambahAnak(e, arguments[i]);
  return e;
}

function tambahAnak(e, a) {
  if (a === undefined || a === null || a === false) return;
  if (Array.isArray(a)) { a.forEach(function (x) { tambahAnak(e, x); }); return; }
  e.append(a instanceof Node ? a : document.createTextNode(String(a)));
}

function kosongkan(n) { while (n.firstChild) n.removeChild(n.firstChild); }

const IKON = {
  cari: ['M18 11a7 7 0 1 1-14 0a7 7 0 1 1 14 0z', 'M16.2 16.2L21 21'],
  arsip: ['M4 4h16v4H4z', 'M5.5 8v12h13V8', 'M10 12.5h4'],
  tempel: ['M9 4h6v3H9z', 'M7 5.5H5.5A1.5 1.5 0 0 0 4 7v13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 20V7a1.5 1.5 0 0 0-1.5-1.5H17', 'M8.5 12h7', 'M8.5 16h5'],
  daftar: ['M9 6h11', 'M9 12h11', 'M9 18h11', 'M4.5 6h.01', 'M4.5 12h.01', 'M4.5 18h.01'],
  orang: ['M16 8a4 4 0 1 1-8 0a4 4 0 1 1 8 0z', 'M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8'],
  tambahOrang: ['M13 8a4 4 0 1 1-8 0a4 4 0 1 1 8 0z', 'M2 21c0-3.9 3.1-7 7-7s7 3.1 7 7', 'M19 8v6', 'M16 11h6'],
  kamera: ['M3 8.5A1.5 1.5 0 0 1 4.5 7h3l1.5-2.5h6L16.5 7h3A1.5 1.5 0 0 1 21 8.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z', 'M16 13.5a4 4 0 1 1-8 0a4 4 0 1 1 8 0z'],
  perisai: ['M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z', 'M8.5 12l2.5 2.5 4.5-5'],
  printer: ['M6 9V3h12v6', 'M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2', 'M6 14h12v7H6z'],
  telepon: ['M5 3h3.5l1.5 5-2.2 1.4a11 11 0 0 0 6.8 6.8L16 14l5 1.5V19a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z'],
  pesan: ['M4 5h16v11H9l-5 4z', 'M8 9.5h8', 'M8 12.5h5'],
  rumah: ['M3 11l9-7 9 7', 'M5 9.5V20h14V9.5', 'M10 20v-6h4v6'],
  centang: ['M5 12.5l4.5 4.5L19 7.5'],
  silang: ['M6 6l12 12', 'M18 6L6 18'],
  peringatan: ['M21 12a9 9 0 1 1-18 0a9 9 0 1 1 18 0z', 'M12 7.5v5.5', 'M12 16.5v.5'],
  info: ['M21 12a9 9 0 1 1-18 0a9 9 0 1 1 18 0z', 'M12 11v6', 'M12 7.5v.5'],
  ulang: ['M20 12a8 8 0 1 1-2.3-5.7', 'M20 4v4.5h-4.5'],
  unduh: ['M12 4v11', 'M7 10.5l5 5 5-5', 'M5 20h14'],
  bagikan: ['M12 15V4', 'M7.5 8.5L12 4l4.5 4.5', 'M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6'],
  keluar: ['M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3', 'M10 8l-4 4 4 4', 'M6 12h10'],
  kanan: ['M9 6l6 6-6 6'],
  kiri: ['M15 6l-6 6 6 6'],
  dokumen: ['M6 3h8l4 4v14H6z', 'M14 3v4h4', 'M9 12h6', 'M9 16h6'],
  catatan: ['M5 4h14v16H5z', 'M8 9h8', 'M8 13h8', 'M8 17h5'],
  kartu: ['M3 6h18v12H3z', 'M10 10.5a2 2 0 1 1-4 0a2 2 0 1 1 4 0z', 'M5.5 15.5c.5-1.3 1.6-2 2.5-2s2 .7 2.5 2', 'M13 10h5', 'M13 14h4'],
  gambar: ['M4 5h16v14H4z', 'M4 16l5-5 4 4 2-2 5 5', 'M16 9.5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 1 1 3 0z'],
  perbesar: ['M18 11a7 7 0 1 1-14 0a7 7 0 1 1 14 0z', 'M16.2 16.2L21 21', 'M11 8v6', 'M8 11h6'],
  perkecil: ['M18 11a7 7 0 1 1-14 0a7 7 0 1 1 14 0z', 'M16.2 16.2L21 21', 'M8 11h6'],
  tambah: ['M12 5v14', 'M5 12h14'],
  pensil: ['M4 20h4L19 9l-4-4L4 16z', 'M13.5 6.5l4 4'],
  pin: ['M12 21s-7-6.2-7-11.5a7 7 0 1 1 14 0C19 14.8 12 21 12 21z', 'M14.5 9.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 1 1 5 0z'],
  label: ['M3 12V4h8l10 10-8 8z', 'M8 8.5h.01'],
  awanPutus: ['M7 18h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.6 9.1A4.5 4.5 0 0 0 7 18z', 'M4 4l16 16'],
  gedung: ['M4 21V9l8-5.5L20 9v12', 'M9 21v-6h6v6', 'M9 12h.01', 'M15 12h.01'],
  tambahRumah: ['M3 11l9-7 9 7', 'M5 9.5V20h8', 'M10 20v-5h3', 'M18 15v6', 'M15 18h6'],
  jam: ['M21 12a9 9 0 1 1-18 0a9 9 0 1 1 18 0z', 'M12 7v5l3.5 2'],
  grafik: ['M5 20v-8', 'M12 20V5', 'M19 20v-11'],
  sembunyi: ['M3 3l18 18', 'M10.6 6.1A10 10 0 0 1 12 6c5 0 9 6 9 6a17 17 0 0 1-2.6 3.2', 'M6.3 7.8C4.2 9.4 3 12 3 12s4 6 9 6a9 9 0 0 0 4-1'],
  sampah: ['M4 7h16', 'M9 7V4h6v3', 'M6 7l1 13h10l1-13', 'M10 11v5', 'M14 11v5'],
  lonceng: ['M6 16V11a6 6 0 1 1 12 0v5l2 2H4z', 'M10 20a2 2 0 0 0 4 0'],
  kalender: ['M4 6h16v14H4z', 'M4 10h16', 'M8 3v5', 'M16 3v5'],
  salin: ['M8 8h11v12H8z', 'M5 16V4h11'],
  uang: ['M3 7h18v10H3z', 'M14.5 12a2.5 2.5 0 1 1-5 0a2.5 2.5 0 1 1 5 0z', 'M6 10v4', 'M18 10v4'],
  penggaris: ['M3 17L17 3l4 4L7 21z', 'M7 13l2 2', 'M10 10l2 2', 'M13 7l2 2'],
  cocok: ['M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z'],
  pindah: ['M4 8h13', 'M13 4l4 4-4 4', 'M20 16H7', 'M11 12l-4 4 4 4'],
  area: ['M9 4l-5 2v14l5-2 6 2 5-2V4l-5 2z', 'M9 4v14', 'M15 6v14'],
  lainnya: ['M5 12h.01', 'M12 12h.01', 'M19 12h.01'],
  perangkat: ['M7 3h10v18H7z', 'M11 18h2']
};

function ikon(nama, kelas) {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('class', 'ikon' + (kelas ? ' ' + kelas : ''));
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  (IKON[nama] || []).forEach(function (d) {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    svg.appendChild(p);
  });
  return svg;
}

function tombol(kelas, ikonNama, teks, aksi, attr) {
  const props = Object.assign({ type: 'button', class: 'tombol ' + (kelas || ''), onclick: aksi }, attr || {});
  const gbr = ikonNama instanceof Node ? ikonNama : (ikonNama ? ikon(ikonNama) : null);
  return el('button', props, gbr, el('span', { text: teks }));
}

/**
 * Logo resmi WhatsApp (milik Meta), dari Brand Resource Center.
 * Berkasnya dipakai apa adanya, tidak diubah warna atau bentuknya, sesuai
 * aturan pakai merek mereka. Dua warna: putih untuk tombol hijau tua,
 * hijau untuk tombol berlatar terang.
 * alt sengaja kosong karena tulisan di sebelahnya sudah menyebut WhatsApp.
 */
function ikonWa(warna, kelas) {
  return el('img', {
    src: warna === 'putih' ? './wa-putih.svg' : './wa-hijau.svg',
    alt: '', width: '26', height: '26',
    class: 'ikon-wa' + (kelas ? ' ' + kelas : '')
  });
}

/** "Lainnya: Gudang" tampil sebagai "Gudang". */
function namaJenis(j) {
  return String(j || '').replace(/^Lainnya: ?/, '') || 'Lainnya';
}

const LABEL_PROGRES = { 'Agen lain': 'Laku agen lain' };
function labelProgres(p) { return LABEL_PROGRES[p] || p; }

function chip(nilai, label) {
  return el('span', { class: 'chip chip-' + String(nilai).replace(/\s+/g, '-'), text: label || labelProgres(nilai) });
}

/** Label netral tanpa titik warna (penawaran, area, kebutuhan pembeli). */
function chipNetral(teks) {
  return el('span', { class: 'chip chip-pen', text: teks });
}

/** Baris tombol penyaring yang bisa digeser ke samping. nilai '' = semua. */
function barisSaring(judul, daftar, nilai, saatPilih) {
  const tombolTombol = daftar.map(function (d) {
    return el('button', { type: 'button', class: 'saring', 'aria-pressed': d.kode === nilai ? 'true' : 'false', onclick: function () { saatPilih(d.kode); }, text: d.label });
  });
  return el('div', { class: 'saring-wadah', role: 'group', 'aria-label': judul },
    el('p', { class: 'saring-judul', text: judul }),
    el('div', { class: 'saring-baris' }, tombolTombol));
}

/** Tab dua atau tiga pilihan. "lencana" = lingkaran merah berisi angka. */
function segmen(daftar, aktif, saatPilih, kelas) {
  const wadah = el('div', { class: 'segmen ' + (kelas || ''), role: 'tablist' });
  const tombolTombol = daftar.map(function (d) {
    return el('button', { type: 'button', class: 'segmen-item', role: 'tab', 'aria-selected': d.kode === aktif ? 'true' : 'false', onclick: function () { saatPilih(d.kode); } },
      el('span', { text: d.label }),
      d.lencana ? el('span', { class: 'lencana', text: String(d.lencana) }) : null);
  });
  wadah.append.apply(wadah, tombolTombol);
  return wadah;
}

function avatar(nama, besar) {
  let h = 0;
  const s = norm(nama);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return el('span', { class: 'avatar warna-' + (h % 6) + (besar ? ' besar' : ''), 'aria-hidden': 'true', text: inisial(nama) });
}

function buatBanner(b) {
  const jenis = b.jenis || 'info';
  const kotak = el('div', { class: 'banner banner-' + jenis, role: jenis === 'gagal' ? 'alert' : 'status' });
  kotak.append(
    ikon(jenis === 'sukses' ? 'centang' : jenis === 'gagal' ? 'peringatan' : 'info'),
    el('div', { class: 'tengah' },
      el('span', { class: 'judul', text: b.judul }),
      b.pesan ? el('span', { class: 'pesan', text: b.pesan }) : null,
      b.aksi ? el('div', { class: 'banner-aksi' }, b.aksi) : null));
  if (!b.tanpaTutup) kotak.append(el('button', { type: 'button', class: 'tutup', text: 'Tutup', onclick: function () { kotak.remove(); } }));
  return kotak;
}

/** Tampilkan banner di wadah tertentu (mengganti banner lama) lalu gulir ke sana. */
function tampilBanner(wadah, b) {
  kosongkan(wadah);
  wadah.append(buatBanner(b));
  umumkan(b.judul + (b.pesan ? '. ' + b.pesan : ''));
  wadah.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

/** Layar boleh menaruh banner dari layar sebelumnya di tempat yang ia pilih. */
function sisipBanner(wadah) {
  if (!S.bannerTertunda) return;
  wadah.append(buatBanner(S.bannerTertunda));
  S.bannerTertunda = null;
}

function umumkan(teks) {
  const p = document.getElementById('pengumuman');
  if (p) { p.textContent = ''; setTimeout(function () { p.textContent = teks; }, 50); }
}

function judulBagian(teks, kanan) {
  return el('div', { class: 'judul-bagian' }, el('h2', { text: teks }), kanan || null);
}

function tampilMemuat(teks) {
  tutupMemuat();
  // Saat aplikasi baru dibuka, layar sudah punya pemutar sendiri: cukup ganti tulisannya (jangan dobel).
  const awal = document.querySelector('#isi > .kosong');
  if (awal && !S.data) {
    const t = awal.querySelector('p');
    if (t) t.textContent = teks;
    S.sibuk = true;
    return;
  }
  const l = el('div', { class: 'lapisan', id: 'lapisanMemuat', role: 'alertdialog', 'aria-modal': 'true', 'aria-label': 'Sebentar ya. ' + teks },
    el('div', { class: 'kartu kosong' },
      el('div', { class: 'pemutar', 'aria-hidden': 'true' }),
      el('p', { class: 'tebal', text: 'Sebentar ya...' }),
      el('p', { class: 'redup kecil', text: teks })));
  document.body.append(l);
  S.sibuk = true;
  umumkan('Sebentar ya. ' + teks);
}

/** Mengganti tulisan di lapisan "Sebentar ya" yang sedang tampil (misalnya "foto 3 dari 8"). */
function ubahTeksMemuat(teks) {
  const t = document.querySelector('#lapisanMemuat p.kecil');
  if (t) t.textContent = teks;
  else tampilMemuat(teks);
}

function tutupMemuat() {
  const l = document.getElementById('lapisanMemuat');
  if (l) l.remove();
  S.sibuk = false;
}

/**
 * Lembar pilihan dari bawah layar. Hasil: nilai pilihan yang ditekan, atau null bila dibatalkan.
 * o = { judul, pesan, isi (elemen tambahan), pilihan: [{ nilai, teks, kelas, ikon }], teksBatal }
 */
function pilihDialog(o) {
  return new Promise(function (selesai) {
    if (S.tutupDialog) S.tutupDialog(null);
    const sebelum = document.activeElement;
    const kartu = el('div', { class: 'kartu' });
    const lapisan = el('div', { class: 'lapisan bawah', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'judulDialog' }, kartu);
    function tutup(hasil) {
      lapisan.remove();
      if (S.tutupDialog === tutup) S.tutupDialog = null;
      if (sebelum && sebelum.focus) sebelum.focus();
      selesai(hasil);
    }
    S.tutupDialog = tutup;
    lapisan.addEventListener('click', function (e) { if (e.target === lapisan) tutup(null); });
    tambahAnak(kartu, [
      el('h2', { class: 'judul-dialog', id: 'judulDialog', text: o.judul }),
      o.pesan ? el('p', { class: 'redup pre-line', text: o.pesan }) : null,
      o.isi || null,
      el('div', { class: 'tumpuk jarak-atas' },
        (o.pilihan || []).map(function (p) {
          return tombol(p.kelas || '', p.ikon || null, p.teks, function () {
            if (p.periksa && !p.periksa()) return;
            tutup(p.nilai);
          });
        }),
        o.tanpaBatal ? null : tombol('tombol-kedua', null, o.teksBatal || 'Batal', function () { tutup(null); }))]);
    document.body.append(lapisan);
    const pertama = kartu.querySelector('input, select, button');
    if (pertama) pertama.focus();
  });
}

/** Konfirmasi sederhana. Hasil: true/false. */
function konfirmasi(judul, pesan, teksYa, kelasYa) {
  return pilihDialog({ judul: judul, pesan: pesan, pilihan: [{ nilai: true, teks: teksYa || 'Ya', kelas: kelasYa || 'tombol-utama' }] })
    .then(function (v) { return v === true; });
}

/** Konfirmasi hapus: masuk "Baru dihapus" dan bisa dipulihkan 30 hari. */
function konfirmasiHapus(namaBenda, tambahan) {
  return konfirmasi('Hapus ' + namaBenda + '?',
    (tambahan ? tambahan + '\n\n' : '') + 'Masih bisa dipulihkan dari menu Baru dihapus selama 30 hari. Setelah itu hilang permanen.',
    'Ya, hapus', 'tombol-bahaya-penuh');
}

/* ════════════════════════════════════════════════════════════
   PEMBANTU UMUM
   ════════════════════════════════════════════════════════════ */

function idBaru(awalan) {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return awalan + Array.prototype.map.call(b, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
}

function norm(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
}

function angkaSaja(s) { return String(s || '').replace(/\D/g, ''); }

function varianHp(hp) {
  const d = angkaSaja(hp);
  if (!d) return [];
  if (d.charAt(0) === '0') return [d, '62' + d.slice(1)];
  if (d.slice(0, 2) === '62') return [d, '0' + d.slice(2)];
  return [d];
}

function normalHp(s) { return String(s || '').replace(/[\s.\-()]/g, '').replace(/^\+/, ''); }
function hpValid(s) { return /^(0|62)[0-9]+$/.test(s) && s.length >= 9 && s.length <= 15; }
function keWa(hp) { const d = angkaSaja(hp); return d.charAt(0) === '0' ? '62' + d.slice(1) : d; }
function lokalHp(hp) { const d = angkaSaja(hp); return d.slice(0, 2) === '62' ? '0' + d.slice(2) : d; }

/** Nomor HP tampil seragam: 0812 3456 7890. */
function formatHp(hp) {
  return kelompok4(lokalHp(hp));
}

function kelompok4(d) {
  const potong = [];
  for (let i = 0; i < d.length; i += 4) potong.push(d.slice(i, i + 4));
  return potong.join(' ');
}

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
function formatTanggal(s, denganJam) {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?: (\d{2}):(\d{2}))?/.exec(String(s || ''));
  if (!m) return String(s || '');
  return Number(m[3]) + ' ' + BULAN[Number(m[2]) - 1] + ' ' + m[1] + (denganJam && m[4] ? ', ' + m[4] + '.' + m[5] : '');
}

/** Tanggal hari ini di HP, "yyyy-mm-dd". */
function hariIni() {
  return tanggalKeTeks(new Date());
}

function tanggalKeTeks(d) {
  return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
}

function tambahHari(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return tanggalKeTeks(d);
}

/** Selisih hari dari tanggal "yyyy-mm-dd" ke hari ini (positif = sudah lewat). */
function selisihHari(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s || ''));
  if (!m) return null;
  const t = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const h = new Date(); h.setHours(0, 0, 0, 0);
  return Math.round((h - t) / 86400000);
}

function inisial(nama) {
  const kata = norm(nama).replace(/[^a-z0-9 ]/g, '').split(' ').filter(function (k) { return k && !RAPI_SAPAAN_[k]; });
  return ((kata[0] || '?').charAt(0) + (kata[1] ? kata[1].charAt(0) : '')).toUpperCase();
}

/** Nama panggilan untuk sapaan pesan: "Bu Siti Rahma" tetap, "Siti Rahma" menjadi "Siti Rahma". */
function namaSapaan(nama) {
  return String(nama || '').trim();
}

/* ── Rupiah dan angka ── */

/** 1250000000 -> "1.250.000.000" */
function formatRibuan(n) {
  const d = angkaSaja(n);
  return d ? d.replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
}

function koma(x) {
  return (Math.round(x * 100) / 100).toString().replace('.', ',');
}

/** "Rp 1,25 M", "Rp 980 jt", "Rp 750 rb". */
function rupiahPendek(n) {
  n = Number(n);
  if (!isFinite(n) || n <= 0) return '';
  if (n >= 1e12) return 'Rp ' + koma(n / 1e12) + ' T';
  if (n >= 1e9) return 'Rp ' + koma(n / 1e9) + ' M';
  if (n >= 1e6) return 'Rp ' + koma(n / 1e6) + ' jt';
  if (n >= 1e3) return 'Rp ' + koma(n / 1e3) + ' rb';
  return 'Rp ' + n;
}

/** Bacaan lengkap di bawah isian: "Rp 1,25 miliar". */
function rupiahBaca(n) {
  n = Number(n);
  if (!isFinite(n) || n <= 0) return '';
  if (n >= 1e12) return 'Rp ' + koma(n / 1e12) + ' triliun';
  if (n >= 1e9) return 'Rp ' + koma(n / 1e9) + ' miliar';
  if (n >= 1e6) return 'Rp ' + koma(n / 1e6) + ' juta';
  if (n >= 1e3) return 'Rp ' + koma(n / 1e3) + ' ribu';
  return 'Rp ' + n;
}

/** Angka dari server ("90.5") tampil "90,5". */
function angkaTampil(v) {
  return v === '' || v === undefined || v === null ? '' : String(v).replace('.', ',');
}

/** Jarak ejaan dua kata (untuk "Maksudnya ...?" dan cek klien ganda). */
function jarakEjaan(a, b) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 3) return 9;
  let prev = [];
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

/** Nama orang tanpa sapaan/gelar, untuk dibandingkan. */
function intiNama(nama) {
  return norm(nama).replace(/[^a-z0-9 ]/g, ' ').split(' ').filter(function (k) { return k && !RAPI_SAPAAN_[k]; }).join(' ');
}

function namaMirip(a, b) {
  const x = intiNama(a), y = intiNama(b);
  if (!x || !y) return false;
  if (x === y) return true;
  const batas = Math.min(x.length, y.length) >= 8 ? 2 : Math.min(x.length, y.length) >= 4 ? 1 : 0;
  return jarakEjaan(x, y) <= batas;
}

function bacaSesi(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
function simpanSesi(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* abaikan */ } }
function hapusSesi() {
  try { sessionStorage.clear(); } catch (e) { /* abaikan */ }
  try { localStorage.removeItem('ap_tiket'); } catch (e) { /* abaikan */ }
}

/* Tiket sesi disimpan di HP supaya tidak perlu masuk lagi tiap aplikasi ditutup.
   Server tetap menghanguskannya: 14 hari sejak masuk, atau 7 hari tidak dipakai. */
function simpanTiket(t) {
  try { localStorage.setItem('ap_tiket', JSON.stringify({ t: t, dibuat: Date.now() })); } catch (e) { /* abaikan */ }
}
function bacaTiket() {
  try {
    const x = JSON.parse(localStorage.getItem('ap_tiket') || 'null');
    if (x && typeof x.t === 'string' && Date.now() - Number(x.dibuat) < SESI_MAKS_MS) return x.t;
    localStorage.removeItem('ap_tiket');
  } catch (e) { /* abaikan */ }
  return null;
}

function base64KeBlob(b64, tipe) {
  const bin = atob(b64);
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return new Blob([u], { type: tipe });
}

function blobKeBase64(blob) {
  return new Promise(function (ok, gagal) {
    const r = new FileReader();
    r.onload = function () { ok(String(r.result).split(',')[1] || ''); };
    r.onerror = function () { gagal(r.error); };
    r.readAsDataURL(blob);
  });
}

function configLengkap() {
  return /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(CONFIG.API_URL) &&
    /\.apps\.googleusercontent\.com$/.test(CONFIG.GOOGLE_CLIENT_ID);
}

/** Tulisan dirapikan saat jari pindah dari kotak isian. */
function pasangRapi(isian, fn) {
  isian.addEventListener('blur', function () {
    const v = fn(isian.value);
    if (v !== isian.value) isian.value = v;
  });
}

// ── RAPIKAN TULISAN (sama persis di Code.gs dan javascript.js) ──────────
// Singkatan yang selalu huruf besar.
var RAPI_SINGKATAN_ = ['SHM', 'SHGB', 'HGB', 'HGU', 'HPL', 'AJB', 'PPJB', 'PBB', 'NJOP', 'BPHTB', 'KTP', 'NPWP', 'KK',
  'IMB', 'PBG', 'SLF', 'KPR', 'DP', 'PLN', 'PDAM', 'RT', 'RW', 'LT', 'LB', 'KT', 'KM', 'CV', 'PT', 'UD', 'TBK',
  'BTN', 'BRI', 'BNI', 'BCA', 'BSI', 'AC', 'WC', 'CCTV', 'ATM', 'TK', 'SD', 'SMP', 'SMA', 'SMK', 'HP', 'WA', 'GPS', 'PDF'];
// Kata yang ditulis dengan titik di belakang.
var RAPI_TITIK_ = { jl: 'Jl.', jln: 'Jln.', gg: 'Gg.', no: 'No.', kav: 'Kav.', kec: 'Kec.', kel: 'Kel.', kab: 'Kab.',
  komp: 'Komp.', ds: 'Ds.', prov: 'Prov.', blk: 'Blk.' };
// Sapaan dan gelar di depan nama orang.
var RAPI_SAPAAN_ = { bu: 'Bu', ibu: 'Ibu', pak: 'Pak', bapak: 'Bapak', bpk: 'Bpk.', sdr: 'Sdr.', sdri: 'Sdri.',
  h: 'H.', hj: 'Hj.', dr: 'dr.', drs: 'Drs.', dra: 'Dra.', ir: 'Ir.', prof: 'Prof.', ny: 'Ny.', tn: 'Tn.', mbak: 'Mbak', mas: 'Mas',
  kak: 'Kak', om: 'Om', tante: 'Tante', koh: 'Koh', ci: 'Ci', cik: 'Cik' };
// Kata sambung yang tetap kecil di tengah judul atau nama.
var RAPI_KECIL_ = ['dan', 'di', 'ke', 'dari', 'yang', 'untuk', 'atau', 'dengan', 'bin', 'binti', 'van', 'der', 'de'];
var RAPI_ROMAWI_ = ['ii', 'iii', 'iv', 'vi', 'vii', 'viii', 'ix', 'xi', 'xii'];

function rapiHurufAwal_(s) {
  // "jaya-abadi" -> "Jaya-Abadi"; huruf setelah ' tetap kecil ("Ma'ruf").
  return String(s).toLowerCase().replace(/(^|[-\/(])([a-zà-ÿ])/g, function (m, a, b) { return a + b.toUpperCase(); });
}

function rapiCampuran_(t) {
  // Kata yang sengaja ditulis campuran besar-kecil (iPhone, McDonald) dibiarkan.
  return /[a-z]/.test(t) && /[A-Z]/.test(t.slice(1));
}

/**
 * Satu kata. mode: 'judul' atau 'nama'. awalan: masih di bagian sapaan/gelar depan nama.
 * jagaSingkatan: kata kapital pendek (UI, ABC) dibiarkan karena dianggap singkatan yang disengaja.
 */
function rapiSatuKata_(kata, mode, pertama, semuaSeragam, awalan, jagaSingkatan) {
  var m = /^([("'“]*)(.*?)([.,;:)"'”]*)$/.exec(kata);
  var depan = m[1], inti = m[2], belakang = m[3];
  if (!inti) return kata;
  var kecil = inti.toLowerCase();
  var besar = inti.toUpperCase();
  var hasil;

  if (!semuaSeragam && rapiCampuran_(inti)) return kata;
  if (jagaSingkatan && inti === besar && /^[A-Z]{2,4}$/.test(inti)) return kata;

  if (RAPI_SINGKATAN_.indexOf(besar) >= 0 && (mode === 'judul' || ['PT', 'CV', 'UD', 'TBK'].indexOf(besar) >= 0)) {
    hasil = besar;
  } else if (mode === 'nama' && awalan && RAPI_SAPAAN_[kecil.replace(/\.$/, '')]) {
    hasil = RAPI_SAPAAN_[kecil.replace(/\.$/, '')];
    if (/\.$/.test(hasil) && belakang.charAt(0) === '.') belakang = belakang.slice(1);
  } else if (mode === 'nama' && /^[a-z]{1,4}(\.[a-z]{1,4})+\.?$/i.test(inti)) {
    // Gelar akademik: s.h -> S.H., s.kom -> S.Kom., a.md -> A.Md.
    hasil = inti.replace(/\.$/, '').split('.').map(function (b) { return b.charAt(0).toUpperCase() + b.slice(1).toLowerCase(); }).join('.') + '.';
    if (belakang.charAt(0) === '.') belakang = belakang.slice(1);
  } else if (mode === 'judul' && RAPI_TITIK_[kecil]) {
    hasil = RAPI_TITIK_[kecil];
    if (belakang.charAt(0) === '.') belakang = belakang.slice(1);
  } else if (/^\d+([.,]\d+)?(m2|m²|m|km|cm|jt|rb)$/i.test(inti)) {
    hasil = kecil;
  } else if (/\d/.test(inti)) {
    hasil = besar;                                    // B5, 12A, 03/RW
  } else if (RAPI_ROMAWI_.indexOf(kecil) >= 0) {
    hasil = besar;
  } else if (!pertama && RAPI_KECIL_.indexOf(kecil) >= 0) {
    hasil = kecil;
  } else if (/^[a-z]$/i.test(inti)) {
    hasil = besar;                                    // inisial: "a" -> "A"
  } else {
    hasil = rapiHurufAwal_(inti);
  }
  return depan + hasil + belakang;
}

/**
 * Diketik "seragam" bila tidak ada satu kata pun yang sudah ditulis rapi (Huruf Awal Besar) atau campuran (iPhone).
 * Contoh seragam: "SITI RAHMA", "siti rahma", "RUMAH ASRI b5". Tidak seragam: "Ruko ABC Mall".
 */
function rapiSeragam_(teks) {
  var kata = String(teks).split(/[\s,.;:!?()\/-]+/);
  for (var i = 0; i < kata.length; i++) {
    var h = kata[i].replace(/[^A-Za-zà-ÿÀ-ß]/g, '');
    if (h.length < 2) continue;
    if (h !== h.toUpperCase() && h !== h.toLowerCase()) return false;
  }
  return true;
}

/** Diketik dengan Caps Lock: kata kapital lebih banyak daripada kata lain (gelar, angka, singkatan tidak dihitung). */
function rapiKebanyakanBesar_(teks) {
  var besar = 0, kecil = 0;
  String(teks).split(/\s+/).forEach(function (k) {
    if (/\d/.test(k) || /[A-Za-z]\.[A-Za-z]/.test(k)) return;
    var h = k.replace(/[^A-Za-zà-ÿÀ-ß]/g, '');
    if (h.length < 2 || RAPI_SINGKATAN_.indexOf(h.toUpperCase()) >= 0 || RAPI_SAPAAN_[h.toLowerCase()]) return;
    if (h === h.toUpperCase()) besar++;
    else kecil++;
  });
  return besar > kecil;
}

function rapiBaris_(baris, mode) {
  var semuaSeragam = rapiSeragam_(baris);
  // Singkatan sengaja (UI, ABC) dijaga di judul dan nama perusahaan, kecuali seluruhnya diketik kapital.
  // Nama orang selalu dirapikan ("bu RINA" -> "Bu Rina").
  var jagaSingkatan = !rapiKebanyakanBesar_(baris) && (mode === 'judul' || /(^|\s)(PT|CV|UD|TBK)\.?(\s|$)/i.test(baris));
  var kata = baris.split(' ');
  var nomor = 0;
  var awalan = true;
  return kata.map(function (k) {
    if (!k) return k;
    var hasil = rapiSatuKata_(k, mode, nomor === 0, semuaSeragam, awalan, jagaSingkatan);
    var inti = k.replace(/[^A-Za-zà-ÿÀ-ß]/g, '').toLowerCase();
    if (!RAPI_SAPAAN_[inti]) awalan = false;
    nomor++;
    return hasil;
  }).join(' ');
}

function rapiSpasi_(s, bolehBarisBaru) {
  s = String(s === undefined || s === null ? '' : s).replace(/\r\n?/g, '\n');
  if (!bolehBarisBaru) s = s.replace(/\n/g, ' ');
  return s.split('\n').map(function (b) { return b.replace(/[ \t]+/g, ' ').trim(); }).join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/** Nama orang atau perusahaan: "SITI rahma" -> "Siti Rahma", "bu hj siti" -> "Bu Hj. Siti". */
function rapiNama_(s) {
  return rapiBaris_(rapiSpasi_(s, false), 'nama');
}

/** Nama properti, alamat, area, judul dokumen: "rumah jl melati no 12" -> "Rumah Jl. Melati No. 12". */
function rapiJudul_(s, bolehBarisBaru) {
  return rapiSpasi_(s, bolehBarisBaru).split('\n').map(function (b) { return rapiBaris_(b, 'judul'); }).join('\n');
}

/** Catatan: hanya dirapikan bila diketik semua kapital atau semua kecil. */
function rapiKalimat_(s) {
  s = rapiSpasi_(s, true);
  if (!/[A-Za-z]/.test(s) || !rapiSeragam_(s)) return s;
  var capsLock = rapiKebanyakanBesar_(s);
  s = s.replace(/[A-Za-zÀ-ÿ]+/g, function (k) {
    return !capsLock && /^[A-Z]{2,4}$/.test(k) ? k : k.toLowerCase();   // "dekat UI" tetap UI
  });
  s = s.replace(/(^|[.!?]\s+|\n\s*)([a-zà-ÿ])/g, function (m, a, b) { return a + b.toUpperCase(); });
  return s.replace(/[A-Za-z]+/g, function (k) {
    return RAPI_SINGKATAN_.indexOf(k.toUpperCase()) >= 0 ? k.toUpperCase() : k;
  });
}
// ── AKHIR RAPIKAN TULISAN ────────────────────────────────────────────────

/* ════════════════════════════════════════════════════════════
   PENYIMPANAN DI HP (IndexedDB)
   - "foto": foto yang belum tersimpan ke server, supaya tidak hilang bila aplikasi tertutup.
   - "mini": foto kecil properti untuk daftar.
   Semua dibuang saat Keluar, saat sesi berakhir, dan saat aplikasi dibuka tanpa tiket yang sah.
   ════════════════════════════════════════════════════════════ */

let dbJanji = null;
function bukaDb() {
  if (dbJanji) return dbJanji;
  dbJanji = new Promise(function (ok, gagal) {
    if (!window.indexedDB) { gagal(new Error('idb')); return; }
    const r = indexedDB.open('arsip-properti', 1);
    r.onupgradeneeded = function () {
      const db = r.result;
      if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
      if (!db.objectStoreNames.contains('mini')) db.createObjectStore('mini');
    };
    r.onsuccess = function () { ok(r.result); };
    r.onerror = function () { gagal(r.error); };
  }).catch(function (e) { dbJanji = null; throw e; });
  return dbJanji;
}

function dbJalankan(toko, mode, fn) {
  return bukaDb().then(function (db) {
    return new Promise(function (ok, gagal) {
      const tx = db.transaction(toko, mode);
      const hasil = fn(tx.objectStore(toko));
      tx.oncomplete = function () { ok(hasil && 'result' in hasil ? hasil.result : undefined); };
      tx.onerror = function () { gagal(tx.error); };
      tx.onabort = function () { gagal(tx.error); };
    });
  }).catch(function () { return undefined; });   // penyimpanan HP tidak tersedia: aplikasi tetap jalan
}

function dbAmbil(toko, kunci) { return dbJalankan(toko, 'readonly', function (s) { return s.get(kunci); }); }
function dbTaruh(toko, kunci, nilai) { return dbJalankan(toko, 'readwrite', function (s) { s.put(nilai, kunci); }); }
function dbBuang(toko, kunci) { return dbJalankan(toko, 'readwrite', function (s) { s.delete(kunci); }); }
function dbKosongkan(toko) { return dbJalankan(toko, 'readwrite', function (s) { s.clear(); }); }

/** Simpan foto yang belum tersimpan ke HP (tanpa alamat sementara). */
function simpanFotoTertunda() {
  const f = S.foto;
  if (!f || !f.items.some(function (x) { return !x.tersimpan; })) return dbBuang('kv', 'foto');
  return dbTaruh('kv', 'foto', {
    id_klien: f.id_klien, konteks: f.konteks, tujuan: f.tujuan === undefined ? null : f.tujuan,
    items: f.items.filter(function (x) { return !x.tersimpan; }).map(function (x) {
      return { idUnggahan: x.idUnggahan, base64: x.base64, ukuran: x.ukuran, jenis: x.jenis, judul: x.judul,
        terkunci: x.terkunci, mini: x.mini || '' };
    })
  });
}

/** Kembalikan foto yang belum tersimpan dari HP (setelah aplikasi dibuka lagi atau masuk lagi). */
function muatFotoTertunda() {
  if (S.foto) return Promise.resolve();
  return dbAmbil('kv', 'foto').then(function (f) {
    if (!f || !Array.isArray(f.items) || !f.items.length || S.foto) return;
    S.foto = {
      id_klien: f.id_klien, konteks: f.konteks || '', tujuan: f.tujuan === null ? undefined : f.tujuan,
      items: f.items.filter(function (x) { return x && typeof x.base64 === 'string' && x.base64; }).map(function (x) {
        return { idUnggahan: x.idUnggahan, base64: x.base64, ukuran: x.ukuran, jenis: x.jenis, judul: x.judul || '',
          tersimpan: false, terkunci: !!x.terkunci, galat: '', mini: x.mini || '',
          url: URL.createObjectURL(base64KeBlob(x.base64, 'image/jpeg')) };
      })
    };
    if (!S.foto.items.length) S.foto = null;
  });
}

function jumlahFotoTertunda() {
  return S.foto ? S.foto.items.filter(function (x) { return !x.tersimpan; }).length : 0;
}

/* ════════════════════════════════════════════════════════════
   PANGGILAN API
   POST teks biasa supaya tidak ada pemeriksaan awal (preflight).
   ════════════════════════════════════════════════════════════ */

function GalatJaringan(pesan) { this.message = pesan || 'jaringan'; }
function GalatSesi() { this.message = 'sesi'; }

async function panggil(aksi, data, opsi) {
  opsi = opsi || {};
  const pengendali = new AbortController();
  const mulaiMuat = performance.now();
  const waktu = setTimeout(function () { pengendali.abort(); }, opsi.batas || CONFIG.BATAS_WAKTU_MS);
  let j;
  try {
    const res = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ aksi: aksi, tiket: S.tiket, data: data || {} }),
      signal: pengendali.signal,
      credentials: 'omit',
      cache: 'no-store',
      redirect: 'follow'
    });
    if (!res.ok) throw new GalatJaringan('http ' + res.status);
    const teksMentah = await res.text();
    j = JSON.parse(teksMentah);
    if (aksi === 'muatData') { S.ukuranData = teksMentah.length; S.waktuMuat = performance.now() - mulaiMuat; }
  } catch (e) {
    if (e instanceof GalatJaringan) throw e;
    throw new GalatJaringan(e && e.name);
  } finally {
    clearTimeout(waktu);
  }
  if (!j || typeof j !== 'object') throw new GalatJaringan('bentuk');
  if (j.ok === false && j.kode === 'SESI') {
    if (!opsi.abaikanSesi) sesiBerakhir();
    throw new GalatSesi();
  }
  return j;
}

function sesiBerakhir() {
  // Demi keamanan (misalnya HP hilang lalu "Keluar dari semua HP" dari perangkat lain),
  // foto yang belum tersimpan ikut dibuang dari HP. Foto bisa berisi KTP atau NPWP klien.
  const n = jumlahFotoTertunda();
  bersihkanSemua(true);
  S.bannerBerikut = { jenis: 'waspada', judul: 'Sesi sudah berakhir',
    pesan: 'Demi keamanan, silakan masuk lagi.' + (n ? ' ' + n + ' foto yang belum tersimpan sudah dibuang dari HP ini.' : '') };
  buka('masuk', {}, { ganti: true });
}

/** buangDiHp = true saat Keluar atau sesi berakhir: foto tertunda dan foto kecil di HP ikut dibuang. */
function bersihkanSemua(buangDiHp) {
  tutupMemuat();
  if (S.tutupDialog) S.tutupDialog(null);
  S.tiket = null;
  S.data = null;
  S.baruDibuka = [];
  lepasFoto();
  S.sibuk = false;
  S.urlFoto.forEach(function (x) { URL.revokeObjectURL(x.url); });
  S.urlFoto.clear();
  S.mini.forEach(function (u) { URL.revokeObjectURL(u); });
  S.mini.clear();
  S.miniGagal.clear();
  lepasPdf();
  hapusSesi();
  window.onbeforeunload = null;
  if (buangDiHp) {
    dbBuang('kv', 'foto');
    dbKosongkan('mini');
  }
}

/* ════════════════════════════════════════════════════════════
   DATA DI MEMORI
   ════════════════════════════════════════════════════════════ */

function urutNama(a, b, kunci) { return norm(a[kunci]).localeCompare(norm(b[kunci]), 'id'); }
function cariKlien(id) { return S.data.klien.find(function (k) { return k.id_klien === id; }) || null; }
function cariProperti(id) { return S.data.properti.find(function (p) { return p.id_properti === id; }) || null; }
function cariDokumen(id) { return S.data.dokumen.find(function (d) { return d.id_dokumen === id; }) || null; }

function propertiKlien(idk) {
  return S.data.properti.filter(function (p) { return p.id_klien === idk; })
    .sort(function (a, b) { return urutNama(a, b, 'nama_properti'); });
}

function dokumenKlien(idk) { return S.data.dokumen.filter(function (d) { return d.id_klien === idk; }); }

function dokumenDi(idk, idp, jenis, judul) {
  return S.data.dokumen.filter(function (d) {
    return d.id_klien === idk && (d.id_properti || '') === (idp || '') && d.jenis === jenis &&
      (judul === undefined || norm(d.judul || '') === norm(judul));
  }).sort(function (a, b) { return a.dibuat_pada < b.dibuat_pada ? 1 : -1; });
}

/** Foto properti, terbaru dulu. */
function fotoProperti(pr) { return dokumenDi(pr.id_klien, pr.id_properti, 'Foto properti'); }

/** Dokumen "Lainnya" dikelompokkan per judul (misalnya Surat Girik); tanpa judul = "Dokumen lainnya". */
function dokumenLainnyaGrup(idk, idp) {
  const peta = {};
  S.data.dokumen.forEach(function (d) {
    if (d.id_klien !== idk || (d.id_properti || '') !== (idp || '') || d.jenis !== 'Lainnya') return;
    const kunci = norm(d.judul || '');
    const g = peta[kunci] || (peta[kunci] = { jenis: 'Lainnya', judul: d.judul || '', label: d.judul || 'Dokumen lainnya', ikon: 'dokumen', jumlah: 0, terbaru: '' });
    g.jumlah++;
    if (d.dibuat_pada > g.terbaru) g.terbaru = d.dibuat_pada;
  });
  return Object.keys(peta).map(function (x) { return peta[x]; }).sort(function (a, b) { return urutNama(a, b, 'label'); });
}

/* ── Progres, harga, dan ukuran properti ── */

function progresProp(pr) { return pr.progres || 'Tersedia'; }
function dipasarkan(pr) { const g = progresProp(pr); return g === 'Tersedia' || g === 'Negosiasi'; }
function sedangDeal(pr) { return progresProp(pr) === 'Deal'; }
function sudahSold(pr) { return progresProp(pr) === 'Sold'; }
function denganPembeli(pr) { return sedangDeal(pr) || sudahSold(pr); }
function jenisDasar(j) { return /^Lainnya/.test(j || '') ? 'Lainnya' : (j || ''); }

/** "Second · Dijual · Disewakan" */
function labelTawaran(pr) {
  return [pr.kondisi, pr.dijual ? 'Dijual' : '', pr.disewakan ? 'Disewakan' : ''].filter(Boolean).join(' · ');
}

function satuanSewa(pr, panjang) {
  return pr.satuan_sewa === 'bulan' ? (panjang ? 'per bulan' : '/bln') : (panjang ? 'per tahun' : '/thn');
}

/** Harga yang berlaku: harga promo bila diisi, selain itu harga normal. */
function hargaBerlaku(normal, promo) { return Number(promo) > 0 ? Number(promo) : Number(normal); }

/** "Rp 980 jt atau Rp 45 jt/thn". Memakai harga promo bila ada. Kosong bila harga belum diisi. */
function hargaTeks(pr) {
  const b = [];
  if (pr.dijual && pr.harga_jual) b.push(rupiahPendek(hargaBerlaku(pr.harga_jual, pr.harga_jual_promo)));
  if (pr.disewakan && pr.harga_sewa) b.push(rupiahPendek(hargaBerlaku(pr.harga_sewa, pr.harga_sewa_promo)) + satuanSewa(pr));
  return b.join(' atau ');
}

/** Harga normal dan promo untuk tawaran yang punya promo. Kosong bila tidak ada promo. */
function hargaPromoRinci(pr) {
  const b = [];
  if (pr.dijual && pr.harga_jual && pr.harga_jual_promo) b.push({ normal: pr.harga_jual, promo: pr.harga_jual_promo, akhiran: '' });
  if (pr.disewakan && pr.harga_sewa && pr.harga_sewa_promo) b.push({ normal: pr.harga_sewa, promo: pr.harga_sewa_promo, akhiran: satuanSewa(pr) });
  return b;
}

/** Penjual menandai BU. Server mengirim true, form mengirim 'ya'; keduanya diterima. */
function adaBU(pr) { return pr.bu === true || pr.bu === 'ya'; }

/** Persen potongan harga jual untuk label "-8%". 0 bila tidak ada promo jual. */
function persenDiskon(pr) {
  if (!(pr.dijual && pr.harga_jual && pr.harga_jual_promo)) return 0;
  return Math.max(0, Math.round((1 - Number(pr.harga_jual_promo) / Number(pr.harga_jual)) * 100));
}

/** "Tidak ada", "2 mobil", "4 atau lebih mobil". Kosong bila belum diisi. */
function carportTeks(pr) {
  if (pr.carport === '' || pr.carport == null) return '';
  const n = Number(pr.carport);
  if (n <= 0) return 'Tidak ada';
  return n >= 4 ? '4 atau lebih mobil' : n + ' mobil';
}

/** Harga di detail: harga normal dicoret di atas harga promo, lalu "Hemat ...". Tanpa promo, teks biasa. */
function hargaDetailNode(pr) {
  const promo = hargaPromoRinci(pr);
  const teks = hargaTeks(pr);
  if (!promo.length) return el('p', { class: 'harga-besar' + (teks ? '' : ' redup'), text: teks || 'Harga belum diisi' });
  const wadah = el('div', { class: 'harga-promo' });
  promo.forEach(function (h) {
    wadah.append(
      el('span', { class: 'harga-coret', text: rupiahPendek(h.normal) + h.akhiran }),
      el('span', { class: 'harga-besar', text: rupiahPendek(h.promo) + h.akhiran }),
      el('span', { class: 'hemat', text: 'Hemat ' + rupiahPendek(h.normal - h.promo) }));
  });
  return wadah;
}

/** "LT 120 · LB 90 · 3 KT · 2 KM · SHM" */
function ukuranTeks(pr, tanpaSertifikat) {
  return [
    pr.luas_tanah ? 'LT ' + angkaTampil(pr.luas_tanah) : '',
    pr.luas_bangunan ? 'LB ' + angkaTampil(pr.luas_bangunan) : '',
    pr.kamar_tidur ? pr.kamar_tidur + ' KT' : '',
    pr.kamar_mandi ? pr.kamar_mandi + ' KM' : '',
    !tanpaSertifikat && pr.sertifikat ? namaJenis(pr.sertifikat) : ''
  ].filter(Boolean).join(' · ');
}

function komisiTeks(pr) {
  if (!pr.komisi_jenis || !pr.komisi_nilai) return '';
  if (pr.komisi_jenis === 'persen') {
    const h = hargaBerlaku(pr.harga_jual, pr.harga_jual_promo) * Number(pr.komisi_nilai) / 100;
    return angkaTampil(pr.komisi_nilai) + '%' + (h > 0 ? ' (sekitar ' + rupiahPendek(h) + ')' : '');
  }
  return rupiahBaca(pr.komisi_nilai);
}

/** Semua area yang pernah diisi (properti dan kebutuhan pembeli), urut abjad. */
function daftarArea(dariProperti) {
  const ada = {};
  const tambah = function (a) { if (a) ada[a] = true; };
  S.data.properti.forEach(function (pr) { tambah(pr.area); });
  if (!dariProperti) S.data.klien.forEach(function (k) { tambah(k.kebutuhan_area); });
  return Object.keys(ada).sort(function (a, b) { return norm(a).localeCompare(norm(b), 'id'); });
}

/* ── Wilayah: daftar kota dan area baku (wilayah.json), dimuat sekali saat dibutuhkan ── */
const WILAYAH = { data: null, janji: null };
/** Jabodetabek dan Bandung raya diurutkan lebih dulu di saran (nama yang sama ada di banyak daerah). */
function wilayahUtama(kota) { return /^(Jakarta |Kab\. Bogor|Kota Bogor|Depok|Kab\. Tangerang|Kota Tangerang|Tangerang Selatan|Kab\. Bekasi|Kota Bekasi|Kota Bandung|Kab\. Bandung|Cimahi)/.test(kota) ? 1 : 2; }
function muatWilayah() {
  if (WILAYAH.janji) return WILAYAH.janji;
  WILAYAH.janji = fetch('wilayah.json').then(function (r) { if (!r.ok) throw new Error('wilayah'); return r.json(); }).then(function (j) {
    WILAYAH.data = {
      kota: j.k.map(function (k) { return { n: k, nn: norm(k), p: wilayahUtama(k) }; }),
      area: j.a.map(function (x) { return { n: x[0], k: j.k[x[1]], nn: norm(x[0]), p: wilayahUtama(j.k[x[1]]) }; })
    };
    return WILAYAH.data;
  }).catch(function () { WILAYAH.janji = null; return null; });
  return WILAYAH.janji;
}

/** "Kota Bogor" dan "Kab. Bogor" sama-sama "bogor": pembeli yang cari Bogor melihat keduanya. */
function kunciKota(v) { return norm(v).replace(/^(kota administrasi|kabupaten administrasi|kota|kabupaten|kab\.?)\s+/, '').trim(); }
/** "Bintaro, Jakarta Selatan" -> kotanya "Jakarta Selatan". Tanpa koma: seluruhnya dianggap kota. */
function kotaDariArea(a) { const t = String(a || ''); const i = t.lastIndexOf(','); return (i < 0 ? t : t.slice(i + 1)).trim(); }
function detailDariArea(a) { const t = String(a || ''); const i = t.lastIndexOf(','); return i < 0 ? '' : t.slice(0, i).trim(); }
function gabungArea(detail, kota) { return detail && kota ? detail + ', ' + kota : (kota || detail || ''); }

/** Saran: yang pernah dipakai dulu, lalu wilayah utama; diawali ketikan lebih dulu dari yang hanya mengandung kata itu. Maksimal 10. */
function cariSaran(daftar, q, ambilNama) {
  const nq = norm(q);
  if (nq.length < 2) return [];
  const awal = [], kata = [];
  daftar.forEach(function (x) {
    const nn = x.nn;
    if (nn.indexOf(nq) === 0) awal.push(x);
    else if ((' ' + nn).indexOf(' ' + nq) >= 0) kata.push(x);
  });
  const urut = function (a, b) { return ((a.p || 2) - (b.p || 2)) || a.nn.length - b.nn.length || a.nn.localeCompare(b.nn, 'id'); };
  return awal.sort(urut).concat(kata.sort(urut)).slice(0, 10);
}

/** Area yang pernah diisi Pak Pudji sendiri ikut jadi saran (di urutan atas). */
function areaPernah() {
  const ada = {}, hasil = [];
  daftarArea(false).forEach(function (a) {
    const d = detailDariArea(a), k = kotaDariArea(a);
    const n = d || k;
    const kunci = norm(n) + '|' + norm(d ? k : '');
    if (!n || ada[kunci]) return;
    ada[kunci] = true;
    hasil.push({ n: n, k: d ? k : '', nn: norm(n), p: 0.5 });
  });
  return hasil;
}

/** "Deal dengan Siti Rahma · 12 Okt 2026", "Terjual ke ...", atau "Laku lewat agen lain". */
function dealKeterangan(pr) {
  const g = progresProp(pr);
  if (g === 'Agen lain') return 'Laku lewat agen lain';
  if (!denganPembeli(pr)) return '';
  const l = pr.id_klien_deal ? cariKlien(pr.id_klien_deal) : null;
  const hanyaSewa = pr.disewakan && !pr.dijual;
  if (g === 'Deal') {
    return (l ? 'Deal dengan ' + l.nama : 'Sudah deal') + (pr.tanggal_deal ? ' · ' + formatTanggal(pr.tanggal_deal) : '');
  }
  const kata = hanyaSewa ? 'Disewa ' : 'Terjual ke ';
  return (l ? kata + l.nama : (hanyaSewa ? 'Sudah disewa' : 'Sudah terjual')) + (pr.tanggal_sold ? ' · ' + formatTanggal(pr.tanggal_sold) : '');
}

/**
 * Kelengkapan dokumen. Wajib bergantung pada cara ditawarkan:
 * - Dijual: Sertifikat, PBB, KTP pemilik, Foto properti
 * - Hanya disewakan: KTP pemilik, Foto properti
 * Sisanya tambahan (tetap bisa difoto, tidak membuat "belum lengkap").
 */
function kelengkapan(pr) {
  const SEMUA = [
    { jenis: 'Sertifikat', label: 'Sertifikat', ikon: 'dokumen' },
    { jenis: 'PBB', label: 'PBB', ikon: 'catatan' },
    { jenis: 'KTP', label: 'KTP pemilik', ikon: 'kartu' },
    { jenis: 'NPWP', label: 'NPWP', ikon: 'kartu' },
    { jenis: 'Foto properti', label: 'Foto properti', ikon: 'gambar' }
  ];
  const wajibJenis = pr.dijual || !pr.disewakan ? ['Sertifikat', 'PBB', 'KTP', 'Foto properti'] : ['KTP', 'Foto properti'];
  const isi = SEMUA.map(function (x) {
    const daftar = dokumenDi(pr.id_klien, DOK_KLIEN.indexOf(x.jenis) >= 0 ? '' : pr.id_properti, x.jenis);
    return Object.assign({}, x, { jumlah: daftar.length, terbaru: daftar[0] ? daftar[0].dibuat_pada : '', wajib: wajibJenis.indexOf(x.jenis) >= 0 });
  });
  const wajib = isi.filter(function (x) { return x.wajib; });
  return {
    wajib: wajib,
    tambahan: isi.filter(function (x) { return !x.wajib; }),
    ada: wajib.filter(function (x) { return x.jumlah > 0; }).length,
    total: wajib.length,
    kurang: wajib.filter(function (x) { return !x.jumlah; })
  };
}

/* ── Pencocokan pembeli dan properti ── */

/** Hal yang dicari pembeli, untuk ditampilkan: "Beli · Second · Rumah · Depok · s/d Rp 1,5 M". */
function kebutuhanTeks(k) {
  return [k.kebutuhan_cara, k.kebutuhan_kondisi, k.kebutuhan_jenis ? namaJenis(k.kebutuhan_jenis) : '', k.kebutuhan_area,
    k.budget ? 's/d ' + rupiahPendek(k.budget) + (k.kebutuhan_cara === 'Sewa' ? '/thn' : '') : ''].filter(Boolean).join(' · ');
}

function punyaKebutuhan(k) {
  return !!(k.kebutuhan_cara || k.kebutuhan_kondisi || k.kebutuhan_jenis || k.kebutuhan_area || k.budget);
}

/**
 * Menilai satu properti untuk satu pembeli.
 * Hasil: null bila tidak relevan sama sekali, atau { meleset: [alasan...] }.
 * Isian pembeli yang kosong tidak dihitung. Isian properti yang kosong tidak dianggap meleset.
 */
function nilaiCocok(k, pr) {
  if (pr.id_klien === k.id_klien || !dipasarkan(pr)) return null;
  if (k.kebutuhan_cara === 'Beli' && !pr.dijual) return null;
  if (k.kebutuhan_cara === 'Sewa' && !pr.disewakan) return null;
  const meleset = [];
  if (k.kebutuhan_jenis && jenisDasar(k.kebutuhan_jenis) !== jenisDasar(pr.jenis)) meleset.push('Jenisnya ' + namaJenis(pr.jenis));
  else if (k.kebutuhan_jenis && jenisDasar(k.kebutuhan_jenis) === 'Lainnya' && norm(namaJenis(k.kebutuhan_jenis)) !== norm(namaJenis(pr.jenis))) meleset.push('Jenisnya ' + namaJenis(pr.jenis));
  if (k.kebutuhan_kondisi && pr.kondisi && pr.kondisi !== k.kebutuhan_kondisi) meleset.push('Kondisinya ' + pr.kondisi.toLowerCase());
  if (k.kebutuhan_area && kunciKota(kotaDariArea(pr.area)) !== kunciKota(kotaDariArea(k.kebutuhan_area))) meleset.push(pr.area ? 'Beda area: ' + pr.area : 'Area belum diisi');
  let lebih = 0;
  if (k.budget) {
    const budget = Number(k.budget);
    let harga = 0;
    const sewa = k.kebutuhan_cara === 'Sewa' || (!k.kebutuhan_cara && !pr.dijual);
    if (sewa && pr.harga_sewa) harga = hargaBerlaku(pr.harga_sewa, pr.harga_sewa_promo) * (pr.satuan_sewa === 'bulan' ? 12 : 1);
    else if (!sewa && pr.harga_jual) harga = hargaBerlaku(pr.harga_jual, pr.harga_jual_promo);
    if (harga > budget) {
      lebih = Math.round((harga / budget - 1) * 10000) / 10000;
      if (lebih > CONFIG.BATAS_BUDGET_ALT) return null;   // terlalu jauh di atas budget: tidak ditampilkan
      meleset.push('Lebih mahal ' + rupiahPendek(harga - budget) + (sewa ? '/thn' : '') + ' dari budget');
    }
  }
  return { meleset: meleset, lebih: lebih, jauh: lebih > CONFIG.BATAS_BUDGET_HAMPIR };
}

/** Golongan hasil nilaiCocok: 'cocok', 'hampir' (meleset satu hal), 'alt' (hanya harga 30-60% di atas budget). */
function golongan(n) {
  if (!n.meleset.length) return 'cocok';
  if (n.meleset.length !== 1) return '';
  return n.jauh ? 'alt' : 'hampir';
}

/** Untuk satu pembeli: properti yang cocok semua, hampir cocok, dan alternatif (agak di atas budget). */
function propertiCocok(k) {
  const hasil = { cocok: [], hampir: [], alt: [] };
  if (!punyaKebutuhan(k)) return hasil;
  S.data.properti.forEach(function (pr) {
    const n = nilaiCocok(k, pr);
    if (!n) return;
    const g = golongan(n);
    if (g === 'cocok') hasil.cocok.push(pr);
    else if (g) hasil[g].push({ pr: pr, alasan: n.meleset[0], lebih: n.lebih });
  });
  hasil.cocok.sort(function (a, b) { return urutNama(a, b, 'nama_properti'); });
  const dekat = function (a, b) { return a.lebih - b.lebih; };
  hasil.hampir = hasil.hampir.sort(dekat).slice(0, 5);
  hasil.alt = hasil.alt.sort(dekat).slice(0, 5);
  return hasil;
}

/** Untuk satu properti: pembeli yang sedang mencari dan cocok. */
function pembeliCocok(pr) {
  const hasil = { cocok: [], hampir: [], alt: [] };
  S.data.klien.forEach(function (k) {
    if (k.peran !== 'Pembeli' || (k.status_beli || 'Mencari') !== 'Mencari' || !punyaKebutuhan(k)) return;
    const n = nilaiCocok(k, pr);
    if (!n) return;
    const g = golongan(n);
    if (g === 'cocok') hasil.cocok.push(k);
    else if (g) hasil[g].push({ k: k, alasan: n.meleset[0], lebih: n.lebih });
  });
  hasil.cocok.sort(function (a, b) { return urutNama(a, b, 'nama'); });
  const dekat = function (a, b) { return a.lebih - b.lebih; };
  hasil.hampir = hasil.hampir.sort(dekat).slice(0, 5);
  hasil.alt = hasil.alt.sort(dekat).slice(0, 5);
  return hasil;
}

/* ── Pengingat hubungi lagi ── */

/** Klien yang perlu dihubungi hari ini atau sudah terlambat, yang paling lama terlambat dulu. */
/** Pengingat hubungi hanya berlaku untuk penjual dan pembeli yang masih mencari. Pembeli yang sudah dapat atau tidak lanjut tidak diingatkan lagi. */
function pengingatAktif(k) {
  return !!k.hubungi_tanggal && (k.peran !== 'Pembeli' || (k.status_beli || 'Mencari') === 'Mencari');
}

function perluDihubungi() {
  if (!S.data) return [];
  const hari = hariIni();
  return S.data.klien.filter(function (k) { return pengingatAktif(k) && k.hubungi_tanggal <= hari; })
    .sort(function (a, b) { return a.hubungi_tanggal < b.hubungi_tanggal ? -1 : a.hubungi_tanggal > b.hubungi_tanggal ? 1 : urutNama(a, b, 'nama'); });
}

function teksTerlambat(tanggal) {
  const n = selisihHari(tanggal);
  if (n === null) return '';
  if (n <= 0) return n === 0 ? 'Hari ini' : formatTanggal(tanggal);
  return 'Terlambat ' + n + ' hari';
}

/* ── Perubahan data di memori ── */

function simpanKeDaftar(daftar, kunci, obj) {
  const i = daftar.findIndex(function (x) { return x[kunci] === obj[kunci]; });
  if (i >= 0) daftar[i] = obj; else daftar.push(obj);
}

function hapusKlienDariData(id) {
  S.data.klien = S.data.klien.filter(function (k) { return k.id_klien !== id; });
  S.data.properti = S.data.properti.filter(function (p) { return p.id_klien !== id; });
  S.data.dokumen = S.data.dokumen.filter(function (d) { return d.id_klien !== id; });
  S.baruDibuka = S.baruDibuka.filter(function (x) { return x !== id; });
  simpanSesi('ap_baru', JSON.stringify(S.baruDibuka));
}

function hapusPropertiDariData(id) {
  S.data.properti = S.data.properti.filter(function (p) { return p.id_properti !== id; });
  S.data.dokumen = S.data.dokumen.filter(function (d) { return d.id_properti !== id; });
}

function hapusDokumenDariData(id) {
  S.data.dokumen = S.data.dokumen.filter(function (d) { return d.id_dokumen !== id; });
  const u = S.urlFoto.get(id);
  if (u) { URL.revokeObjectURL(u.url); S.urlFoto.delete(id); }
  const ua = S.urlFoto.get('asli:' + id);
  if (ua) { URL.revokeObjectURL(ua.url); S.urlFoto.delete('asli:' + id); }
}

function catatBaruDibuka(id) {
  S.baruDibuka = [id].concat(S.baruDibuka.filter(function (x) { return x !== id; })).slice(0, 10);
  simpanSesi('ap_baru', JSON.stringify(S.baruDibuka));
}

async function muatData(tujuan) {
  tampilMemuat('Membuka data arsip...');
  try {
    const j = await panggil('muatData', {});
    tutupMemuat();
    if (!j.ok) {
      S.bannerBerikut = { jenis: 'gagal', judul: 'Data gagal dibuka', pesan: j.pesan };
      buka('tanpaInternet', { tujuan: tujuan }, { ganti: true });
      return;
    }
    terimaData(j.data);
    const st = tujuan && tujuan.nama ? tujuan : { nama: 'beranda', param: {} };
    history.replaceState(st, '', '#' + st.nama);
    tampilkan(st);
  } catch (e) {
    tutupMemuat();
    if (e instanceof GalatSesi) return;
    buka('tanpaInternet', { tujuan: tujuan }, { ganti: true });
  }
}

/** Data dari server: isian yang belum ada (server lama) diberi nilai kosong supaya layar tidak rusak. */
function terimaData(d) {
  // 2.7: isian kosong tidak dikirim server; di sini diisi lagi supaya bentuk datanya tetap sama.
  const sk = d.skema || {};
  const bukaPak = function (x) {
    if (!x || !x.k) return x || [];
    return x.b.map(function (r) { const o = {}; for (let i = 0; i < x.k.length; i++) o[x.k[i]] = r[i]; return o; });
  };
  d.klien = bukaPak(d.klien); d.properti = bukaPak(d.properti); d.dokumen = bukaPak(d.dokumen); d.listing = bukaPak(d.listing);
  S.msServer = d.ms || 0; S.rinci = d.rinci || null; S.dariCache = !!d.dariCache;
  const isiSkema = function (daftar, kunci) {
    daftar = daftar || [];
    if (kunci && kunci.length) daftar.forEach(function (r) { for (let i = 0; i < kunci.length; i++) if (!(kunci[i] in r)) r[kunci[i]] = ''; });
    return daftar;
  };
  d.klien = isiSkema(d.klien, sk.klien).map(function (k) {
    return Object.assign({ kebutuhan_cara: '', kebutuhan_kondisi: '', budget: '', status_beli: k.peran === 'Pembeli' ? 'Mencari' : '', hubungi_tanggal: '', hubungi_catatan: '' }, k);
  });
  d.properti = isiSkema(d.properti, sk.properti).map(function (p) {
    const lama = !('dijual' in p);
    const t = lama ? tawaranDariLama(p.penawaran) : {};
    return Object.assign({ kondisi: '', dijual: false, disewakan: false, harga_jual: '', harga_sewa: '', satuan_sewa: '', luas_tanah: '', luas_bangunan: '',
      kamar_tidur: '', kamar_mandi: '', sertifikat: '', komisi_jenis: '', komisi_nilai: '', tanggal_sold: '' }, p, t);
  });
  d.dokumen = isiSkema(d.dokumen, sk.dokumen);
  d.listing = isiSkema(d.listing, sk.listing);
  // Listing yang belum dimuat: hanya [kode, jenis, baru?] supaya lencana tetap tepat.
  d.sisaListing = new Map((d.listingSisa || []).map(function (x) { return [x[0], { tipe: x[1], baru: !!x[2] }]; }));
  S.data = d;
}

function tawaranDariLama(v) {
  v = String(v || '');
  if (v === 'Baru' || v === 'Second') return { kondisi: v, dijual: true, disewakan: false };
  if (v === 'Disewakan' || v === 'Dikontrakkan') return { kondisi: '', dijual: false, disewakan: true, satuan_sewa: 'tahun' };
  return { kondisi: '', dijual: true, disewakan: false };
}

function serverLama() {
  const v = S.data && S.data.versiPustaka;
  return !v || String(v) < CONFIG.VERSI_SERVER_MIN;
}

/** Foto besar di memori (alamat + isi), diambil dari server setelah login. */
async function ambilFotoBesar(idDokumen, untuk) {
  // Pagar pertama: KTP dan NPWP tidak pernah disiapkan untuk dibagikan,
  // walaupun fotonya sudah pernah dibuka dan tersimpan di memori.
  if (untuk === 'bagikan') {
    const dk = cariDokumen(idDokumen);
    if (dk && DOK_KLIEN.indexOf(dk.jenis) >= 0) throw new Error(dk.jenis + ' tidak boleh dibagikan.');
  }
  if (S.urlFoto.has(idDokumen)) return S.urlFoto.get(idDokumen);
  const j = await panggil('ambilFoto', { id_dokumen: idDokumen, untuk: untuk || '' });
  if (!j.ok) throw new Error(j.pesan || 'Foto tidak bisa dibuka.');
  const blob = base64KeBlob(j.data.gambar, j.data.mime || 'image/jpeg');
  const x = { url: URL.createObjectURL(blob), blob: blob };
  S.urlFoto.set(idDokumen, x);
  if (S.urlFoto.size > 20) {
    const tertua = S.urlFoto.keys().next().value;
    URL.revokeObjectURL(S.urlFoto.get(tertua).url);
    S.urlFoto.delete(tertua);
  }
  // Foto properti yang sudah terbuka sekalian dijadikan foto kecil untuk daftar.
  const d = cariDokumen(idDokumen);
  if (d && d.jenis === 'Foto properti' && !S.mini.has(idDokumen)) {
    buatMini(blob).then(function (m) { if (m) simpanMini(idDokumen, m); }).catch(function () { /* abaikan */ });
  }
  return x;
}

/**
 * Bahan foto untuk gambar banner: foto asli tanpa watermark bila ada (banner sudah berlogo dan bernomor sendiri).
 * Foto lama yang tidak punya versi asli, atau bila gagal dibuka, memakai foto ber-watermark seperti biasa.
 */
const BANNER_INFO = { lama: 0, gagal: 0, pesan: '' };   // dicatat tiap pembuatan banner, untuk penjelasan di layar
async function ambilFotoBanner(idDokumen) {
  const dk = cariDokumen(idDokumen);
  if (!(dk && dk.ada_asli)) BANNER_INFO.lama++;
  if (dk && dk.ada_asli && DOK_KLIEN.indexOf(dk.jenis) < 0) {
    const kunci = 'asli:' + idDokumen;
    if (S.urlFoto.has(kunci)) return S.urlFoto.get(kunci);
    try {
      const j = await panggil('ambilFoto', { id_dokumen: idDokumen, versi: 'asli', untuk: 'banner' });
      if (j.ok) {
        const blob = base64KeBlob(j.data.gambar, j.data.mime || 'image/jpeg');
        const x = { url: URL.createObjectURL(blob), blob: blob };
        S.urlFoto.set(kunci, x);
        if (S.urlFoto.size > 20) {
          const tertua = S.urlFoto.keys().next().value;
          URL.revokeObjectURL(S.urlFoto.get(tertua).url);
          S.urlFoto.delete(tertua);
        }
        return x;
      }
      BANNER_INFO.gagal++;
      BANNER_INFO.pesan = j.pesan || '';
    } catch (e) {
      if (e instanceof GalatSesi) throw e;
      BANNER_INFO.gagal++;
    }
  }
  return ambilFotoBesar(idDokumen, 'bagikan');
}

async function urlFoto(idDokumen) {
  return (await ambilFotoBesar(idDokumen)).url;
}

function lepasPdf() {
  if (S.pdf && S.pdf.url) URL.revokeObjectURL(S.pdf.url);
  S.pdf = null;
}

function lepasFoto() {
  if (S.foto && S.foto.items) S.foto.items.forEach(function (it) { if (it.url) URL.revokeObjectURL(it.url); });
  S.foto = null;
}

/* ════════════════════════════════════════════════════════════
   FOTO KECIL (untuk daftar properti)
   Urutan: memori -> HP -> server (gambar mini dari Google Drive).
   ════════════════════════════════════════════════════════════ */

const ANTRE_MINI = { tunggu: new Map(), jadwal: null };

/** Pasang foto kecil dokumen ke dalam wadah (bila sudah tersedia), tanpa menghalangi layar. */
function pasangMini(wadah, idDokumen) {
  const isi = function (url) {
    const lama = wadah.querySelector('img.mini');
    if (lama) lama.remove();
    wadah.prepend(el('img', { class: 'mini', src: url, alt: '' }));
    wadah.classList.add('ada-foto');
  };
  if (S.mini.has(idDokumen)) { isi(S.mini.get(idDokumen)); return; }
  if (S.miniGagal.has(idDokumen)) return;
  const daftar = ANTRE_MINI.tunggu.get(idDokumen) || [];
  daftar.push(isi);
  ANTRE_MINI.tunggu.set(idDokumen, daftar);
  if (!ANTRE_MINI.jadwal) ANTRE_MINI.jadwal = setTimeout(prosesAntreMini, 60);
}

async function prosesAntreMini() {
  ANTRE_MINI.jadwal = null;
  const tunggu = ANTRE_MINI.tunggu;
  ANTRE_MINI.tunggu = new Map();
  const ids = Array.from(tunggu.keys());
  const kurang = [];
  for (let i = 0; i < ids.length; i++) {
    const blob = await dbAmbil('mini', ids[i]);
    if (blob instanceof Blob) setMini(ids[i], blob, tunggu.get(ids[i]));
    else kurang.push(ids[i]);
  }
  for (let i = 0; i < kurang.length && S.tiket; i += 24) {
    const potong = kurang.slice(i, i + 24);
    try {
      const j = await panggil('ambilMini', { ids: potong }, { abaikanSesi: true });
      if (!j.ok || !j.data || !j.data.mini) break;
      potong.forEach(function (id) {
        const m = j.data.mini[id];
        if (!m) { S.miniGagal.add(id); return; }
        const blob = base64KeBlob(m.gambar, m.mime || 'image/png');
        dbTaruh('mini', id, blob);
        setMini(id, blob, tunggu.get(id));
      });
    } catch (e) {
      break;   // tidak ada internet: biarkan ilustrasi, dicoba lagi lain kali
    }
  }
}

function setMini(id, blob, penerima) {
  let url = S.mini.get(id);
  if (!url) { url = URL.createObjectURL(blob); S.mini.set(id, url); }
  (penerima || []).forEach(function (fn) { fn(url); });
}

function simpanMini(id, b64OrBlob) {
  const blob = b64OrBlob instanceof Blob ? b64OrBlob : base64KeBlob(b64OrBlob, 'image/jpeg');
  dbTaruh('mini', id, blob);
  setMini(id, blob, []);
}

/** Foto kecil (JPEG, sisi terpanjang MINI_SISI) dari sebuah foto. Hasil: base64. */
async function buatMini(blob) {
  const h = await kecilkanGambar(blob, CONFIG.MINI_SISI, 0.72);
  return blobKeBase64(h.blob);
}

/**
 * Label di pojok foto. Detail (besar): BU dan DISKON. Daftar: BU, atau -8% bila ada diskon.
 */
function labelFoto(pr, besar) {
  const b = [];
  const diskon = hargaPromoRinci(pr).length > 0;
  const p = persenDiskon(pr);
  if (besar) {
    if (adaBU(pr)) b.push(el('span', { class: 'label-foto label-bu', text: 'BU' }));
    if (diskon) b.push(el('span', { class: 'label-foto label-diskon', text: 'DISKON' }));
  } else if (adaBU(pr)) {
    b.push(el('span', { class: 'label-foto label-bu', text: 'BU' }));
  } else if (diskon) {
    b.push(el('span', { class: 'label-foto label-diskon', text: p ? '-' + p + '%' : 'DISKON' }));
  }
  return b.length ? el('span', { class: 'label-tumpuk' }, b) : null;
}

/**
 * Gambar properti untuk daftar: foto terbaru bila ada, selain itu ilustrasi atau "Belum ada foto".
 * Ditambah pita DEAL atau SOLD, label BU atau diskon, dan jumlah foto.
 */
function gambarProp(pr, besar) {
  const foto = fotoProperti(pr);
  const g = progresProp(pr);
  const wadah = el('span', { class: (besar ? 'gambar-utama' : 'gambar-prop') + (foto.length ? '' : ' tanpa-foto') + (g === 'Sold' || g === 'Agen lain' ? ' pudar' : '') });
  if (foto.length) {
    wadah.append(ikon('rumah', besar ? '' : 'ikon-besar'));
    if (!besar) wadah.append(el('span', { class: 'jumlah-foto' }, ikon('gambar', 'ikon-mini'), String(foto.length)));
    pasangMini(wadah, foto[0].id_dokumen);
  } else if (!besar) {
    wadah.append(ikon('kamera'), el('span', { class: 'tulisan-kecil', text: 'Belum ada foto' }));
  } else {
    wadah.append(ikon('rumah'));
  }
  const lencana = labelFoto(pr, besar);
  if (lencana) wadah.append(lencana);
  if (g === 'Deal') wadah.append(el('span', { class: 'pita pita-deal', text: 'DEAL' }));
  if (g === 'Sold') wadah.append(el('span', { class: 'pita pita-sold', text: 'SOLD' }));
  return wadah;
}

/* ════════════════════════════════════════════════════════════
   GAMBAR PROMO (4:5, 1080 x 1350)
   Dibuat di HP dari foto yang dicentang (satu gambar per foto). Tidak disimpan ke Drive.
   ════════════════════════════════════════════════════════════ */

const PROMO_W = 1080, PROMO_H = 1350;

/** "Rp 11 M", "Rp 1,25 M", "Rp 900 jt" untuk gambar promo. */
function hargaPromo(n) {
  const v = Number(n) || 0;
  if (v >= 1e9) return 'Rp ' + (Math.round(v / 1e7) / 100).toString().replace('.', ',') + ' M';
  return 'Rp ' + Math.round(v / 1e6) + ' jt';
}

/** Nama area untuk judul besar: bagian sebelum koma (Bintaro, Jakarta Selatan -> BINTARO). */
function areaPromo(pr) {
  return (detailDariArea(pr.area) || kotaDariArea(pr.area) || 'Properti').toUpperCase();
}

/** Harga utama untuk gambar promo: jual dulu, lalu sewa. Null bila belum diisi. */
function pasanganHargaPromo(pr) {
  if (pr.dijual && pr.harga_jual) return { normal: Number(pr.harga_jual), promo: Number(pr.harga_jual_promo) || 0, akhiran: '' };
  if (pr.disewakan && pr.harga_sewa) return { normal: Number(pr.harga_sewa), promo: Number(pr.harga_sewa_promo) || 0, akhiran: satuanSewa(pr) };
  return null;
}

/** Baris spesifikasi gambar promo, misalnya ["LT 120 m² · LB 90 m² · 3 KT · 2 KM", "Carport 2 mobil · Listrik 2.200 watt"]. */
function spekPromo(pr) {
  const a = [
    pr.luas_tanah ? 'LT ' + angkaTampil(pr.luas_tanah) + ' m²' : '',
    pr.luas_bangunan ? 'LB ' + angkaTampil(pr.luas_bangunan) + ' m²' : '',
    pr.kamar_tidur ? pr.kamar_tidur + ' KT' : '',
    pr.kamar_mandi ? pr.kamar_mandi + ' KM' : ''
  ].filter(Boolean).join(' · ');
  const b = [
    carportTeks(pr) ? 'Carport ' + carportTeks(pr).toLowerCase() : '',
    pr.listrik_va ? 'Listrik ' + formatRibuan(pr.listrik_va) + ' watt' : '',
    pr.menghadap ? 'Menghadap ' + pr.menghadap : ''
  ].filter(Boolean).join(' · ');
  return [a, b].filter(Boolean);
}

function namaFilePromo(pr, nomor) {
  return 'Promo ' + (pr.nama_properti || 'properti').replace(/[^\w\- ]+/g, '').trim() + (nomor ? ' ' + nomor : '') + '.jpg';
}

/** Tulisan yang diperkecil sampai muat di lebar yang diberikan. */
function tulisanMuat(c, teks, px, bobot, lebar) {
  let f = px;
  c.font = bobot + ' ' + f + 'px "Segoe UI", Roboto, Arial, sans-serif';
  while (c.measureText(teks).width > lebar && f > 24) { f -= 2; c.font = bobot + ' ' + f + 'px "Segoe UI", Roboto, Arial, sans-serif'; }
}

/**
 * Satu gambar promo 1080 x 1350 dari satu foto properti. Susunan (v4.5):
 * atas: logo kecil di kiri, label BU dan HEMAT di kanan; tengah: foto 4:5;
 * bawah: nama, area, harga (coret bila promo), spesifikasi, kaki hubungi agen.
 * pilih = { harga, spek, agen } menentukan tulisan yang tampil. Hasil: Blob JPEG.
 */
async function buatGambarPromo(pr, idFoto, pilih) {
  if (pilih.gaya === 'banner') return buatGambarBanner(pr, idFoto, pilih);
  const W = PROMO_W, H = PROMO_H;
  const kanvas = document.createElement('canvas');
  kanvas.width = W;
  kanvas.height = H;
  const c = kanvas.getContext('2d');
  c.fillStyle = '#B8AE97';
  c.fillRect(0, 0, W, H);

  const x = await ambilFotoBesar(idFoto, 'bagikan');
  const img = new Image();
  img.src = x.url;
  await img.decode();
  const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
  const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
  c.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);

  // Pita gelap di atas dan bawah supaya tulisan terbaca.
  const atas = c.createLinearGradient(0, 0, 0, 340);
  atas.addColorStop(0, 'rgba(0,0,0,0.5)');
  atas.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = atas;
  c.fillRect(0, 0, W, 340);
  const bawah = c.createLinearGradient(0, H - 660, 0, H);
  bawah.addColorStop(0, 'rgba(0,0,0,0)');
  bawah.addColorStop(1, 'rgba(0,0,0,0.7)');
  c.fillStyle = bawah;
  c.fillRect(0, H - 660, W, 660);

  // Atas kiri: logo kecil
  try {
    const logo = await muatMarka();
    const lw = 170, lh = lw * logo.height / logo.width;
    c.globalAlpha = 0.9;
    c.drawImage(logo, 56, 56, lw, lh);
    c.globalAlpha = 1;
  } catch (e) { /* logo tidak termuat: gambar tetap dibuat */ }

  // Atas kanan: label BU dan HEMAT
  const lencana = [];
  if (adaBU(pr)) lencana.push({ teks: 'BU', latar: '#2E7D5B', warna: '#FFFFFF' });
  const harga = pasanganHargaPromo(pr);
  if (harga && harga.promo > 0 && harga.promo < harga.normal) {
    lencana.push({ teks: 'HEMAT ' + hargaPromo(harga.normal - harga.promo), latar: '#F2B33D', warna: '#3A2400' });
  }
  let yl = 56;
  lencana.forEach(function (l) {
    c.font = '800 46px "Segoe UI", Roboto, Arial, sans-serif';
    const w = c.measureText(l.teks).width + 56;
    const xl = W - 56 - w;
    c.fillStyle = l.latar;
    garisBundar(c, xl, yl, w, 84, 42);
    c.fill();
    c.fillStyle = l.warna;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(l.teks, xl + w / 2, yl + 43);
    yl += 84 + 16;
  });

  // Bawah: nama, area, harga, spesifikasi, kaki
  c.textAlign = 'center';
  c.textBaseline = 'alphabetic';
  c.fillStyle = '#FFFFFF';
  // Bayangan halus di belakang tulisan bawah supaya tetap terbaca di foto yang terang.
  c.save();
  c.shadowColor = 'rgba(0,0,0,0.85)';
  c.shadowBlur = 14;
  c.shadowOffsetY = 2;
  const y0 = H - 600;
  tulisanMuat(c, pr.nama_properti || 'Properti', 66, '800', W - 120);
  c.fillText(pr.nama_properti || 'Properti', W / 2, y0);
  c.font = '600 40px "Segoe UI", Roboto, Arial, sans-serif';
  c.fillText(areaPromo(pr), W / 2, y0 + 62);

  let yHarga = y0 + 250;
  if (pilih.harga && harga) {
    const adaPromo = harga.promo > 0 && harga.promo < harga.normal;
    if (adaPromo) {
      const teksNormal = hargaPromo(harga.normal) + harga.akhiran;
      c.font = '600 46px "Segoe UI", Roboto, Arial, sans-serif';
      c.fillStyle = 'rgba(255,255,255,0.85)';
      const lebarN = c.measureText(teksNormal).width;
      c.fillText(teksNormal, W / 2, y0 + 130);
      c.fillRect(W / 2 - lebarN / 2 - 8, y0 + 118, lebarN + 16, 5);   // garis coret
      c.fillStyle = '#FFFFFF';
      yHarga = y0 + 250;
      tulisanMuat(c, hargaPromo(harga.promo) + harga.akhiran, 120, '800', W - 120);
      c.fillText(hargaPromo(harga.promo) + harga.akhiran, W / 2, yHarga);
    } else {
      tulisanMuat(c, hargaPromo(harga.normal) + harga.akhiran, 120, '800', W - 120);
      c.fillText(hargaPromo(harga.normal) + harga.akhiran, W / 2, yHarga);
    }
  }
  if (pilih.spek) {
    c.font = '600 38px "Segoe UI", Roboto, Arial, sans-serif';
    spekPromo(pr).forEach(function (baris, i) {
      tulisanMuat(c, baris, 38, '600', W - 120);
      c.fillText(baris, W / 2, y0 + 340 + i * 52);
    });
  }
  if (pilih.agen) {
    tulisanMuat(c, 'Hubungi ' + CONFIG.NAMA_PEMILIK + ' · ' + CONFIG.NO_HP_PEMILIK, 42, '700', W - 120);
    c.fillText('Hubungi ' + CONFIG.NAMA_PEMILIK + ' · ' + CONFIG.NO_HP_PEMILIK, W / 2, H - 70);
  }
  c.restore();

  const blob = await new Promise(function (ok, gagal) {
    kanvas.toBlob(function (b) { if (b) ok(b); else gagal(new Error('toBlob')); }, 'image/jpeg', 0.92);
  });
  kanvas.width = 0;
  kanvas.height = 0;
  return blob;
}

const ASET = {};
function muatAset(nama) {
  if (!ASET[nama]) {
    ASET[nama] = new Promise(function (ok, gagal) {
      const g = new Image();
      g.onload = function () { ok(g); };
      g.onerror = function () { ASET[nama] = null; gagal(new Error(nama)); };
      g.src = nama;
    });
  }
  return ASET[nama];
}

function gayaPromoAwal() {
  try { return localStorage.getItem('gayaPromo') === 'banner' ? 'banner' : 'watermark'; } catch (e) { return 'watermark'; }
}

/** Gaya "Banner Gading Pro": foto di atas, strip banner di bawah (harga, hubungi, QR WhatsApp). Hasil: Blob JPEG 1080 x 1350. */
async function buatGambarBanner(pr, idFoto, pilih) {
  const W = PROMO_W, H = PROMO_H;
  const NAVY = '#1D3A8A', GELAP = '#12256A', ORANYE = '#F7943A';
  const F = ' "Segoe UI", Roboto, Arial, sans-serif';
  const kanvas = document.createElement('canvas');
  kanvas.width = W;
  kanvas.height = H;
  const c = kanvas.getContext('2d');
  c.fillStyle = '#FFFFFF';
  c.fillRect(0, 0, W, H);
  const yHub = H - 60 - 250;   // strip hubungi: dari sini sampai kaki oranye
  // Tinggi foto menyesuaikan banyaknya tulisan di bawahnya, supaya tidak bertabrakan dengan strip hubungi.
  const harga = pasanganHargaPromo(pr);
  const adaPromo = !!(pilih.harga && harga && harga.promo > 0 && harga.promo < harga.normal);
  const barisSpek = pilih.spek ? spekPromo(pr) : [];
  const area = areaPromo(pr);
  const butuh = 62 + (area ? 40 : 0) + (pilih.harga && harga ? (adaPromo ? 44 : 0) + 72 : 0) + (barisSpek.length ? 44 + 38 * (barisSpek.length - 1) + 10 : 0) + 18;
  const yFoto = Math.max(440, Math.min(pilih.agen ? 800 : 960, (pilih.agen ? yHub : H - 60) - butuh));

  const x = await ambilFotoBanner(idFoto);
  const img = new Image();
  img.src = x.url;
  await img.decode();
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const rasio = iw / ih, rasioArea = W / yFoto;
  const hilang = rasio >= rasioArea ? 1 - rasioArea / rasio : 1 - rasio / rasioArea;   // bagian foto yang terpotong bila dipenuhkan
  c.save();
  c.beginPath();
  c.rect(0, 0, W, yFoto);
  c.clip();
  if (hilang > 0.25) {
    // Foto tegak: tampil utuh di tengah, sisi kiri-kanan diisi bayangan buram dari foto yang sama.
    let k = img, kw = iw, kh = ih;
    [24, 48, 96, 192, 384].forEach(function (lebar) {
      const k2 = document.createElement('canvas');
      k2.width = lebar;
      k2.height = Math.max(1, Math.round(lebar * yFoto / W));
      const sk = Math.max(k2.width / kw, k2.height / kh);
      k2.getContext('2d').drawImage(k, (k2.width - kw * sk) / 2, (k2.height - kh * sk) / 2, kw * sk, kh * sk);
      k = k2; kw = k2.width; kh = k2.height;
    });
    c.imageSmoothingQuality = 'high';
    c.drawImage(k, 0, 0, W, yFoto);
    c.fillStyle = 'rgba(0,0,0,0.18)';
    c.fillRect(0, 0, W, yFoto);
    const sc = Math.min(W / iw, yFoto / ih);
    c.drawImage(img, (W - iw * sc) / 2, (yFoto - ih * sc) / 2, iw * sc, ih * sc);
  } else {
    const s = Math.max(W / iw, yFoto / ih);
    c.drawImage(img, (W - iw * s) / 2, (yFoto - ih * s) / 2, iw * s, ih * s);
  }
  c.restore();

  try { const lg = await muatAset('logo-banner.png'); c.drawImage(lg, 0, 0, 300, 150); } catch (e) { /* logo tidak termuat: gambar tetap dibuat */ }

  // Kanan atas: DIJUAL / DISEWAKAN, BU, HEMAT
  const lencana = [{ teks: pr.dijual && pr.disewakan ? 'DIJUAL / DISEWAKAN' : pr.disewakan ? 'DISEWAKAN' : 'DIJUAL', latar: ORANYE, warna: '#FFFFFF' }];
  if (adaBU(pr)) lencana.push({ teks: 'BU', latar: '#2E7D5B', warna: '#FFFFFF' });
  if (harga && harga.promo > 0 && harga.promo < harga.normal) lencana.push({ teks: 'HEMAT ' + hargaPromo(harga.normal - harga.promo), latar: '#F2B33D', warna: '#3A2400' });
  let yl = 36;
  lencana.forEach(function (l) {
    c.font = '800 40px' + F;
    const w = c.measureText(l.teks).width + 52;
    const xl = W - 36 - w;
    c.fillStyle = l.latar;
    garisBundar(c, xl, yl, w, 76, 38);
    c.fill();
    c.fillStyle = l.warna;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(l.teks, xl + w / 2, yl + 39);
    yl += 76 + 14;
  });

  // Nama, area, harga, spesifikasi
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  let y = yFoto + 62;
  c.fillStyle = NAVY;
  const nama = pr.nama_properti || 'Properti';
  tulisanMuat(c, nama, 52, '800', W - 96);
  c.fillText(nama, 48, y);
  if (area) {
    c.fillStyle = '#3A3A3A';
    tulisanMuat(c, area, 28, '600', W - 96);
    c.fillText(area, 48, y + 40);
    y += 40;
  }
  if (pilih.harga && harga) {
    if (adaPromo) {
      const tn = hargaPromo(harga.normal) + harga.akhiran;
      c.font = '600 28px' + F;
      c.fillStyle = '#6B6B6B';
      c.fillText(tn, 48, y + 44);
      c.fillRect(44, y + 34, c.measureText(tn).width + 8, 3);
      y += 44;
    }
    const tp = hargaPromo(adaPromo ? harga.promo : harga.normal) + harga.akhiran;
    c.fillStyle = NAVY;
    tulisanMuat(c, tp, 68, '800', W - 96);
    c.fillText(tp, 48, y + 72);
    y += 72;
  }
  if (barisSpek.length) {
    c.fillStyle = '#3A3A3A';
    barisSpek.forEach(function (baris, i) {
      tulisanMuat(c, baris, 25, '600', W - 96);
      c.fillText(baris, 48, y + 44 + i * 38);
    });
  }

  // Strip hubungi: nama, nomor, QR WhatsApp
  if (pilih.agen) {
    c.fillStyle = GELAP;
    c.font = '700 26px' + F;
    c.textAlign = 'left';
    c.fillText('HUBUNGI :', 48, yHub + 34);
    c.fillStyle = NAVY;
    c.fillRect(0, yHub + 48, 770, 84);
    c.fillStyle = '#FFFFFF';
    c.textAlign = 'center';
    const nm = String(CONFIG.NAMA_BANNER || CONFIG.NAMA_PEMILIK || '').toUpperCase();
    tulisanMuat(c, nm, 62, '800', 700);
    c.fillText(nm, 385, yHub + 48 + 62);
    c.fillStyle = GELAP;
    tulisanMuat(c, CONFIG.NO_HP_PEMILIK, 108, '800', 740);
    c.fillText(CONFIG.NO_HP_PEMILIK, 385, yHub + 232);
    try {
      const qr = await muatAset('qr-wa.png');
      c.fillStyle = ORANYE;
      garisBundar(c, 810, yHub + 10, 232, 232, 24);
      c.fill();
      c.fillStyle = '#FFFFFF';
      c.font = '800 25px' + F;
      c.fillText('SCAN ME', 926, yHub + 44);
      garisBundar(c, 830, yHub + 58, 192, 172, 10);
      c.fill();
      c.drawImage(qr, 842, yHub + 62, 168, 168);
    } catch (e) { /* QR tidak termuat: gambar tetap dibuat tanpa QR */ }
  }

  // Kaki
  c.fillStyle = ORANYE;
  c.fillRect(0, H - 60, W, 60);
  c.fillStyle = GELAP;
  c.fillRect(520, H - 60, W - 520, 60);
  c.fillStyle = '#FFFFFF';
  c.textAlign = 'left';
  tulisanMuat(c, 'JUAL • BELI • SEWA • PROPERTI', 27, '800', 470);
  c.fillText('JUAL • BELI • SEWA • PROPERTI', 36, H - 21);
  c.textAlign = 'center';
  const sosial = 'gadingproofficial · gadingpro · www.gadingpro.com';
  let fs = 22;
  c.font = '600 ' + fs + 'px' + F;
  while (c.measureText(sosial).width > W - 520 - 28 && fs > 12) { fs -= 1; c.font = '600 ' + fs + 'px' + F; }
  c.fillText(sosial, (520 + W) / 2, H - 22);

  const blob = await new Promise(function (ok, gagal) {
    kanvas.toBlob(function (b) { if (b) ok(b); else gagal(new Error('toBlob')); }, 'image/jpeg', 0.92);
  });
  kanvas.width = 0;
  kanvas.height = 0;
  return blob;
}

function garisBundar(c, x, y, w, h, r) {
  c.beginPath();
  if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h);
  c.closePath();
}

/** Layar gambar promo: centang foto yang mau diberi tulisan, pilih isi tulisan, lalu unduh atau bagikan. */
function layarPromo(isi, p) {
  const pr = p.id ? cariProperti(p.id) : null;
  if (!pr) return tidakAda();
  const k = cariKlien(pr.id_klien);
  kepala({ judul: 'Gambar Promo' });
  const st = S.layar;
  const fotos = fotoProperti(pr);
  const dipilih = {};
  if (fotos[0]) dipilih[fotos[0].id_dokumen] = true;
  const pilih = { harga: true, spek: true, agen: true, gaya: gayaPromoAwal() };
  let hasil = [];          // { nama, blob, url }
  let nomor = 0;

  const catatan = el('p', { class: 'kecil redup', 'aria-live': 'polite' });
  const kisiFoto = el('div', { class: 'grid-foto-promo' });
  const wadahHasil = el('div', { class: 'hasil-promo' });
  const tombolBagi = tombol('tombol-wa', ikonWa('putih'), 'Bagikan ke WhatsApp', bagikan);
  const tombolUnduh = tombol('tombol-kedua', 'unduh', 'Unduh gambar', unduh);
  const tandaHarga = kotakCentang('Tulisan harga', 'Harga normal dan harga promo', true, function (b) { pilih.harga = b; segarkan(); });
  const tandaSpek = kotakCentang('Tulisan spesifikasi', 'Luas, kamar, carport, listrik, menghadap', true, function (b) { pilih.spek = b; segarkan(); });
  const tandaAgen = kotakCentang('Nama dan HP agen', 'Hubungi ' + CONFIG.NAMA_PEMILIK + ' · ' + CONFIG.NO_HP_PEMILIK, true, function (b) { pilih.agen = b; segarkan(); });

  fotos.forEach(function (f) {
    const img = el('img', { alt: '' });
    const kotak = el('button', { type: 'button', class: 'pilih-foto', 'aria-pressed': dipilih[f.id_dokumen] ? 'true' : 'false', onclick: function () {
      dipilih[f.id_dokumen] = !dipilih[f.id_dokumen];
      kotak.setAttribute('aria-pressed', dipilih[f.id_dokumen] ? 'true' : 'false');
      segarkan();
    } }, img, el('span', { class: 'tanda-pilih' }, ikon('centang', 'ikon-mini')));
    kisiFoto.append(kotak);
    urlFoto(f.id_dokumen).then(function (u) { if (S.layar === st) img.src = u; }).catch(function () { /* foto tidak termuat: kotak tetap bisa dicentang */ });
  });

  isi.append(
    el('div', { class: 'bidang' }, el('span', { class: 'label', text: 'Foto yang diberi tulisan' }), el('span', { class: 'keterangan', text: 'Boleh lebih dari satu. Tiap foto jadi satu gambar.' })),
    fotos.length ? kisiFoto : el('p', { class: 'kecil redup', text: 'Belum ada foto properti. Tambahkan foto dulu.' }),
    el('div', { class: 'jarak-atas' }, grupPilihan('Gaya gambar', '', [{ nilai: 'watermark', label: 'Watermark' }, { nilai: 'banner', label: 'Banner Gading Pro' }], pilih.gaya, function (g) {
      pilih.gaya = g;
      try { localStorage.setItem('gayaPromo', g); } catch (e) { /* tidak apa-apa */ }
      segarkan();
    }).wadah),
    el('div', { class: 'bidang jarak-atas' }, el('span', { class: 'label', text: 'Tulisan yang tampil' }), tandaHarga, tandaSpek, tandaAgen),
    catatan, wadahHasil,
    el('div', { class: 'tumpuk jarak-atas' }, tombolBagi, tombolUnduh));

  function sibuk(t, aktif, teksSibuk, teksBiasa) {
    t.disabled = aktif;
    t.querySelector('span').textContent = aktif ? teksSibuk : teksBiasa;
  }

  async function segarkan() {
    const ke = ++nomor;
    const terpilih = fotos.filter(function (f) { return dipilih[f.id_dokumen]; });
    tombolBagi.disabled = true;
    tombolUnduh.disabled = true;
    if (!terpilih.length) {
      hasil.forEach(function (h) { URL.revokeObjectURL(h.url); });
      hasil = [];
      kosongkan(wadahHasil);
      catatan.textContent = 'Centang minimal satu foto.';
      return;
    }
    catatan.textContent = 'Menyiapkan ' + terpilih.length + ' gambar...';
    const baru = [];
    BANNER_INFO.lama = 0; BANNER_INFO.gagal = 0; BANNER_INFO.pesan = '';
    try {
      for (let i = 0; i < terpilih.length; i++) {
        const b = await buatGambarPromo(pr, terpilih[i].id_dokumen, pilih);
        if (ke !== nomor || S.layar !== st) { baru.forEach(function (h) { URL.revokeObjectURL(h.url); }); return; }
        baru.push({ nama: namaFilePromo(pr, terpilih.length > 1 ? i + 1 : 0), blob: b, url: URL.createObjectURL(b) });
      }
      hasil.forEach(function (h) { URL.revokeObjectURL(h.url); });
      hasil = baru;
      kosongkan(wadahHasil);
      hasil.forEach(function (h) { wadahHasil.append(el('img', { class: 'pratinjau-promo', alt: 'Pratinjau gambar promo', src: h.url })); });
      catatan.textContent = hasil.length + ' gambar, ukuran 4:5 (1080 × 1350).';
      if (pilih.gaya === 'banner') {
        if (BANNER_INFO.gagal) catatan.textContent += ' Foto asli belum bisa dibuka' + (BANNER_INFO.pesan ? ' (' + BANNER_INFO.pesan + ')' : '') + ', jadi memakai foto ber-watermark. Pastikan server sudah versi terbaru.';
        else if (BANNER_INFO.lama) catatan.textContent += ' ' + BANNER_INFO.lama + ' foto belum punya versi asli (diunggah sebelum fitur ini), jadi masih ber-watermark. Unggah ulang fotonya agar bersih.';
      }
      tombolBagi.disabled = false;
      tombolUnduh.disabled = false;
    } catch (e) {
      if (ke === nomor) catatan.textContent = 'Gambar belum bisa dibuat. Coba lagi.';
    }
  }

  function unduh() {
    hasil.forEach(function (h, i) {
      setTimeout(function () {
        const a = el('a', { href: h.url, download: h.nama });
        document.body.append(a);
        a.click();
        a.remove();
      }, i * 400);   // jeda supaya Chrome tidak memblokir unduhan beruntun
    });
  }

  async function bagikan() {
    if (!hasil.length) return;
    const files = hasil.map(function (h) { return new File([h.blob], h.nama, { type: 'image/jpeg' }); });
    if (!(navigator.canShare && navigator.canShare({ files: files }))) { unduh(); return; }
    sibuk(tombolBagi, true, 'Membuka menu...', 'Bagikan ke WhatsApp');
    try {
      await navigator.share({ files: files, text: teksPromosi([pr], k) });
    } catch (e) {
      if (!e || e.name !== 'AbortError') unduh();
    } finally {
      sibuk(tombolBagi, false, '', 'Bagikan ke WhatsApp');
    }
  }

  if (fotos.length) segarkan();
  else { tombolBagi.disabled = true; tombolUnduh.disabled = true; }
}

/* ════════════════════════════════════════════════════════════
   NAVIGASI
   Tombol kembali di layar dan tombol kembali HP memakai riwayat yang sama.
   Alamat hanya berisi nama layar; tiket dan data tidak pernah masuk alamat.
   ════════════════════════════════════════════════════════════ */

const LAYAR = {
  masuk: layarMasuk,
  beranda: layarBeranda,
  cari: layarCari,
  profil: layarProfil,
  properti: layarProperti,
  pilihTujuan: layarPilihTujuan,
  foto: layarFoto,
  simpanFoto: layarSimpanFoto,
  lihat: layarLihatDokumen,
  ubahDok: layarUbahDokumen,
  klien: layarFormKlien,
  listing: layarListing,
  formListing: layarFormListing,
  detailListing: layarDetailListing,
  formProperti: layarFormProperti,
  cetak: layarCetak,
  bagikan: layarBagikan,
  promo: layarPromo,
  dihapus: layarDihapus,
  rapikanArea: layarRapikanArea,
  tanpaInternet: layarTanpaInternet
};

function buka(nama, param, opsi) {
  const st = { nama: nama, param: param || {} };
  if (opsi && opsi.ganti) history.replaceState(st, '', '#' + nama);
  else history.pushState(st, '', '#' + nama);
  tampilkan(st);
}

/** Ubah isian layar yang sedang tampil (objeknya tetap sama supaya pemeriksaan "masih di layar ini" tetap benar). */
function gantiParam(param) {
  if (!S.layar) return;
  S.layar.param = Object.assign(S.layar.param || {}, param);
  history.replaceState(S.layar, '', '#' + S.layar.nama);
}

/** Atur kepala halaman: judul, tombol kembali, tombol kanan, dan menu bawah. */
function kepala(o) {
  document.getElementById('kepalaJudul').textContent = o.judul || '';
  const kanan = document.getElementById('kepalaKanan');
  kosongkan(kanan);
  if (o.kanan) kanan.append(o.kanan);
  document.getElementById('tombolKembali').classList.toggle('tersembunyi', !!o.tanpaKembali);
  document.getElementById('kepala').classList.toggle('tanpa-kembali', !!o.tanpaKembali);
  if (o.nav) pasangNav(o.nav);
}

function pasangNav(aktif) {
  const MENU = [['beranda', 'rumah', 'Beranda'], ['klien', 'orang', 'Klien'], ['properti', 'gedung', 'Properti'], ['listing', 'daftar', 'Listing']];
  const nIngat = perluDihubungi().length + jumlahUltahPerlu();
  // Angka lencana selalu dihitung ulang dari data terkini setiap menu digambar.
  const lencanaMenu = function (kode) { return kode === 'beranda' ? nIngat : kode === 'listing' ? jumlahListingBaru() : 0; };
  function pindah(kode) {
    if (kode === aktif) return;
    if (kode === 'beranda') buka('beranda', {});
    else if (kode === 'listing') buka('listing', {});
    else buka('cari', { tampil: kode, mode: 'lihat' });
  }

  // HP: tiga tombol di bawah layar
  const n = document.getElementById('navBawah');
  kosongkan(n);
  MENU.forEach(function (x) {
    n.append(el('button', {
      type: 'button', class: 'nav-item', 'aria-current': x[0] === aktif ? 'page' : null,
      'aria-label': x[2] + (x[0] === 'beranda' && nIngat ? ', ' + nIngat + ' klien perlu dihubungi' : x[0] === 'listing' && lencanaMenu('listing') ? ', ' + lencanaMenu('listing') + ' listing baru' : ''),
      onclick: function () { pindah(x[0]); }
    }, el('span', { class: 'nav-ikon' }, ikon(x[1]), lencanaMenu(x[0]) ? el('span', { class: 'lencana lencana-nav', text: String(lencanaMenu(x[0])) }) : null),
    el('span', { text: x[2] })));
  });
  n.classList.remove('tersembunyi');

  // Laptop: menu samping (tampil lewat CSS hanya di layar lebar)
  const sisi = document.getElementById('sisi');
  kosongkan(sisi);
  function itemSisi(ikonNama, teks, aksi, aktifItem, lencana) {
    return el('button', { type: 'button', class: 'sisi-item', 'aria-current': aktifItem ? 'page' : null, onclick: aksi },
      ikon(ikonNama), el('span', { text: teks }), lencana ? el('span', { class: 'lencana', text: String(lencana) }) : null);
  }
  sisi.append(
    el('div', { class: 'sisi-merek' },
      el('img', { src: './icon-192.png', alt: '', width: '80', height: '80' }),
      el('strong', { text: 'Arsip Properti' })),
    el('nav', { class: 'sisi-menu', 'aria-label': 'Menu samping' },
      MENU.map(function (x) { return itemSisi(x[1], x[2], function () { pindah(x[0]); }, x[0] === aktif, lencanaMenu(x[0])); }),
      itemSisi('kamera', 'Foto Dokumen', function () { buka('cari', { tampil: 'klien', mode: 'foto' }); }, false),
      itemSisi('printer', 'Cetak PDF', function () { buka('cari', { tampil: 'klien', mode: 'cetak' }); }, false)),
    el('div', { class: 'sisi-bawah' },
      itemSisi('sampah', 'Baru dihapus', function () { buka('dihapus', {}); }, aktif === 'dihapus'),
      itemSisi('area', 'Rapikan area', function () { buka('rapikanArea', {}); }, aktif === 'rapikanArea'),
      itemSisi('keluar', 'Keluar', keluar, false)));
  document.body.classList.add('ada-nav');
}

function tampilkan(st) {
  st = st && LAYAR[st.nama] ? st : { nama: S.tiket ? 'beranda' : 'masuk', param: {} };
  const butuhData = st.nama !== 'masuk' && st.nama !== 'tanpaInternet';
  if (butuhData && !S.tiket) {
    st = { nama: 'masuk', param: {} };
    history.replaceState(st, '', '#masuk');
  } else if (butuhData && !S.data) {
    muatData(st);
    return;
  }
  if (st.nama === 'masuk' && S.tiket && S.data) {
    st = { nama: 'beranda', param: {} };
    history.replaceState(st, '', '#beranda');
  }

  if (S.perluMuatUlang && (st.nama === 'beranda' || st.nama === 'masuk')) { S.perluMuatUlang = false; location.reload(); return; }
  if (S.layar && S.layar.nama === 'cetak' && st.nama !== 'cetak') lepasPdf();
  if (S.layar && S.layar.nama === 'bagikan' && st.nama !== 'bagikan') lepasBagikan();
  S.layar = st;

  // Keadaan awal setiap layar; layar boleh mengubahnya lewat kepala().
  document.body.className = '';
  document.getElementById('navBawah').classList.add('tersembunyi');
  kosongkan(document.getElementById('sisi'));
  kepala({ judul: 'Arsip Properti' });

  const isi = document.getElementById('isi');
  kosongkan(isi);
  S.bannerTertunda = S.bannerBerikut;
  S.bannerBerikut = null;
  LAYAR[st.nama](isi, st.param || {});
  if (S.bannerTertunda) {
    const b = S.bannerTertunda;
    S.bannerTertunda = null;
    isi.prepend(buatBanner(b));
    umumkan(b.judul + (b.pesan ? '. ' + b.pesan : ''));
  }
  window.scrollTo(0, 0);
  isi.focus({ preventScroll: true });
}

function tidakAda() {
  S.bannerBerikut = { jenis: 'waspada', judul: 'Data tidak ditemukan', pesan: 'Mungkin sudah dihapus.' };
  setTimeout(function () { buka('beranda', {}, { ganti: true }); }, 0);
}

window.addEventListener('popstate', function (e) {
  if (S.tutupDialog) S.tutupDialog(null);
  if (S.sibuk && S.layar) {
    // Proses masih berjalan: tetap di layar ini.
    history.pushState(S.layar, '', '#' + S.layar.nama);
    umumkan('Tunggu sampai proses selesai.');
    return;
  }
  tampilkan(e.state);
});

/* ════════════════════════════════════════════════════════════
   LAYAR: MASUK
   ════════════════════════════════════════════════════════════ */

function layarMasuk(isi) {
  document.body.classList.add('layar-masuk');
  const bawah = el('div', { class: 'masuk-bawah' });
  isi.append(el('div', { class: 'masuk' },
    el('div', { class: 'masuk-kartu' },
      el('div', { class: 'masuk-isi' },
        el('img', { class: 'logo', src: './icon-192.png', alt: '', width: '100', height: '100' }),
        el('h2', { class: 'judul-masuk', text: 'Arsip Properti' }),
        el('p', { class: 'tagline', text: 'Dokumen klien dalam satu tempat, selalu rapi.' }),
        el('div', { class: 'hero-garis tengah-garis' }),
        bawah)),
    el('p', { class: 'pembuat', text: 'Developed by Vira' })));
  sisipBanner(bawah);

  if (!configLengkap()) {
    bawah.append(buatBanner({
      jenis: 'gagal', tanpaTutup: true, judul: 'Aplikasi belum diatur',
      pesan: 'Alamat API dan Client ID belum diisi di blok CONFIG pada file javascript.js.'
    }));
    return;
  }
  if (!navigator.onLine) {
    bawah.append(buatBanner({ jenis: 'waspada', tanpaTutup: true, judul: 'Butuh internet untuk masuk', pesan: 'Periksa Wi-Fi atau paket data HP.' }),
      tombol('tombol-utama', 'ulang', 'Coba lagi', function () { tampilkan({ nama: 'masuk', param: {} }); }));
    return;
  }

  bangunkanServer();
  const wadah = el('div', { class: 'wadah-google', id: 'wadahGoogle' });
  const status = el('div');
  bawah.append(
    el('div', { class: 'masuk-aksi' },
      el('p', { class: 'petunjuk-masuk', text: 'Masuk dengan akun Google Anda.' }),
      wadah, status),
    el('p', { class: 'aman' }, ikon('perisai'), el('span', { text: 'Akses aman menggunakan akun Google Anda.' })));

  muatGis().then(function () {
    if (!document.body.contains(wadah)) return;
    pasangTombolGoogle(wadah);
  }).catch(function () {
    if (!document.body.contains(status)) return;
    kosongkan(wadah);
    status.append(
      buatBanner({ jenis: 'gagal', tanpaTutup: true, judul: 'Tombol masuk tidak bisa dimuat', pesan: 'Periksa internet, lalu tekan Coba lagi.' }),
      tombol('tombol-utama', 'ulang', 'Coba lagi', function () { tampilkan({ nama: 'masuk', param: {} }); }));
  });
}

/** Membangunkan server Apps Script selagi pengguna memilih akun, supaya login terasa lebih cepat. */
function bangunkanServer() {
  if (S.dibangunkan) return;
  S.dibangunkan = true;
  try {
    fetch(CONFIG.API_URL, {
      method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ aksi: 'ping', data: {} }), credentials: 'omit', cache: 'no-store', redirect: 'follow'
    }).catch(function () { /* tidak apa-apa */ });
  } catch (e) { /* tidak apa-apa */ }
}

function muatGis() {
  if (window.google && google.accounts && google.accounts.id) return Promise.resolve();
  if (S.gisJanji) return S.gisJanji;
  S.gisJanji = new Promise(function (ok, gagal) {
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.onload = function () { ok(); };
    s.onerror = function () { s.remove(); S.gisJanji = null; gagal(new Error('gsi')); };
    document.head.append(s);
  });
  return S.gisJanji;
}

function pasangTombolGoogle(wadah) {
  if (!S.gisSiap) {
    google.accounts.id.initialize({
      client_id: CONFIG.GOOGLE_CLIENT_ID,
      callback: terimaKredensial,
      auto_select: false,
      cancel_on_tap_outside: true,
      ux_mode: 'popup',
      context: 'signin'
    });
    S.gisSiap = true;
  }
  // Tombol resmi Google tingginya 40 px; diperbesar supaya mudah ditekan.
  const skala = 1.4;
  const tersedia = Math.min(wadah.clientWidth || 320, 420);
  const lebar = Math.max(200, Math.min(400, Math.floor(tersedia / skala)));
  const dalam = el('div', { class: 'skala-google' });
  dalam.style.transform = 'scale(' + skala + ')';
  wadah.style.height = Math.round(44 * skala) + 'px';
  kosongkan(wadah);
  wadah.append(dalam);
  // Tombol Google menggambar dirinya bertahap; sembunyikan dulu, tampilkan halus setelah selesai digambar.
  wadah.style.opacity = '0';
  wadah.style.transition = 'none';
  google.accounts.id.renderButton(dalam, {
    type: 'standard', theme: 'outline', size: 'large', text: 'continue_with',
    shape: 'pill', logo_alignment: 'left', width: lebar, locale: 'id'
  });
  setTimeout(function () {
    wadah.style.transition = 'opacity 0.25s ease';
    wadah.style.opacity = '1';
  }, 700);
}

async function terimaKredensial(resp) {
  if (!resp || !resp.credential) return;
  tampilMemuat('Memeriksa akun...');
  let j;
  try {
    j = await panggil('login', { idToken: resp.credential }, { abaikanSesi: true });
  } catch (e) {
    tutupMemuat();
    S.bannerBerikut = { jenis: 'gagal', judul: 'Tidak ada jawaban dari server', pesan: 'Periksa internet, lalu coba masuk lagi.' };
    tampilkan({ nama: 'masuk', param: {} });
    return;
  }
  tutupMemuat();
  if (!j.ok) {
    S.bannerBerikut = { jenis: 'gagal', judul: j.pesan || 'Tidak bisa masuk', pesan: 'Pastikan memilih akun Google milik agen.' };
    tampilkan({ nama: 'masuk', param: {} });
    return;
  }
  S.tiket = j.data.tiket;
  simpanTiket(S.tiket);
  await muatFotoTertunda();
  if (j.data.muatan && typeof j.data.muatan === 'object') {
    // Data sudah ikut dalam jawaban login: langsung ke Beranda, tanpa menunggu server lagi.
    terimaData(j.data.muatan);
    const st = { nama: 'beranda', param: {} };
    history.replaceState(st, '', '#beranda');
    tampilkan(st);
    return;
  }
  await muatData({ nama: 'beranda', param: {} });
}

async function keluar() {
  const n = jumlahFotoTertunda();
  if (n) {
    const ya = await konfirmasi('Ada ' + n + ' foto belum tersimpan', 'Kalau keluar sekarang, foto itu dibuang dari HP ini. Simpan dulu bila masih dibutuhkan.', 'Tetap keluar', 'tombol-bahaya-penuh');
    if (!ya) return;
  }
  tampilMemuat('Keluar dari aplikasi...');
  try { await panggil('logout', {}, { batas: 10000, abaikanSesi: true }); } catch (e) { /* tetap keluar di HP */ }
  bersihkanSemua(true);
  try { if (window.google && google.accounts && google.accounts.id) google.accounts.id.disableAutoSelect(); } catch (e) { /* abaikan */ }
  S.bannerBerikut = { jenis: 'sukses', judul: 'Anda sudah keluar' };
  buka('masuk', {}, { ganti: true });
}

async function keluarSemua() {
  const ya = await konfirmasi('Keluar dari semua HP?',
    'Semua HP dan laptop yang sedang masuk ke Arsip Properti akan diminta masuk lagi. Pakai ini bila HP hilang atau dipinjam orang.',
    'Ya, keluar dari semua', 'tombol-bahaya-penuh');
  if (!ya) return;
  tampilMemuat('Mengeluarkan semua HP...');
  try {
    const j = await panggil('logoutSemua', {}, { abaikanSesi: true });
    if (!j.ok) { tutupMemuat(); S.bannerBerikut = { jenis: 'gagal', judul: 'Belum berhasil', pesan: j.pesan }; tampilkan(S.layar); return; }
  } catch (e) {
    tutupMemuat();
    if (e instanceof GalatSesi) return;
    S.bannerBerikut = { jenis: 'waspada', judul: 'Belum berhasil', pesan: 'Periksa internet, lalu coba lagi.' };
    tampilkan(S.layar);
    return;
  }
  bersihkanSemua(true);
  S.bannerBerikut = { jenis: 'sukses', judul: 'Semua HP sudah dikeluarkan', pesan: 'Silakan masuk lagi di HP ini.' };
  buka('masuk', {}, { ganti: true });
}

/* ════════════════════════════════════════════════════════════
   BARIS DAFTAR (dipakai di banyak layar)
   ════════════════════════════════════════════════════════════ */

function barisKlien(k, aksi, tampilan) {
  const ps = propertiKlien(k.id_klien);
  const jd = dokumenKlien(k.id_klien).length;
  let sub = k.peran + ' · ' + ps.length + ' properti · ' + jd + ' dokumen';
  let label = [];
  if (tampilan === 'penjual') {
    sub = ps.filter(dipasarkan).length + ' dipasarkan · ' + ps.filter(sedangDeal).length + ' deal · ' + ps.filter(sudahSold).length + ' sold';
    const area = [];
    ps.forEach(function (pr) { if (pr.area && area.indexOf(pr.area) < 0) area.push(pr.area); });
    label = area.slice(0, 3).map(chipNetral);
  } else if (tampilan === 'pembeli') {
    sub = k.no_hp ? formatHp(k.no_hp) : 'Nomor HP belum diisi';
    const cari = kebutuhanTeks(k);
    if (cari) label.push(chipNetral('Mencari: ' + cari));
    if (k.status_beli && k.status_beli !== 'Mencari') label.push(chip(k.status_beli));
  }
  if (pengingatAktif(k) && k.hubungi_tanggal <= hariIni()) label.push(el('span', { class: 'chip chip-ingat' }, ikon('lonceng', 'ikon-mini'), 'Hubungi'));
  return el('button', { type: 'button', class: 'baris', onclick: aksi },
    avatar(k.nama),
    el('span', { class: 'tengah' },
      el('span', { class: 'judul', text: k.nama }),
      el('span', { class: 'sub', text: sub }),
      label.length ? el('span', { class: 'baris-chip' }, label) : null),
    ikon('kanan', 'panah'));
}

function barisProperti(pr, aksi, tampilPemilik) {
  const k = cariKlien(pr.id_klien);
  const lk = kelengkapan(pr);
  const dasar = tampilPemilik && k ? k.nama : (pr.alamat ? pr.alamat.split('\n')[0] : namaJenis(pr.jenis));
  const deal = dealKeterangan(pr);
  const harga = hargaTeks(pr);
  const coret = hargaPromoRinci(pr).map(function (h) { return rupiahPendek(h.normal) + h.akhiran; }).join(' atau ');
  const ukuran = ukuranTeks(pr, true);
  const g = progresProp(pr);
  const selesai = g === 'Sold' || g === 'Agen lain' || g === 'Batal';
  return el('button', { type: 'button', class: 'baris baris-prop' + (selesai ? ' selesai' : ''), onclick: aksi },
    gambarProp(pr),
    el('span', { class: 'tengah' },
      el('span', { class: 'judul', text: pr.nama_properti }),
      el('span', { class: 'sub', text: dasar + (pr.area ? ' · ' + pr.area : '') }),
      coret ? el('span', { class: 'harga-coret-kecil', text: coret }) : null,
      harga ? el('span', { class: 'harga', text: harga }) : el('span', { class: 'sub redup-lagi', text: 'Harga belum diisi' }),
      ukuran ? el('span', { class: 'sub', text: ukuran }) : null,
      el('span', { class: 'baris-chip' },
        labelTawaran(pr) ? chipNetral(labelTawaran(pr)) : null,
        g === 'Deal' || g === 'Sold' ? null : chip(g),
        el('span', { class: 'kecil redup', text: lk.ada + '/' + lk.total + ' dokumen' })),
      deal ? el('span', { class: 'sub deal-info' + (g === 'Deal' ? ' deal-kuning' : ''), text: deal }) : null),
    ikon('kanan', 'panah'));
}

function barisDok(x, saatAda, saatBelum) {
  const ada = x.jumlah > 0;
  const belum = !ada && x.wajib !== false;
  return el('button', { type: 'button', class: 'baris' + (belum ? ' belum' : ''), onclick: ada ? saatAda : saatBelum },
    el('span', { class: 'ubin-ikon' }, ikon(x.ikon)),
    el('span', { class: 'tengah' },
      el('span', { class: 'judul', text: x.label }),
      el('span', { class: 'sub', text: ada ? x.jumlah + ' foto · ' + formatTanggal(x.terbaru) : (belum ? 'Belum ada · ketuk untuk memotret' : 'Tambahan · belum ada') })),
    ada ? ikon('kanan', 'panah') : el('span', { class: 'label-pil foto' + (belum ? '' : ' muda') }, ikon('kamera', 'ikon-kecil'), 'Foto'));
}

/** Tombol WhatsApp kecil ke nomor klien, dengan teks awal (boleh kosong). */
function tautanWa(hp, teks, kelas, label) {
  // Tombol bergaris berlatar terang, selebihnya berlatar hijau tua.
  const garis = String(kelas || '').indexOf('tombol-wa-garis') >= 0;
  return el('a', { class: 'tombol tombol-wa ' + (kelas || ''), href: 'https://wa.me/' + keWa(hp) + (teks ? '?text=' + encodeURIComponent(teks) : ''), target: '_blank', rel: 'noopener noreferrer' },
    ikonWa(garis ? 'hijau' : 'putih'), el('span', { text: label || 'WhatsApp' }));
}

/* ════════════════════════════════════════════════════════════
   PENGINGAT HUBUNGI LAGI (lembar dari bawah)
   ════════════════════════════════════════════════════════════ */

/* ── Ulang tahun klien (v4.5 #14): tanggal lahir diisi sekali, ulang tahun muncul di Beranda ── */

function kabisat(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }

/** Tanggal ulang tahun di tahun tertentu. 29 Februari di tahun bukan kabisat dihitung 28 Februari. */
function tanggalUltah(tahun, bulan, hari) {
  const h = bulan === 2 && hari === 29 && !kabisat(tahun) ? 28 : hari;
  return new Date(tahun, bulan - 1, h);
}

/**
 * Ulang tahun klien yang berikutnya dari hari ini.
 * Hasil: { tgl, tahun, selisih (0 = hari ini), umur (0 bila tahun lahir tidak diisi) }. Null bila tanggal lahir kosong.
 */
function ultahBerikut(k) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(k.tanggal_lahir || ''));
  if (!m) return null;
  const h = new Date(); h.setHours(0, 0, 0, 0);
  const lahir = Number(m[1]), bulan = Number(m[2]), hari = Number(m[3]);
  let tahun = h.getFullYear();
  let tgl = tanggalUltah(tahun, bulan, hari);
  if (tgl < h) { tahun++; tgl = tanggalUltah(tahun, bulan, hari); }
  return { tgl: tgl, tahun: tahun, selisih: Math.round((tgl - h) / 86400000), umur: lahir ? tahun - lahir : 0 };
}

/** Klien yang ulang tahunnya dalam sejumlah hari ke depan (termasuk hari ini), paling dekat dulu. */
function ultahDaftar(maks) {
  if (!S.data) return [];
  return S.data.klien.map(function (k) {
    const u = ultahBerikut(k);
    return u && u.selisih <= maks ? { k: k, u: u } : null;
  }).filter(Boolean).sort(function (a, b) { return a.u.selisih - b.u.selisih || urutNama(a.k, b.k, 'nama'); });
}

function sudahUcap(k, u) { return Number(k.ultah_diucapkan) === u.tahun; }

/** Ulang tahun hari ini sampai H-3 yang belum diucapkan. Dipakai angka Beranda dan tab Segera, supaya selalu sama. */
function ultahSegera() {
  return ultahDaftar(3).filter(function (x) { return !sudahUcap(x.k, x.u); });
}

/** Angka pada tombol Beranda: ulang tahun dalam 3 hari ke depan yang belum diucapkan. */
function jumlahUltahPerlu() {
  return ultahSegera().length;
}

function ultahHariTeks(selisih) { return selisih === 0 ? 'hari ini' : selisih === 1 ? 'besok' : selisih + ' hari lagi'; }
function ultahTanggalTeks(u) { return u.tgl.getDate() + ' ' + BULAN[u.tgl.getMonth()]; }

/** Baris "Ulang tahun 3 Nov (ke-41) · 2 hari lagi" di profil klien. */
function ultahBarisTeks(k) {
  const u = ultahBerikut(k);
  if (!u) return '';
  return 'Ulang tahun ' + ultahTanggalTeks(u) + (u.umur ? ' (ke-' + u.umur + ')' : '') + ' · ' + ultahHariTeks(u.selisih);
}

/** Ucapan bawaan. Bisa diubah di WhatsApp sebelum dikirim. */
function teksUcapan(k) {
  return 'Selamat ulang tahun, ' + namaSapaan(k.nama) + '. Semoga sehat, bahagia, dan lancar rezekinya. Salam hangat, ' + CONFIG.NAMA_PEMILIK + ' – Gading Pro.';
}

/** Simpan tanda ucapan ke server, lalu muat ulang Beranda. */
async function aturUltah(k, data, judulGagal, judulSukses) {
  tampilMemuat('Menyimpan...');
  try {
    const j = await panggil('aturKlien', Object.assign({ id_klien: k.id_klien }, data));
    tutupMemuat();
    if (j.ok) {
      simpanKeDaftar(S.data.klien, 'id_klien', Object.assign({}, k, j.data.klien));
      S.bannerBerikut = { jenis: 'sukses', judul: judulSukses, pesan: k.nama };
    } else {
      S.bannerBerikut = { jenis: 'gagal', judul: judulGagal, pesan: j.pesan };
    }
  } catch (e) {
    tutupMemuat();
    if (e instanceof GalatSesi) return;
    S.bannerBerikut = { jenis: 'waspada', judul: judulGagal, pesan: 'Periksa internet, lalu coba lagi.' };
  }
  tampilkan({ nama: 'beranda', param: {} });
}

/** Kartu Ulang tahun di Beranda: tab Segera (hari ini sampai H-3) dan 30 hari ke depan. Null bila tidak ada. */
function kartuUltah() {
  const semua = ultahDaftar(30);
  if (!semua.length) return null;
  const wadah = el('section', { class: 'kartu-bagian kartu-ingat kartu-ultah', 'aria-label': 'Ulang tahun klien' });

  function baris(x, segeraTab) {
    const k = x.k, u = x.u;
    const aksi = [];
    if (segeraTab) {
      aksi.push(k.no_hp ? tautanWa(k.no_hp, teksUcapan(k), 'tombol-kecil', 'Ucapkan') : el('span', { class: 'kecil redup', text: 'HP belum diisi' }));
      if (!sudahUcap(k, u)) aksi.push(tombol('tombol-kecil tombol-kedua', 'centang', 'Sudah', function () {
        aturUltah(k, { ultah_diucapkan: String(u.tahun) }, 'Ucapan belum tercatat', 'Ucapan dicatat');
      }));
    }
    return el('div', { class: 'baris-ultah' },
      el('button', { type: 'button', class: 'baris', onclick: function () { buka('profil', { id: k.id_klien }); } },
        avatar(k.nama),
        el('span', { class: 'tengah' },
          el('span', { class: 'judul', text: k.nama }),
          el('span', { class: 'sub', text: ultahTanggalTeks(u) + (u.umur ? ' · ke-' + u.umur : '') + ' · ' + ultahHariTeks(u.selisih) }),
          segeraTab && sudahUcap(k, u) ? el('span', { class: 'sub tebal teks-hijau', text: 'Ucapan sudah dicatat' }) : null)),
      aksi.length ? el('div', { class: 'baris-ingat-aksi' }, aksi) : null);
  }

  function gambar() {
    kosongkan(wadah);
    const tab = S.ultahTab === 'bulan' ? 'bulan' : 'segera';
    const segera = ultahSegera();
    wadah.append(
      el('div', { class: 'kartu-judul' }, el('h2', {}, ikon('kalender'), 'Ulang tahun')),
      segmen([{ kode: 'segera', label: 'Segera', lencana: segera.length }, { kode: 'bulan', label: '30 hari ke depan' }], tab,
        function (v) { S.ultahTab = v; gambar(); }, 'segmen-2'));
    if (tab === 'segera') {
      wadah.append(segera.length
        ? el('div', { class: 'daftar daftar-ingat' }, segera.map(function (x) { return baris(x, true); }))
        : el('p', { class: 'kecil redup jarak-atas-kecil', text: 'Tidak ada ulang tahun dalam 3 hari ke depan yang belum diucapkan.' }));
    } else {
      wadah.append(el('div', { class: 'daftar daftar-ingat' }, semua.map(function (x) { return baris(x, x.u.selisih <= 3); })));
    }
  }
  gambar();
  return wadah;
}

async function aturPengingat(k, judul) {
  const catatan = el('input', { class: 'isian', id: 'pgCatatan', type: 'text', maxlength: '120', autocomplete: 'off', placeholder: 'Contoh: tanya jadi survei atau tidak' });
  catatan.value = k.hubungi_catatan || '';
  pasangRapi(catatan, rapiKalimat_);
  const tanggal = el('input', { class: 'isian', id: 'pgTanggal', type: 'date', min: hariIni() });
  tanggal.value = k.hubungi_tanggal && k.hubungi_tanggal > hariIni() ? k.hubungi_tanggal : '';
  const salah = el('p', { class: 'pesan-salah tersembunyi', text: 'Pilih tanggalnya dulu.' });
  const isiDialog = el('div', {},
    el('div', { class: 'bidang' }, el('label', { class: 'label', for: 'pgCatatan' }, el('span', { text: 'Catatan singkat' }), el('span', { class: 'keterangan', text: 'Boleh kosong' })), catatan),
    el('div', { class: 'bidang' }, el('label', { class: 'label', for: 'pgTanggal' }, el('span', { text: 'Tanggal lain' })), tanggal, salah));
  const pilih = await pilihDialog({
    judul: judul || 'Ingatkan untuk hubungi ' + k.nama,
    pesan: k.hubungi_tanggal ? 'Sekarang: ' + formatTanggal(k.hubungi_tanggal) : 'Pengingat muncul di Beranda pada tanggal yang dipilih.',
    isi: isiDialog,
    pilihan: [
      { nilai: tambahHari(1), teks: 'Besok', kelas: 'tombol-kedua' },
      { nilai: tambahHari(3), teks: '3 hari lagi', kelas: 'tombol-kedua' },
      { nilai: tambahHari(7), teks: '1 minggu lagi', kelas: 'tombol-kedua' },
      { nilai: 'tanggal', teks: 'Pakai tanggal lain di atas', kelas: 'tombol-utama', periksa: function () {
        const ok = !!tanggal.value;
        salah.classList.toggle('tersembunyi', ok);
        if (!ok) tanggal.focus();
        return ok;
      } },
      k.hubungi_tanggal ? { nilai: 'hapus', teks: 'Selesai, tidak perlu diingatkan', kelas: 'tombol-bahaya' } : null
    ].filter(Boolean)
  });
  if (!pilih) return false;
  const tgl = pilih === 'hapus' ? '' : pilih === 'tanggal' ? tanggal.value : pilih;
  tampilMemuat('Menyimpan pengingat...');
  try {
    const j = await panggil('aturKlien', { id_klien: k.id_klien, hubungi_tanggal: tgl, hubungi_catatan: tgl ? rapiKalimat_(catatan.value) : '' });
    tutupMemuat();
    if (!j.ok) { S.bannerBerikut = { jenis: 'gagal', judul: 'Pengingat belum tersimpan', pesan: j.pesan }; return true; }
    simpanKeDaftar(S.data.klien, 'id_klien', Object.assign({}, k, j.data.klien));
    S.bannerBerikut = tgl
      ? { jenis: 'sukses', judul: 'Pengingat tersimpan', pesan: k.nama + ' · ' + formatTanggal(tgl) }
      : { jenis: 'sukses', judul: 'Pengingat dihapus', pesan: k.nama };
  } catch (e) {
    tutupMemuat();
    if (e instanceof GalatSesi) return false;
    S.bannerBerikut = { jenis: 'waspada', judul: 'Pengingat belum tersimpan', pesan: 'Periksa internet, lalu coba lagi.' };
  }
  return true;
}

/* ════════════════════════════════════════════════════════════
   LAYAR: BERANDA
   ════════════════════════════════════════════════════════════ */

/** Peringatan bila cadangan mingguan tidak jalan lebih dari 10 hari. */
function peringatanCadangan() {
  const c = S.data && S.data.cadangan;
  if (!c) return null;
  const umurHari = function (s) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s || ''));
    return m ? (Date.now() - new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).getTime()) / 86400000 : null;
  };
  const t = umurHari(c.terakhir);
  const d = umurHari(c.dipasang);
  if (t !== null && t <= 10) return null;
  if (t === null && (d === null || d <= 10)) return null;
  return {
    jenis: 'waspada', tanpaTutup: true, judul: 'Cadangan data belum jalan',
    pesan: t === null ? 'Belum ada cadangan sejak aplikasi dipasang. Hubungi pembuat aplikasi.' : 'Cadangan terakhir ' + formatTanggal(c.terakhir) + '. Hubungi pembuat aplikasi.'
  };
}

/** Baris kecil di bawah Beranda: seberapa besar dan seberapa lama data dimuat (untuk memantau kecepatan). */
function infoKecepatan() {
  if (!S.ukuranData) return null;
  const d = S.data;
  const angka = function (n) { return String(n).replace('.', ','); };
  return el('p', { class: 'kecil redup info-kecepatan', text: 'Data ' + angka((S.ukuranData / 1048576).toFixed(1)) + ' MB · dimuat ' + angka((S.waktuMuat / 1000).toFixed(1)) + ' detik · ' +
    d.klien.length + ' klien, ' + d.properti.length + ' properti' + (S.msServer ? ' · server ' + angka((S.msServer / 1000).toFixed(1)) + ' detik' + (CONFIG.MODE === 'uji' && S.rinci ? ' (' + Object.keys(S.rinci).map(function (k) { return k + ' ' + S.rinci[k]; }).join(', ') + ' ms)' : '') : '') + (S.dariCache && CONFIG.MODE === 'uji' ? ' · dari simpanan' : '') + (d.jumlahArsip ? ' · ' + d.jumlahArsip + ' di arsip' : '') });
}

function layarBeranda(isi) {
  kepala({ judul: 'Arsip Properti', tanpaKembali: true, nav: 'beranda' });
  document.body.classList.add('layar-beranda');
  const d = S.data;
  const inisialPemilik = (CONFIG.NAMA_PEMILIK || 'A').trim().charAt(0).toUpperCase();
  document.getElementById('kepalaKanan').append(el('span', { class: 'avatar-kepala', 'aria-hidden': 'true', text: inisialPemilik }));

  if (serverLama()) {
    isi.append(buatBanner({ jenis: 'gagal', tanpaTutup: true, judul: 'Kode server masih versi lama',
      pesan: 'Tampilan ini butuh Code.gs versi ' + CONFIG.VERSI_SERVER_MIN + '. Periksa pustaka di Apps Script (mode HEAD) atau hubungi pembuat aplikasi.' }));
  }
  const cad = peringatanCadangan();
  if (cad) isi.append(buatBanner(cad));
  const nTunda = jumlahFotoTertunda();
  if (nTunda) {
    const kt = cariKlien(S.foto.id_klien);
    if (kt) {
      isi.append(buatBanner({ jenis: 'waspada', tanpaTutup: true, judul: 'Ada ' + nTunda + ' foto belum tersimpan', pesan: 'Untuk ' + kt.nama,
        aksi: tombol('tombol-utama', 'ulang', 'Lanjutkan simpan', function () { buka('simpanFoto', { id_klien: kt.id_klien, id_properti: S.foto.konteks || '' }); }) }));
    }
  }
  const wb = el('div');
  isi.append(wb);

  function ubin(kelas, ikonNama, teks, aksi) {
    return el('button', { type: 'button', class: 'ubin ' + kelas, onclick: aksi }, ikon(ikonNama, 'ikon-besar'), el('span', { text: teks }));
  }
  function stat(kelas, ikonNama, angka, nama) {
    return el('div', { class: 'stat ' + kelas },
      el('div', { class: 'stat-atas' }, ikon(ikonNama), el('span', { class: 'angka', text: String(angka) })),
      el('span', { class: 'nama', text: nama }));
  }

  // Perlu dihubungi hari ini (paling atas).
  const ingat = perluDihubungi();
  let kartuIngat = null;
  if (ingat.length) {
    kartuIngat = el('section', { class: 'kartu-bagian kartu-ingat g-ingat', 'aria-label': 'Perlu dihubungi' },
      el('div', { class: 'kartu-judul' }, el('h2', {}, ikon('lonceng'), 'Perlu dihubungi (' + ingat.length + ')')),
      el('div', { class: 'daftar daftar-ingat' }, ingat.slice(0, 6).map(function (k) {
        const terlambat = selisihHari(k.hubungi_tanggal) > 0;
        return el('div', { class: 'baris-ingat' },
          el('button', { type: 'button', class: 'baris', onclick: function () { buka('profil', { id: k.id_klien }); } },
            avatar(k.nama),
            el('span', { class: 'tengah' },
              el('span', { class: 'judul', text: k.nama }),
              el('span', { class: 'sub', text: k.hubungi_catatan || 'Hubungi lagi' }),
              el('span', { class: 'sub tebal' + (terlambat ? ' teks-aksen' : ''), text: teksTerlambat(k.hubungi_tanggal) }))),
          el('div', { class: 'baris-ingat-aksi' },
            k.no_hp ? tautanWa(k.no_hp, '', 'tombol-kecil', 'Chat') : null,
            tombol('tombol-kecil tombol-kedua', 'centang', 'Sudah', async function () {
              await aturPengingat(k, 'Sudah menghubungi ' + k.nama + '. Ingatkan lagi?');
              tampilkan({ nama: 'beranda', param: {} });
            })));
      })),
      ingat.length > 6 ? el('p', { class: 'kecil redup jarak-atas-kecil', text: 'Dan ' + (ingat.length - 6) + ' klien lainnya. Cari di daftar klien (tanda lonceng).' }) : null);
  }

  // Data terbaru: campuran klien, properti, dan dokumen, urut dari yang paling baru.
  const campur = [];
  d.klien.forEach(function (k) {
    campur.push({ t: k.diubah_pada || k.dibuat_pada || '', ik: 'orang', warna: '', judul: k.nama, sub: 'Klien ' + k.peran.toLowerCase(), aksi: function () { buka('profil', { id: k.id_klien }); } });
  });
  d.properti.forEach(function (pr) {
    campur.push({ t: pr.diubah_pada || pr.dibuat_pada || '', ik: 'rumah', warna: 'peach', judul: pr.nama_properti, sub: namaJenis(pr.jenis) + ' · ' + labelProgres(progresProp(pr)), aksi: function () { buka('properti', { id: pr.id_properti }); } });
  });
  d.dokumen.forEach(function (x) {
    const k = cariKlien(x.id_klien);
    if (!k) return;
    campur.push({ t: x.dibuat_pada || '', ik: 'dokumen', warna: 'biru', judul: x.judul || x.jenis, sub: k.nama, aksi: function () {
      buka('lihat', { id_klien: x.id_klien, id_properti: x.id_properti || '', jenis: x.jenis, judul: x.judul || '' });
    } });
  });
  campur.sort(function (a, b) { return a.t < b.t ? 1 : a.t > b.t ? -1 : 0; });
  const terbaru = campur.slice(0, 4);

  const hero = el('section', { class: 'hero g-hero', 'aria-label': 'Selamat datang' },
    el('div', { class: 'hero-foto', role: 'img', 'aria-label': 'Rumah modern saat senja' }),
    el('div', { class: 'hero-isi' },
      el('h2', { text: 'Selamat datang, ' + CONFIG.NAMA_PEMILIK + '!' }),
      el('p', { text: 'Kelola dokumen klien dengan rapi dan mudah.' }),
      el('div', { class: 'hero-garis' })));

  const tombolPerbarui = el('button', { type: 'button', class: 'tombol-segarkan', 'aria-label': 'Perbarui data', title: 'Perbarui data', onclick: perbarui }, ikon('ulang'));
  const cari = el('div', { class: 'baris-cari g-cari' },
    el('button', { type: 'button', class: 'kotak-cari-palsu', onclick: function () { buka('cari', { tampil: 'semua', mode: 'lihat', fokus: true }); } },
      ikon('cari'), el('span', { text: 'Cari klien atau properti...' })),
    tombolPerbarui);

  const kisi = el('div', { class: 'ubin-grid g-ubin' },
    ubin('ubin-hijau', 'tambahOrang', 'Klien Baru', function () { buka('klien', { mode: 'baru', id: idBaru('k') }); }),
    ubin('ubin-krem', 'tambahRumah', 'Properti Baru', function () { buka('cari', { tampil: 'klien', mode: 'properti' }); }),
    ubin('ubin-abu', 'kamera', 'Foto Dokumen', function () { buka('cari', { tampil: 'klien', mode: 'foto' }); }),
    ubin('ubin-abu', 'printer', 'Cetak PDF', function () { buka('cari', { tampil: 'klien', mode: 'cetak' }); }));

  const ringkas = el('section', { class: 'kartu-bagian g-ringkas' },
    el('div', { class: 'kartu-judul' }, el('h2', {}, ikon('grafik'), 'Ringkasan Data')),
    el('div', { class: 'statistik' },
      stat('hijau', 'orang', d.klien.length, 'Klien'),
      stat('coklat', 'gedung', d.properti.length, 'Properti'),
      stat('biru', 'dokumen', d.dokumen.length, 'Dokumen')));

  const kartuTerbaru = el('section', { class: 'kartu-bagian terbaru g-terbaru' },
    el('div', { class: 'kartu-judul' },
      el('h2', {}, ikon('jam'), 'Data Terbaru'),
      el('button', { type: 'button', class: 'tautan', onclick: function () { buka('cari', { tampil: 'semua', mode: 'lihat' }); } }, el('span', { text: 'Lihat Semua' }), ikon('kanan'))),
    terbaru.length
      ? el('div', { class: 'daftar' }, terbaru.map(function (x) {
          return el('button', { type: 'button', class: 'baris', onclick: x.aksi },
            el('span', { class: 'ubin-ikon ' + x.warna }, ikon(x.ik)),
            el('span', { class: 'tengah' }, el('span', { class: 'judul', text: x.judul }), el('span', { class: 'sub', text: x.sub })),
            ikon('kanan', 'panah'));
        }))
      : el('div', { class: 'petunjuk' }, ikon('info'), el('div', { text: 'Belum ada data. Mulai dengan menekan Klien Baru.' })));

  const papan = el('section', { class: 'papan g-papan', 'aria-label': 'Arsip rapi' },
    el('div', { class: 'papan-teks' }, el('strong', { text: 'Arsip rapi, kerja lebih tenang.' }), el('div', { class: 'hero-garis' })),
    el('div', { class: 'papan-foto', 'aria-hidden': 'true' }));

  const lain = el('section', { class: 'kartu-bagian g-lain hanya-hp', 'aria-label': 'Menu lainnya' },
    el('div', { class: 'kartu-judul' }, el('h2', {}, ikon('lainnya'), 'Lainnya')),
    el('div', { class: 'daftar' },
      [['sampah', 'Baru dihapus', 'Pulihkan data yang terhapus (30 hari)', function () { buka('dihapus', {}); }],
       ['area', 'Rapikan area', 'Satukan area yang ejaannya berbeda', function () { buka('rapikanArea', {}); }],
       ['perangkat', 'Keluar dari semua HP', 'Bila HP hilang atau dipinjam orang', keluarSemua]].map(function (x) {
        return el('button', { type: 'button', class: 'baris', onclick: x[3] },
          el('span', { class: 'ubin-ikon' }, ikon(x[0])),
          el('span', { class: 'tengah' }, el('span', { class: 'judul', text: x[1] }), el('span', { class: 'sub', text: x[2] })),
          ikon('kanan', 'panah'));
      })));

  const aksi = el('div', { class: 'stat-aksi g-aksi' }, tombol('hanya-hp', 'keluar', 'Keluar', keluar));
  const lainLaptop = el('div', { class: 'g-lainlaptop hanya-laptop' }, tombol('tombol-kedua', 'perangkat', 'Keluar dari semua HP', keluarSemua));

  isi.append(el('div', { class: 'beranda' }, kartuIngat, kartuUltah(), hero, cari, kisi, ringkas, kartuTerbaru, papan, lain, aksi, lainLaptop, infoKecepatan()));

  /** Perbarui tanpa menutup layar: data lama tetap tampil sampai data baru datang. */
  async function perbarui() {
    if (S.menyegarkan) return;
    S.menyegarkan = true;
    sibukPerbarui(tombolPerbarui, true);
    kosongkan(wb);
    try {
      const j = await panggil('muatData', { segar: true });
      S.menyegarkan = false;
      if (S.layar && S.layar.nama !== 'beranda') return;
      if (j.ok) { terimaData(j.data); tampilkan({ nama: 'beranda', param: {} }); return; }
      tampilBanner(wb, { jenis: 'gagal', judul: 'Belum bisa diperbarui', pesan: j.pesan });
    } catch (e) {
      S.menyegarkan = false;
      if (e instanceof GalatSesi) return;
      if (S.layar && S.layar.nama === 'beranda') tampilBanner(wb, { jenis: 'waspada', judul: 'Belum bisa diperbarui', pesan: 'Periksa internet. Data yang tampil masih data lama.' });
    }
    if (document.body.contains(tombolPerbarui)) sibukPerbarui(tombolPerbarui, false);
  }
}

/* ════════════════════════════════════════════════════════════
   LAYAR: CARI / DAFTAR KLIEN / DAFTAR PROPERTI / PILIH KLIEN
   ════════════════════════════════════════════════════════════ */

function layarCari(isi, p) {
  const mode = p.mode || 'lihat';
  const tampil = p.tampil || 'semua';
  const lihat = mode === 'lihat';
  const judul = !lihat ? 'Pilih Klien' : tampil === 'klien' ? 'Daftar Klien' : tampil === 'properti' ? 'Daftar Properti' : 'Cari';
  let kanan = null;
  if (lihat && tampil === 'klien') {
    kanan = tombol('tombol-pil', 'tambah', 'Baru', function () { buka('klien', { mode: 'baru', id: idBaru('k') }); }, { 'aria-label': 'Tambah klien baru' });
  } else if (lihat && tampil === 'properti') {
    kanan = tombol('tombol-pil', 'tambah', 'Baru', function () { buka('cari', { tampil: 'klien', mode: 'properti' }); }, { 'aria-label': 'Tambah properti baru' });
  }
  kepala({ judul: judul, kanan: kanan, nav: lihat && (tampil === 'klien' || tampil === 'properti') ? tampil : null });

  const keterangan = { foto: 'Dokumen klien siapa yang mau difoto?', cetak: 'Berkas klien siapa yang mau dicetak?', properti: 'Properti baru ini milik klien siapa?' }[mode];
  if (keterangan) isi.append(el('p', { class: 'redup', text: keterangan }));

  const input = el('input', {
    class: 'isian', id: 'kataCari', type: 'search', enterkeyhint: 'search', 'aria-label': 'Cari',
    autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', maxlength: '60',
    placeholder: tampil === 'properti' ? 'Cari properti atau alamat' : 'Cari nama atau nomor HP'
  });
  input.value = p.q || '';
  const hapus = el('button', { type: 'button', class: 'hapus', 'aria-label': 'Hapus kata cari' }, ikon('silang'));
  const hasil = el('div');
  isi.append(el('div', { class: 'kotak-cari jarak-atas-kecil' }, ikon('cari'), input, hapus), hasil);

  // Pilihan tab dan penyaring disimpan di alamat layar supaya tetap ada setelah kembali.
  const F = {
    peran: p.peran === 'Pembeli' ? 'Pembeli' : 'Penjual',
    areaJ: p.areaJ || '', progresJ: p.progresJ || '',
    statusB: p.statusB === undefined ? 'Mencari' : p.statusB, bangunanB: p.bangunanB || '', areaB: p.areaB || '',
    saringBuka: !!p.saringBuka,
    areaP: p.areaP || '', bangunanP: p.bangunanP || '', tawarP: p.tawarP || '', progresP: p.progresP || '', hargaP: p.hargaP || '', khususP: p.khususP || ''
  };
  function ubahF(perubahan) {
    Object.assign(F, perubahan);
    gantiParam(perubahan);
    if (Object.keys(perubahan).length === 1 && 'saringBuka' in perubahan) return;   // hanya buka/tutup kotak Saring
    segarkan();
  }

  let jeda = null;
  function segarkan() {
    tampilHasilCari(hasil, input.value, mode, tampil, hapusKata, F, ubahF);
    hapus.classList.toggle('tersembunyi', !input.value);
    clearTimeout(jeda);
    jeda = setTimeout(function () { gantiParam({ q: input.value }); }, 300);
  }
  function hapusKata() { input.value = ''; segarkan(); input.focus(); }
  input.addEventListener('input', segarkan);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') input.blur(); });
  hapus.addEventListener('click', hapusKata);
  segarkan();
  if (p.fokus) { setTimeout(function () { input.focus(); }, 60); gantiParam({ fokus: false }); }
}

function pilihKlienDariCari(mode, k) {
  if (mode === 'foto') {
    if (propertiKlien(k.id_klien).length) buka('pilihTujuan', { id_klien: k.id_klien });
    else buka('foto', { id_klien: k.id_klien, id_properti: '' });
  } else if (mode === 'cetak') buka('cetak', { id_klien: k.id_klien });
  else if (mode === 'properti') buka('formProperti', { mode: 'baru', id_klien: k.id_klien, id: idBaru('p') });
  else buka('profil', { id: k.id_klien });
}

function pilihPropertiDariCari(mode, pr) {
  if (mode === 'foto') buka('foto', { id_klien: pr.id_klien, id_properti: pr.id_properti });
  else if (mode === 'cetak') buka('cetak', { id_klien: pr.id_klien });
  else if (mode === 'properti') buka('formProperti', { mode: 'baru', id_klien: pr.id_klien, id: idBaru('p') });
  else buka('properti', { id: pr.id_properti });
}

const PILIHAN_PROGRES = [{ kode: '', label: 'Semua' }, { kode: 'dipasarkan', label: 'Dipasarkan' }, { kode: 'Deal', label: 'Deal' }, { kode: 'Sold', label: 'Sold' }, { kode: 'lain', label: 'Batal / agen lain' }];
const PILIHAN_BANGUNAN = [{ kode: '', label: 'Semua' }].concat(JENIS_PROP.map(function (j) { return { kode: j, label: j }; }));
const PILIHAN_TAWAR = [{ kode: '', label: 'Semua' }, { kode: 'jual', label: 'Dijual' }, { kode: 'sewa', label: 'Disewakan' }, { kode: 'Baru', label: 'Baru' }, { kode: 'Second', label: 'Second' }];
const PILIHAN_KHUSUS = [{ kode: '', label: 'Semua' }, { kode: 'diskon', label: 'Diskon' }, { kode: 'bu', label: 'BU' }];
const PILIHAN_HARGA = [{ kode: '', label: 'Semua harga' }, { kode: '0-500', label: '< 500 jt' }, { kode: '500-1000', label: '500 jt – 1 M' }, { kode: '1000-2000', label: '1 – 2 M' }, { kode: '2000-', label: '> 2 M' }];
const PILIHAN_STATUS_BELI = [{ kode: 'Mencari', label: 'Masih mencari' }, { kode: 'Sudah dapat', label: 'Sudah dapat' }, { kode: 'Tidak lanjut', label: 'Tidak lanjut' }, { kode: '', label: 'Semua' }];

/**
 * Penyaring dilipat dalam satu kotak "Saring" supaya daftar langsung terlihat di HP.
 * Ringkasan penyaring yang aktif tetap tampil walaupun kotaknya tertutup.
 */
function lipatSaring(baris, aktif, buka, saatBukaTutup, hapusSemua) {
  const d = el('details', { class: 'lipat lipat-saring', open: buka ? true : null },
    el('summary', {}, ikon('cari'),
      el('span', { class: 'tengah' },
        el('span', { class: 'judul-lipat', text: 'Filter' }),
        el('span', { class: 'sub-lipat' + (aktif.length ? ' aktif' : ''), text: aktif.length ? aktif.join(' · ') : 'Semua ditampilkan' }))),
    el('div', { class: 'lipat-isi' }, baris,
      aktif.length && hapusSemua ? el('button', { type: 'button', class: 'tautan', onclick: hapusSemua }, ikon('silang'), el('span', { text: 'Hapus semua filter' })) : null));
  d.addEventListener('toggle', function () { saatBukaTutup(d.open); });
  return d;
}

/** Label pilihan yang sedang aktif (untuk ringkasan penyaring). */
function labelAktif(daftar, nilai, awalan) {
  if (!nilai) return null;
  const x = daftar.find(function (d) { return d.kode === nilai; });
  return (awalan || '') + (x ? x.label : nilai);
}

function pilihanArea(daftar) {
  return [{ kode: '', label: 'Semua area' }].concat(daftar.map(function (a) { return { kode: a, label: a }; }));
}

function sesuaiProgres(pr, kode) {
  if (!kode) return true;
  if (kode === 'dipasarkan') return dipasarkan(pr);
  if (kode === 'lain') return progresProp(pr) === 'Batal' || progresProp(pr) === 'Agen lain';
  return progresProp(pr) === kode;
}

function sesuaiTawar(pr, kode) {
  if (!kode) return true;
  if (kode === 'jual') return !!pr.dijual;
  if (kode === 'sewa') return !!pr.disewakan;
  return pr.kondisi === kode;
}

/** Penawaran khusus: Diskon (ada harga promo) atau BU. Kosong = semua. */
function sesuaiKhusus(pr, kode) {
  if (!kode) return true;
  if (kode === 'diskon') return hargaPromoRinci(pr).length > 0;
  if (kode === 'bu') return adaBU(pr);
  return true;
}

/** Rentang harga jual dalam juta, misalnya "500-1000". Properti tanpa harga jual tidak masuk. */
function sesuaiHarga(pr, kode) {
  if (!kode) return true;
  if (!pr.dijual || !pr.harga_jual) return false;
  const jt = hargaBerlaku(pr.harga_jual, pr.harga_jual_promo) / 1e6;
  const r = kode.split('-');
  return jt >= Number(r[0] || 0) && (r[1] === '' || jt < Number(r[1]));
}

function tampilHasilCari(wadah, q, mode, tampil, hapusKata, F, ubahF) {
  kosongkan(wadah);
  const qn = norm(q);
  const qd = angkaSaja(q);
  const urutK = function (a, b) { return urutNama(a, b, 'nama'); };
  const urutP = function (a, b) { return urutNama(a, b, 'nama_properti'); };
  const kartuKlien = function (daftar, tampilan) {
    return daftarBertahap(daftar, function (k) { return barisKlien(k, function () { pilihKlienDariCari(mode, k); }, tampilan); }, el('div', { class: 'daftar' }));
  };
  const kartuProp = function (daftar) {
    return daftarBertahap(daftar, function (pr) { return barisProperti(pr, function () { pilihPropertiDariCari(mode, pr); }, true); }, el('div', { class: 'daftar' }));
  };
  const kosongSaring = function (teks, hapusSaring) {
    return el('div', { class: 'kosong' },
      el('div', { class: 'lingkar-ikon' }, ikon('cari')),
      el('h2', { text: teks }),
      tombol('tombol-kedua', 'silang', 'Hapus filter', hapusSaring));
  };

  if (!qn) {
    if (tampil === 'properti' && mode === 'lihat') {
      // Daftar properti dengan penyaring area, bangunan, ditawarkan, harga, progres
      const semuaP = S.data.properti.filter(function (pr) { return !pr.arsip; });
      const areaAda = daftarArea(true);
      const hapusSaringP = function () { ubahF({ areaP: '', bangunanP: '', tawarP: '', progresP: '', hargaP: '', khususP: '' }); };
      wadah.append(lipatSaring([
        areaAda.length ? barisSaring('Area', pilihanArea(areaAda), F.areaP, function (v) { ubahF({ areaP: v }); }) : null,
        barisSaring('Bangunan', PILIHAN_BANGUNAN, F.bangunanP, function (v) { ubahF({ bangunanP: v }); }),
        barisSaring('Ditawarkan', PILIHAN_TAWAR, F.tawarP, function (v) { ubahF({ tawarP: v }); }),
        barisSaring('Harga jual', PILIHAN_HARGA, F.hargaP, function (v) { ubahF({ hargaP: v }); }),
        barisSaring('Progres', PILIHAN_PROGRES, F.progresP, function (v) { ubahF({ progresP: v }); }),
        barisSaring('Penawaran khusus', PILIHAN_KHUSUS, F.khususP, function (v) { ubahF({ khususP: v }); })
      ], [F.areaP || null, labelAktif(PILIHAN_BANGUNAN, F.bangunanP), labelAktif(PILIHAN_TAWAR, F.tawarP), labelAktif(PILIHAN_HARGA, F.hargaP), labelAktif(PILIHAN_PROGRES, F.progresP), labelAktif(PILIHAN_KHUSUS, F.khususP)].filter(Boolean),
      F.saringBuka, function (b) { ubahF({ saringBuka: b }); }, hapusSaringP));
      const cocok = semuaP.filter(function (pr) {
        return (!F.areaP || pr.area === F.areaP) &&
          (!F.bangunanP || jenisDasar(pr.jenis) === F.bangunanP) &&
          sesuaiTawar(pr, F.tawarP) && sesuaiHarga(pr, F.hargaP) && sesuaiProgres(pr, F.progresP) && sesuaiKhusus(pr, F.khususP);
      }).sort(urutP);
      const disaring = F.areaP || F.bangunanP || F.tawarP || F.progresP || F.hargaP || F.khususP;
      const ket = disaring ? cocok.length + ' properti cocok dengan filter' : 'Semua properti (' + semuaP.length + ')';
      wadah.append(judulBagian(ket));
      if (cocok.length) wadah.append(kartuProp(cocok));
      else if (disaring) wadah.append(kosongSaring('Tidak ada properti dengan filter ini.', hapusSaringP));
      else wadah.append(el('p', { class: 'redup', text: 'Belum ada properti.' }));
      return;
    }

    // Daftar klien: tab Penjual dan Pembeli
    // Angka merah di tab = jumlah yang tampil di tab itu dengan filter yang sedang dipakai (selalu sama dengan judul daftar).
    const sesuaiPenjual = function (k) {
      return !(F.areaJ || F.progresJ) || propertiKlien(k.id_klien).some(function (pr) { return (!F.areaJ || pr.area === F.areaJ) && sesuaiProgres(pr, F.progresJ); });
    };
    const sesuaiPembeli = function (k) {
      return (!F.statusB || (k.status_beli || 'Mencari') === F.statusB) &&
        (!F.bangunanB || jenisDasar(k.kebutuhan_jenis) === F.bangunanB) && (!F.areaB || k.kebutuhan_area === F.areaB);
    };
    const jumlah = { Penjual: 0, Pembeli: 0 };
    S.data.klien.forEach(function (k) {
      if (k.arsip) return;
      if (k.peran === 'Penjual' && sesuaiPenjual(k)) jumlah.Penjual++;
      else if (k.peran === 'Pembeli' && sesuaiPembeli(k)) jumlah.Pembeli++;
    });
    wadah.append(segmen(
      [{ kode: 'Penjual', label: 'Penjual', lencana: jumlah.Penjual }, { kode: 'Pembeli', label: 'Pembeli', lencana: jumlah.Pembeli }],
      F.peran, function (v) { ubahF({ peran: v }); }, 'segmen-2'));

    let daftar = S.data.klien.filter(function (k) { return k.peran === F.peran && !k.arsip; });
    let ket;
    let disaring;
    if (F.peran === 'Penjual') {
      const areaAda = daftarArea(true);
      wadah.append(lipatSaring([
        areaAda.length ? barisSaring('Area properti', pilihanArea(areaAda), F.areaJ, function (v) { ubahF({ areaJ: v }); }) : null,
        barisSaring('Progres properti', PILIHAN_PROGRES, F.progresJ, function (v) { ubahF({ progresJ: v }); })
      ], [F.areaJ || null, labelAktif(PILIHAN_PROGRES, F.progresJ)].filter(Boolean),
      F.saringBuka, function (b) { ubahF({ saringBuka: b }); }, function () { ubahF({ areaJ: '', progresJ: '' }); }));
      disaring = F.areaJ || F.progresJ;
      if (disaring) {
        daftar = daftar.filter(function (k) {
          return propertiKlien(k.id_klien).some(function (pr) { return (!F.areaJ || pr.area === F.areaJ) && sesuaiProgres(pr, F.progresJ); });
        });
      }
      ket = disaring ? daftar.length + ' penjual cocok dengan filter' : 'Semua penjual (' + daftar.length + ')';
    } else {
      const areaBeli = [];
      S.data.klien.forEach(function (k) { if (k.peran === 'Pembeli' && k.kebutuhan_area && areaBeli.indexOf(k.kebutuhan_area) < 0) areaBeli.push(k.kebutuhan_area); });
      areaBeli.sort(function (a, b) { return norm(a).localeCompare(norm(b), 'id'); });
      wadah.append(lipatSaring([
        barisSaring('Status', PILIHAN_STATUS_BELI, F.statusB, function (v) { ubahF({ statusB: v }); }),
        barisSaring('Cari bangunan', PILIHAN_BANGUNAN, F.bangunanB, function (v) { ubahF({ bangunanB: v }); }),
        areaBeli.length ? barisSaring('Area dicari', pilihanArea(areaBeli), F.areaB, function (v) { ubahF({ areaB: v }); }) : null
      ], [labelAktif(PILIHAN_STATUS_BELI, F.statusB), labelAktif(PILIHAN_BANGUNAN, F.bangunanB, 'Cari '), F.areaB || null].filter(Boolean),
      F.saringBuka, function (b) { ubahF({ saringBuka: b }); }, function () { ubahF({ statusB: '', bangunanB: '', areaB: '' }); }));
      disaring = F.statusB || F.bangunanB || F.areaB;
      daftar = daftar.filter(function (k) {
        return (!F.statusB || (k.status_beli || 'Mencari') === F.statusB) &&
          (!F.bangunanB || jenisDasar(k.kebutuhan_jenis) === F.bangunanB) && (!F.areaB || k.kebutuhan_area === F.areaB);
      });
      ket = F.statusB === 'Mencari' && !F.bangunanB && !F.areaB
        ? 'Pembeli yang masih mencari (' + daftar.length + ')'
        : disaring ? daftar.length + ' pembeli cocok dengan filter' : 'Semua pembeli (' + daftar.length + ')';
    }
    daftar.sort(urutK);
    wadah.append(judulBagian(ket));
    if (daftar.length) wadah.append(kartuKlien(daftar, F.peran === 'Penjual' ? 'penjual' : 'pembeli'));
    else if (disaring) {
      wadah.append(kosongSaring('Tidak ada yang cocok dengan filter ini.', function () {
        ubahF(F.peran === 'Penjual' ? { areaJ: '', progresJ: '' } : { statusB: '', bangunanB: '', areaB: '' });
      }));
    } else wadah.append(el('p', { class: 'redup', text: F.peran === 'Penjual' ? 'Belum ada penjual.' : 'Belum ada pembeli.' }));
    return;
  }

  const awalDulu = function (teks) { return norm(teks).indexOf(qn) === 0 ? 0 : 1; };
  const klien = S.data.klien.filter(function (k) {
    if (k.arsip) return false;
    if (norm(k.nama).indexOf(qn) >= 0) return true;
    return qd.length >= 3 && qd.length === q.replace(/[\s+\-.()]/g, '').length &&
      varianHp(k.no_hp).some(function (v) { return v.indexOf(qd) >= 0; });
  }).sort(function (a, b) { return (awalDulu(a.nama) - awalDulu(b.nama)) || urutK(a, b); });
  const properti = S.data.properti.filter(function (pr) {
    return !pr.arsip && norm(pr.nama_properti + ' ' + pr.alamat + ' ' + (pr.area || '')).indexOf(qn) >= 0;
  }).sort(urutP);

  if (!klien.length && !properti.length) {
    const tidakKetemu = el('div', { class: 'kosong' },
      el('div', { class: 'lingkar-ikon' }, ikon('cari')),
      el('h2', { text: 'Tidak ketemu. Coba nama lain.' }),
      el('p', { class: 'redup', text: 'Periksa ejaan nama, nomor HP, atau nama jalan.' }),
      tombol('tombol-kedua', 'silang', 'Hapus kata cari', hapusKata));
    wadah.append(tidakKetemu);
    // Bila arsip menemukan sesuatu, pesan "tidak ketemu" disembunyikan.
    cariDiArsip(wadah, q, mode, function () { tidakKetemu.classList.add('tersembunyi'); });
    umumkan('Tidak ketemu.');
    return;
  }
  const urutan = tampil === 'properti' ? ['properti', 'klien'] : ['klien', 'properti'];
  urutan.forEach(function (bagian) {
    if (bagian === 'klien' && klien.length) wadah.append(judulBagian('Klien (' + klien.length + ')'), kartuKlien(klien));
    if (bagian === 'properti' && properti.length) wadah.append(judulBagian('Properti (' + properti.length + ')'), kartuProp(properti));
  });
  cariDiArsip(wadah, q, mode, null);
  umumkan(klien.length + ' klien dan ' + properti.length + ' properti ditemukan.');
}

/* ════════════════════════════════════════════════════════════
   LAYAR: DETAIL KLIEN
   ════════════════════════════════════════════════════════════ */

function layarProfil(isi, p) {
  const k = cariKlien(p.id);
  if (!k) return tidakAda();
  kepala({ judul: 'Detail Klien' });
  if (k.arsip) isi.append(buatBanner({ jenis: 'info', judul: 'Ini data arsip', pesan: 'Sudah lama tidak diubah. Kalau Anda mengubahnya, otomatis kembali aktif.', tanpaTutup: true }));
  catatBaruDibuka(k.id_klien);
  const props = propertiKlien(k.id_klien);
  const pembeli = k.peran === 'Pembeli';

  const cari = kebutuhanTeks(k);
  const kartu = el('div', { class: 'kartu' },
    el('div', { class: 'kepala-klien' }, avatar(k.nama, true),
      el('div', {}, el('h2', { class: 'nama', text: k.nama }),
        el('div', { class: 'baris-chip' }, chip(k.peran), pembeli ? chip(k.status_beli || 'Mencari') : null))),
    el('div', { class: 'kontak' }, ikon('telepon'), el('span', { class: k.no_hp ? 'tebal' : 'redup', text: k.no_hp ? formatHp(k.no_hp) : 'Nomor HP belum diisi' })),
    pembeli ? el('div', { class: 'kontak' }, ikon('cari'), el('span', { class: cari ? 'tebal' : 'redup', text: cari ? 'Mencari: ' + cari : 'Yang dicari belum diisi' })) : null,
    ultahBarisTeks(k) ? el('div', { class: 'kontak' }, ikon('kalender'), el('span', { class: 'tebal', text: ultahBarisTeks(k) })) : null,
    k.catatan ? el('div', { class: 'kontak' }, ikon('catatan'), el('span', { class: 'pre-line', text: k.catatan })) : null);
  if (k.no_hp) {
    kartu.append(el('div', { class: 'baris-2 jarak-atas-kecil' },
      el('a', { class: 'tombol tombol-utama', href: 'tel:' + angkaSaja(k.no_hp) }, ikon('telepon'), el('span', { text: 'Telepon' })),
      tautanWa(k.no_hp, '', '', 'WhatsApp')));
  }
  isi.append(kartu);

  // Pengingat hubungi lagi
  const terlambat = k.hubungi_tanggal && selisihHari(k.hubungi_tanggal) >= 0;
  isi.append(el('button', { type: 'button', class: 'kartu baris-pengingat' + (terlambat ? ' jatuh-tempo' : ''), onclick: async function () {
    const ubah = await aturPengingat(k);
    if (ubah) tampilkan(S.layar);
  } },
    el('span', { class: 'ubin-ikon' }, ikon('lonceng')),
    el('span', { class: 'tengah' },
      el('span', { class: 'judul', text: k.hubungi_tanggal ? 'Hubungi lagi: ' + formatTanggal(k.hubungi_tanggal) + (terlambat ? ' (' + teksTerlambat(k.hubungi_tanggal).toLowerCase() + ')' : '') : 'Atur pengingat hubungi lagi' }),
      el('span', { class: 'sub', text: k.hubungi_tanggal ? (k.hubungi_catatan || 'Tanpa catatan') : 'Muncul di Beranda pada tanggalnya' })),
    ikon('kanan', 'panah')));

  // Properti yang cocok untuk pembeli
  if (pembeli) isi.append(kartuCocokPembeli(k));
  if (pembeli) { const kl = kartuListingCocok(k); if (kl) isi.append(kl); }

  isi.append(el('div', { class: 'aksi-tiga' },
    el('button', { type: 'button', class: 'aksi-kecil', onclick: function () {
      if (props.length) buka('pilihTujuan', { id_klien: k.id_klien });
      else buka('foto', { id_klien: k.id_klien, id_properti: '' });
    } }, ikon('kamera'), el('span', { text: 'Foto' })),
    el('button', { type: 'button', class: 'aksi-kecil', onclick: function () { buka('cetak', { id_klien: k.id_klien }); } }, ikon('printer'), el('span', { text: 'Cetak PDF' })),
    el('button', { type: 'button', class: 'aksi-kecil', onclick: function () { buka('klien', { mode: 'ubah', id: k.id_klien }); } }, ikon('pensil'), el('span', { text: 'Ubah' }))));

  // Tab: Properti | Dokumen pribadi
  const tabProp = el('button', { type: 'button', class: 'tab', role: 'tab', id: 'tabProperti', text: 'Properti (' + props.length + ')' });
  const tabDok = el('button', { type: 'button', class: 'tab', role: 'tab', id: 'tabDokumen', text: 'Dokumen pribadi' });
  const panel = el('div', { class: 'panel-tab', role: 'tabpanel' });
  isi.append(el('div', { class: 'tab-tab', role: 'tablist' }, tabProp, tabDok), panel);

  function pilihTab(t) {
    tabProp.setAttribute('aria-selected', t === 'properti' ? 'true' : 'false');
    tabDok.setAttribute('aria-selected', t === 'dokumen' ? 'true' : 'false');
    panel.setAttribute('aria-labelledby', t === 'properti' ? 'tabProperti' : 'tabDokumen');
    kosongkan(panel);
    gantiParam({ tab: t });
    if (t === 'properti') {
      if (props.length) {
        const nPasar = props.filter(dipasarkan).length;
        const nDeal = props.filter(sedangDeal).length;
        const nSold = props.filter(sudahSold).length;
        const sub = ['dipasarkan', 'selesai', 'semua'].indexOf(p.sub) >= 0 ? p.sub : (nPasar ? 'dipasarkan' : 'semua');
        function ubin(kelas, angka, nama) {
          return el('div', { class: 'stat-mini ' + kelas }, el('b', { text: String(angka) }), el('span', { text: nama }));
        }
        panel.append(el('div', { class: 'stat-mini-grid' },
          ubin('hijau', nPasar, 'Dipasarkan'), ubin('kuning', nDeal, 'Deal'), ubin('merah', nSold, 'Sold')));
        panel.append(segmen(
          [{ kode: 'dipasarkan', label: 'Dipasarkan' }, { kode: 'selesai', label: 'Deal & Sold' }, { kode: 'semua', label: 'Semua' }],
          sub, function (v) { gantiParam({ sub: v }); pilihTab('properti'); }, 'segmen-3'));
        const tampilProps = props.filter(function (pr) { return sub === 'semua' || (sub === 'dipasarkan' ? dipasarkan(pr) : denganPembeli(pr)); });
        panel.append(tampilProps.length
          ? el('div', { class: 'daftar jarak-atas-kecil' }, tampilProps.map(function (pr) {
              const baris = barisProperti(pr, function () { buka('properti', { id: pr.id_properti }); }, false);
              if (k.peran !== 'Penjual') return baris;
              return el('div', { class: 'grup-prop' }, baris,
                tombol('tombol-kedua tombol-kecil', 'gambar', 'Gambar promo', function () { buka('promo', { id: pr.id_properti }); }));
            }))
          : el('p', { class: 'redup jarak-atas-kecil', text: sub === 'dipasarkan' ? 'Tidak ada properti yang sedang dipasarkan.' : 'Belum ada properti yang deal atau sold.' }));
      } else {
        panel.append(el('p', { class: 'redup', text: pembeli ? 'Belum ada properti. Pembeli tidak wajib punya properti.' : 'Belum ada properti.' }));
      }
      panel.append(el('div', { class: 'jarak-atas' },
        tombol(pembeli ? '' : 'tombol-utama', 'tambah', 'Tambah Properti', function () { buka('formProperti', { mode: 'baru', id_klien: k.id_klien, id: idBaru('p') }); })));
      // Properti milik klien lain yang deal/sold dengan klien ini (biasanya pembeli atau penyewa)
      const dealDenganIni = S.data.properti.filter(function (pr) { return denganPembeli(pr) && pr.id_klien_deal === k.id_klien; })
        .sort(function (a, b) { return urutNama(a, b, 'nama_properti'); });
      if (dealDenganIni.length) {
        panel.append(judulBagian('Deal dan Sold dengan ' + k.nama + ' (' + dealDenganIni.length + ')'),
          el('div', { class: 'daftar' }, dealDenganIni.map(function (pr) {
            return barisProperti(pr, function () { buka('properti', { id: pr.id_properti }); }, true);
          })));
      }
    } else {
      const daftar = [
        { jenis: 'KTP', label: 'KTP', ikon: 'kartu' },
        { jenis: 'NPWP', label: 'NPWP', ikon: 'kartu', wajib: false }
      ].map(function (x) {
        const dd = dokumenDi(k.id_klien, '', x.jenis);
        return Object.assign(x, { jumlah: dd.length, terbaru: dd[0] ? dd[0].dibuat_pada : '' });
      }).concat(dokumenLainnyaGrup(k.id_klien, ''));
      panel.append(el('div', { class: 'daftar' }, daftar.map(function (x) {
        return barisDok(x,
          function () { buka('lihat', { id_klien: k.id_klien, id_properti: '', jenis: x.jenis, judul: x.judul }); },
          function () { buka('foto', { id_klien: k.id_klien, id_properti: '', jenis: x.jenis }); });
      })), el('p', { class: 'kecil redup jarak-atas-kecil', text: 'Sertifikat, PBB, dan foto properti ada di halaman tiap properti.' }));
    }
  }
  tabProp.addEventListener('click', function () { pilihTab('properti'); });
  tabDok.addEventListener('click', function () { pilihTab('dokumen'); });
  pilihTab(p.tab === 'dokumen' ? 'dokumen' : 'properti');
}

/** Kartu hijau "Properti cocok" untuk pembeli (dipakai di detail klien dan setelah pembeli disimpan). */
function kartuCocokPembeli(k) {
  const kotak = el('section', { class: 'kartu kartu-hijau kartu-cocok jarak-atas-kecil', 'aria-label': 'Properti yang cocok' });
  if (!punyaKebutuhan(k)) {
    kotak.append(el('h2', { class: 'judul-kartu' }, ikon('cocok'), 'Properti yang cocok'),
      el('p', { class: 'redup', text: 'Isi dulu yang dicari pembeli (tekan Ubah) supaya aplikasi bisa mencocokkan dengan properti penjual.' }));
    return kotak;
  }
  const h = propertiCocok(k);
  kotak.append(el('h2', { class: 'judul-kartu' }, ikon('cocok'), h.cocok.length ? h.cocok.length + ' properti cocok' : 'Belum ada yang cocok'),
    el('p', { class: 'kecil redup', text: (k.status_beli && k.status_beli !== 'Mencari' ? 'Status: ' + k.status_beli + '. ' : '') + 'Dari properti penjual yang masih dipasarkan.' }));
  if (h.cocok.length) {
    tambahAnak(kotak, [el('div', { class: 'daftar' }, h.cocok.map(function (pr) {
      return barisProperti(pr, function () { buka('properti', { id: pr.id_properti }); }, true);
    })),
    el('div', { class: 'jarak-atas-kecil' }, tombol('tombol-wa', ikonWa('putih'), 'Kirim ke WhatsApp', function () {
      buka('bagikan', { ids: h.cocok.slice(0, 5).map(function (x) { return x.id_properti; }), untuk: k.id_klien });
    })),
    h.cocok.length > 5 ? el('p', { class: 'kecil redup', text: 'Yang dikirim 5 properti pertama. Untuk yang lain, buka propertinya lalu Bagikan.' }) : null]);
  }
  if (h.hampir.length) {
    kotak.append(el('h3', { class: 'judul-kecil', text: 'Hampir cocok (' + h.hampir.length + ')' }),
      el('div', { class: 'daftar' }, h.hampir.map(function (x) {
        const baris = barisProperti(x.pr, function () { buka('properti', { id: x.pr.id_properti }); }, true);
        baris.querySelector('.tengah').append(el('span', { class: 'sub teks-aksen tebal', text: x.alasan }));
        return baris;
      })));
  }
  if (h.alt.length) {
    kotak.append(el('h3', { class: 'judul-kecil', text: 'Alternatif, agak di atas budget (' + h.alt.length + ')' }),
      el('p', { class: 'kecil redup', text: 'Bisa ditawarkan, siapa tahu pembeli mau menambah budget.' }),
      el('div', { class: 'daftar' }, h.alt.map(function (x) {
        const baris = barisProperti(x.pr, function () { buka('properti', { id: x.pr.id_properti }); }, true);
        baris.querySelector('.tengah').append(el('span', { class: 'sub teks-aksen tebal', text: x.alasan }));
        return baris;
      })));
  }
  return kotak;
}

/* ════════════════════════════════════════════════════════════
   LAYAR: DETAIL PROPERTI
   ════════════════════════════════════════════════════════════ */

/** Baris "Deal dengan ..." di detail properti; bisa dibuka ke profil klien yang deal. */
function dealBaris(pr) {
  const l = pr.id_klien_deal ? cariKlien(pr.id_klien_deal) : null;
  const teks = dealKeterangan(pr);
  const label = sedangDeal(pr) ? 'Deal' : 'Sold';
  if (!l) {
    return el('div', { class: 'info-baris' }, ikon('orang'),
      el('span', {}, el('span', { class: 'label', text: label }), el('span', { class: 'nilai', text: teks })));
  }
  return el('button', { type: 'button', class: 'baris info-baris', onclick: function () { buka('profil', { id: l.id_klien }); } },
    ikon('orang'),
    el('span', { class: 'tengah' }, el('span', { class: 'label', text: label }), el('span', { class: 'nilai', text: teks })),
    ikon('kanan', 'panah'));
}

function infoBaris(ikonNama, label, nilai, kelas) {
  return el('div', { class: 'info-baris' }, ikon(ikonNama),
    el('span', {}, el('span', { class: 'label', text: label }),
      nilai instanceof Node ? el('span', { class: 'nilai' }, nilai) : el('span', { class: 'nilai ' + (kelas || ''), text: nilai })));
}

/** Data lengkap properti untuk dikirim ulang ke server (misalnya saat hanya progres yang berubah). */
function dataProperti(pr, ubahan) {
  return Object.assign({
    mode: 'ubah', id_properti: pr.id_properti, id_klien: pr.id_klien, nama_properti: pr.nama_properti, alamat: pr.alamat || '',
    area: pr.area || '', jenis: pr.jenis, kondisi: pr.kondisi || '', dijual: !!pr.dijual, disewakan: !!pr.disewakan,
    harga_jual: pr.harga_jual || '', harga_sewa: pr.harga_sewa || '', satuan_sewa: pr.satuan_sewa || '',
    luas_tanah: pr.luas_tanah || '', luas_bangunan: pr.luas_bangunan || '', kamar_tidur: pr.kamar_tidur || '', kamar_mandi: pr.kamar_mandi || '',
    sertifikat: pr.sertifikat || '', komisi_jenis: pr.komisi_jenis || '', komisi_nilai: pr.komisi_nilai || '',
    panjang_tanah: pr.panjang_tanah || '', lebar_tanah: pr.lebar_tanah || '', carport: pr.carport ?? '',
    listrik_va: pr.listrik_va || '', sumber_air: pr.sumber_air || '', menghadap: pr.menghadap || '', bu: adaBU(pr) ? 'ya' : '',
    harga_jual_promo: pr.harga_jual_promo || '', harga_sewa_promo: pr.harga_sewa_promo || '',
    progres: progresProp(pr), id_klien_deal: pr.id_klien_deal || '', catatan: pr.catatan || ''
  }, ubahan || {});
}

function layarProperti(isi, p) {
  const pr = cariProperti(p.id);
  const k = pr ? cariKlien(pr.id_klien) : null;
  if (!pr || !k) return tidakAda();
  kepala({ judul: 'Detail Properti' });
  if (pr.arsip) isi.append(buatBanner({ jenis: 'info', judul: 'Ini data arsip', pesan: 'Sudah lama tidak diubah. Kalau Anda mengubahnya, otomatis kembali aktif.', tanpaTutup: true }));
  catatBaruDibuka(k.id_klien);
  const st = S.layar;
  const wb = el('div');
  isi.append(wb);

  // Foto utama: foto properti terbaru bila ada, selain itu ilustrasi. Pita DEAL/SOLD ikut tampil.
  const fotoProp = fotoProperti(pr);
  const gambar = gambarProp(pr, true);
  const keterangan = el('span', { class: 'keterangan-gambar', text: fotoProp.length ? 'Membuka foto...' : 'Belum ada foto properti' });
  gambar.append(keterangan);
  isi.append(gambar);
  if (fotoProp.length) {
    urlFoto(fotoProp[0].id_dokumen).then(function (url) {
      if (S.layar !== st) return;
      const lama = gambar.querySelector('img');
      if (lama) lama.remove();
      gambar.prepend(el('img', { src: url, alt: 'Foto ' + pr.nama_properti }));
      gambar.classList.add('ada-foto');
      keterangan.textContent = fotoProp.length + ' foto';
    }).catch(function () { keterangan.textContent = 'Foto belum bisa dibuka'; });
  }

  isi.append(el('h2', { class: 'judul-prop', text: pr.nama_properti }));
  if (pr.alamat) isi.append(el('div', { class: 'alamat' }, ikon('pin'), el('span', { class: 'pre-line', text: pr.alamat })));
  isi.append(hargaDetailNode(pr));
  const ukuran = ukuranTeks(pr);
  if (ukuran) isi.append(el('p', { class: 'ukuran-baris', text: ukuran }));

  const ukuranRinci = [
    pr.luas_tanah ? 'Luas tanah ' + angkaTampil(pr.luas_tanah) + ' m²' : '',
    pr.luas_bangunan ? 'Luas bangunan ' + angkaTampil(pr.luas_bangunan) + ' m²' : '',
    pr.kamar_tidur ? pr.kamar_tidur + ' kamar tidur' : '',
    pr.kamar_mandi ? pr.kamar_mandi + ' kamar mandi' : ''
  ].filter(Boolean).join('\n');

  isi.append(el('div', { class: 'kartu info' },
    el('button', { type: 'button', class: 'baris info-baris', onclick: function () { buka('profil', { id: k.id_klien }); } },
      ikon('orang'),
      el('span', { class: 'tengah' }, el('span', { class: 'label', text: k.peran === 'Pembeli' ? 'Klien (pembeli)' : 'Klien (pemilik)' }), el('span', { class: 'nilai', text: k.nama })),
      ikon('kanan', 'panah')),
    infoBaris('centang', 'Progres', chip(progresProp(pr))),
    denganPembeli(pr) ? dealBaris(pr) : null,
    infoBaris('rumah', 'Jenis', namaJenis(pr.jenis) + (pr.kondisi ? ' · ' + pr.kondisi : '')),
    infoBaris('label', 'Ditawarkan', [pr.dijual ? 'Dijual' : '', pr.disewakan ? 'Disewakan' : ''].filter(Boolean).join(' dan ') || 'Belum diisi'),
    pr.dijual ? infoBaris('uang', 'Harga jual', pr.harga_jual ? rupiahBaca(pr.harga_jual) + ' (' + formatRibuan(pr.harga_jual) + ')' : 'Belum diisi', pr.harga_jual ? '' : 'redup') : null,
    pr.disewakan ? infoBaris('uang', 'Harga sewa', pr.harga_sewa ? rupiahBaca(pr.harga_sewa) + ' ' + satuanSewa(pr, true) : 'Belum diisi', pr.harga_sewa ? '' : 'redup') : null,
    ukuranRinci ? infoBaris('penggaris', 'Ukuran', ukuranRinci, 'pre-line') : null,
    pr.panjang_tanah && pr.lebar_tanah ? infoBaris('penggaris', 'Ukuran tanah', angkaTampil(pr.panjang_tanah) + ' × ' + angkaTampil(pr.lebar_tanah) + ' m') : null,
    carportTeks(pr) ? infoBaris('gedung', 'Carport', carportTeks(pr)) : null,
    pr.listrik_va ? infoBaris('perangkat', 'Listrik', formatRibuan(pr.listrik_va) + ' watt') : null,
    pr.sumber_air ? infoBaris('info', 'Air', pr.sumber_air) : null,
    pr.menghadap ? infoBaris('pin', 'Menghadap', pr.menghadap) : null,
    pr.sertifikat ? infoBaris('dokumen', 'Sertifikat', namaJenis(pr.sertifikat)) : null,
    pr.area ? infoBaris('pin', 'Area', pr.area) : null,
    komisiTeks(pr) ? infoBaris('perisai', 'Komisi (hanya untuk agen)', komisiTeks(pr)) : null,
    pr.catatan ? infoBaris('catatan', 'Catatan', pr.catatan, 'pre-line') : null));

  isi.append(el('div', { class: 'tumpuk jarak-atas' },
    k.peran === 'Penjual' && (pr.dijual || pr.disewakan) ? tombol('tombol-kedua', 'gambar', 'Buat gambar promo', function () { buka('promo', { id: pr.id_properti }); }) : null,
    tombol('tombol-wa', ikonWa('putih'), 'Bagikan ke pembeli (WhatsApp)', function () { buka('bagikan', { ids: [pr.id_properti] }); }),
    tombol('tombol-utama', 'pensil', 'Ubah Status atau Data', function () { buka('formProperti', { mode: 'ubah', id_klien: k.id_klien, id: pr.id_properti }); }),
    sedangDeal(pr) ? tombol('tombol-bahaya', 'ulang', 'Deal batal, pasarkan lagi', function () { dealBatal(pr, wb); }) : null));

  // Pembeli yang sedang mencari properti seperti ini
  if (dipasarkan(pr)) {
    const h = pembeliCocok(pr);
    if (h.cocok.length || h.hampir.length || h.alt.length) {
      const baris = function (pk, alasan) {
        return el('button', { type: 'button', class: 'baris', onclick: function () { buka('bagikan', { ids: [pr.id_properti], untuk: pk.id_klien }); } },
          avatar(pk.nama),
          el('span', { class: 'tengah' },
            el('span', { class: 'judul', text: pk.nama }),
            el('span', { class: 'sub', text: 'Mencari: ' + kebutuhanTeks(pk) }),
            alasan ? el('span', { class: 'sub teks-aksen tebal', text: alasan }) : null),
          el('span', { class: 'label-pil kirim' }, ikonWa('hijau', 'ikon-wa-kecil'), 'Kirim'));
      };
      isi.append(el('section', { class: 'kartu kartu-hijau kartu-cocok jarak-atas' },
        el('h2', { class: 'judul-kartu' }, ikon('cocok'), h.cocok.length ? h.cocok.length + ' pembeli sedang mencari properti seperti ini' : 'Pembeli yang hampir cocok'),
        h.cocok.length ? el('div', { class: 'daftar' }, h.cocok.map(function (x) { return baris(x, ''); })) : null,
        h.hampir.length ? el('h3', { class: 'judul-kecil', text: 'Hampir cocok (' + h.hampir.length + ')' }) : null,
        h.hampir.length ? el('div', { class: 'daftar' }, h.hampir.map(function (x) { return baris(x.k, x.alasan); })) : null,
        h.alt.length ? el('h3', { class: 'judul-kecil', text: 'Alternatif, budget agak di bawah harga (' + h.alt.length + ')' }) : null,
        h.alt.length ? el('div', { class: 'daftar' }, h.alt.map(function (x) { return baris(x.k, x.alasan); })) : null));
    }
  }

  const lk = kelengkapan(pr);
  const semua = lk.wajib.concat(lk.tambahan, dokumenLainnyaGrup(k.id_klien, pr.id_properti));
  isi.append(judulBagian('Dokumen (' + lk.ada + ' dari ' + lk.total + ')',
    tombol('tombol-pil', 'tambah', 'Foto', function () { buka('foto', { id_klien: k.id_klien, id_properti: pr.id_properti }); }, { 'aria-label': 'Foto dokumen baru' })));
  if (lk.kurang.length) isi.append(el('p', { class: 'kecil teks-aksen tebal', text: 'Belum lengkap: ' + lk.kurang.map(function (x) { return x.label; }).join(', ') }));
  else isi.append(el('p', { class: 'kecil tebal teks-hijau', text: 'Dokumen wajib sudah lengkap.' }));
  isi.append(el('div', { class: 'daftar' }, semua.map(function (x) {
    const milikKlien = DOK_KLIEN.indexOf(x.jenis) >= 0;
    return barisDok(x,
      function () { buka('lihat', { id_klien: k.id_klien, id_properti: milikKlien ? '' : pr.id_properti, jenis: x.jenis, judul: x.judul, dari_properti: pr.id_properti }); },
      function () { buka('foto', { id_klien: k.id_klien, id_properti: pr.id_properti, jenis: x.jenis }); });
  })));
}

/** Deal batal: properti kembali Tersedia. Pembeli yang sudah ditandai "Sudah dapat" bisa dikembalikan ke "Mencari". */
async function dealBatal(pr, wb) {
  const l = pr.id_klien_deal ? cariKlien(pr.id_klien_deal) : null;
  const ya = await konfirmasi('Deal batal?', 'Properti ini kembali menjadi Tersedia dan bisa ditawarkan lagi ke pembeli lain.' + (l ? '\nDeal dengan ' + l.nama + ' dihapus.' : ''), 'Ya, pasarkan lagi', 'tombol-utama');
  if (!ya) return;
  tampilMemuat('Menyimpan...');
  try {
    const j = await panggil('simpanProperti', dataProperti(pr, { progres: 'Tersedia', id_klien_deal: '' }));
    tutupMemuat();
    if (!j.ok) { tampilBanner(wb, { jenis: 'gagal', judul: 'Gagal tersimpan', pesan: j.pesan }); return; }
    simpanKeDaftar(S.data.properti, 'id_properti', j.data.properti);
    S.bannerBerikut = { jenis: 'sukses', judul: 'Properti dipasarkan lagi', pesan: pr.nama_properti + ' · Tersedia' };
    if (l && l.peran === 'Pembeli' && l.status_beli === 'Sudah dapat') {
      const balik = await konfirmasi('Kembalikan ' + l.nama + ' ke "Masih mencari"?', 'Supaya muncul lagi di daftar pembeli yang dicocokkan.', 'Ya, masih mencari', 'tombol-utama');
      if (balik) await ubahStatusPembeli(l, 'Mencari');
    }
    tampilkan(S.layar);
  } catch (e) {
    tutupMemuat();
    if (e instanceof GalatSesi) return;
    tampilBanner(wb, { jenis: 'waspada', judul: 'Hasil belum pasti', pesan: 'Koneksi terputus. Tekan Perbarui di Beranda untuk melihat hasilnya.' });
  }
}

async function ubahStatusPembeli(k, status) {
  try {
    // Pembeli yang sudah dapat atau tidak lanjut: pengingat hubungi ikut dibersihkan.
    const bersih = status === 'Mencari' ? {} : { hubungi_tanggal: '', hubungi_catatan: '' };
    const j = await panggil('aturKlien', Object.assign({ id_klien: k.id_klien, status_beli: status }, bersih));
    if (j.ok) simpanKeDaftar(S.data.klien, 'id_klien', j.data.klien);
    return j.ok;
  } catch (e) {
    return false;
  }
}

/* ════════════════════════════════════════════════════════════
   LAYAR: PILIH TUJUAN FOTO
   ════════════════════════════════════════════════════════════ */

function layarPilihTujuan(isi, p) {
  const k = cariKlien(p.id_klien);
  if (!k) return tidakAda();
  kepala({ judul: 'Foto untuk Apa?' });
  isi.append(el('p', { class: 'redup', text: k.nama }));
  const daftar = el('div', { class: 'daftar jarak-atas-kecil' },
    el('button', { type: 'button', class: 'baris', onclick: function () { buka('foto', { id_klien: k.id_klien, id_properti: '' }); } },
      el('span', { class: 'ubin-ikon' }, ikon('kartu')),
      el('span', { class: 'tengah' }, el('span', { class: 'judul', text: 'Dokumen pribadi klien' }), el('span', { class: 'sub', text: 'KTP, NPWP, atau dokumen lain' })),
      ikon('kanan', 'panah')));
  propertiKlien(k.id_klien).forEach(function (pr) {
    daftar.append(barisProperti(pr, function () { buka('foto', { id_klien: k.id_klien, id_properti: pr.id_properti }); }, false));
  });
  isi.append(daftar);
}

/* ════════════════════════════════════════════════════════════
   LAYAR: FOTO DOKUMEN (tampilan kamera)
   Tombol membuka kamera bawaan HP. Foto dikecilkan di HP, disimpan dulu di HP
   (supaya tidak hilang), lalu diperiksa di layar Simpan Dokumen sebelum dikirim.
   ════════════════════════════════════════════════════════════ */

function layarFoto(isi, p) {
  const k = cariKlien(p.id_klien);
  const pr = p.id_properti ? cariProperti(p.id_properti) : null;
  if (!k || (p.id_properti && !pr)) return tidakAda();
  document.body.classList.add('layar-gelap');
  const st = S.layar;
  const pilihan = pr ? JENIS_DOK : ['KTP', 'NPWP', 'Lainnya'];
  // Jenis awal setiap foto; bisa diubah satu per satu di layar berikutnya.
  const jenisAwal = pilihan.indexOf(p.jenis) >= 0 ? p.jenis : (pr ? 'Foto properti' : 'KTP');

  const kamera = el('input', { type: 'file', accept: 'image/*', capture: 'environment', class: 'tersembunyi', tabindex: '-1', 'aria-hidden': 'true' });
  const galeri = el('input', { type: 'file', accept: 'image/*', multiple: true, class: 'tersembunyi', tabindex: '-1', 'aria-hidden': 'true' });
  const pesan = el('div');
  const tombolKamera = el('button', { type: 'button', class: 'sumber sumber-utama', onclick: function () { kamera.value = ''; kamera.click(); } },
    ikon('kamera', 'ikon-besar'), el('span', { text: 'Pakai Kamera' }));
  const tombolGaleri = el('button', { type: 'button', class: 'sumber', onclick: function () { galeri.value = ''; galeri.click(); } },
    ikon('gambar', 'ikon-besar'), el('span', { text: 'Pilih dari Galeri (bisa banyak)' }));

  const ruang = el('div', { class: 'kamera' },
    el('div', { class: 'kamera-atas' },
      el('button', { type: 'button', class: 'tombol-ikon', 'aria-label': 'Tutup', onclick: function () { history.back(); } }, ikon('silang')),
      el('h2', { class: 'kamera-judul', text: 'Foto Dokumen' }),
      el('span')),
    el('p', { class: 'kamera-tujuan', text: 'Untuk: ' + (pr ? pr.nama_properti + ' — ' : 'Dokumen pribadi — ') + k.nama }),
    pesan,
    el('div', { class: 'bingkai-bidik' },
      el('span', { class: 'sudut sa' }), el('span', { class: 'sudut sb' }), el('span', { class: 'sudut sc' }), el('span', { class: 'sudut sd' }),
      ikon('kartu'),
      el('p', { text: 'Pastikan tulisan di dokumen terlihat jelas.' }),
      el('p', { class: 'kecil', text: 'Dari galeri bisa memilih beberapa foto sekaligus. Jenis tiap foto diatur di layar berikutnya.' })),
    el('div', { class: 'kamera-bawah' }, tombolKamera, tombolGaleri),
    kamera, galeri);
  isi.append(ruang);
  sisipBanner(pesan);

  // Foto sebelumnya yang belum tersimpan untuk klien ini.
  const belum = S.foto && S.foto.id_klien === k.id_klien ? jumlahFotoTertunda() : 0;
  if (belum) {
    pesan.append(buatBanner({ jenis: 'waspada', tanpaTutup: true, judul: 'Ada ' + belum + ' foto yang belum tersimpan', pesan: 'Untuk ' + k.nama }),
      tombol('tombol-utama jarak-atas-kecil', 'ulang', 'Buka foto itu lagi', function () { buka('simpanFoto', { id_klien: k.id_klien, id_properti: S.foto.konteks || '' }); }));
  }

  kamera.addEventListener('change', function () { siapkan(kamera.files); });
  galeri.addEventListener('change', function () { siapkan(galeri.files); });

  async function siapkan(daftarFile) {
    const file = Array.prototype.slice.call(daftarFile || []);
    kamera.value = '';
    galeri.value = '';
    if (!file.length) return;
    if (S.foto && (S.foto.id_klien !== k.id_klien || !jumlahFotoTertunda())) lepasFoto();
    if (!S.foto) S.foto = { id_klien: k.id_klien, konteks: '', tujuan: undefined, items: [] };
    const f = S.foto;
    f.konteks = pr ? pr.id_properti : '';
    const ruangSisa = Math.max(0, FOTO_BATCH_MAKS - f.items.length);
    const dipakai = file.slice(0, ruangSisa);
    const terlalu = file.length - dipakai.length;
    let gagalBaca = 0;
    tampilMemuat('Menyiapkan foto...');
    for (let i = 0; i < dipakai.length; i++) {
      ubahTeksMemuat('Menyiapkan foto ' + (i + 1) + ' dari ' + dipakai.length + '...');
      try {
        const hasil = await kecilkanGambar(dipakai[i], CONFIG.FOTO_SISI_MAKS, CONFIG.FOTO_KUALITAS);
        const base64 = await blobKeBase64(hasil.blob);
        let mini = '';
        try { mini = await buatMini(hasil.blob); } catch (e) { mini = ''; }
        f.items.push({
          idUnggahan: idBaru('u'), base64: base64, url: URL.createObjectURL(hasil.blob), ukuran: hasil.blob.size,
          jenis: jenisAwal, judul: jenisAwal === 'Lainnya' ? (p.judul || '') : '', tersimpan: false, terkunci: false, galat: '', mini: mini
        });
      } catch (e) {
        gagalBaca++;
      }
    }
    await simpanFotoTertunda();
    tutupMemuat();
    if (S.layar !== st) return;
    if (!f.items.length) {
      lepasFoto();
      simpanFotoTertunda();
      kosongkan(pesan);
      pesan.append(buatBanner({ jenis: 'gagal', judul: 'Foto tidak bisa dibaca', pesan: 'Silakan foto ulang.' }));
      return;
    }
    const catatan = [];
    if (gagalBaca) catatan.push(gagalBaca + ' foto tidak bisa dibaca dan dilewati.');
    if (terlalu) catatan.push('Paling banyak ' + FOTO_BATCH_MAKS + ' foto sekali simpan; ' + terlalu + ' foto tidak ikut.');
    if (catatan.length) S.bannerBerikut = { jenis: 'waspada', judul: 'Sebagian foto tidak diambil', pesan: catatan.join(' ') };
    buka('simpanFoto', { id_klien: k.id_klien, id_properti: pr ? pr.id_properti : '' });
  }
}

/* ── Watermark foto properti: logo Gading Pro + nama agen, di tengah, samar tapi terbaca ── */
/** Logo Gading Pro + nama agen di tengah gambar (W x H). Dipakai foto properti dan gambar promo. */
function tempelMarka(c, W, H, logo) {
    const rasio = logo.height / logo.width;
    const lw = Math.min(W * 0.3, H * 0.4 / rasio);
    const lh = lw * rasio;
    const fs = Math.round(lw * 0.18);
    const gap = fs * 0.18;
    const total = lh + gap + fs;
    const x = (W - lw) / 2;
    const y = (H - total) / 2;
    // Logo: lingkar putih tipis di sekelilingnya supaya huruf hitamnya tetap terbaca di foto gelap.
    c.save();
    c.globalAlpha = 0.42;
    c.shadowColor = 'rgba(255,255,255,1)';
    c.shadowBlur = lw * 0.05;
    c.drawImage(logo, x, y, lw, lh);
    c.restore();
    // Nama agen
    c.save();
    c.globalAlpha = 0.55;
    c.font = '700 ' + fs + 'px "Segoe UI", Roboto, Arial, sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'top';
    c.lineJoin = 'round';
    c.lineWidth = fs * 0.08;
    c.strokeStyle = 'rgba(0,0,0,0.4)';
    c.fillStyle = '#ffffff';
    c.strokeText(CONFIG.MARKA_TEKS, W / 2, y + lh + gap);
    c.fillText(CONFIG.MARKA_TEKS, W / 2, y + lh + gap);
    c.restore();
}

const MARKA = { janji: null };
function muatMarka() {
  if (!MARKA.janji) {
    MARKA.janji = new Promise(function (ok, gagal) {
      const g = new Image();
      g.onload = function () { ok(g); };
      g.onerror = function () { MARKA.janji = null; gagal(new Error('marka')); };
      g.src = 'marka.png';
    });
  }
  return MARKA.janji;
}

/** Hanya untuk Foto properti, dipasang tepat sebelum dikirim. Hasil: base64 JPEG baru. */
async function beriMarka(base64) {
  const logo = await muatMarka();
  const blob = base64KeBlob(base64, 'image/jpeg');
  const gbr = new Image();
  const url = URL.createObjectURL(blob);
  try {
    gbr.src = url;
    await gbr.decode();
    const W = gbr.naturalWidth, H = gbr.naturalHeight;
    if (!W || !H) throw new Error('ukuran');
    const kanvas = document.createElement('canvas');
    kanvas.width = W;
    kanvas.height = H;
    const c = kanvas.getContext('2d');
    c.drawImage(gbr, 0, 0, W, H);
    tempelMarka(c, W, H, logo);
    const hasil = await new Promise(function (ok, gagal) {
      kanvas.toBlob(function (b) { if (b) ok(b); else gagal(new Error('toBlob')); }, 'image/jpeg', CONFIG.FOTO_KUALITAS);
    });
    kanvas.width = 0;
    kanvas.height = 0;
    return await blobKeBase64(hasil);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Mengecilkan gambar di HP: sisi terpanjang maks "sisi" px, JPEG, orientasi dikoreksi. */
async function kecilkanGambar(file, sisi, kualitas) {
  let sumber = null;
  let urlSementara = null;
  try {
    if (window.createImageBitmap) {
      try { sumber = await createImageBitmap(file, { imageOrientation: 'from-image' }); } catch (e) { sumber = null; }
    }
    if (!sumber) {
      urlSementara = URL.createObjectURL(file);
      const img = new Image();
      img.src = urlSementara;
      await img.decode();
      sumber = img;
    }
    const w = sumber.width || sumber.naturalWidth;
    const h = sumber.height || sumber.naturalHeight;
    if (!w || !h) throw new Error('ukuran');
    const skala = Math.min(1, sisi / Math.max(w, h));
    const cw = Math.round(w * skala);
    const ch = Math.round(h * skala);
    const kanvas = document.createElement('canvas');
    kanvas.width = cw;
    kanvas.height = ch;
    const ctx = kanvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cw, ch);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sumber, 0, 0, cw, ch);
    const blob = await new Promise(function (ok, gagal) {
      kanvas.toBlob(function (b) { if (b) ok(b); else gagal(new Error('toBlob')); }, 'image/jpeg', kualitas);
    });
    kanvas.width = 0;
    kanvas.height = 0;
    return { blob: blob, lebar: cw, tinggi: ch };
  } finally {
    if (sumber && sumber.close) sumber.close();
    if (urlSementara) URL.revokeObjectURL(urlSementara);
  }
}

/* ════════════════════════════════════════════════════════════
   LAYAR: SIMPAN DOKUMEN
   "Berhasil tersimpan" hanya tampil setelah server mengonfirmasi.
   ════════════════════════════════════════════════════════════ */

function layarSimpanFoto(isi, p) {
  const k = cariKlien(p.id_klien);
  if (!k) return tidakAda();
  kepala({ judul: 'Simpan Dokumen' });
  const st = S.layar;
  const f = S.foto;
  if (!f || f.id_klien !== k.id_klien || !f.items.length) {
    isi.append(el('div', { class: 'kosong' },
      el('div', { class: 'lingkar-ikon' }, ikon('kamera')),
      el('h2', { text: 'Belum ada foto' }),
      el('p', { class: 'redup', text: 'Foto belum diambil atau sudah tersimpan.' }),
      tombol('tombol-utama', 'kamera', 'Ke layar foto', function () { buka('foto', { id_klien: k.id_klien, id_properti: p.id_properti || '' }, { ganti: true }); })));
    return;
  }
  const props = propertiKlien(k.id_klien);
  const pilihanJenis = props.length ? JENIS_DOK : ['KTP', 'NPWP', 'Lainnya'];

  const wb = el('div');
  const selTujuan = el('select', { class: 'isian', id: 'sTujuan' },
    el('option', { value: '', text: 'Dokumen pribadi — ' + k.nama }),
    props.map(function (pr) { return el('option', { value: pr.id_properti, text: pr.nama_properti }); }));
  const tujuanAwal = f.tujuan !== undefined ? f.tujuan : (f.konteks || '');
  selTujuan.value = tujuanAwal;
  if (selTujuan.value !== tujuanAwal) selTujuan.value = '';
  const catatanTujuan = el('p', { class: 'kecil redup' });
  const salahTujuan = el('p', { class: 'pesan-salah tersembunyi' });
  const ringkas = el('p', { class: 'tebal' });
  const daftarKartu = el('div', { class: 'daftar-foto' });
  const status = el('div', { class: 'jarak-atas' });
  const tombolSimpan = tombol('tombol-utama', 'centang', 'Simpan', simpan);
  const tombolTambah = tombol('', 'kamera', 'Tambah foto', function () { history.back(); });
  const selSamakan = el('select', { class: 'isian', id: 'sSamakan', 'aria-label': 'Samakan jenis semua foto' },
    el('option', { value: '', text: 'Pilih jenis...' }),
    pilihanJenis.map(function (j) { return el('option', { value: j, text: j }); }));
  const kotakSamakan = el('div', { class: 'kartu jarak-atas-kecil' },
    el('label', { class: 'label', for: 'sSamakan' }, el('span', { text: 'Samakan semua jadi:' })),
    selSamakan,
    el('p', { class: 'kecil redup jarak-atas-kecil', text: 'Lalu ubah satu per satu yang berbeda.' }));

  isi.append(wb,
    el('div', { class: 'bidang' }, el('label', { class: 'label', for: 'sTujuan' }, el('span', { text: 'Simpan ke' })), selTujuan, catatanTujuan, salahTujuan),
    ringkas, kotakSamakan, daftarKartu, status,
    el('div', { class: 'tumpuk' }, tombolSimpan, tombolTambah),
    el('p', { class: 'kecil redup jarak-atas-kecil', text: 'Foto yang belum tersimpan aman di HP ini sampai disimpan, walaupun aplikasi tertutup.' }));

  function belumTersimpan() { return f.items.filter(function (x) { return !x.tersimpan; }); }
  function terkunciAda() { return f.items.some(function (x) { return x.terkunci && !x.tersimpan; }); }

  function atur(it, j) {
    it.jenis = j;
    if (it._ui) {
      it._ui.sel.value = j;
      it._ui.judul.wadah.classList.toggle('tersembunyi', j !== 'Lainnya');
    }
  }

  function perbaruiRingkas() {
    const sisa = belumTersimpan();
    const kb = Math.round(sisa.reduce(function (n, x) { return n + x.ukuran; }, 0) / 1024);
    ringkas.textContent = f.items.length === sisa.length
      ? f.items.length + ' foto dipilih · total ' + kb + ' KB'
      : (f.items.length - sisa.length) + ' tersimpan · ' + sisa.length + ' belum';
    kotakSamakan.classList.toggle('tersembunyi', sisa.length < 2 || sibukSimpan);
    tombolSimpan.querySelector('span').textContent = sisa.length > 1 ? 'Simpan ' + sisa.length + ' Foto' : 'Simpan';
    aturTujuan();
  }

  function aturTujuan() {
    const sisa = belumTersimpan();
    const adaProp = sisa.some(function (x) { return DOK_PROPERTI.indexOf(x.jenis) >= 0; });
    const semuaKlien = sisa.length > 0 && sisa.every(function (x) { return DOK_KLIEN.indexOf(x.jenis) >= 0; });
    salahTujuan.classList.add('tersembunyi');
    if (semuaKlien) {
      selTujuan.value = '';
      catatanTujuan.textContent = 'KTP dan NPWP selalu disimpan di dokumen pribadi klien.';
    } else {
      catatanTujuan.textContent = adaProp ? 'PBB, Sertifikat, dan foto properti disimpan di properti ini. KTP dan NPWP tetap masuk dokumen pribadi.' : '';
    }
    selTujuan.disabled = sibukSimpan || terkunciAda() || semuaKlien;
  }

  let sibukSimpan = false;

  function tandai(it) {
    const u = it._ui;
    if (!u) return;
    u.tanda.className = 'tanda-foto' + (it.tersimpan ? ' ok' : it.galat ? ' salah' : '');
    u.tanda.textContent = it.tersimpan ? 'Tersimpan' : (it.galat || '');
    const kunciKartu = sibukSimpan || it.tersimpan || it.terkunci;
    u.sel.disabled = kunciKartu;
    u.judul.isian.disabled = kunciKartu;
    u.hapus.disabled = sibukSimpan || it.tersimpan || it.terkunci;
    u.kartu.classList.toggle('selesai', it.tersimpan);
  }

  function buatKartu(it, i) {
    const sel = el('select', { class: 'isian isian-kecil', 'aria-label': 'Jenis foto ' + (i + 1) }, pilihanJenis.map(function (j) { return el('option', { value: j, text: j }); }));
    sel.value = pilihanJenis.indexOf(it.jenis) >= 0 ? it.jenis : pilihanJenis[0];
    it.jenis = sel.value;
    const judul = bidangTeks('fJudul' + i, 'Judul dokumen', 'Wajib', it.judul || '', { maxlength: '60', autocomplete: 'off', autocapitalize: 'words', placeholder: 'Contoh: Surat Girik' });
    judul.wadah.classList.toggle('tersembunyi', it.jenis !== 'Lainnya');
    pasangRapi(judul.isian, function (v) { return rapiJudul_(v, false); });
    judul.isian.addEventListener('input', function () { it.judul = judul.isian.value; judul.salah(''); it.galat = ''; tandai(it); });
    judul.isian.addEventListener('blur', function () { it.judul = judul.isian.value; simpanFotoTertunda(); });
    sel.addEventListener('change', function () {
      atur(it, sel.value);
      it.galat = '';
      tandai(it);
      if (sel.value === 'Lainnya') judul.isian.focus();
      perbaruiRingkas();
      simpanFotoTertunda();
    });
    const tanda = el('span', { class: 'tanda-foto' });
    const hapus = el('button', { type: 'button', class: 'tombol-ikon buang', 'aria-label': 'Buang foto ' + (i + 1), onclick: function () { buang(it); } }, ikon('silang'));
    const kartu = el('div', { class: 'kartu kartu-foto' },
      el('img', { class: 'pratinjau-kecil', src: it.url, alt: 'Pratinjau foto ' + (i + 1) }),
      el('div', { class: 'tengah' },
        el('span', { class: 'tebal', text: 'Foto ' + (i + 1) + ' · ' + Math.round(it.ukuran / 1024) + ' KB' }),
        tanda, sel, judul.wadah),
      hapus);
    it._ui = { sel: sel, judul: judul, tanda: tanda, hapus: hapus, kartu: kartu };
    tandai(it);
    return kartu;
  }

  function gambarDaftar() {
    kosongkan(daftarKartu);
    f.items.forEach(function (it, i) { daftarKartu.append(buatKartu(it, i)); });
    perbaruiRingkas();
  }

  function buang(it) {
    if (sibukSimpan || it.tersimpan || it.terkunci) return;
    if (it.url) URL.revokeObjectURL(it.url);
    f.items = f.items.filter(function (x) { return x !== it; });
    if (!f.items.length) { lepasFoto(); simpanFotoTertunda(); history.back(); return; }
    simpanFotoTertunda();
    gambarDaftar();
  }

  selSamakan.addEventListener('change', function () {
    const j = selSamakan.value;
    selSamakan.value = '';
    if (!j) return;
    belumTersimpan().forEach(function (it) { if (!it.terkunci) { atur(it, j); it.galat = ''; tandai(it); } });
    perbaruiRingkas();
    simpanFotoTertunda();
  });
  selTujuan.addEventListener('change', function () { f.tujuan = selTujuan.value; salahTujuan.classList.add('tersembunyi'); simpanFotoTertunda(); });

  function kunci(aktif) {
    sibukSimpan = aktif;
    S.sibuk = aktif;
    tombolSimpan.disabled = aktif;
    tombolTambah.disabled = aktif;
    f.items.forEach(tandai);
    perbaruiRingkas();
    window.onbeforeunload = aktif ? function (e) { e.preventDefault(); e.returnValue = ''; return ''; } : null;
  }

  function periksaIsian() {
    let pertama = null;
    const tujuan = selTujuan.value;
    f.tujuan = tujuan;
    belumTersimpan().forEach(function (it) {
      it.galat = '';
      if (it.jenis === 'Lainnya') it.judul = rapiJudul_(it.judul || '', false);
      if (it.jenis === 'Lainnya' && !it.judul) {
        it.galat = 'Ketik judul dokumennya.';
        if (!pertama) pertama = it._ui.judul.isian;
      } else if (DOK_PROPERTI.indexOf(it.jenis) >= 0 && !tujuan) {
        it.galat = props.length ? 'Pilih properti di atas untuk ' + it.jenis + '.' : 'Tambahkan properti dulu untuk menyimpan ' + it.jenis + '.';
        if (!pertama) pertama = selTujuan;
      }
      tandai(it);
    });
    return pertama;
  }

  async function simpan() {
    const sisa = belumTersimpan();
    if (!sisa.length) return;
    kosongkan(status);
    const salah = periksaIsian();
    if (salah) {
      salahTujuan.textContent = 'Ada foto yang perlu dilengkapi. Lihat tulisan merah di bawah foto.';
      salahTujuan.classList.remove('tersembunyi');
      salah.focus();
      umumkan('Ada foto yang perlu dilengkapi.');
      return;
    }
    salahTujuan.classList.add('tersembunyi');
    kunci(true);
    await simpanFotoTertunda();
    let dikirim = 0;
    const total = sisa.length;
    let putus = false;
    for (let i = 0; i < sisa.length && !putus; i++) {
      const it = sisa[i];
      tampilProgres(i + 1, total, 'menyimpan');
      it.terkunci = true;
      tandai(it);
      let gambarKirim = it.base64;
      const duaVersi = DOK_DUA_VERSI.indexOf(it.jenis) >= 0;
      if (it.jenis === 'Foto properti' || duaVersi) {
        try { gambarKirim = await beriMarka(it.base64); } catch (e0) {
          // Lebih baik berhenti daripada mengirim foto properti tanpa watermark.
          it.terkunci = false;
          it.galat = 'Watermark belum terpasang. Tekan Simpan lagi.';
          tandai(it);
          continue;
        }
      }
      try {
        const jw = await panggil('unggahDokumen', {
          id_unggahan: it.idUnggahan, id_klien: f.id_klien,
          id_properti: DOK_KLIEN.indexOf(it.jenis) >= 0 ? '' : f.tujuan,
          jenis: it.jenis, judul: it.jenis === 'Lainnya' ? it.judul : '', gambar: gambarKirim,
          gambar_asli: duaVersi ? it.base64 : ''
        }, { batas: CONFIG.BATAS_WAKTU_UNGGAH_MS });
        if (jw.ok) { berhasilSatu(it, jw.data.dokumen); dikirim++; continue; }
        // Server menolak dengan jelas: foto ini belum tersimpan, boleh diubah dan dicoba lagi.
        it.terkunci = false;
        it.idUnggahan = idBaru('u');
        it.galat = jw.pesan || 'Gagal tersimpan.';
        tandai(it);
      } catch (e) {
        if (e instanceof GalatSesi) return;
        // Koneksi putus: cek apakah foto ini sempat sampai (anti-ganda).
        tampilProgres(i + 1, total, 'memeriksa');
        try {
          const jc = await panggil('cekUnggahan', { id_unggahan: it.idUnggahan });
          if (jc.ok && jc.data.ditemukan) { berhasilSatu(it, jc.data.dokumen); dikirim++; continue; }
          it.terkunci = false;
          it.galat = 'Belum sampai ke server.';
        } catch (e2) {
          if (e2 instanceof GalatSesi) return;
          it.galat = 'Hasil belum pasti. Tekan Simpan lagi; foto tidak akan tersimpan dobel.';
          it.terkunci = true;   // jenis dan judul dikunci supaya kiriman ulang sama persis
        }
        tandai(it);
        putus = true;
      }
    }
    kunci(false);
    await simpanFotoTertunda();
    ringkasanAkhir(dikirim, total, putus);
  }

  function berhasilSatu(it, dok) {
    if (S.data && !S.data.dokumen.some(function (d) { return d.id_dokumen === dok.id_dokumen; })) S.data.dokumen.push(dok);
    if (dok.jenis === 'Foto properti' && it.mini) simpanMini(dok.id_dokumen, it.mini);
    it.tersimpan = true;
    it.terkunci = false;
    it.galat = '';
    it.base64 = null;   // lepaskan memori; foto sudah di server
    tandai(it);
    simpanFotoTertunda();
  }

  function tampilProgres(n, total, keadaan) {
    if (S.layar !== st) return;
    kosongkan(status);
    const batang = el('span');
    batang.style.width = Math.round(((n - 1) / total) * 100) + '%';
    status.append(el('div', { class: 'kartu' },
      el('p', { class: 'tebal', text: keadaan === 'memeriksa' ? 'Memeriksa ke server...' : 'Menyimpan... ' + n + ' dari ' + total }),
      el('div', { class: 'batang tentu' }, batang),
      el('p', { class: 'kecil redup', text: 'Jangan tutup aplikasi sampai selesai.' })));
    umumkan(keadaan === 'memeriksa' ? 'Memeriksa ke server' : 'Menyimpan foto ' + n + ' dari ' + total);
  }

  function ringkasanAkhir(dikirim, total, putus) {
    if (S.layar !== st) return;
    kosongkan(status);
    const sisa = belumTersimpan();
    if (!sisa.length) {
      tombolSimpan.classList.add('tersembunyi');
      tombolTambah.classList.add('tersembunyi');
      status.append(buatBanner({
        jenis: 'sukses', tanpaTutup: true, judul: f.items.length > 1 ? f.items.length + ' foto berhasil tersimpan' : 'Berhasil tersimpan',
        pesan: 'Untuk ' + k.nama
      }), el('div', { class: 'tumpuk' },
        tombol('tombol-utama', 'kamera', 'Foto lagi', function () { lepasFoto(); simpanFotoTertunda(); history.back(); }),
        tombol('', 'centang', 'Selesai', function () { lepasFoto(); simpanFotoTertunda(); history.go(-2); })));
      umumkan('Semua foto berhasil tersimpan');
    } else if (putus) {
      status.append(buatBanner({
        jenis: 'waspada', tanpaTutup: true, judul: dikirim + ' dari ' + total + ' tersimpan',
        pesan: 'Koneksi terputus. ' + sisa.length + ' foto masih aman di HP. Periksa internet, lalu tekan Simpan lagi; foto yang sudah tersimpan tidak dikirim ulang.'
      }));
    } else {
      status.append(buatBanner({
        jenis: 'gagal', tanpaTutup: true, judul: dikirim + ' dari ' + total + ' tersimpan',
        pesan: 'Foto yang gagal ditandai merah. Perbaiki, lalu tekan Coba lagi.'
      }));
    }
    if (sisa.length) {
      kosongkan(tombolSimpan);
      tombolSimpan.append(ikon('ulang'), el('span', { text: 'Coba lagi (' + sisa.length + ' foto)' }));
    }
    status.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  gambarDaftar();
  if (terkunciAda()) {
    // Layar dibuka lagi saat ada foto yang hasilnya belum pasti.
    f.items.forEach(function (it) { if (it.terkunci && !it.tersimpan) { it.galat = 'Hasil belum pasti. Tekan Simpan lagi; foto tidak akan tersimpan dobel.'; tandai(it); } });
  }
}

/* ════════════════════════════════════════════════════════════
   LAYAR: LIHAT DOKUMEN
   ════════════════════════════════════════════════════════════ */

function layarLihatDokumen(isi, p) {
  const k = cariKlien(p.id_klien);
  if (!k) return tidakAda();
  const namaDok = p.judul || p.jenis;
  kepala({ judul: namaDok });
  const st = S.layar;
  const idp = p.id_properti || '';
  const pr = idp ? cariProperti(idp) : null;
  const daftar = dokumenDi(k.id_klien, idp, p.jenis, p.jenis === 'Lainnya' ? (p.judul || '') : undefined);
  const tujuanFoto = { id_klien: k.id_klien, id_properti: idp || p.dari_properti || '', jenis: p.jenis, judul: p.judul || '' };

  isi.append(el('p', { class: 'redup', text: (pr ? pr.nama_properti : 'Dokumen pribadi') + ' — ' + k.nama }));
  if (!daftar.length) {
    isi.append(el('div', { class: 'kosong' },
      el('div', { class: 'lingkar-ikon' }, ikon('gambar')),
      el('h2', { text: 'Belum ada foto' }),
      tombol('tombol-utama', 'kamera', 'Foto Dokumen', function () { buka('foto', tujuanFoto, { ganti: true }); })));
    return;
  }

  let i = Math.min(Math.max(0, Number(p.indeks) || 0), daftar.length - 1);
  let besar = false;
  const wb = el('div');
  const info = el('p', { class: 'tebal' });
  const bingkai = el('div', { class: 'bingkai-foto' });
  const tombolBesar = tombol('tombol-kedua', 'perbesar', 'Perbesar', function () {
    besar = !besar;
    bingkai.classList.toggle('besar', besar);
    kosongkan(tombolBesar);
    tombolBesar.append(ikon(besar ? 'perkecil' : 'perbesar'), el('span', { text: besar ? 'Perkecil' : 'Perbesar' }));
  });
  const sebelumnya = tombol('tombol-kedua', 'kiri', 'Sebelumnya', function () { if (i > 0) { i--; tampilFoto(); } });
  const berikutnya = tombol('tombol-kedua', 'kanan', 'Berikutnya', function () { if (i < daftar.length - 1) { i++; tampilFoto(); } });
  const tombolAsli = tombol('tombol-kedua', 'unduh', 'Unduh versi asli', unduhAsli);

  isi.append(wb, info, bingkai,
    el('div', { class: 'tumpuk jarak-atas' }, tombolBesar,
      daftar.length > 1 ? el('div', { class: 'baris-2' }, sebelumnya, berikutnya) : null),
    el('div', { class: 'tumpuk jarak-atas' },
      tombolAsli,
      tombol('tombol-utama', 'kamera', 'Foto ulang', function () { buka('foto', tujuanFoto); }),
      tombol('', 'pindah', 'Ubah jenis atau pindahkan', function () { buka('ubahDok', { id_dokumen: daftar[i].id_dokumen }); }),
      tombol('tombol-bahaya', 'sampah', 'Hapus foto ini', hapusFoto)),
    el('p', { class: 'kecil redup jarak-atas-kecil', text: 'Foto ulang menambah foto baru. Foto lama tetap ada sampai dihapus.' }));

  /** Unduh foto asli (tanpa watermark). Hanya setelah konfirmasi; server mencatat setiap unduhan. */
  async function unduhAsli() {
    const d = daftar[i];
    const yakin = await konfirmasi('Unduh foto asli?',
      'Ini foto asli tanpa watermark. Hanya untuk arsip Anda, jangan dibagikan ke siapa pun. Setiap unduhan dicatat.',
      'Ya, unduh');
    if (!yakin) return;
    tombolAsli.disabled = true;
    kosongkan(tombolAsli);
    tombolAsli.append(el('span', { text: 'Menyiapkan...' }));
    try {
      const j = await panggil('ambilFoto', { id_dokumen: d.id_dokumen, versi: 'asli', konfirmasi: true });
      if (!j.ok) throw new Error(j.pesan || 'Foto asli tidak bisa dibuka.');
      const url = URL.createObjectURL(base64KeBlob(j.data.gambar, j.data.mime || 'image/jpeg'));
      unduhBlob(url, (d.nama_file || d.jenis).replace(/\.jpg$/, '') + ' - ASLI.jpg');
      setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
      tampilBanner(wb, { jenis: 'sukses', judul: 'Foto asli diunduh', pesan: 'Cek folder unduhan di HP atau laptop Anda.' });
    } catch (e) {
      if (e instanceof GalatSesi) return;
      tampilBanner(wb, { jenis: 'gagal', judul: 'Foto asli belum bisa diunduh', pesan: e.message || 'Coba lagi sebentar lagi.' });
    } finally {
      tombolAsli.disabled = false;
      kosongkan(tombolAsli);
      tombolAsli.append(ikon('unduh'), el('span', { text: 'Unduh versi asli' }));
    }
  }

  async function tampilFoto() {
    const d = daftar[i];
    tombolAsli.classList.toggle('tersembunyi', !(d.ada_asli && DOK_DUA_VERSI.indexOf(d.jenis) >= 0));
    info.textContent = 'Foto ' + (i + 1) + ' dari ' + daftar.length + ' · ' + formatTanggal(d.dibuat_pada, true);
    sebelumnya.disabled = i === 0;
    berikutnya.disabled = i === daftar.length - 1;
    gantiParam({ indeks: i });
    kosongkan(bingkai);
    bingkai.append(el('div', { class: 'kosong' }, el('div', { class: 'pemutar', 'aria-hidden': 'true' }),
      el('p', { class: 'tebal teks-terang', text: 'Sebentar ya... membuka foto' })));
    try {
      const url = await urlFoto(d.id_dokumen);
      if (S.layar !== st || daftar[i] !== d) return;
      kosongkan(bingkai);
      bingkai.append(el('img', { src: url, alt: (d.judul || d.jenis) + ' ' + k.nama + ', foto ' + (i + 1) }));
    } catch (e) {
      if (e instanceof GalatSesi || S.layar !== st) return;
      kosongkan(bingkai);
      bingkai.append(el('div', { class: 'kosong' },
        el('p', { class: 'tebal teks-terang', text: e instanceof GalatJaringan ? 'Foto gagal dibuka. Periksa internet.' : (e.message || 'Foto gagal dibuka.') }),
        tombol('tombol-kedua', 'ulang', 'Coba lagi', tampilFoto)));
    }
  }

  async function hapusFoto() {
    const d = daftar[i];
    const ya = await konfirmasiHapus('foto ' + (d.judul || d.jenis) + ' ini');
    if (!ya) return;
    tampilMemuat('Menghapus foto...');
    try {
      const j = await panggil('hapus', { jenis: 'dokumen', id: d.id_dokumen });
      tutupMemuat();
      if (!j.ok) { tampilBanner(wb, { jenis: 'gagal', judul: 'Gagal menghapus', pesan: j.pesan }); return; }
      hapusDokumenDariData(d.id_dokumen);
      S.bannerBerikut = { jenis: 'sukses', judul: 'Foto dihapus', pesan: 'Bisa dipulihkan dari menu Baru dihapus selama 30 hari.' };
      const st2 = { nama: 'lihat', param: Object.assign({}, p, { indeks: Math.max(0, i - 1) }) };
      history.replaceState(st2, '', '#lihat');
      tampilkan(st2);
    } catch (e) {
      tutupMemuat();
      if (e instanceof GalatSesi) return;
      tampilBanner(wb, { jenis: 'waspada', judul: 'Hasil belum pasti', pesan: 'Koneksi terputus. Tekan Perbarui di Beranda untuk melihat hasilnya.' });
    }
  }

  tampilFoto();
}

/* ════════════════════════════════════════════════════════════
   LAYAR: UBAH JENIS ATAU PINDAHKAN DOKUMEN
   ════════════════════════════════════════════════════════════ */

function layarUbahDokumen(isi, p) {
  const d = cariDokumen(p.id_dokumen);
  const k = d ? cariKlien(d.id_klien) : null;
  if (!d || !k) return tidakAda();
  kepala({ judul: 'Ubah Dokumen' });
  const props = propertiKlien(k.id_klien);
  const pilihanJenis = props.length ? JENIS_DOK : ['KTP', 'NPWP', 'Lainnya'];
  const wb = el('div');
  const pratinjau = el('div', { class: 'pratinjau-ubah' }, el('div', { class: 'pemutar', 'aria-hidden': 'true' }));
  urlFoto(d.id_dokumen).then(function (url) {
    kosongkan(pratinjau);
    pratinjau.append(el('img', { src: url, alt: 'Foto ' + (d.judul || d.jenis) }));
  }).catch(function () { kosongkan(pratinjau); pratinjau.append(el('p', { class: 'redup', text: 'Pratinjau belum bisa dibuka.' })); });

  const selJenis = el('select', { class: 'isian', id: 'uJenis' }, pilihanJenis.map(function (j) { return el('option', { value: j, text: j }); }));
  selJenis.value = pilihanJenis.indexOf(d.jenis) >= 0 ? d.jenis : pilihanJenis[0];
  const judul = bidangTeks('uJudul', 'Judul dokumen', 'Wajib', d.judul || '', { maxlength: '60', autocomplete: 'off', placeholder: 'Contoh: Surat Girik' });
  pasangRapi(judul.isian, function (v) { return rapiJudul_(v, false); });
  const selTempat = el('select', { class: 'isian', id: 'uTempat' },
    el('option', { value: '', text: 'Dokumen pribadi — ' + k.nama }),
    props.map(function (pr) { return el('option', { value: pr.id_properti, text: pr.nama_properti }); }));
  selTempat.value = d.id_properti || '';
  const catatanTempat = el('p', { class: 'kecil redup' });
  const salahTempat = el('p', { class: 'pesan-salah tersembunyi' });
  function aturTampilan() {
    judul.wadah.classList.toggle('tersembunyi', selJenis.value !== 'Lainnya');
    const milikKlien = DOK_KLIEN.indexOf(selJenis.value) >= 0;
    if (milikKlien) selTempat.value = '';
    selTempat.disabled = milikKlien;
    catatanTempat.textContent = milikKlien ? 'KTP dan NPWP selalu disimpan di dokumen pribadi klien.' : '';
    salahTempat.classList.add('tersembunyi');
  }
  selJenis.addEventListener('change', aturTampilan);
  selTempat.addEventListener('change', function () { salahTempat.classList.add('tersembunyi'); });
  aturTampilan();
  const tombolSimpan = tombol('tombol-utama', 'centang', 'Simpan', simpan);

  isi.append(el('p', { class: 'redup', text: k.nama }), wb, pratinjau,
    el('div', { class: 'bidang jarak-atas' }, el('label', { class: 'label', for: 'uJenis' }, el('span', { text: 'Jenis dokumen' })), selJenis),
    judul.wadah,
    el('div', { class: 'bidang' }, el('label', { class: 'label', for: 'uTempat' }, el('span', { text: 'Simpan di' })), selTempat, catatanTempat, salahTempat),
    tombolSimpan);

  async function simpan() {
    judul.salah('');
    const jenis = selJenis.value;
    const nilaiJudul = jenis === 'Lainnya' ? rapiJudul_(judul.isian.value, false) : '';
    if (jenis === 'Lainnya' && !nilaiJudul) { judul.salah('Ketik judul dokumennya.'); judul.isian.focus(); return; }
    if (DOK_PROPERTI.indexOf(jenis) >= 0 && !selTempat.value) {
      salahTempat.textContent = props.length ? 'Pilih properti untuk ' + jenis + '.' : 'Tambahkan properti dulu untuk menyimpan ' + jenis + '.';
      salahTempat.classList.remove('tersembunyi');
      selTempat.focus();
      return;
    }
    // Foto yang belum punya versi asli dan belum ber-watermark (PBB, Lainnya) lalu diubah jadi jenis dua-versi: kirim versi ber-watermark-nya.
    // Foto yang sudah ber-watermark (jenis lama KTP/NPWP/Sertifikat/Foto properti) tidak diberi watermark kedua kali.
    let gambarBaru = '';
    if (DOK_DUA_VERSI.indexOf(jenis) >= 0 && !d.ada_asli && DOK_SUDAH_MARKA.indexOf(d.jenis) < 0) {
      try {
        const foto = await ambilFotoBesar(d.id_dokumen);
        gambarBaru = await beriMarka(await blobKeBase64(foto.blob));
      } catch (e0) {
        if (e0 instanceof GalatSesi) return;
        tampilBanner(wb, { jenis: 'gagal', judul: 'Foto belum bisa disiapkan', pesan: 'Coba tekan Simpan lagi.' });
        return;
      }
    }
    tombolSimpanSibuk(tombolSimpan, true);
    S.sibuk = true;
    try {
      const j = await panggil('ubahDokumen', { id_dokumen: d.id_dokumen, jenis: jenis, judul: nilaiJudul, id_properti: DOK_KLIEN.indexOf(jenis) >= 0 ? '' : selTempat.value, gambar: gambarBaru });
      S.sibuk = false;
      if (j.ok) {
        simpanKeDaftar(S.data.dokumen, 'id_dokumen', j.data.dokumen);
        const dok = j.data.dokumen;
        S.bannerBerikut = { jenis: 'sukses', judul: 'Dokumen diubah', pesan: (dok.judul || dok.jenis) + ' · ' + (dok.id_properti ? (cariProperti(dok.id_properti) || {}).nama_properti : 'Dokumen pribadi') };
        buka('lihat', { id_klien: dok.id_klien, id_properti: dok.id_properti || '', jenis: dok.jenis, judul: dok.judul || '' }, { ganti: true });
        return;
      }
      tampilBanner(wb, { jenis: 'gagal', judul: 'Gagal tersimpan', pesan: j.pesan });
    } catch (e) {
      S.sibuk = false;
      if (e instanceof GalatSesi) return;
      tampilBanner(wb, { jenis: 'waspada', judul: 'Hasil belum pasti', pesan: 'Koneksi terputus. Tekan Perbarui di Beranda untuk melihat hasilnya.' });
    }
    tombolSimpanSibuk(tombolSimpan, false);
  }
}

/* ════════════════════════════════════════════════════════════
   FORMULIR
   ════════════════════════════════════════════════════════════ */

function bidangTeks(id, label, keterangan, nilai, attr, panjang) {
  const isian = panjang
    ? el('textarea', Object.assign({ class: 'isian', id: id, rows: '4' }, attr || {}))
    : el('input', Object.assign({ class: 'isian', id: id, type: 'text' }, attr || {}));
  isian.value = nilai || '';
  const salah = el('p', { class: 'pesan-salah tersembunyi', id: id + 'Salah' });
  isian.setAttribute('aria-describedby', id + 'Salah');
  const wadah = el('div', { class: 'bidang' },
    el('label', { class: 'label', for: id }, el('span', { text: label }), keterangan ? el('span', { class: 'keterangan', text: keterangan }) : null),
    isian, salah);
  return {
    wadah: wadah, isian: isian,
    salah: function (pesan) {
      salah.textContent = pesan || '';
      salah.classList.toggle('tersembunyi', !pesan);
      isian.classList.toggle('salah', !!pesan);
      isian.setAttribute('aria-invalid', pesan ? 'true' : 'false');
    }
  };
}

/** Tombol pilihan. Isi daftar boleh teks, atau { nilai, label }. bolehKosong: ketuk lagi untuk membatalkan. */
function grupPilihan(label, keterangan, daftar, nilai, saatPilih, bolehKosong, kelasKisi) {
  const item = daftar.map(function (d) { return typeof d === 'string' ? { nilai: d, label: d } : d; });
  const salah = el('p', { class: 'pesan-salah tersembunyi' });
  const tombolTombol = item.map(function (d) {
    return el('button', { type: 'button', class: 'pilihan', 'aria-pressed': 'false', onclick: function () { pilih(d.nilai); } });
  });
  function gambar() {
    tombolTombol.forEach(function (b, i) {
      const ya = item[i].nilai === nilai;
      b.setAttribute('aria-pressed', ya ? 'true' : 'false');
      kosongkan(b);
      if (ya) b.append(ikon('centang'));
      b.append(el('span', { text: item[i].label }));
    });
  }
  function pilih(v) {
    nilai = bolehKosong && v === nilai ? null : v;
    gambar();
    salah.classList.add('tersembunyi');
    if (saatPilih) saatPilih(nilai);
  }
  gambar();
  const wadah = el('div', { class: 'bidang', role: 'group', 'aria-label': label },
    el('div', { class: 'label' }, el('span', { text: label }), keterangan ? el('span', { class: 'keterangan', text: keterangan }) : null),
    el('div', { class: kelasKisi || 'baris-2' }, tombolTombol), salah);
  return {
    wadah: wadah,
    nilai: function () { return nilai; },
    atur: function (v) { nilai = v; gambar(); },
    salah: function (pesan) { salah.textContent = pesan; salah.classList.toggle('tersembunyi', !pesan); },
    fokus: function () { tombolTombol[0].focus(); }
  };
}

/** Beberapa pilihan boleh aktif bersamaan (misalnya Dijual dan Disewakan). */
function grupCentang(label, keterangan, daftar, terpilih, saatUbah) {
  const pilih = {};
  daftar.forEach(function (d) { pilih[d.nilai] = !!terpilih[d.nilai]; });
  const salah = el('p', { class: 'pesan-salah tersembunyi' });
  const tombolTombol = daftar.map(function (d) {
    const b = el('button', { type: 'button', class: 'pilihan', 'aria-pressed': 'false' });
    b.addEventListener('click', function () {
      pilih[d.nilai] = !pilih[d.nilai];
      gambar();
      salah.classList.add('tersembunyi');
      if (saatUbah) saatUbah(Object.assign({}, pilih));
    });
    return b;
  });
  function gambar() {
    tombolTombol.forEach(function (b, i) {
      const ya = pilih[daftar[i].nilai];
      b.setAttribute('aria-pressed', ya ? 'true' : 'false');
      kosongkan(b);
      b.append(el('span', { class: 'kotak-kecil' }, ya ? ikon('centang') : null), el('span', { text: daftar[i].label }));
    });
  }
  gambar();
  return {
    wadah: el('div', { class: 'bidang', role: 'group', 'aria-label': label },
      el('div', { class: 'label' }, el('span', { text: label }), keterangan ? el('span', { class: 'keterangan', text: keterangan }) : null),
      el('div', { class: 'baris-2' }, tombolTombol), salah),
    nilai: function () { return Object.assign({}, pilih); },
    salah: function (pesan) { salah.textContent = pesan; salah.classList.toggle('tersembunyi', !pesan); },
    fokus: function () { tombolTombol[0].focus(); }
  };
}

/** Isian rupiah: titik ribuan otomatis, bacaan mudah di bawahnya ("Rp 1,25 miliar"). */
function bidangRupiah(id, label, keterangan, nilai) {
  const b = bidangTeks(id, label, keterangan, formatRibuan(nilai), { inputmode: 'numeric', autocomplete: 'off', maxlength: '20', placeholder: 'Contoh: 1.250.000.000' });
  const bacaan = el('p', { class: 'bacaan-angka', 'aria-live': 'polite' });
  const awalan = el('span', { class: 'awalan-rp', 'aria-hidden': 'true', text: 'Rp' });
  const bungkus = el('div', { class: 'isian-rp' });
  b.isian.parentNode.insertBefore(bungkus, b.isian);
  bungkus.append(awalan, b.isian);
  b.wadah.insertBefore(bacaan, b.wadah.lastChild);
  function segarkan() {
    const d = angkaSaja(b.isian.value).replace(/^0+(?=\d)/, '');
    const f = formatRibuan(d);
    if (b.isian.value !== f) b.isian.value = f;
    bacaan.textContent = d ? rupiahBaca(d) : '';
  }
  b.isian.addEventListener('input', function () { segarkan(); b.salah(''); });
  segarkan();
  b.nilai = function () { return angkaSaja(b.isian.value).replace(/^0+(?=\d)/, ''); };
  return b;
}

/** Isian angka pendek (luas, kamar, persen). desimal: boleh koma. Satuan tampil di dalam kotak, di kanan. */
function bidangAngka(id, label, satuan, nilai, desimal) {
  const b = bidangTeks(id, label, '', angkaTampil(nilai), { inputmode: desimal ? 'decimal' : 'numeric', autocomplete: 'off', maxlength: '12' });
  if (satuan) {
    const bungkus = el('div', { class: 'isian-satuan' });
    b.isian.parentNode.insertBefore(bungkus, b.isian);
    bungkus.append(b.isian, el('span', { class: 'akhiran-satuan', 'aria-hidden': 'true', text: satuan }));
    b.isian.setAttribute('aria-label', label + ' dalam ' + (satuan === 'm²' ? 'meter persegi' : satuan === '%' ? 'persen' : satuan));
  }
  b.isian.addEventListener('input', function () {
    const v = desimal ? b.isian.value.replace(/[^\d,.]/g, '').replace('.', ',') : angkaSaja(b.isian.value);
    if (v !== b.isian.value) b.isian.value = v;
    b.salah('');
  });
  b.nilai = function () { return desimal ? b.isian.value.trim().replace(',', '.') : angkaSaja(b.isian.value); };
  b.periksa = function () {
    const v = b.nilai();
    if (!v) return true;
    const ok = desimal ? /^\d+(\.\d{1,2})?$/.test(v) : /^\d+$/.test(v);
    if (!ok) b.salah(desimal ? 'Tulis angka saja, boleh koma (misalnya 90,5).' : 'Tulis angka bulat saja.');
    return ok;
  };
  return b;
}

/** Isian dengan saran di bawahnya. cari(ketikan) -> daftar { n, k }; saatPilih(item) dipanggil saat saran diketuk. */
function isianSaran(id, label, keterangan, nilai, placeholder, cari, saatPilih) {
  const t = bidangTeks(id, label, keterangan, nilai, { autocomplete: 'off', autocapitalize: 'words', maxlength: '60', placeholder: placeholder });
  pasangRapi(t.isian, function (v) { return rapiJudul_(v, false); });
  const saran = el('div', { class: 'saran-wilayah' });
  t.wadah.insertBefore(saran, t.wadah.querySelector('.pesan-salah'));
  let nomor = 0;
  function tampil() {
    const ke = ++nomor;
    const q = t.isian.value;
    muatWilayah().then(function () {
      if (ke !== nomor) return;
      kosongkan(saran);
      cari(q).forEach(function (x) {
        saran.append(el('button', { type: 'button', class: 'saran-baris', onclick: function () {
          nomor++;
          kosongkan(saran);
          saatPilih(x);
        } }, el('strong', { text: x.n }), x.k ? el('span', { class: 'redup', text: x.k }) : null));
      });
    });
  }
  t.isian.addEventListener('input', tampil);
  t.isian.addEventListener('blur', function () { setTimeout(function () { nomor++; kosongkan(saran); }, 250); });
  return t;
}

/**
 * Area properti (penjual): "Area" (kelurahan, kecamatan, kompleks) + "Kota".
 * Mengetik sebagian nama area memunculkan saran dari daftar wilayah baku; memilihnya mengisi kotanya.
 * Pembeli (kotaSaja): cukup kota. Tersimpan sebagai "Area, Kota" atau "Kota".
 */
function bidangArea(id, label, keterangan, nilai, kotaSaja) {
  muatWilayah();
  const awalDetail = kotaSaja ? '' : detailDariArea(nilai);
  const awalKota = kotaSaja ? kotaDariArea(nilai) : (nilai && nilai.indexOf(',') >= 0 ? kotaDariArea(nilai) : '');
  const sendiri = (!kotaSaja && nilai && nilai.indexOf(',') < 0) ? nilai : '';   // data lama tanpa koma
  let detail = null;
  const sarankanKota = function (q) {
    const pakai = daftarArea(false).map(function (a) { return kotaDariArea(a); }).filter(Boolean)
      .filter(function (v, i, d) { return d.indexOf(v) === i; }).map(function (k) { return { n: k, nn: norm(k) }; });
    const dasar = WILAYAH.data ? WILAYAH.data.kota : [];
    const sudah = {};
    return cariSaran(pakai.concat(dasar), q).filter(function (x) { if (sudah[x.nn]) return false; sudah[x.nn] = true; return true; });
  };
  const kota = isianSaran(id + 'Kota', kotaSaja ? label : 'Kota', kotaSaja ? keterangan : 'Pilih dari saran', awalKota,
    'Contoh: Jakarta Selatan, Depok, Bogor', sarankanKota, function (x) { kota.isian.value = x.n; peringatan(); });
  if (!kotaSaja) {
    detail = isianSaran(id, label, keterangan, awalDetail || sendiri, 'Contoh: Bintaro, Bojongsari, Daan Mogot',
      function (q) {
        const dasar = WILAYAH.data ? WILAYAH.data.area : [];
        return cariSaran(areaPernah().concat(dasar), q).filter(function (x, i, d) {
          return d.findIndex(function (y) { return y.nn === x.nn && y.k === x.k; }) === i;
        });
      },
      function (x) { detail.isian.value = x.n; if (x.k) kota.isian.value = x.k; peringatan(); });
  }
  const catatan = el('p', { class: 'kecil teks-aksen tersembunyi', text: 'Isi kotanya juga supaya bisa dicocokkan dengan pembeli.' });
  function peringatan() { catatan.classList.toggle('tersembunyi', !(detail && detail.isian.value.trim() && !kota.isian.value.trim())); }
  if (detail) { detail.isian.addEventListener('input', peringatan); kota.isian.addEventListener('input', peringatan); }
  // Data lama tanpa koma yang ternyata nama kota: pindahkan ke kolom kota.
  if (sendiri) muatWilayah().then(function (w) {
    if (!w) return;
    const kk = kunciKota(sendiri);
    if (w.kota.some(function (k) { return kunciKota(k.n) === kk; }) && !kota.isian.value) { kota.isian.value = sendiri; detail.isian.value = ''; peringatan(); }
  });
  kota.isian.addEventListener('blur', function () {
    const nn = norm(kota.isian.value);
    const sama = WILAYAH.data && WILAYAH.data.kota.filter(function (k) { return k.nn === nn; })[0];
    if (sama) kota.isian.value = sama.n;
  });
  return {
    wadah: el('div', { class: detail ? 'kotak-area' : '' }, detail ? detail.wadah : null, kota.wadah, catatan),
    nilai: function () {
      const d = detail ? rapiJudul_(detail.isian.value, false) : '';
      const k = rapiJudul_(kota.isian.value, false);
      return gabungArea(d, k);
    }
  };
}

function sibukPerbarui(t, sibuk) {
  t.disabled = sibuk;
  t.setAttribute('aria-label', sibuk ? 'Sedang memperbarui' : 'Perbarui data');
  kosongkan(t);
  t.append(ikon('ulang', sibuk ? 'berputar' : ''));
}

function tombolSimpanSibuk(t, sibuk) {
  t.disabled = sibuk;
  kosongkan(t);
  if (sibuk) t.append(el('span', { text: 'Menyimpan...' }));
  else t.append(ikon('centang'), el('span', { text: 'Simpan' }));
}

/* ════════════════════════════════════════════════════════════
   LISTING (v5.0): PEMBACA PESAN WHATSAPP
   Tanpa AI dan tanpa biaya: hanya aturan tulisan. Isian yang kurang yakin
   ditandai (ragu) supaya tampil kuning dan dicek oleh agen.
   ════════════════════════════════════════════════════════════ */

const LISTING_STATUS = ['Baru', 'Sudah dihubungi', 'Ada pembeli', 'Deal', 'Batal'];
const LISTING_SELESAI = ['Deal', 'Batal'];
const LS_KANTOR = /\b(gp\b|gading ?pro|ray ?white|era ?house|era\b|century ?21|c21|re\/?max|remax|pinhome|coldwell|propnex|dreamhouse|erahouse|leads|realty|sinar ?mas ?land|smart ?agent|rumah ?123|lamudi|jaya ?real|properti|property)\b/i;
const LS_HP = /(?:\+?62|0)\s?8[\d\s.\-]{7,14}\d/g;
const LS_UANG_KATA = /(harga|hrg|price|open|budget|nett?|ask|nego|jual|rp|max|maks|dp)/i;

/** "1.200" -> 1200 ; "72,5" -> 72.5 ; "2.5" -> 2.5 */
function angkaID(s) {
  s = String(s || '').trim().replace(/[.,]+$/, '');
  if (!s) return NaN;
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) return Number(s.replace(/\./g, '').replace(',', '.'));
  if (/^\d+,\d+$/.test(s)) return Number(s.replace(',', '.'));
  if (/^\d+(\.\d+)?$/.test(s)) return Number(s);
  return NaN;
}

const LS_KATA_ANGKA = { satu: 1, dua: 2, tiga: 3, empat: 4, lima: 5, enam: 6, tujuh: 7 };

function satuanUang(u) {
  u = String(u || '').toLowerCase();
  if (/^(miliar|milyar|milliar|m|b)$/.test(u)) return 1e9;
  if (/^(juta|jt|j)$/.test(u)) return 1e6;
  if (/^(ribu|rb|k)$/.test(u)) return 1e3;
  return 0;
}

/** Semua kandidat uang pada satu baris. Hasil: [{ nilai, skor }] */
function uangDiBaris(baris) {
  const hasil = [];
  const adaKata = LS_UANG_KATA.test(baris);
  const re = /(?:rp\.?\s*)?(\d[\d.,]*)\s*(?:(?:-|–|s\/d|sd|sampai|hingga)\s*(?:rp\.?\s*)?(\d[\d.,]*)\s*)?(miliar|milyar|milliar|juta|jt|ribu|rb|m|b|j|k)?(?![a-z0-9²])/gi;
  let m;
  while ((m = re.exec(baris))) {
    const adaRp = /rp\.?\s*$/i.test(baris.slice(0, m.index + (m[0].match(/^rp\.?\s*/i) || [''])[0].length)) || /^rp/i.test(m[0]);
    const unit = m[3] || '';
    const sat = satuanUang(unit);
    const panjang = /^(miliar|milyar|milliar|juta|jt|ribu|rb)$/i.test(unit);
    let nilai = NaN, rentang = false;
    if (sat && (panjang || adaKata || /^[MB]$/.test(unit))) {
      const mentahAngka = m[2] || m[1];
      const a = (sat >= 1e9 && /^\d{1,2}\.\d{3}$/.test(mentahAngka)) ? parseFloat(mentahAngka) : angkaID(mentahAngka);
      nilai = a * sat;
      rentang = !!m[2];
    } else if (!sat && adaRp) {
      const a = angkaID(m[1]);
      if (a >= 1e6) nilai = a;
    }
    if (!isFinite(nilai) || nilai < 1e6 || nilai > 1e14) continue;
    hasil.push({ nilai: Math.round(nilai), skor: (adaKata ? 2 : 0) + (adaRp ? 1 : 0), rentang: rentang });
  }
  return hasil;
}

function pecahLokasi(t) {
  let s = ' ' + String(t || '') + ' ';
  const daftar = [
    [/\bjak(?:arta)?\.? ?sel(?:atan)?\b/i, 'Jakarta Selatan'], [/\bjak(?:arta)?\.? ?bar(?:at)?\b/i, 'Jakarta Barat'],
    [/\bjak(?:arta)?\.? ?ut(?:ara)?\b/i, 'Jakarta Utara'], [/\bjak(?:arta)?\.? ?pus(?:at)?\b/i, 'Jakarta Pusat'],
    [/\bjak(?:arta)?\.? ?tim(?:ur)?\b/i, 'Jakarta Timur'], [/\btang\.? ?sel(?:atan)?\b|\btangerang selatan\b/i, 'Tangerang Selatan'],
    [/\bkab(?:upaten)?\.? tangerang\b/i, 'Kab. Tangerang'], [/\bkota tangerang\b/i, 'Kota Tangerang'],
    [/\bdepok\b/i, 'Depok'], [/\b(?:kota )?bekasi\b/i, 'Kota Bekasi'], [/\b(?:kota )?bogor\b/i, 'Kota Bogor'],
    [/\bsurabaya\b/i, 'Surabaya'], [/\b(?:kota )?bandung\b/i, 'Kota Bandung'], [/\b(?:kota )?semarang\b/i, 'Kota Semarang']
  ];
  let kota = '';
  for (let i = 0; i < daftar.length && !kota; i++) {
    if (daftar[i][0].test(s)) { kota = daftar[i][1]; s = s.replace(daftar[i][0], ' '); }
  }
  if (!kota && /\btangerang\b/i.test(s) && /\b(cikupa|balaraja|cisauk|tigaraksa|curug|legok|panongan|jambe|kelapa dua|gading serpong|pagedangan)\b/i.test(s)) { kota = 'Kab. Tangerang'; s = s.replace(/\btangerang\b/i, ' '); }
  if (!kota && /\b(?:gading serpong|summarecon serpong|paramount|scientia)\b/i.test(s)) kota = 'Kab. Tangerang';
  if (!kota && /\b(?:pamulang|ciputat|serpong|bsd|pondok aren|alam sutera)\b/i.test(s)) kota = 'Tangerang Selatan';
  s = s.replace(/\b(?:di|lokasi|strategis|premium)\b/gi, ' ').replace(/\bjakarta\b\s*$/i, ' ');
  const area = s.replace(/[,;]+/g, ' ').replace(/\s+-\s+$|^\s+-\s+/g, ' ').replace(/\s+/g, ' ').replace(/^[\s-]+|[\s-]+$/g, '');
  return { lokasi: area && kota ? area + ', ' + kota : (kota || area), kota: !!kota };
}

function bersihkanTeks(t) {
  return String(t || '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE0F}‍‎‏]/gu, ' ')
    .replace(/[*_~`]/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/ +\n/g, '\n');
}

/** Hasil: { nilai: {...isian}, ragu: { namaIsian: true }, catatan: 'teks' } */
function bacaListing(mentah) {
  const ragu = {};
  const catatan = [];
  // Harga lama yang dicoret (~1.8M~) tidak dipakai sebagai harga, hanya dicatat.
  const tautan = [];
  let teks = String(mentah || '').replace(/https?:\/\/(?!(?:api\.)?wa\.me)\S+/gi, function (u) { tautan.push('Link: ' + u.replace(/[).,;*_]+$/, '')); return ' '; }).replace(/(^|\s)~([^\s~]+)~(?=\s|$)/g, function (x, a1, v) { catatan.push('Harga lama (dicoret): ' + v); return a1; });
  teks = bersihkanTeks(teks).trim().slice(0, 4000);
  const nilai = {
    tipe: 'stok', nama: '', jenis: '', tawar: '', lokasi: '', luas_tanah: '', luas_bangunan: '', lantai: '',
    kamar_tidur: '', kamar_mandi: '', sertifikat: '', menghadap: '', harga: '', nego: '', panjang_tanah: '', lebar_tanah: '',
    agen_nama: '', agen_kantor: '', agen_hp: ''
  };

  // Kepala pesan WhatsApp salinan: "[10.15, 2/11/2026] Juan Tan: ..." atau "02/11/2026 10.15 - Juan Tan: ..."
  let pengirim = '';
  teks = teks.split('\n').map(function (b, i) {
    const m = /^\s*\[[^\]]{4,40}\]\s*([^:\n]{2,40}):\s*(.*)$/.exec(b) || /^\s*\d{1,2}\/\d{1,2}\/\d{2,4},?\s+\d{1,2}[.:]\d{2}\s*-\s*([^:\n]{2,40}):\s*(.*)$/.exec(b);
    if (m && i < 3) { if (!pengirim) pengirim = m[1].trim(); return m[2]; }
    return b;
  }).join('\n');

  teks = teks.replace(/^\s*(forwarded|diteruskan)\s*$/gim, '');
  // Harga lama yang dicoret (~1.8M~): tidak dipakai sebagai harga, hanya dicatat.
  teks = teks.replace(/\(?\s*(?:spek(?:ifikasi)?\s+)?bangunan\s*(?:pxl|p\s*x\s*l|ukuran|dimensi)\s*[:=]?\s*(\d[\d.,]*)\s*[x×]\s*(\d[\d.,]*)\s*(?:m|meter)?\s*\)?/gi, function (x, p1, l1) { catatan.push('P × L bangunan: ' + p1 + ' x ' + l1 + ' m'); return ' '; });
  // Nomor HP dan tautan dikeluarkan dulu supaya angkanya tidak terbaca sebagai harga atau luas.
  const nomor = [];
  teks = teks.replace(/(?:https?:\/\/)?(?:api\.)?wa\.me\/(?:send\?phone=)?(\+?\d{9,16})\S*/gi, function (x, d) { nomor.push(d); return ' ◆ '; });
  teks = teks.replace(LS_HP, function (x) {
    const d = x.replace(/\D/g, '');
    if (d.length >= 9 && d.length <= 15) { nomor.push(d); return ' ◆ '; }
    return x;
  });
  teks = teks.replace(/https?:\/\/\S+/gi, ' ');
  const baris = teks.split('\n').map(function (b) { return b.trim(); }).filter(Boolean);
  const semua = baris.join('\n');
  const kecil = semua.toLowerCase();

  /* ── jual / sewa / dicari ── */
  const tanpaButuhUang = kecil.replace(/butuh (uang|cepat|dana)/g, ' ');
  const cariRe = /\b(wtb|wtr|wtl|dicari|dicarikan|dibutuhkan|butuh|mencari|looking for|wanted|cari)\b/;
  const dicari = cariRe.test(tanpaButuhUang);
  const sewaRe = /\b(disewa|disewakan|sewa|dikontrakkan|dikontrak|kontrak|for rent|rent|wtr)\b/;
  const jualRe = /\b(dijual|jual|wts|for sale|forsale|open listing|ol)\b/;
  if (dicari) {
    nilai.tipe = 'dicari';
    nilai.tawar = /\bwtr\b/.test(kecil) || (sewaRe.test(kecil) && !/\bwtb\b|\bbeli\b/.test(kecil)) ? 'sewa' : 'jual';
    if (/\b(wtb|wtr|dicari|dibutuhkan)\b/.test(kecil) === false) ragu.tipe = true;
  } else {
    nilai.tipe = 'stok';
    const s = sewaRe.test(kecil), j = jualRe.test(kecil);
    if (s && !j) nilai.tawar = 'sewa';
    else if (j && !s) nilai.tawar = 'jual';
    else if (j && s) { nilai.tawar = 'jual'; ragu.tawar = true; }
    else { nilai.tawar = 'jual'; ragu.tawar = true; }
  }

  /* ── luas ── */
  let dasar = kecil;
  const ambilLuas = function (v) { const n = angkaID(v); return isFinite(n) && n >= 1 && n <= 1e7 ? String(n) : ''; };
  let m = /(?:lt|l\.t\.?)\s*\/\s*(?:lb|l\.b\.?)\s*[:=.\-]?\s*(\d[\d.,]*)\s*(?:m2|m²|m)?\s*(?:an)?\s*[\/x]\s*(\d[\d.,]*)/.exec(dasar);
  if (m) {
    nilai.luas_tanah = ambilLuas(m[1]); nilai.luas_bangunan = ambilLuas(m[2]);
    dasar = dasar.replace(m[0], ' ');
  }
  m = /(?:dimensi|ukuran|pxl|p\s*x\s*l|panjang\s*[x×]\s*lebar)\s*(?:tanah)?\s*[:=]?\s*(\d+(?:[.,]\d+)?)\s*(?:m|meter|mtr)?\s*[x×]\s*(\d+(?:[.,]\d+)?)/.exec(dasar);
  if (m) {
    nilai.panjang_tanah = ambilLuas(m[1]); nilai.lebar_tanah = ambilLuas(m[2]);
    dasar = dasar.replace(m[0], ' ');
  }
  if (!nilai.luas_tanah) {
    // ukuran 7x15 (kali) atau 7x15 = 105
    m = /(?:\blt\b|\bl\.t\.?|luas tanah|tanah|surface|land)\s*[:=.\-]?\s*(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+(?:[.,]\d+)?)(?:\s*=\s*(\d[\d.,]*))?/.exec(dasar);
    if (m) {
      if (!nilai.panjang_tanah) { nilai.panjang_tanah = ambilLuas(m[1]); nilai.lebar_tanah = ambilLuas(m[2]); }
      if (m[3]) nilai.luas_tanah = ambilLuas(m[3]);
      else { nilai.luas_tanah = ambilLuas(String(Math.round(angkaID(m[1]) * angkaID(m[2]) * 100) / 100)); ragu.luas_tanah = true; }
      dasar = dasar.replace(m[0], ' ');
    }
  }
  if (!nilai.luas_tanah) {
    m = /(?:\blt\b|\bl\.t\.?|luas tanah|luas lahan|surface|land)\s*[:=.\-]?\s*(?:min|max|minimal|maks|±|~|sekitar|kurang lebih)?\s*(\d[\d.,]*)\s*(?:an)?\s*(?:m2|m²|m\b|meter|mtr)?/.exec(dasar);
    if (m) { nilai.luas_tanah = ambilLuas(m[1]); dasar = dasar.replace(m[0], ' '); }
  }
  if (!nilai.luas_bangunan) {
    m = /(?:\blb\b|\bl\.b\.?|luas bangunan|building)\s*[:=.\-]?\s*(?:±|~|sekitar|kurang lebih)?\s*(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+(?:[.,]\d+)?)(?:\s*=\s*(\d[\d.,]*))?/.exec(dasar);
    if (m) {
      if (m[3]) nilai.luas_bangunan = ambilLuas(m[3]);
      else { nilai.luas_bangunan = ambilLuas(String(Math.round(angkaID(m[1]) * angkaID(m[2]) * 100) / 100)); ragu.luas_bangunan = true; }
      dasar = dasar.replace(m[0], ' ');
    }
  }
  if (!nilai.luas_bangunan) {
    m = /(?:\blb\b|\bl\.b\.?|luas bangunan|bangunan|building)\s*[:=.\-]?\s*(?:±|~|sekitar|kurang lebih)?\s*(\d[\d.,]*)\s*(?:an)?\s*(?:m2|m²|m\b|meter|mtr)?/.exec(dasar);
    if (m) { nilai.luas_bangunan = ambilLuas(m[1]); dasar = dasar.replace(m[0], ' '); }
  }

  if (!nilai.luas_tanah) {
    m = /\bluas\s*[:=.\-]?\s*(?:±|~|sekitar)?\s*(\d[\d.,]*)\s*(?:an)?\s*(?:m2|m²|meter)/.exec(dasar);
    if (m) { nilai.luas_tanah = ambilLuas(m[1]); dasar = dasar.replace(m[0], ' '); }
  }

  if (!nilai.luas_tanah) {
    // "TANAH 1.200 m2": angka luas tanpa label, hanya dipakai bila satu-satunya
    const semuaLuas = [];
    const reL = /(\d[\d.,]*)\s*(?:an)?\s*(?:m2|m²)\b/g;
    let y;
    while ((y = reL.exec(dasar))) semuaLuas.push(y);
    if (semuaLuas.length === 1) { nilai.luas_tanah = ambilLuas(semuaLuas[0][1]); dasar = dasar.replace(semuaLuas[0][0], ' '); ragu.luas_tanah = true; }
  }

  /* ── lantai ── */
  m = /(\d)\s*(?:lantai|lanta|tingkat|floors?)\b/.exec(dasar) || /\b(?:lantai|tingkat)\s*[:=]?\s*(\d)\b/.exec(dasar);
  if (m) { nilai.lantai = m[1]; dasar = dasar.replace(m[0], ' '); }
  else {
    m = /\b(satu|dua|tiga|empat|lima)\s*(?:lantai|tingkat)\b/.exec(dasar);
    if (m) { nilai.lantai = String(LS_KATA_ANGKA[m[1]]); dasar = dasar.replace(m[0], ' '); }
  }

  /* ── kamar tidur dan kamar mandi ── */
  const bukanJarak = function (teksDasar, idx, panjang) {
    const sebelum = teksDasar.slice(Math.max(0, idx - 14), idx);
    const sesudah = teksDasar.slice(idx + panjang, idx + panjang + 12);
    return !/(jarak|±|sekitar|dekat)\s*$/.test(sebelum) && !/^\s*(dari|ke|menuju|from|arah|menit)/.test(sesudah);
  };
  m = /\bkt\s*\/\s*km\s*[:=]?\s*(\d+)\s*[\/+]\s*(\d+)/.exec(dasar) || /(\d+)\s*[\/+]\s*(\d+)\s*(?:kt\s*\/\s*km|k\.?t\s*\/\s*k\.?m)\b/.exec(dasar);
  if (m) { nilai.kamar_tidur = m[1]; nilai.kamar_mandi = m[2]; dasar = dasar.replace(m[0], ' '); }
  if (!nilai.kamar_tidur) {
    m = /(?:\bkt\b|\bk\.t\.?|kamar tidur|kmr\.? ?tidur|bedrooms?|\bbr\b|\bbed\b)[ \t]*[:=.\-]?[ \t]*(\d+)(?:\s*\+\s*(\d+))?/.exec(dasar)
      || /(\d+)(?:\s*\+\s*(\d+))?\s*(?:kt\b|kamar tidur|bedrooms?|\bbr\b|\bbed\b)/.exec(dasar);
    if (m) {
      nilai.kamar_tidur = m[1];
      if (m[2]) catatan.push('KT ' + m[1] + '+' + m[2]);
      dasar = dasar.replace(m[0], ' ');
    }
  }
  if (!nilai.kamar_mandi) {
    const re1 = /(?:\bkm\b|\bk\.m\.?|kamar mandi|kmr\.? ?mandi|bathrooms?|\bbath\b)[ \t]*[:=.\-]?[ \t]*(\d+)(?:\s*\+\s*(\d+))?/g;
    const re2 = /(\d+)(?:\s*\+\s*(\d+))?\s*(?:km\b|kamar mandi|kmr\.? ?mandi|bathrooms?|\bbath\b)/g;
    [re1, re2].some(function (re) {
      let x;
      while ((x = re.exec(dasar))) {
        if (!bukanJarak(dasar, x.index, x[0].length)) continue;
        nilai.kamar_mandi = x[1];
        if (x[2]) catatan.push('KM ' + x[1] + '+' + x[2]);
        dasar = dasar.replace(x[0], ' ');
        return true;
      }
      return false;
    });
  }

  /* ── sertifikat ── */
  const sert = [];
  if (/\b(shm|sertifikat hak milik|sertipikat hak milik)\b/.test(kecil)) sert.push('SHM');
  if (/\b(shgb|hgb|hak guna bangunan)\b/.test(kecil)) sert.push('HGB');
  if (/\bajb\b/.test(kecil)) sert.push('AJB');
  if (/\b(girik|petok|letter c)\b/.test(kecil)) sert.push('Girik');
  if (/\bstrata( title)?\b/.test(kecil)) sert.push('Lainnya: Strata title');
  if (/\bhak pakai\b/.test(kecil)) sert.push('Lainnya: Hak pakai');
  if (/\bppjb\b/.test(kecil) && !sert.some(function (x) { return x !== 'AJB'; })) { sert.length = 0; sert.push('Lainnya: PPJB'); ragu.sertifikat = true; }
  if (sert.length) { nilai.sertifikat = sert[0]; if (sert.length > 1) ragu.sertifikat = true; }

  /* ── menghadap ── */
  m = /(?:menghadap|hadap|facing)\s*[:=]?\s*(timur ?laut|barat ?daya|barat ?laut|tenggara|utara|selatan|timur|barat)/.exec(kecil);
  if (m) {
    const k = m[1].replace(/\s+/g, '');
    nilai.menghadap = { timurlaut: 'Timur Laut', baratdaya: 'Barat Daya', baratlaut: 'Barat Laut', tenggara: 'Tenggara', utara: 'Utara', selatan: 'Selatan', timur: 'Timur', barat: 'Barat' }[k] || '';
  }

  /* ── jenis ── */
  const bersih = kecil.replace(/luas (tanah|bangunan)|tanah (dan|&) bangunan|tanah\s*\/\s*bangunan/g, ' ');
  const kandidat = [];
  const tambahJenis = function (re, nama) { const x = re.exec(bersih); if (x) kandidat.push({ pos: x.index, nama: nama }); };
  tambahJenis(/\b(ruko|rukan|rumah toko|ruang usaha)\b/, 'Ruko');
  tambahJenis(/\b(rumah|hunian|townhouse|villa|vila|cluster)\b/, 'Rumah');
  tambahJenis(/\b(tanah|kavling|kav|lahan)\b/, 'Tanah');
  tambahJenis(/\b(apartemen|apartment|apt)\b/, 'Lainnya: Apartemen');
  tambahJenis(/\b(gudang)\b/, 'Lainnya: Gudang');
  tambahJenis(/\b(kantor)\b/, 'Lainnya: Kantor');
  tambahJenis(/\b(pabrik)\b/, 'Lainnya: Pabrik');
  tambahJenis(/\b(kos|kost)\b/, 'Lainnya: Kos');
  kandidat.sort(function (a, b) { return a.pos - b.pos; });
  if (kandidat.length) {
    nilai.jenis = kandidat[0].nama;
    if (kandidat.length > 1 && kandidat[1].nama !== kandidat[0].nama) {
      // "rumah" + "ruko" bersamaan, atau "rumah" + "tanah" (tanah kosong disebut belakangan) -> cukup minta dicek
      if (!(kandidat[0].nama === 'Rumah' && kandidat[1].nama === 'Tanah')) ragu.jenis = true;
    }
  } else if (nilai.luas_bangunan) { nilai.jenis = 'Rumah'; ragu.jenis = true; }
  else if (nilai.luas_tanah) { nilai.jenis = 'Tanah'; ragu.jenis = true; }
  if (/Apartemen/.test(nilai.jenis) && nilai.luas_tanah && !nilai.luas_bangunan) { nilai.luas_bangunan = nilai.luas_tanah; nilai.luas_tanah = ''; delete ragu.luas_tanah; ragu.luas_bangunan = true; }
  if (nilai.jenis === 'Tanah' && nilai.luas_bangunan) { nilai.jenis = 'Rumah'; ragu.jenis = true; }

  /* ── harga ── */
  let calon = [];
  baris.forEach(function (b) {
    uangDiBaris(b.replace(/\b(lt|lb|kt|km)\b\s*\d[\d.,]*/gi, ' ')).forEach(function (u) { calon.push(u); });
  });
  if (calon.length) {
    const tinggi = Math.max.apply(null, calon.map(function (c) { return c.skor; }));
    const teratas = calon.filter(function (c) { return c.skor === tinggi; });
    nilai.harga = String(teratas[0].nilai);
    const beda = {};
    teratas.forEach(function (c) { beda[c.nilai] = true; });
    const semuaBeda = {};
    calon.forEach(function (c) { semuaBeda[c.nilai] = true; });
    if (Object.keys(beda).length > 1 || (tinggi < 2 && Object.keys(semuaBeda).length > 1)) ragu.harga = true;
    if (teratas[0].rentang) ragu.harga = true;
  }
  if (/\b(no ?nego|nonego|harga pas|fix price|fix)\b/.test(kecil) || /\bnett?\b/.test(kecil)) nilai.nego = 'tidak';
  else if (/\bnego\b|\bnegotiable\b|\bbisa nego\b|\bnego tipis\b/.test(kecil)) nilai.nego = 'ya';
  if (nilai.tawar === 'sewa' && nilai.harga) {
    if (/(\/|per ?)\s*(tahun|thn)|pertahun|per tahun/.test(kecil)) catatan.push('Harga sewa per tahun');
    else if (/(\/|per ?)\s*(bulan|bln)|perbulan|per bulan/.test(kecil)) catatan.push('Harga sewa per bulan');
    else ragu.harga = true;
  }

  /* ── judul dan lokasi ── */
  const sapaan = /^(assalam|halo|hai\b|hi\b|selamat|permisi|bismillah|dear|mohon|ijin|izin|share|salam|sore|pagi|siang|malam|info para|rekan|rekans|yth|yth|numpang|up\b|update)/i;
  const dataBaris = /^(lt|lb|l\.t|l\.b|kt|km|harga|hrg|price|shm|hgb|ajb|hadap|menghadap|contact|kontak|hub|hubungi|cp|call|wa\b|whatsapp|lokasi|alamat|area|luas|lantai|listrik|air|nego|note|catatan|ket|keterangan|fasilitas|sertifikat|legalitas|surat|\d|◆)/i;
  let judul = '';
  let judulDipotong = false;
  let idxJudul = -1;
  let judulAsli = '';
  const awalanRe0 = /^(?:(?:new|hot|ready|open|special|exclusive|urgent|info|update|promo)\s+)*(?:listing|dijual(?:\s+cepat)?|disewakan|dikontrakkan|dicari|dibutuhkan|wts|wtb|wtr|wtl|jual|sewa|cari|mencari|butuh|turun harga|price drop)\b[\s:!\-–.,]*/i;
  for (let i = 0; i < baris.length; i++) {
    const b = baris[i].replace(/^[^A-Za-z0-9]+/, '').trim();
    if (!b) continue;
    const awalUnit = /^\d+\s*(?:unit|br|bed(?:room)?s?)\b[\s,.:-]*/i;
    const b2 = awalUnit.test(b) ? b.replace(awalUnit, '') : b;
    if (b2 === b && (sapaan.test(b) || dataBaris.test(b))) continue;
    // baris semboyan ("DIJUAL RUGI", "BARANG LANGKA", "(dibawah hrg NJOP)") bukan judul
    let sisa = b2;
    for (let q = 0; q < 4; q++) sisa = sisa.replace(awalanRe0, '');
    sisa = sisa.replace(/[\s!.:*-]+$/, '');
    if (!sisa || /^(\(|rugi\b|barang langka|murah|banting|cuan|siap huni$|bu\b)/i.test(sisa)) continue;
    judul = b2;
    judulAsli = b2;
    idxJudul = i;
    break;
  }
  const awalanRe = /^(?:(?:new|hot|ready|open|special|exclusive|urgent|info|update|promo)\s+)*(?:listing|dijual(?:\s+cepat)?|disewakan|dikontrakkan|dicari|dibutuhkan|wts|wtb|wtr|wtl|jual|sewa|cari|mencari|butuh|bu|turun harga|price drop)\b[\s:!\-–.,]*/i;
  for (let i = 0; i < 3; i++) { const j2 = judul.replace(awalanRe, ''); if (j2 === judul) break; judul = j2; }
  judul = judul.replace(/◆/g, ' ').replace(/\s+/g, ' ').trim();
  // Pesan yang ditulis satu baris panjang: judul dipotong sebelum data teknis.
  const potong = /[,;]|(?<!\b(?:jl|jln|no|gg|kav|rt|rw|dr|ir|pt|cv))\.(?=\s|$)|\s(?:lt|lb|kt|km|br|harga|hrg|open|budget|max|maks|shm|hgb|hadap|nego|hub|hubungi|info|contact)\b/i.exec(judul.slice(4));
  if (potong) judul = judul.slice(0, 4 + potong.index);
  judul = judul.replace(/[\s:!\-–.,]+$/, '').trim();
  if (judul.length > 110) { judul = judul.slice(0, 110).replace(/\s+\S*$/, ''); judulDipotong = true; }
  if (judul) { nilai.nama = judul; if (judulDipotong || judul.length < 10) ragu.nama = true; }
  else { ragu.nama = true; }

  m = /(?:lokasi|alamat|area|loc|location|daerah)\s*[:=\-]\s*([^\n◆]{3,100})/i.exec(semua);
  if (m) nilai.lokasi = m[1].replace(/[\s.,;]+$/, '').trim();
  else if (judul) {
    // "Rumah di NAMA PERUMAHAN, Daerah - Daerah, dekat ...": daerahnya ada setelah koma pertama
    const dk = /\bdi\s+[^,\n]+,\s*([A-Za-z][A-Za-z .]{2,30}?)(?:\s+-\s+[A-Za-z .]+?)?\s*(?=,|\bdekat\b|$)/i.exec(judulAsli);
    if (dk && pecahLokasi(dk[1]).kota) nilai.lokasi = dk[1].trim();
    const d = /\b(?:di|daerah|area)\s+([A-Za-z][A-Za-z .]{2,40}?)(?=\s+\d|\s+(?:budget|bud|max|maks|harga|lt|lb|kt|km|shm|hgb|br)\b|[,;]|$)/i.exec(judul);
    if (nilai.lokasi) { /* sudah dari daerah setelah koma */ }
    else if (d) nilai.lokasi = d[1].trim();
    else {
      const d2 = /\b(?:di|daerah)\s+([A-Za-z][A-Za-z ]{2,40}?)(?=\s+(?:budget|bud|max|maks|harga|lt|lb|kt|km|shm|hgb)\b|[,.]|$)/i.exec(semua.split('\n').find(function (b) { return /\bdi\s+[A-Za-z]/i.test(b); }) || '');
      if (d2) nilai.lokasi = d2[1].trim();
    }
    if (!nilai.lokasi || /^lokasi\s/i.test(nilai.lokasi)) {
      const d3 = /\b(?:di|daerah|area)\s+([A-Za-z][A-Za-z0-9 .,\-]{2,80})$/i.exec(judulAsli.replace(/[\s!.:*]+$/, ''));
      if (d3) nilai.lokasi = d3[1].trim();
    }
    nilai.lokasi = nilai.lokasi.replace(/^lokasi\s+(?:premium|strategis|bagus)\s+/i, '');
  }
  if (!nilai.lokasi && judulAsli) {
    const seg = judulAsli.split(/\s+[-–]\s+/);
    if (seg.length >= 2) nilai.lokasi = seg.slice(1).join(' - ');
  }
  if (nilai.lokasi) { const pl = pecahLokasi(nilai.lokasi); nilai.lokasi = pl.lokasi; if (!pl.kota) ragu.lokasi = true; }
  if (!nilai.nama && nilai.jenis) nilai.nama = namaJenis(nilai.jenis) + (nilai.lokasi ? ' ' + nilai.lokasi : '');

  /* ── agen ── */
  const hpUnik = [];
  nomor.forEach(function (d) {
    const lokal = d.charAt(0) === '0' ? d : (d.slice(0, 2) === '62' ? '0' + d.slice(2) : d);
    if (hpUnik.indexOf(lokal) < 0) hpUnik.push(lokal);
  });
  if (hpUnik.length) { nilai.agen_hp = hpUnik[hpUnik.length - 1]; if (hpUnik.length > 1) ragu.agen_hp = true; }

  const kontakSumber = '\\b(contact|kontak|hubungi|hub|cp|call|info|wa|whatsapp|booking|marketing|mkt|agen|agent|person|pic|by|from)\\b';
  const rapikanOrang = function (t) {
    return String(t || '').replace(/[()\[\]|•:\/,]+/g, ' ').replace(/\s+-\s+/g, ' ').replace(/^[\s\-–]+|[\s\-–]+$/g, '').replace(/\s+/g, ' ').trim();
  };
  // Bagi "Juan Tan GadingPro Alsut" menjadi nama dan kantor.
  const pisahOrang = function (t) {
    t = rapikanOrang(t);
    if (!t) return null;
    const k = LS_KANTOR.exec(t);
    if (k && k.index > 0) return { nama: t.slice(0, k.index).trim(), kantor: t.slice(k.index).trim() };
    if (k) return { nama: '', kantor: t };
    return { nama: t, kantor: '' };
  };
  let orang = null;
  const dipakai = {};
  if (idxJudul >= 0) dipakai[idxJudul] = true;
  let idxOrang = -1;
  for (let i = baris.length - 1; i >= 0 && !orang; i--) {
    const b = baris[i];
    const adaHp = b.indexOf('◆') >= 0;
    const kata = [];
    let x;
    const re = new RegExp(kontakSumber, 'gi');
    while ((x = re.exec(b))) kata.push({ idx: x.index, akhir: x.index + x[0].length });
    if (!adaHp && !kata.length) continue;
    let segmen;
    if (kata.length) {
      const k = kata[kata.length - 1];
      segmen = b.slice(k.akhir);
      const p = segmen.indexOf('◆');
      if (p >= 0) {
        const depan = segmen.slice(0, p);
        segmen = rapikanOrang(depan) ? depan : segmen.slice(p + 1);
      }
    } else {
      segmen = b.replace(/◆/g, ' ');
    }
    segmen = segmen.replace(/\b(ke|no|nomor|telp|tlp|telepon|hp)\b/gi, ' ');
    let o = pisahOrang(segmen);
    let dari = i;
    if ((!o || (!o.nama && !o.kantor) || /\d/.test(segmen)) && i > 0) {
      const sebelumnya = baris[i - 1];
      if (sebelumnya && !/\d/.test(sebelumnya) && sebelumnya.split(' ').length <= 6 && !dataBaris.test(sebelumnya)) o = pisahOrang(sebelumnya);
      dari = i - 1;
    }
    if (o && (o.nama || o.kantor) && /^[A-Z]/.test(o.nama || o.kantor) && !/\d{3,}/.test(o.nama + o.kantor) && (o.nama + ' ' + o.kantor).trim().split(' ').length <= 6) { orang = o; idxOrang = dari; dipakai[i] = true; dipakai[dari] = true; }
  }
  // Nama di baris sebelum kantor ("Juan Tan" lalu "GadingPro Alsut" lalu nomor).
  if (orang && !orang.nama && idxOrang > 0) {
    const sb = baris[idxOrang - 1];
    if (sb && !/\d/.test(sb) && sb.split(' ').length <= 4 && /^[A-Z]/.test(sb) && !dataBaris.test(sb) && !sapaan.test(sb)) {
      orang.nama = rapikanOrang(sb);
      dipakai[idxOrang - 1] = true;
    }
  }
  if (orang) {
    nilai.agen_nama = orang.nama;
    nilai.agen_kantor = orang.kantor;
    if (orang.nama.split(' ').length > 4) { ragu.agen_nama = true; }
  }
  if (!nilai.agen_nama && pengirim) {
    const o = pisahOrang(pengirim);
    if (o) { nilai.agen_nama = o.nama || o.kantor; if (o.nama && !nilai.agen_kantor) nilai.agen_kantor = o.kantor; }
  }
  if (!nilai.agen_nama) ragu.agen_nama = true;
  if (!nilai.agen_hp) ragu.agen_hp = true;

  if (nilai.tipe === 'stok' && !nilai.harga && !nilai.luas_tanah && !nilai.luas_bangunan) ragu.tipe = true;
  // Keterangan tambahan: baris yang bukan data yang dikenal masuk ke catatan.
  const bukanKeterangan = /^((?:(?:link|video|foto)\b[^:\n]{0,15}|spesifikasi)\s*:?\s*$|lt|l\.t|lb|l\.b|luas|dimensi|ukuran|pxl|kt|km|kamar (tidur|mandi)|kmr\.? ?(tidur|mandi)|harga|hrg|price|open|nett?|nego|hadap|menghadap|shm|hgb|shgb|ajb|girik|sertifikat|legalitas|contact|kontak|hub|hubungi|cp\b|call|info|wa\b|lokasi|alamat|area|dll|rp\b|◆|(bangunan|tanah|lantai)\s*[:=]?\s*\d|\d+\s*(lantai|tingkat|lt|kt|km|m2|m²))/i;
  const sisa = [];
  baris.forEach(function (b, i) {
    if (dipakai[i]) return;
    const t = b.replace(/^[^A-Za-z0-9]+/, '').replace(/◆/g, ' ').replace(/\s+/g, ' ').trim();
    if (t.length < 4 || sapaan.test(t) || bukanKeterangan.test(t)) return;
    sisa.push(t);
  });
  const tambahan = [catatan.join(' · '), tautan.join('\n'), sisa.join('\n')].filter(Boolean).join('\n').slice(0, 1000);
  if (tambahan) nilai.catatan_otomatis = tambahan;
  return { nilai: nilai, ragu: ragu };
}

/* ════════════════════════════════════════════════════════════
   LISTING (v5.0): DATA, PENCOCOKAN, LAYAR
   ════════════════════════════════════════════════════════════ */

function daftarListing() { return (S.data && S.data.listing) || []; }
function cariListing(id) { return daftarListing().find(function (l) { return l.id_listing === id; }) || null; }
function listingSelesai(l) { return LISTING_SELESAI.indexOf(l.status) >= 0; }
/** Jumlah listing yang masih berstatus Baru (belum disentuh). Dipakai lencana merah. Selalu dihitung dari data terkini. */
function jumlahListingBaru(tipe) {
  let n = daftarListing().filter(function (l) { return (l.status || 'Baru') === 'Baru' && (!tipe || l.tipe === tipe); }).length;
  if (S.data && S.data.sisaListing) S.data.sisaListing.forEach(function (x) { if (x.baru && (!tipe || x.tipe === tipe)) n++; });
  return n;
}

/** 2.7: listing yang baru diambil dari server dimasukkan ke daftar dan keluar dari "belum dimuat". */
function gabungListingBaru(daftar, kunci) {
  let baru = 0;
  (daftar || []).forEach(function (l) {
    (kunci || []).forEach(function (k) { if (!(k in l)) l[k] = ''; });
    if (S.data.sisaListing) S.data.sisaListing.delete(l.id_listing);
    if (!S.data.listing.some(function (x) { return x.id_listing === l.id_listing; })) { S.data.listing.push(l); baru++; }
  });
  return baru;
}

function umurListingHari(l) {
  const t = Date.parse(String(l.dibuat_pada || '').replace(' ', 'T') + '+07:00');
  return isFinite(t) ? Math.max(0, Math.floor((Date.now() - t) / 86400000)) : 0;
}
function teksUmurListing(l) {
  const n = umurListingHari(l);
  return n === 0 ? 'Masuk hari ini' : 'Masuk ' + n + ' hari lalu';
}
/** Mulai tampil 40; sisanya ditambah otomatis saat digulir (tanpa tombol). */
function daftarBertahap(daftar, buat, wadah) {
  const BATCH = 40;
  let n = 0, pengamat = null;
  const penanda = el('div', { class: 'penanda-bertahap', 'aria-hidden': 'true' });
  function lagi() {
    daftar.slice(n, n + BATCH).forEach(function (x) { wadah.insertBefore(buat(x), penanda); });
    n += BATCH;
    if (n >= daftar.length) { if (pengamat) pengamat.disconnect(); penanda.remove(); }
    else if (pengamat) { pengamat.unobserve(penanda); pengamat.observe(penanda); }
  }
  wadah.append(penanda);
  lagi();
  if (n < daftar.length) {
    if ('IntersectionObserver' in window) {
      pengamat = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) lagi(); }, { rootMargin: '800px' });
      pengamat.observe(penanda);
    } else { while (n < daftar.length) lagi(); }
  }
  return wadah;
}

function teksCariListing(l) { return norm([l.nama, l.lokasi, l.agen_nama, l.agen_kantor, l.catatan, l.jenis].join(' ')); }

function hargaListingTeks(l) {
  if (!l.harga) return l.tipe === 'dicari' ? 'Budget belum ditulis' : 'Harga belum ditulis';
  const dasar = rupiahPendek(l.harga);
  if (l.tipe === 'dicari') return 'Budget s/d ' + dasar;
  return dasar + (l.nego === 'ya' ? ' · nego' : l.nego === 'tidak' ? ' · harga pas' : '');
}

function ringkasListing(l) {
  const bit = [];
  if (l.jenis) bit.push(namaJenis(l.jenis));
  if (l.luas_tanah) bit.push('LT ' + angkaTampil(l.luas_tanah));
  if (l.luas_bangunan) bit.push('LB ' + angkaTampil(l.luas_bangunan));
  if (l.panjang_tanah && l.lebar_tanah) bit.push(angkaTampil(l.panjang_tanah) + ' x ' + angkaTampil(l.lebar_tanah) + ' m');
  if (l.lantai) bit.push(l.lantai + ' lantai');
  if (l.kamar_tidur) bit.push('KT ' + l.kamar_tidur);
  if (l.kamar_mandi) bit.push('KM ' + l.kamar_mandi);
  if (l.sertifikat) bit.push(l.sertifikat.replace(/^Lainnya: ?/, ''));
  if (l.menghadap) bit.push('Hadap ' + l.menghadap.toLowerCase());
  return bit.join(' · ');
}

function namaAgenListing(l) {
  return [l.agen_nama, l.agen_kantor].filter(Boolean).join(' · ');
}

function pesanWaListing(l) {
  const sapa = 'Halo' + (l.agen_nama ? ' ' + l.agen_nama : '') + ', saya ' + CONFIG.NAMA_PEMILIK + '. ';
  if (l.tipe === 'dicari') return sapa + 'Soal yang dicari "' + l.nama + '": saya ada properti yang mungkin cocok. Boleh saya kirim infonya?';
  return sapa + 'Listing "' + l.nama + '" masih tersedia? Saya ada klien yang tertarik.';
}

/* ── Pencocokan listing dengan pembeli dan properti sendiri ── */

function kotaCocokTeks(kotaArea, teks) {
  const kunci = kunciKota(kotaDariArea(kotaArea));
  return !!kunci && norm(teks).indexOf(kunci) >= 0;
}

/** Stok agen lain -> pembeli Pudji yang sedang mencari. Hasil: { cocok: [k], mungkin: [{k, alasan}] } */
function pembeliUntukListing(l) {
  const hasil = { cocok: [], mungkin: [] };
  if (l.tipe !== 'stok') return hasil;
  const tawarSewa = l.tawar === 'sewa';
  const teks = [l.nama, l.lokasi, l.catatan].join(' ');
  daftarKlien().forEach(function (k) {
    if (k.peran !== 'Pembeli' || (k.status_beli || 'Mencari') !== 'Mencari' || !punyaKebutuhan(k)) return;
    if (k.kebutuhan_cara === 'Beli' && tawarSewa) return;
    if (k.kebutuhan_cara === 'Sewa' && !tawarSewa) return;
    const meleset = [];
    if (k.kebutuhan_jenis) {
      if (!l.jenis) meleset.push('Jenis belum jelas');
      else if (jenisDasar(k.kebutuhan_jenis) !== jenisDasar(l.jenis)) return;
    }
    if (k.kebutuhan_area && !kotaCocokTeks(k.kebutuhan_area, teks)) meleset.push('Area belum jelas');
    if (k.budget && l.harga) {
      const sewaTahun = tawarSewa && /per bulan/.test(l.catatan || '') ? Number(l.harga) * 12 : Number(l.harga);
      if (sewaTahun > Number(k.budget)) {
        const lebih = sewaTahun / Number(k.budget) - 1;
        if (lebih > CONFIG.BATAS_BUDGET_ALT) return;
        meleset.push('Agak di atas budget');
      }
    }
    if (!meleset.length) hasil.cocok.push(k);
    else if (meleset.length === 1) hasil.mungkin.push({ k: k, alasan: meleset[0] });
  });
  hasil.cocok.sort(function (a, b) { return urutNama(a, b, 'nama'); });
  return hasil;
}

/** Permintaan agen lain (dicari) -> properti Pudji yang dipasarkan. Hasil: { cocok: [pr], mungkin: [{pr, alasan}] } */
function propertiUntukListing(l) {
  const hasil = { cocok: [], mungkin: [] };
  if (l.tipe !== 'dicari') return hasil;
  const sewa = l.tawar === 'sewa';
  const teks = [l.nama, l.lokasi, l.catatan].join(' ');
  S.data.properti.forEach(function (pr) {
    if (!dipasarkan(pr)) return;
    if (sewa && !pr.disewakan) return;
    if (!sewa && !pr.dijual) return;
    const meleset = [];
    if (l.jenis) {
      if (jenisDasar(l.jenis) !== jenisDasar(pr.jenis)) return;
    }
    if (l.lokasi || l.nama) {
      if (!(kotaCocokTeks(pr.area, teks) || (pr.area && norm(teks).indexOf(norm(detailDariArea(pr.area))) >= 0 && detailDariArea(pr.area)))) meleset.push('Area belum jelas');
    }
    if (l.harga) {
      const harga = sewa ? hargaBerlaku(pr.harga_sewa, pr.harga_sewa_promo) * (pr.satuan_sewa === 'bulan' ? 12 : 1) : hargaBerlaku(pr.harga_jual, pr.harga_jual_promo);
      const budget = sewa && /per bulan/.test(l.catatan || '') ? Number(l.harga) * 12 : Number(l.harga);
      if (harga > budget) {
        if (harga / budget - 1 > CONFIG.BATAS_BUDGET_ALT) return;
        meleset.push('Agak di atas budget');
      }
    }
    if (!meleset.length) hasil.cocok.push(pr);
    else if (meleset.length === 1) hasil.mungkin.push({ pr: pr, alasan: meleset[0] });
  });
  return hasil;
}

function daftarKlien() { return (S.data && S.data.klien) || []; }

/** Chip kecil "Cocok: Pak Bayu" (maksimal 2 nama, sisanya "+n"). */
function chipCocokListing(l) {
  const nama = [];
  if (l.tipe === 'stok') pembeliUntukListing(l).cocok.forEach(function (k) { nama.push(k.nama); });
  else propertiUntukListing(l).cocok.forEach(function (pr) { nama.push(pr.nama_properti); });
  if (!nama.length) return null;
  const tampil = nama.slice(0, 2).join(', ') + (nama.length > 2 ? ' +' + (nama.length - 2) : '');
  return el('span', { class: 'chip chip-cocok', text: 'Cocok: ' + tampil });
}

/* ── Daftar Listing ── */

function layarListing(isi, p) {
  kepala({ judul: 'Listing', nav: 'listing' });
  const F = { tab: p.tab === 'dicari' ? 'dicari' : 'stok', q: p.q || '', selesai: !!p.selesai };
  isi.append(
    el('p', { class: 'redup', text: 'Salin pesan dari grup WhatsApp, lalu tekan tombol di bawah. Aplikasi membacakan isinya ke formulir.' }),
    el('button', { type: 'button', class: 'tombol tombol-tempel', onclick: tempelDariWa }, ikon('tempel'), el('span', { text: 'Tempel dari WA' })),
    el('div', { class: 'tempel-bantu' },
      el('button', { type: 'button', class: 'tautan', onclick: function () { buka('formListing', { mode: 'baru', id: idBaru('l'), teks: '' }); } }, el('span', { text: 'Isi sendiri' })),
      el('span', { class: 'kecil redup', text: 'Pesan berupa gambar belum bisa dibaca otomatis. Pakai Isi sendiri.' })));
  const wadah = el('div', { class: 'jarak-atas' });
  isi.append(wadah);
  const input = el('input', { class: 'isian', type: 'search', 'aria-label': 'Cari listing', autocomplete: 'off', maxlength: '60', placeholder: 'Cari nama, lokasi, atau agen' });
  input.value = F.q;

  function gambar() {
    pasangNav('listing');   // lencana menu ikut data terbaru
    const aktifKeyword = norm(input.value);
    kosongkan(wadah);
    wadah.append(segmen([
      { kode: 'stok', label: 'Stok', lencana: jumlahListingBaru('stok') },
      { kode: 'dicari', label: 'Dicari', lencana: jumlahListingBaru('dicari') }
    ], F.tab, function (kode) { F.tab = kode; gantiParam({ tab: kode }); gambar(); }));
    wadah.append(el('div', { class: 'jarak-atas-kecil' }, input));
    wadah.append(barisSaring('Status', [{ kode: '', label: 'Belum selesai' }, { kode: 'selesai', label: 'Deal / Batal' }], F.selesai ? 'selesai' : '', function (k) {
      F.selesai = k === 'selesai'; gantiParam({ selesai: F.selesai }); gambar();
    }));
    const semua = daftarListing().filter(function (l) { return l.tipe === F.tab; });
    const daftar = semua.filter(function (l) {
      if (listingSelesai(l) !== F.selesai) return false;
      return !aktifKeyword || teksCariListing(l).indexOf(aktifKeyword) >= 0;
    }).sort(function (a, b) { return String(b.dibuat_pada).localeCompare(String(a.dibuat_pada)); });
    wadah.append(el('p', { class: 'redup jarak-atas-kecil', 'aria-live': 'polite', text: daftar.length + ' listing' + (aktifKeyword ? ' ditemukan' : '') }));
    if (aktifKeyword && F.totalCari > 100) wadah.append(el('p', { class: 'kecil redup', text: 'Menampilkan 100 teratas dari ' + F.totalCari + '. Ketik kata kunci yang lebih khusus.' }));
    const sisaN = S.data.sisaListing ? S.data.sisaListing.size : 0;
    const tombolMuat = !sisaN || aktifKeyword ? null : el('button', { type: 'button', class: 'tombol tombol-kedua jarak-atas-kecil', onclick: async function () {
      tombolMuat.disabled = true; kosongkan(tombolMuat); tombolMuat.append(el('span', { text: 'Memuat...' }));
      try {
        const j = await panggil('ambilListingBanyak', { ids: Array.from(S.data.sisaListing.keys()).slice(0, 300) });
        if (j.ok) gabungListingBaru(j.data.listing, j.data.skema);
        else { tombolMuat.disabled = false; kosongkan(tombolMuat); tombolMuat.append(el('span', { text: 'Belum bisa memuat. Coba lagi' })); return; }
      } catch (e) {
        if (e instanceof GalatSesi) return;
        tombolMuat.disabled = false; kosongkan(tombolMuat); tombolMuat.append(el('span', { text: 'Periksa internet, lalu coba lagi' })); return;
      }
      gambar();
    } }, el('span', { text: 'Muat lebih banyak (' + sisaN + ' lagi)' }));
    if (!daftar.length) {
      wadah.append(el('div', { class: 'kartu kosong' },
        el('p', { class: 'tebal', text: semua.length ? 'Tidak ada yang cocok dengan pilihan ini.' : (F.tab === 'stok' ? 'Belum ada stok.' : 'Belum ada yang dicari.') }),
        semua.length ? null : el('p', { class: 'redup', text: 'Tekan Tempel dari WA untuk mulai.' })));
      return;
    }
    wadah.append(daftarBertahap(daftar, kartuListing, el('div')));
    if (tombolMuat) wadah.append(tombolMuat);
  }
  let jedaCari = 0;
  function cariDiServer(q) {
    clearTimeout(jedaCari);
    if (!S.data.sisaListing || !S.data.sisaListing.size || norm(q).length < 2) { F.totalCari = 0; return; }
    jedaCari = setTimeout(async function () {
      try {
        const j = await panggil('cariListing', { q: q.trim() });
        if (!j.ok || input.value !== q) return;
        F.totalCari = j.data.total || 0;
        const baru = gabungListingBaru(j.data.listing, j.data.skema);
        if (baru || F.totalCari > 100) {
          const fokusAwal = document.activeElement === input;
          gambar();
          if (fokusAwal) { input.focus(); const n = input.value.length; try { input.setSelectionRange(n, n); } catch (e) { /* abaikan */ } }
        }
      } catch (e) { /* tanpa internet: hasil dari data yang sudah ada tetap tampil */ }
    }, 500);
  }
  input.addEventListener('input', function () {
    gantiParam({ q: input.value });
    cariDiServer(input.value);
    // hanya daftar yang digambar ulang supaya ketikan tidak hilang fokus
    const fokusAwal = document.activeElement === input;
    gambar();
    if (fokusAwal) { input.focus(); const n = input.value.length; try { input.setSelectionRange(n, n); } catch (e) { /* abaikan */ } }
  });
  gambar();
}

function labelDesakListing(l) {
  const t = ((l.nama || '') + ' ' + (l.catatan || '')).toLowerCase();
  if (/\b(dijual|jual) rugi\b|banting harga|turun harga|price drop/.test(t)) return 'Dijual rugi';
  if (/\b(dijual|disewakan|dikontrakkan) cepat\b|butuh cepat|urgent/.test(t)) return /sewa|kontrak/.test(t) && !/\bdijual\b/.test(t) ? 'Disewakan cepat' : 'Dijual cepat';
  return '';
}

/** Satu pembeli: listing agen lain (stok) yang cocok. Aturannya sama dengan pembeliUntukListing. */
function kartuListingCocok(k) {
  if ((k.status_beli || 'Mencari') !== 'Mencari' || !punyaKebutuhan(k)) return null;
  const hasil = [];
  (S.data.listing || []).forEach(function (l) {
    if (l.tipe !== 'stok' || listingSelesai(l)) return;
    const sewa = l.tawar === 'sewa';
    if ((k.kebutuhan_cara === 'Beli' && sewa) || (k.kebutuhan_cara === 'Sewa' && !sewa)) return;
    if (k.kebutuhan_jenis && (!l.jenis || jenisDasar(k.kebutuhan_jenis) !== jenisDasar(l.jenis))) return;
    if (k.kebutuhan_area && !kotaCocokTeks(k.kebutuhan_area, [l.nama, l.lokasi, l.catatan].join(' '))) return;
    if (k.budget && l.harga) {
      const h = sewa && /per bulan/.test(l.catatan || '') ? Number(l.harga) * 12 : Number(l.harga);
      if (h > Number(k.budget)) return;
    }
    hasil.push(l);
  });
  if (!hasil.length) return null;
  const kotak = el('section', { class: 'kartu kartu-hijau kartu-cocok jarak-atas-kecil', 'aria-label': 'Listing yang cocok' });
  kotak.append(el('h2', { class: 'judul-kartu' }, ikon('cocok'), hasil.length + ' listing agen cocok'),
    el('p', { class: 'kecil redup', text: 'Dari menu Listing (stok agen lain). Ketuk untuk membuka.' }),
    el('div', { class: 'daftar' }, hasil.slice(0, 5).map(kartuListing)));
  if (hasil.length > 5) kotak.append(el('p', { class: 'kecil redup', text: 'Menampilkan 5 dari ' + hasil.length + '. Sisanya ada di menu Listing.' }));
  return kotak;
}

/* ── Gambar promo listing (dari agen lain; dipakai apa adanya, tanpa watermark) ── */

const GAMBAR_LISTING_MAKS = 3;
const MINI_LISTING = {};            // kode listing -> gambar kecil (data:...) untuk kartu
const ANTRE_MINI_LST = { ids: [], pasang: {}, jadwal: 0 };

function jumlahGambarListing(l) { return Number(l.gambar_n) || 0; }

function isiMini(wadah, src) {
  wadah.style.backgroundImage = 'url("' + src + '")';
  wadah.classList.add('siap');
}

/** Kotak gambar kecil di atas kartu; gambarnya diminta ke server berkelompok, tidak satu per satu. */
function wadahMiniListing(l) {
  const n = jumlahGambarListing(l);
  if (!n) return null;
  const w = el('span', { class: 'listing-mini', 'aria-hidden': 'true' },
    n > 1 ? el('span', { class: 'listing-mini-n' }, ikon('gambar', 'ikon-mini'), el('span', { text: String(n) })) : null);
  if (MINI_LISTING[l.id_listing]) { isiMini(w, MINI_LISTING[l.id_listing]); return w; }
  (ANTRE_MINI_LST.pasang[l.id_listing] = ANTRE_MINI_LST.pasang[l.id_listing] || []).push(w);
  if (ANTRE_MINI_LST.ids.indexOf(l.id_listing) < 0) ANTRE_MINI_LST.ids.push(l.id_listing);
  clearTimeout(ANTRE_MINI_LST.jadwal);
  ANTRE_MINI_LST.jadwal = setTimeout(jalankanAntreMini, 150);
  return w;
}

async function jalankanAntreMini() {
  while (ANTRE_MINI_LST.ids.length) {
    const ids = ANTRE_MINI_LST.ids.splice(0, 24);
    let hasil = {};
    try {
      const j = await panggil('ambilMiniListing', { ids: ids });
      if (j.ok) hasil = j.data.mini || {};
    } catch (e) { /* kartu tetap tampil tanpa gambar */ }
    ids.forEach(function (id) {
      const m = hasil[id];
      if (m) MINI_LISTING[id] = 'data:' + m.mime + ';base64,' + m.gambar;
      (ANTRE_MINI_LST.pasang[id] || []).forEach(function (w) { if (m) isiMini(w, MINI_LISTING[id]); else w.remove(); });
      delete ANTRE_MINI_LST.pasang[id];
    });
  }
}

function lihatGambarBesar(src) {
  const tekan = function (e) { if (e.key === 'Escape') tutup(); };
  const tutup = function () { lapis.remove(); document.removeEventListener('keydown', tekan); };
  const lapis = el('div', { class: 'lihat-gambar', role: 'dialog', 'aria-label': 'Gambar besar', onclick: tutup },
    el('img', { src: src, alt: 'Gambar promo' }),
    el('button', { type: 'button', class: 'lihat-gambar-tutup', 'aria-label': 'Tutup', onclick: tutup }, ikon('silang')));
  document.addEventListener('keydown', tekan);
  document.body.append(lapis);
}

/** Bagian "Gambar dari agen" di rincian listing: lihat, tambah, hapus, bagikan. */
function bagianGambarListing(l, wb) {
  const wadah = el('div', { class: 'gambar-listing' });
  const st = S.layar;
  let blobs = [];
  const jumlah = function () { return jumlahGambarListing(l); };
  const catatJumlah = function (n) {
    l.gambar_n = n || '';
    const d = cariListing(l.id_listing);
    if (d) d.gambar_n = n || '';
    delete MINI_LISTING[l.id_listing];
  };
  const unduhSemua = function (files) {
    files.forEach(function (f, i) {
      setTimeout(function () {
        const a = el('a', { href: URL.createObjectURL(f), download: f.name });
        document.body.append(a);
        a.click();
        a.remove();
      }, i * 400);
    });
  };

  function gambarUlang() {
    kosongkan(wadah);
    blobs = [];
    const n = jumlah();
    const kisi = el('div', { class: 'gambar-kisi' + (n ? '' : ' tersembunyi') });
    const kotak = [];
    for (let i = 0; i < n; i++) {
      const img = el('img', { alt: 'Gambar promo ' + (i + 1) });
      const k = el('div', { class: 'gambar-kotak' }, img,
        el('button', { type: 'button', class: 'gambar-hapus', 'aria-label': 'Hapus gambar ' + (i + 1), onclick: function () { hapus(i); } }, ikon('silang', 'ikon-mini')));
      kotak.push({ k: k, img: img });
      kisi.append(k);
    }
    const masukan = el('input', { type: 'file', accept: 'image/*', multiple: true, class: 'tersembunyi', tabindex: '-1', 'aria-hidden': 'true' });
    masukan.addEventListener('change', function () { tambah(masukan.files); });
    const tombolTambah = n < GAMBAR_LISTING_MAKS ? el('button', { type: 'button', class: 'tambah-gambar', onclick: function () { masukan.value = ''; masukan.click(); } },
      el('span', { class: 'tambah-gambar-ikon' }, ikon('gambar')),
      el('span', { class: 'tengah' }, el('span', { class: 'tambah-gambar-judul', text: 'Tambah gambar' }), el('span', { class: 'tambah-gambar-sub', text: 'Pilih dari galeri · maksimal ' + GAMBAR_LISTING_MAKS }))) : null;
    const tombolBagi = n ? tombol('tombol-kedua', 'bagikan', 'Bagikan gambar', function () { bagikan(tombolBagi); }) : null;
    wadah.append(kisi);
    if (tombolTambah) wadah.append(tombolTambah);
    if (tombolBagi) wadah.append(tombolBagi);
    wadah.append(masukan);

    (async function () {
      for (let i = 0; i < n; i++) {
        try {
          const j = await panggil('ambilGambarListing', { id_listing: l.id_listing, nomor: i });
          if (S.layar !== st) return;
          if (j.ok) {
            const b = base64KeBlob(j.data.gambar, 'image/jpeg');
            blobs[i] = b;
            const u = URL.createObjectURL(b);
            kotak[i].img.src = u;
            kotak[i].img.onclick = function () { lihatGambarBesar(u); };
            kotak[i].k.classList.add('siap');
          } else kotak[i].k.classList.add('galat');
        } catch (e) {
          if (e instanceof GalatSesi) return;
          if (kotak[i]) kotak[i].k.classList.add('galat');
        }
      }
    })();
  }

  async function tambah(daftarFile) {
    const file = Array.prototype.slice.call(daftarFile || []).slice(0, GAMBAR_LISTING_MAKS - jumlah());
    if (!file.length) return;
    S.sibuk = true;
    tampilMemuat('Menyiapkan gambar...');
    let gagal = 0;
    try {
      for (let i = 0; i < file.length; i++) {
        ubahTeksMemuat('Mengunggah gambar ' + (i + 1) + ' dari ' + file.length + '...');
        try {
          const h = await kecilkanGambar(file[i], CONFIG.FOTO_SISI_MAKS, 0.82);
          const j = await panggil('unggahGambarListing', { id_listing: l.id_listing, nomor: jumlah(), gambar: await blobKeBase64(h.blob) });
          if (j.ok) catatJumlah(j.data.gambar_n); else gagal++;
        } catch (e) {
          if (e instanceof GalatSesi) throw e;
          gagal++;
        }
      }
    } catch (e) { tutupMemuat(); S.sibuk = false; return; }
    tutupMemuat();
    S.sibuk = false;
    if (S.layar !== st) return;
    gambarUlang();
    if (gagal) tampilBanner(wb, { jenis: 'waspada', judul: gagal + ' gambar belum terunggah', pesan: 'Periksa internet, lalu coba lagi.' });
  }

  async function hapus(i) {
    if (!(await konfirmasi('Hapus gambar ini?', 'Gambar dihapus dari listing ini dan tidak bisa dikembalikan.', 'Ya, hapus', 'tombol-bahaya-penuh'))) return;
    S.sibuk = true;
    tampilMemuat('Menghapus gambar...');
    try {
      const j = await panggil('hapusGambarListing', { id_listing: l.id_listing, nomor: i });
      tutupMemuat();
      S.sibuk = false;
      if (S.layar !== st) return;
      if (j.ok) { catatJumlah(j.data.gambar_n); gambarUlang(); return; }
      tampilBanner(wb, { jenis: 'gagal', judul: 'Gambar belum terhapus', pesan: j.pesan });
    } catch (e) {
      tutupMemuat();
      S.sibuk = false;
      if (e instanceof GalatSesi) return;
      tampilBanner(wb, { jenis: 'waspada', judul: 'Hasil belum pasti', pesan: 'Koneksi terputus. Periksa internet, lalu lihat lagi daftar gambarnya.' });
    }
  }

  async function bagikan(t) {
    const ada = blobs.filter(Boolean);
    if (!ada.length) { umumkan('Gambar belum selesai dimuat.'); return; }
    const dasar = (l.nama || 'Listing').replace(/[^\w\- ]+/g, '').trim();
    const files = ada.map(function (b, i) { return new File([b], dasar + ' ' + (i + 1) + '.jpg', { type: 'image/jpeg' }); });
    if (!(navigator.canShare && navigator.canShare({ files: files }))) { unduhSemua(files); return; }
    t.disabled = true;
    t.querySelector('span').textContent = 'Membuka menu...';
    try {
      await navigator.share({ files: files });
    } catch (e) {
      if (!e || e.name !== 'AbortError') unduhSemua(files);
    } finally {
      t.disabled = false;
      t.querySelector('span').textContent = 'Bagikan gambar';
    }
  }

  gambarUlang();
  return wadah;
}

function kartuListing(l) {
  const spesifikasi = ringkasListing(l);
  const cocok = chipCocokListing(l);
  return el('button', { type: 'button', class: 'kartu kartu-listing', onclick: function () { buka('detailListing', { id: l.id_listing }); } },
    wadahMiniListing(l),
    el('span', { class: 'listing-judul', text: l.nama }),
    l.lokasi ? el('span', { class: 'sub', text: l.lokasi }) : null,
    spesifikasi ? el('span', { class: 'sub', text: spesifikasi }) : null,
    el('span', { class: 'listing-harga', text: hargaListingTeks(l) }),
    namaAgenListing(l) ? el('span', { class: 'sub', text: 'Agen: ' + namaAgenListing(l) }) : null,
    el('span', { class: 'sub' + (umurListingHari(l) >= 30 ? ' sub-lama' : ''), text: teksUmurListing(l) + (umurListingHari(l) >= 30 && !listingSelesai(l) ? '. Hapus kalau sudah tidak berlaku.' : '') }),
    el('span', { class: 'baris-chip' }, chip(l.status || 'Baru', l.status || 'Baru'), labelDesakListing(l) ? chip('desak', labelDesakListing(l)) : null, cocok));
}

/* ── Tempel dari WA ── */

async function tempelDariWa() {
  let teks = '';
  try {
    if (navigator.clipboard && navigator.clipboard.readText) teks = await navigator.clipboard.readText();
  } catch (e) { teks = ''; }
  teks = String(teks || '').trim();
  if (teks.length < 20 || !/\d/.test(teks)) {
    teks = await dialogTempel(teks);
    if (!teks) return;
  }
  buka('formListing', { mode: 'baru', id: idBaru('l'), teks: teks.slice(0, 4000) });
}

function dialogTempel(awal) {
  const area = el('textarea', { class: 'isian', rows: '8', maxlength: '4000', 'aria-label': 'Pesan dari WhatsApp', placeholder: 'Tekan lama di sini, lalu pilih Tempel.' });
  area.value = awal || '';
  return pilihDialog({
    judul: 'Tempel pesan di sini',
    pesan: 'Aplikasi tidak bisa mengambil salinan otomatis. Tekan lama di kotak, pilih Tempel, lalu tekan Baca pesan.',
    isi: area,
    pilihan: [{ nilai: 'baca', teks: 'Baca pesan', kelas: 'tombol-utama', ikon: 'centang', periksa: function () { return !!area.value.trim(); } }]
  }).then(function (h) { return h === 'baca' ? area.value.trim() : ''; });
}

/* ── Formulir listing (baru dari tempelan, isi sendiri, atau ubah) ── */

const ISIAN_LISTING_KOSONG = {
  tipe: 'stok', nama: '', jenis: '', tawar: '', lokasi: '', luas_tanah: '', luas_bangunan: '', panjang_tanah: '', lebar_tanah: '', lantai: '', kamar_tidur: '', kamar_mandi: '',
  sertifikat: '', menghadap: '', harga: '', nego: '', agen_nama: '', agen_kantor: '', agen_hp: '', komisi_kesepakatan: '', catatan: ''
};

function layarFormListing(isi, p) {
  const ubah = p.mode === 'ubah';
  const lama = ubah ? cariListing(p.id) : null;
  if (ubah && !lama) return tidakAda();
  if (!ubah && !/^l[0-9a-f]{32}$/.test(p.id || '')) { gantiParam({ id: idBaru('l') }); p = S.layar.param; }
  const idListing = ubah ? lama.id_listing : p.id;
  const hasil = !ubah && p.teks ? bacaListing(p.teks) : null;
  const v = Object.assign({}, ISIAN_LISTING_KOSONG, ubah ? lama : (hasil ? hasil.nilai : {}));
  if (hasil && hasil.nilai.catatan_otomatis) v.catatan = hasil.nilai.catatan_otomatis;
  const teksAsli = ubah ? '' : (p.teks || '');

  // Isian yang kurang yakin: ditandai pembaca, atau penting tetapi kosong.
  const ragu = Object.assign({}, hasil ? hasil.ragu : {});
  if (hasil) {
    ['nama', 'jenis', 'harga', 'lokasi', 'agen_hp'].forEach(function (k) { if (!v[k]) ragu[k] = true; });
    if (/^(Rumah|Tanah)$/.test(v.jenis) && !v.luas_tanah) ragu.luas_tanah = true;
    if (/^(Rumah|Ruko)$/.test(v.jenis) && !v.luas_bangunan) ragu.luas_bangunan = true;
  }
  const kuning = function (g, kunci) {
    if (!ragu[kunci]) return g;
    g.wadah.classList.add('kuning');
    const lepas = function () { g.wadah.classList.remove('kuning'); };
    g.wadah.addEventListener('input', lepas, { once: true });
    g.wadah.addEventListener('click', lepas, { once: true });
    return g;
  };
  const jumlahKuning = Object.keys(ragu).filter(function (k) { return ragu[k] && k !== 'tipe' && k !== 'tawar'; }).length + (ragu.tawar ? 1 : 0) + (ragu.tipe ? 1 : 0);

  kepala({ judul: ubah ? 'Ubah Listing' : 'Periksa Isian' });
  const wb = el('div', { class: 'jarak-atas-kecil' });
  isi.append(wb);
  if (hasil) {
    isi.append(el('div', { class: 'banner ' + (jumlahKuning ? 'banner-waspada' : 'banner-info'), role: 'status' },
      ikon(jumlahKuning ? 'peringatan' : 'info'),
      el('div', { class: 'tengah' },
        el('span', { class: 'judul', text: jumlahKuning ? 'Ada ' + jumlahKuning + ' isian berwarna kuning' : 'Pesan sudah dibaca' }),
        el('span', { class: 'pesan', text: jumlahKuning ? 'Aplikasi kurang yakin dengan isian ini. Mohon dicek, lalu ubah bila perlu.' : 'Tetap periksa sekali lagi sebelum menyimpan.' }))));
  }

  // Jenis listing dan penawaran
  const labelHarga = function (t) { return t === 'dicari' ? 'Budget maksimal' : 'Harga'; };
  let harga;
  const tipe = kuning(grupPilihan('Ini listing apa?', '', [{ nilai: 'stok', label: 'Stok' }, { nilai: 'dicari', label: 'Dicari' }], v.tipe, function (t) {
    harga.wadah.querySelector('.label span').textContent = labelHarga(t);
    tawar.wadah.querySelector('.label span').textContent = t === 'dicari' ? 'Mau beli atau sewa?' : 'Dijual atau disewakan?';
  }), 'tipe');
  const tawar = kuning(grupPilihan(v.tipe === 'dicari' ? 'Mau beli atau sewa?' : 'Dijual atau disewakan?', 'Boleh kosong', [{ nilai: 'jual', label: v.tipe === 'dicari' ? 'Beli' : 'Dijual' }, { nilai: 'sewa', label: v.tipe === 'dicari' ? 'Sewa' : 'Disewakan' }], v.tawar || null, null, true), 'tawar');
  const nama = kuning(bidangTeks('fLNama', 'Judul', 'Wajib', rapiJudul_(v.nama, false), { autocomplete: 'off', maxlength: '120', placeholder: 'Contoh: Rumah Onyx Boulevard' }), 'nama');
  pasangRapi(nama.isian, function (x) { return rapiJudul_(x, false); });
  const lokasi = kuning(bidangArea('fLLokasi', 'Lokasi', 'Ketik area, pilih dari saran', rapiJudul_(v.lokasi, false)), 'lokasi');

  const awalJenis = v.jenis || '';
  const jenisLain = /^Lainnya: ?/.test(awalJenis);
  const jenisTeks = bidangTeks('fLJenisLain', 'Jenis lainnya', 'Wajib diketik', jenisLain ? awalJenis.replace(/^Lainnya: ?/, '') : '', { autocomplete: 'off', maxlength: '40', placeholder: 'Contoh: Apartemen, Gudang' });
  jenisTeks.wadah.classList.toggle('tersembunyi', !jenisLain);
  jenisTeks.isian.addEventListener('input', function () { jenisTeks.salah(''); });
  const jenis = kuning(grupPilihan('Jenis bangunan', 'Boleh kosong', JENIS_PROP, jenisLain ? 'Lainnya' : (awalJenis || null), function (x) {
    jenisTeks.wadah.classList.toggle('tersembunyi', x !== 'Lainnya');
    if (x === 'Lainnya') jenisTeks.isian.focus();
  }, true), 'jenis');

  harga = kuning(bidangRupiah('fLHarga', labelHarga(v.tipe), 'Boleh kosong', v.harga), 'harga');
  const nego = grupPilihan('Nego?', 'Boleh kosong', [{ nilai: 'ya', label: 'Bisa nego' }, { nilai: 'tidak', label: 'Harga pas' }], v.nego || null, null, true);

  const lt = kuning(bidangAngka('fLLt', 'Luas tanah', 'm²', v.luas_tanah, true), 'luas_tanah');
  const lb = kuning(bidangAngka('fLLb', 'Luas bangunan', 'm²', v.luas_bangunan, true), 'luas_bangunan');
  const pj = bidangAngka('fLPanjang', 'Panjang tanah', 'm', v.panjang_tanah, true);
  const le = bidangAngka('fLLebar', 'Lebar tanah', 'm', v.lebar_tanah, true);
  const lantai = bidangAngka('fLLantai', 'Lantai', '', v.lantai, false);
  const kt = bidangAngka('fLKt', 'Kamar tidur', '', v.kamar_tidur, false);
  const km = bidangAngka('fLKm', 'Kamar mandi', '', v.kamar_mandi, false);

  const awalSert = v.sertifikat || '';
  const sertLain = /^Lainnya: ?/.test(awalSert);
  const sertTeks = bidangTeks('fLSertLain', 'Sertifikat lainnya', 'Wajib diketik', sertLain ? awalSert.replace(/^Lainnya: ?/, '') : '', { autocomplete: 'off', maxlength: '40', placeholder: 'Contoh: Strata title' });
  sertTeks.wadah.classList.toggle('tersembunyi', !sertLain);
  sertTeks.isian.addEventListener('input', function () { sertTeks.salah(''); });
  const sert = kuning(grupPilihan('Sertifikat', 'Boleh kosong', SERTIFIKAT, sertLain ? 'Lainnya' : (awalSert || null), function (x) {
    sertTeks.wadah.classList.toggle('tersembunyi', x !== 'Lainnya');
    if (x === 'Lainnya') sertTeks.isian.focus();
  }, true), 'sertifikat');
  const hadap = grupPilihan('Menghadap', 'Boleh kosong', ARAH_HADAP, v.menghadap || null, null, true);

  const agenNama = kuning(bidangTeks('fLAgen', 'Nama agen', 'Boleh kosong', rapiNama_(v.agen_nama), { autocomplete: 'off', maxlength: '80', placeholder: 'Contoh: Juan Tan' }), 'agen_nama');
  pasangRapi(agenNama.isian, rapiNama_);
  const agenKantor = bidangTeks('fLKantor', 'Kantor agen', 'Boleh kosong', v.agen_kantor, { autocomplete: 'off', maxlength: '80', placeholder: 'Contoh: GadingPro Alsut' });
  const agenHp = kuning(bidangTeks('fLHp', 'Nomor HP agen', 'Untuk menghubungi lewat WhatsApp', v.agen_hp ? formatHp(v.agen_hp) : '', { type: 'tel', inputmode: 'tel', autocomplete: 'off', maxlength: '20', placeholder: 'Contoh: 0812 3456 7890' }), 'agen_hp');
  pasangRapi(agenHp.isian, function (x) { const n = normalHp(x); return hpValid(n) ? formatHp(n) : x; });

  const komisi = bidangTeks('fLKomisi', 'Bagi komisi untuk saya', 'Boleh kosong · isi sesuai kesepakatan dengan agen', v.komisi_kesepakatan, { autocomplete: 'off', maxlength: '80', placeholder: 'Contoh: 50:50' });
  const catatan = bidangTeks('fLCatatan', 'Catatan', 'Boleh kosong', v.catatan, { maxlength: '1000' }, true);
  pasangRapi(catatan.isian, rapiKalimat_);

  // Gambar promo dari agen: hanya untuk listing baru; yang sudah ada diatur dari rincian listing.
  const gambarBaru = [];
  let blokGambar = null;
  if (!ubah) {
    const kisiGambar = el('div', { class: 'gambar-kisi tersembunyi' });
    const masukan = el('input', { type: 'file', accept: 'image/*', multiple: true, class: 'tersembunyi', tabindex: '-1', 'aria-hidden': 'true' });
    const tombolTambah = el('button', { type: 'button', class: 'tambah-gambar', onclick: function () { masukan.value = ''; masukan.click(); } },
      el('span', { class: 'tambah-gambar-ikon' }, ikon('gambar')),
      el('span', { class: 'tengah' }, el('span', { class: 'tambah-gambar-judul', text: 'Tambah gambar' }), el('span', { class: 'tambah-gambar-sub', text: 'Pilih dari galeri · maksimal ' + GAMBAR_LISTING_MAKS })));
    const gambarUlangForm = function () {
      kosongkan(kisiGambar);
      gambarBaru.forEach(function (g, i) {
        kisiGambar.append(el('div', { class: 'gambar-kotak siap' }, el('img', { src: g.url, alt: 'Gambar ' + (i + 1) }),
          el('button', { type: 'button', class: 'gambar-hapus', 'aria-label': 'Buang gambar ' + (i + 1), onclick: function () { URL.revokeObjectURL(g.url); gambarBaru.splice(i, 1); gambarUlangForm(); } }, ikon('silang', 'ikon-mini'))));
      });
      kisiGambar.classList.toggle('tersembunyi', !gambarBaru.length);
      tombolTambah.classList.toggle('tersembunyi', gambarBaru.length >= GAMBAR_LISTING_MAKS);
    };
    masukan.addEventListener('change', async function () {
      const file = Array.prototype.slice.call(masukan.files || []).slice(0, GAMBAR_LISTING_MAKS - gambarBaru.length);
      masukan.value = '';
      let gagal = 0;
      for (let i = 0; i < file.length; i++) {
        try {
          const h = await kecilkanGambar(file[i], CONFIG.FOTO_SISI_MAKS, 0.82);
          gambarBaru.push({ blob: h.blob, url: URL.createObjectURL(h.blob) });
        } catch (e) { gagal++; }
      }
      gambarUlangForm();
      if (gagal) umumkan(gagal + ' gambar tidak bisa dibaca dan dilewati.');
    });
    blokGambar = el('div', { class: 'bidang' },
      el('span', { class: 'label', text: 'Gambar promo dari agen' }),
      el('span', { class: 'keterangan', text: 'Boleh kosong. Dipakai apa adanya, tanpa watermark.' }),
      tombolTambah, kisiGambar, masukan);
  }

  const tombolSimpan = tombol('tombol-utama', 'centang', 'Simpan listing', function () { simpan(); });
  isi.append(tipe.wadah, nama.wadah, jenis.wadah, jenisTeks.wadah, tawar.wadah, lokasi.wadah, harga.wadah, nego.wadah,
    el('div', { class: 'baris-2' }, lt.wadah, lb.wadah),
    el('div', { class: 'baris-2' }, pj.wadah, le.wadah),
    el('div', { class: 'baris-3' }, lantai.wadah, kt.wadah, km.wadah),
    sert.wadah, sertTeks.wadah, hadap.wadah,
    judulBagian('Agen yang memposting'), agenNama.wadah, agenKantor.wadah, agenHp.wadah,
    judulBagian('Komisi'), komisi.wadah, catatan.wadah);
  if (blokGambar) isi.append(blokGambar);
  if (teksAsli) {
    isi.append(el('details', { class: 'lipat' },
      el('summary', {}, ikon('pesan'), el('span', { class: 'tengah' }, el('span', { class: 'judul-lipat', text: 'Pesan asli' }), el('span', { class: 'sub-lipat', text: 'Ketuk untuk membandingkan' }))),
      el('div', { class: 'lipat-isi' }, el('p', { class: 'pre-line kecil', text: teksAsli }))));
  }
  isi.append(tombolSimpan);

  /** Mengunggah gambar yang dipilih sesudah listing tersimpan. Hasil: jumlah gambar yang gagal. */
  async function unggahGambarBaru() {
    let gagal = 0, terunggah = 0;
    tampilMemuat('Mengunggah gambar...');
    try {
      for (let i = 0; i < gambarBaru.length; i++) {
        ubahTeksMemuat('Mengunggah gambar ' + (i + 1) + ' dari ' + gambarBaru.length + '...');
        try {
          const j = await panggil('unggahGambarListing', { id_listing: idListing, nomor: terunggah, gambar: await blobKeBase64(gambarBaru[i].blob) });
          if (j.ok) {
            terunggah = j.data.gambar_n;
            const d = cariListing(idListing);
            if (d) d.gambar_n = terunggah;
          } else gagal++;
        } catch (e) {
          if (e instanceof GalatSesi) throw e;
          gagal++;
        }
      }
    } finally { tutupMemuat(); }
    gambarBaru.forEach(function (g) { URL.revokeObjectURL(g.url); });
    return gagal;
  }

  async function simpan() {
    [nama, agenHp, jenisTeks, sertTeks, lt, lb, pj, le, lantai, kt, km].forEach(function (g) { g.salah(''); });
    tipe.salah('');
    nama.isian.value = rapiJudul_(nama.isian.value, false);
    const nilaiNama = nama.isian.value.trim();
    const hp = normalHp(agenHp.isian.value);
    let pertama = null;
    const tandai = function (g, pesan) { g.salah(pesan); pertama = pertama || g; };
    if (!tipe.nilai()) tandai(tipe, 'Pilih Stok atau Dicari.');
    if (!nilaiNama) tandai(nama, 'Judul wajib diisi.');
    if (hp && !hpValid(hp)) tandai(agenHp, 'Nomor HP harus angka, diawali 0 atau 62, panjang 9 sampai 15 angka.');
    const teksJenis = rapiJudul_(jenisTeks.isian.value, false);
    if (jenis.nilai() === 'Lainnya' && !teksJenis) tandai(jenisTeks, 'Ketik jenis bangunannya.');
    const teksSert = rapiJudul_(sertTeks.isian.value, false);
    if (sert.nilai() === 'Lainnya' && !teksSert) tandai(sertTeks, 'Ketik jenis sertifikatnya.');
    [lt, lb, pj, le, lantai, kt, km].forEach(function (g) { if (!g.periksa()) pertama = pertama || g; });
    if (pertama) {
      if (pertama.fokus) pertama.fokus(); else pertama.isian.focus();
      umumkan('Ada isian yang perlu diperbaiki.');
      return;
    }
    const kirim = {
      mode: ubah ? 'ubah' : 'baru', id_listing: idListing, tipe: tipe.nilai(), nama: nilaiNama,
      jenis: !jenis.nilai() ? '' : jenis.nilai() === 'Lainnya' ? 'Lainnya: ' + teksJenis : jenis.nilai(),
      tawar: tawar.nilai() || '', lokasi: lokasi.nilai(),
      luas_tanah: lt.nilai(), luas_bangunan: lb.nilai(), panjang_tanah: pj.nilai(), lebar_tanah: le.nilai(), lantai: lantai.nilai(), kamar_tidur: kt.nilai(), kamar_mandi: km.nilai(),
      sertifikat: !sert.nilai() ? '' : sert.nilai() === 'Lainnya' ? 'Lainnya: ' + teksSert : sert.nilai(),
      menghadap: hadap.nilai() || '', harga: harga.nilai(), nego: nego.nilai() || '',
      agen_nama: rapiNama_(agenNama.isian.value), agen_kantor: agenKantor.isian.value.trim(), agen_hp: hp,
      komisi_kesepakatan: komisi.isian.value.trim(), status: ubah ? (lama.status || 'Baru') : 'Baru',
      catatan: rapiKalimat_(catatan.isian.value)
    };
    if (!ubah) kirim.teks_asli = teksAsli;
    tombolSimpanSibuk(tombolSimpan, true);
    S.sibuk = true;
    try {
      const j = await panggil('simpanListing', kirim);
      if (j.ok) {
        S.data.listing = S.data.listing || [];
        simpanKeDaftar(S.data.listing, 'id_listing', j.data.listing);
      }
      let gagalGambar = 0;
      if (j.ok && !ubah && gambarBaru.length) gagalGambar = await unggahGambarBaru();
      S.sibuk = false;
      if (j.ok) {
        S.bannerBerikut = gagalGambar
          ? { jenis: 'waspada', judul: 'Listing tersimpan', pesan: gagalGambar + ' gambar belum terunggah. Tambahkan lagi dari rincian listing.' }
          : { jenis: 'sukses', judul: ubah ? 'Perubahan tersimpan' : 'Listing tersimpan', pesan: j.data.listing.nama };
        if (ubah) history.back();
        else buka('detailListing', { id: idListing }, { ganti: true });
        return;
      }
      tampilBanner(wb, { jenis: 'gagal', judul: 'Gagal tersimpan', pesan: j.pesan });
    } catch (e) {
      S.sibuk = false;
      if (e instanceof GalatSesi) return;
      tampilBanner(wb, { jenis: 'waspada', judul: 'Hasil belum pasti', pesan: 'Koneksi terputus saat menyimpan. Periksa internet, lalu tekan Simpan sekali lagi. Data tidak akan tersimpan dobel.' });
    }
    tombolSimpanSibuk(tombolSimpan, false);
    kosongkan(tombolSimpan); tombolSimpan.append(ikon('centang'), el('span', { text: 'Simpan listing' }));
  }
}

/* ── Rincian listing ── */

function layarDetailListing(isi, p) {
  const l = cariListing(p.id);
  if (!l) return tidakAda();
  kepala({ judul: l.tipe === 'dicari' ? 'Dicari' : 'Stok' });
  const wb = el('div', { class: 'jarak-atas-kecil' });
  isi.append(wb);

  const spesifikasi = ringkasListing(l);
  isi.append(el('div', { class: 'kartu' },
    el('h2', { class: 'listing-judul', text: l.nama }),
    l.lokasi ? el('p', { class: 'redup', text: l.lokasi }) : null,
    el('p', { class: 'listing-harga', text: hargaListingTeks(l) }),
    spesifikasi ? el('p', { class: 'redup', text: spesifikasi }) : null,
    l.catatan ? el('p', { class: 'pre-line kecil', text: l.catatan }) : null,
    el('p', { class: 'kecil' + (umurListingHari(l) >= 30 ? ' sub-lama' : ' redup'), text: teksUmurListing(l) + (umurListingHari(l) >= 30 && !listingSelesai(l) ? '. Hapus kalau sudah tidak berlaku.' : '') }),
    el('div', { class: 'baris-chip' }, chipNetral(l.tipe === 'dicari' ? (l.tawar === 'sewa' ? 'Cari sewa' : 'Cari beli') : (l.tawar === 'sewa' ? 'Disewakan' : 'Dijual')))));

  isi.append(judulBagian('Gambar dari agen'), bagianGambarListing(l, wb));

  // Agen dan WhatsApp
  const hpAda = !!l.agen_hp;
  isi.append(judulBagian('Agen'),
    el('div', { class: 'kartu' },
      el('p', { class: 'tebal', text: namaAgenListing(l) || 'Nama agen belum diisi' }),
      el('p', { class: 'redup', text: hpAda ? formatHp(l.agen_hp) : 'Nomor HP belum diisi. Tekan Ubah untuk menambah.' }),
      hpAda ? tautanWa(l.agen_hp, pesanWaListing(l), '', 'Hubungi lewat WhatsApp') : null));

  // Status
  const statusGrup = grupPilihan('Status', '', LISTING_STATUS, l.status || 'Baru', ubahStatus, false, 'baris-2');
  isi.append(judulBagian('Perkembangan'), el('div', { class: 'kartu' }, statusGrup.wadah));
  async function ubahStatus(baru) {
    const sebelumnya = l.status || 'Baru';
    if (baru === sebelumnya) return;
    S.sibuk = true;
    try {
      const j = await panggil('aturListing', { id_listing: l.id_listing, status: baru });
      S.sibuk = false;
      if (j.ok) {
        simpanKeDaftar(S.data.listing, 'id_listing', j.data.listing);
        l.status = j.data.listing.status;
        pasangNav('listing');   // lencana mengikuti status terbaru
        document.getElementById('navBawah').classList.remove('tersembunyi');
        umumkan('Status menjadi ' + baru);
        return;
      }
      statusGrup.atur(sebelumnya);
      tampilBanner(wb, { jenis: 'gagal', judul: 'Status belum tersimpan', pesan: j.pesan });
    } catch (e) {
      S.sibuk = false;
      statusGrup.atur(sebelumnya);
      if (e instanceof GalatSesi) return;
      tampilBanner(wb, { jenis: 'waspada', judul: 'Status belum tersimpan', pesan: 'Koneksi terputus. Periksa internet, lalu coba lagi.' });
    }
  }

  // Komisi kesepakatan
  const komisi = bidangTeks('dLKomisi', 'Bagi komisi untuk saya', 'Boleh kosong · isi sesuai kesepakatan dengan agen', l.komisi_kesepakatan, { autocomplete: 'off', maxlength: '80', placeholder: 'Contoh: 50:50' });
  const tombolKomisi = tombol('tombol-kedua', 'centang', 'Simpan komisi', async function () {
    tombolKomisi.disabled = true;
    S.sibuk = true;
    try {
      const j = await panggil('aturListing', { id_listing: l.id_listing, komisi_kesepakatan: komisi.isian.value.trim() });
      S.sibuk = false;
      if (j.ok) {
        simpanKeDaftar(S.data.listing, 'id_listing', j.data.listing);
        l.komisi_kesepakatan = j.data.listing.komisi_kesepakatan;
        tampilBanner(wb, { jenis: 'sukses', judul: 'Komisi tersimpan', pesan: l.komisi_kesepakatan || 'Dikosongkan.' });
      } else tampilBanner(wb, { jenis: 'gagal', judul: 'Gagal tersimpan', pesan: j.pesan });
    } catch (e) {
      S.sibuk = false;
      if (e instanceof GalatSesi) return;
      tampilBanner(wb, { jenis: 'waspada', judul: 'Hasil belum pasti', pesan: 'Koneksi terputus. Tekan Simpan komisi sekali lagi.' });
    }
    tombolKomisi.disabled = false;
  });
  isi.append(judulBagian('Komisi'), el('div', { class: 'kartu' }, komisi.wadah, tombolKomisi));

  // Yang cocok
  if (l.tipe === 'stok') {
    const h = pembeliUntukListing(l);
    isi.append(judulBagian('Pembeli Anda yang cocok'));
    if (!h.cocok.length && !h.mungkin.length) isi.append(el('p', { class: 'redup', text: 'Belum ada pembeli yang cocok. Pembeli dicocokkan dari jenis, area, dan budget yang Anda isi di data klien.' }));
    else isi.append(el('div', { class: 'daftar' },
      h.cocok.map(function (k) { return barisKlienListing(k, 'Cocok · ' + kebutuhanTeks(k)); }),
      h.mungkin.map(function (x) { return barisKlienListing(x.k, 'Mungkin · ' + x.alasan); })));
  } else {
    const h = propertiUntukListing(l);
    isi.append(judulBagian('Properti Anda yang cocok'));
    if (!h.cocok.length && !h.mungkin.length) isi.append(el('p', { class: 'redup', text: 'Belum ada properti Anda yang cocok dengan permintaan ini.' }));
    else isi.append(el('div', { class: 'daftar' },
      h.cocok.map(function (pr) { return barisPropertiListing(pr, 'Cocok'); }),
      h.mungkin.map(function (x) { return barisPropertiListing(x.pr, 'Mungkin · ' + x.alasan); })));
  }

  const kotakAsli = el('div');
  isi.append(kotakAsli);
  panggil('ambilListing', { id_listing: l.id_listing }).then(function (j) {
    if (!j.ok || !j.data.teks_asli || !kotakAsli.isConnected) return;
    kotakAsli.append(el('details', { class: 'lipat jarak-atas' },
      el('summary', {}, ikon('pesan'), el('span', { class: 'tengah' }, el('span', { class: 'judul-lipat', text: 'Pesan asli' }), el('span', { class: 'sub-lipat', text: 'Ketuk untuk membaca' }))),
      el('div', { class: 'lipat-isi' }, el('p', { class: 'pre-line kecil', text: j.data.teks_asli }))));
  }).catch(function () { /* pesan asli hanya pelengkap */ });

  isi.append(el('div', { class: 'tumpuk jarak-atas' },
    tombol('tombol-kedua', 'pensil', 'Ubah listing', function () { buka('formListing', { mode: 'ubah', id: l.id_listing }); }),
    tombol('tombol-bahaya', 'sampah', 'Hapus listing', hapusListing)));

  async function hapusListing() {
    const ya = await konfirmasi('Hapus listing ini?', 'Listing dihapus permanen dan tidak bisa dipulihkan. Data klien dan properti Anda tidak ikut terhapus.', 'Ya, hapus', 'tombol-bahaya-penuh');
    if (!ya) return;
    tampilMemuat('Menghapus...');
    try {
      const j = await panggil('hapusListing', { id_listing: l.id_listing });
      tutupMemuat();
      if (!j.ok) { tampilBanner(wb, { jenis: 'gagal', judul: 'Gagal menghapus', pesan: j.pesan }); return; }
      S.data.listing = S.data.listing.filter(function (x) { return x.id_listing !== l.id_listing; });
      S.bannerBerikut = { jenis: 'sukses', judul: 'Listing dihapus', pesan: l.nama };
      history.back();
    } catch (e) {
      tutupMemuat();
      if (e instanceof GalatSesi) return;
      tampilBanner(wb, { jenis: 'waspada', judul: 'Hasil belum pasti', pesan: 'Koneksi terputus saat menghapus. Periksa internet, lalu coba lagi.' });
    }
  }
}

function barisKlienListing(k, sub) {
  return el('button', { type: 'button', class: 'baris', onclick: function () { buka('profil', { id: k.id_klien }); } },
    avatar(k.nama), el('span', { class: 'tengah' }, el('span', { class: 'judul', text: k.nama }), el('span', { class: 'sub', text: sub })), ikon('panah', 'panah'));
}

function barisPropertiListing(pr, sub) {
  return el('button', { type: 'button', class: 'baris', onclick: function () { buka('properti', { id: pr.id_properti }); } },
    el('span', { class: 'tengah' }, el('span', { class: 'judul', text: pr.nama_properti }), el('span', { class: 'sub', text: sub + (pr.area ? ' · ' + pr.area : '') })), ikon('panah', 'panah'));
}


/* ── Arsip (v5.1): data lama muncul di pencarian yang sama, diberi label Arsip ── */

/** Gabungkan data arsip ke memori supaya bisa dibuka seperti data biasa. Hilang sendiri saat dimuat ulang. */
function gabungArsip(d) {
  [['klien', 'id_klien'], ['properti', 'id_properti'], ['dokumen', 'id_dokumen']].forEach(function (x) {
    (d[x[0]] || []).forEach(function (o) {
      if (S.data[x[0]].some(function (a) { return a[x[1]] === o[x[1]]; })) return;
      o.arsip = true;
      S.data[x[0]].push(o);
    });
  });
}

function chipArsip() { return el('span', { class: 'chip chip-arsip' }, ikon('arsip', 'ikon-mini'), 'Arsip'); }

/** Cari juga di arsip. Hasil muncul di bawah hasil biasa, di layar dan kotak cari yang sama. */
function cariDiArsip(induk, q, mode, saatAda) {
  const nomor = (induk._arsipNo = (induk._arsipNo || 0) + 1);
  clearTimeout(induk._arsipJeda);
  const wadah = el('div', { class: 'arsip-hasil' });
  induk.append(wadah);
  if (!S.data.jumlahArsip || String(q).trim().length < 2) return;
  wadah.append(el('p', { class: 'kecil redup jarak-atas-kecil', text: 'Mencari juga di arsip...' }));
  induk._arsipJeda = setTimeout(async function () {
    try {
      const j = await panggil('cariArsip', { q: String(q).trim() });
      if (induk._arsipNo !== nomor || !wadah.isConnected) return;
      kosongkan(wadah);
      if (!j.ok) { wadah.append(el('p', { class: 'kecil redup', text: 'Arsip belum bisa dicari sekarang.' })); return; }
      const d = j.data;
      const adaDi = function (daftar, kunci, id) { return daftar.some(function (x) { return x[kunci] === id && !x.arsip; }); };
      const klien = d.klien.filter(function (k) { return d.ketemuKlien.indexOf(k.id_klien) >= 0 && !adaDi(S.data.klien, 'id_klien', k.id_klien); });
      const properti = d.properti.filter(function (p) { return d.ketemuProperti.indexOf(p.id_properti) >= 0 && !adaDi(S.data.properti, 'id_properti', p.id_properti); });
      if (!klien.length && !properti.length) return;
      if (saatAda) saatAda();
      wadah.append(judulBagian('Di arsip (' + (klien.length + properti.length) + ')'),
        el('div', { class: 'daftar' },
          klien.map(function (k) {
            const n = d.properti.filter(function (p) { return p.id_klien === k.id_klien; }).length;
            return el('button', { type: 'button', class: 'baris', onclick: function () { gabungArsip(d); pilihKlienDariCari(mode, cariKlien(k.id_klien)); } },
              avatar(k.nama),
              el('span', { class: 'tengah' }, el('span', { class: 'judul', text: k.nama }), el('span', { class: 'sub', text: k.peran + (k.peran === 'Penjual' ? ' · ' + n + ' properti' : '') }),
                el('span', { class: 'baris-chip' }, chipArsip())),
              ikon('kanan', 'panah'));
          }),
          properti.map(function (pr) {
            return el('button', { type: 'button', class: 'baris', onclick: function () { gabungArsip(d); pilihPropertiDariCari(mode, cariProperti(pr.id_properti)); } },
              el('span', { class: 'tengah' }, el('span', { class: 'judul', text: pr.nama_properti }), el('span', { class: 'sub', text: (pr.area || pr.alamat || namaJenis(pr.jenis)) }),
                el('span', { class: 'baris-chip' }, chipArsip(), chip(progresProp(pr)))),
              ikon('kanan', 'panah'));
          })));
      umumkan((klien.length + properti.length) + ' ditemukan di arsip.');
    } catch (e) {
      if (e instanceof GalatSesi || induk._arsipNo !== nomor || !wadah.isConnected) return;
      kosongkan(wadah);
      wadah.append(el('p', { class: 'kecil redup', text: 'Arsip belum bisa dicari. Periksa internet.' }));
    }
  }, 600);
}

/* ── Klien baru dan ubah klien ── */

/** Klien lain dengan nomor HP sama atau nama sangat mirip. */
function klienMirip(nama, hp, kecualiId) {
  const hpV = varianHp(hp);
  return S.data.klien.filter(function (k) {
    if (k.id_klien === kecualiId) return false;
    const hpSama = hpV.length && varianHp(k.no_hp).some(function (v) { return hpV.indexOf(v) >= 0; });
    return hpSama || namaMirip(nama, k.nama);
  }).slice(0, 4);
}

function layarFormKlien(isi, p) {
  const ubah = p.mode === 'ubah';
  const k = ubah ? cariKlien(p.id) : null;
  if (ubah && !k) return tidakAda();
  if (!ubah && !/^k[0-9a-f]{32}$/.test(p.id || '')) { gantiParam({ id: idBaru('k') }); p = S.layar.param; }
  const idKlien = ubah ? k.id_klien : p.id;
  kepala({ judul: ubah ? 'Ubah Data Klien' : 'Klien Baru' });

  isi.append(el('p', { class: 'redup', text: ubah ? k.nama : 'Isi data penjual atau pembeli. Tulisan dirapikan otomatis.' }));
  const wb = el('div', { class: 'jarak-atas-kecil' });
  isi.append(wb);

  const kebutuhanKotak = el('div', { class: 'kartu kartu-hijau bidang' });
  const peran = grupPilihan('Klien ini sebagai', 'Wajib dipilih', ['Penjual', 'Pembeli'], ubah ? k.peran : (p.peran || null), function (v) {
    kebutuhanKotak.classList.toggle('tersembunyi', v !== 'Pembeli');
  });
  const nama = bidangTeks('fNama', 'Nama lengkap', 'Wajib', ubah ? k.nama : '', { autocomplete: 'off', autocapitalize: 'words', maxlength: '100', placeholder: 'Contoh: Bu Siti Rahma' });
  pasangRapi(nama.isian, rapiNama_);
  const hp = bidangTeks('fHp', 'Nomor HP', 'Boleh kosong', ubah ? formatHp(k.no_hp) : '', { type: 'tel', inputmode: 'tel', autocomplete: 'off', maxlength: '20', placeholder: 'Contoh: 0812 3456 7890' });
  pasangRapi(hp.isian, function (v) { const n = normalHp(v); return hpValid(n) ? formatHp(n) : v; });

  // Yang dicari pembeli: cara, kondisi, jenis bangunan, area, budget (semua boleh kosong).
  const beliCara = grupPilihan('Mau beli atau sewa?', 'Boleh kosong', ['Beli', 'Sewa'], ubah ? (k.kebutuhan_cara || null) : null, function (v) {
    budget.wadah.querySelector('.label span').textContent = v === 'Sewa' ? 'Budget sewa per tahun' : 'Budget sampai';
  }, true);
  const beliKondisi = grupPilihan('Kondisi', 'Boleh kosong', KONDISI, ubah ? (k.kebutuhan_kondisi || null) : null, null, true);
  const beliAwal = ubah ? (k.kebutuhan_jenis || '') : '';
  const beliLain = /^Lainnya: ?/.test(beliAwal);
  const beliJenisLain = bidangTeks('fBeliLain', 'Bangunan lainnya', 'Wajib diketik', beliLain ? beliAwal.replace(/^Lainnya: ?/, '') : '', { autocomplete: 'off', maxlength: '40', placeholder: 'Contoh: Gudang, Apartemen, Kos' });
  pasangRapi(beliJenisLain.isian, function (v) { return rapiJudul_(v, false); });
  beliJenisLain.wadah.classList.toggle('tersembunyi', !beliLain);
  beliJenisLain.isian.addEventListener('input', function () { beliJenisLain.salah(''); });
  const beliJenis = grupPilihan('Jenis bangunan', 'Boleh kosong', JENIS_PROP, beliLain ? 'Lainnya' : (beliAwal || null), function (v) {
    beliJenisLain.wadah.classList.toggle('tersembunyi', v !== 'Lainnya');
    if (v === 'Lainnya') beliJenisLain.isian.focus();
  }, true);
  const beliArea = bidangArea('fBeliArea', 'Kota yang dicari', 'Boleh kosong', ubah ? (k.kebutuhan_area || '') : '', true);
  const budget = bidangRupiah('fBudget', ubah && k.kebutuhan_cara === 'Sewa' ? 'Budget sewa per tahun' : 'Budget sampai', 'Boleh kosong', ubah ? k.budget : '');
  const statusBeli = ubah ? grupPilihan('Status pembeli', '', STATUS_BELI, k.status_beli || 'Mencari', null, false, 'baris-3') : null;
  tambahAnak(kebutuhanKotak, [el('h2', { class: 'judul-kartu', text: 'Yang dicari pembeli' }),
    el('p', { class: 'kecil redup', text: 'Dipakai untuk mencocokkan otomatis dengan properti penjual.' }),
    beliCara.wadah, beliKondisi.wadah, beliJenis.wadah, beliJenisLain.wadah, beliArea.wadah, budget.wadah,
    statusBeli ? statusBeli.wadah : null]);
  kebutuhanKotak.classList.toggle('tersembunyi', !((ubah ? k.peran : p.peran) === 'Pembeli'));

  // Tanggal lahir (boleh kosong). Diisi sekali; ulang tahunnya muncul di Beranda.
  const tglLahir = el('input', { class: 'isian', id: 'fLahir', type: 'date', max: hariIni() });
  tglLahir.value = ubah && /^\d{4}-\d{2}-\d{2}$/.test(k.tanggal_lahir || '') ? k.tanggal_lahir : '';
  const bidangLahir = el('div', { class: 'bidang' },
    el('label', { class: 'label', for: 'fLahir' }, el('span', { text: 'Tanggal lahir' }), el('span', { class: 'keterangan', text: 'Boleh kosong · untuk pengingat ulang tahun' })), tglLahir);

  // Pengingat hubungi lagi (boleh kosong)
  const tglIngat = el('input', { class: 'isian', id: 'fIngat', type: 'date' });
  tglIngat.value = ubah ? (k.hubungi_tanggal || '') : '';
  const catIngat = bidangTeks('fIngatCat', 'Catatan pengingat', 'Boleh kosong', ubah ? (k.hubungi_catatan || '') : '', { maxlength: '120', autocomplete: 'off', placeholder: 'Contoh: tanya jadi survei atau tidak' });
  pasangRapi(catIngat.isian, rapiKalimat_);
  const cepat = el('div', { class: 'baris-3' },
    [['Besok', 1], ['3 hari', 3], ['1 minggu', 7]].map(function (x) {
      return el('button', { type: 'button', class: 'pilihan pilihan-kecil', onclick: function () { tglIngat.value = tambahHari(x[1]); } }, x[0]);
    }));
  const kotakIngat = el('details', { class: 'lipat', open: ubah && k.hubungi_tanggal ? true : null },
    el('summary', {}, ikon('lonceng'), el('span', { class: 'tengah' },
      el('span', { class: 'judul-lipat', text: 'Pengingat hubungi lagi' }),
      el('span', { class: 'sub-lipat', text: ubah && k.hubungi_tanggal ? formatTanggal(k.hubungi_tanggal) : 'Boleh kosong · ketuk untuk mengisi' }))),
    el('div', { class: 'lipat-isi' },
      el('div', { class: 'bidang' }, el('label', { class: 'label', for: 'fIngat' }, el('span', { text: 'Tanggal' })), tglIngat,
        el('div', { class: 'jarak-atas-kecil' }, cepat),
        el('button', { type: 'button', class: 'tautan', onclick: function () { tglIngat.value = ''; catIngat.isian.value = ''; } }, el('span', { text: 'Kosongkan pengingat' }))),
      catIngat.wadah));

  const cat = bidangTeks('fCatatan', 'Catatan', 'Boleh kosong', ubah ? k.catatan : '', { maxlength: '1000', placeholder: 'Catatan lain, misalnya waktu bisa dihubungi.' }, true);
  pasangRapi(cat.isian, rapiKalimat_);
  const tombolSimpan = tombol('tombol-utama', 'centang', 'Simpan', function () { simpan(false); });

  isi.append(peran.wadah, nama.wadah, hp.wadah, kebutuhanKotak, bidangLahir, kotakIngat, cat.wadah, tombolSimpan);

  if (ubah) {
    isi.append(judulBagian('Hapus klien'),
      el('p', { class: 'kecil redup', text: 'Klien yang dihapus hilang dari aplikasi beserta properti dan fotonya. Masih bisa dipulihkan dari Baru dihapus selama 30 hari.' }),
      tombol('tombol-bahaya', 'sampah', 'Hapus klien ini', hapusKlien));
  }

  async function simpan(lewatiCekGanda) {
    peran.salah('');
    nama.salah('');
    hp.salah('');
    nama.isian.value = rapiNama_(nama.isian.value);
    const nilaiNama = nama.isian.value.trim();
    const nilaiHp = normalHp(hp.isian.value);
    let pertama = null;
    if (!peran.nilai()) { peran.salah('Pilih Penjual atau Pembeli.'); pertama = pertama || peran; }
    if (!nilaiNama) { nama.salah('Nama wajib diisi.'); pertama = pertama || nama; }
    if (nilaiHp && !hpValid(nilaiHp)) { hp.salah('Nomor HP harus angka, diawali 0 atau 62, panjang 9 sampai 15 angka.'); pertama = pertama || hp; }
    const pembeli = peran.nilai() === 'Pembeli';
    beliJenisLain.salah('');
    const teksBeliLain = rapiJudul_(beliJenisLain.isian.value, false);
    if (pembeli && beliJenis.nilai() === 'Lainnya' && !teksBeliLain) { beliJenisLain.salah('Ketik jenis bangunannya.'); pertama = pertama || beliJenisLain; }
    const nilaiBeliJenis = !pembeli || !beliJenis.nilai() ? '' : beliJenis.nilai() === 'Lainnya' ? 'Lainnya: ' + teksBeliLain : beliJenis.nilai();
    if (pertama) {
      if (pertama.fokus) pertama.fokus(); else pertama.isian.focus();
      umumkan('Ada isian yang perlu diperbaiki.');
      return;
    }

    // Klien ganda: nomor HP sama atau nama sangat mirip.
    if (!lewatiCekGanda) {
      const mirip = klienMirip(nilaiNama, nilaiHp, idKlien);
      if (mirip.length) {
        const pilih = await pilihDialog({
          judul: 'Mungkin sudah ada',
          pesan: 'Klien ini mirip dengan data yang sudah tersimpan:',
          isi: el('div', { class: 'daftar jarak-atas-kecil' }, mirip.map(function (m) {
            return el('div', { class: 'baris baris-statis' }, avatar(m.nama),
              el('span', { class: 'tengah' }, el('span', { class: 'judul', text: m.nama }),
                el('span', { class: 'sub', text: m.peran + (m.no_hp ? ' · ' + formatHp(m.no_hp) : '') })));
          })),
          pilihan: [
            { nilai: 'buka', teks: 'Buka data ' + mirip[0].nama, kelas: 'tombol-utama', ikon: 'orang' },
            { nilai: 'simpan', teks: ubah ? 'Tetap simpan perubahan' : 'Tetap simpan sebagai klien baru', kelas: '' }
          ]
        });
        if (pilih === 'buka') { buka('profil', { id: mirip[0].id_klien }, { ganti: !ubah }); return; }
        if (pilih !== 'simpan') return;
      }
    }

    tombolSimpanSibuk(tombolSimpan, true);
    S.sibuk = true;
    try {
      const kirim = {
        mode: ubah ? 'ubah' : 'baru', id_klien: idKlien, peran: peran.nilai(),
        nama: nilaiNama, no_hp: nilaiHp, catatan: rapiKalimat_(cat.isian.value),
        kebutuhan_jenis: nilaiBeliJenis, kebutuhan_area: pembeli ? beliArea.nilai() : '',
        kebutuhan_cara: pembeli ? (beliCara.nilai() || '') : '', kebutuhan_kondisi: pembeli ? (beliKondisi.nilai() || '') : '',
        budget: pembeli ? budget.nilai() : '',
        tanggal_lahir: tglLahir.value || '', hubungi_tanggal: tglIngat.value || '', hubungi_catatan: tglIngat.value ? rapiKalimat_(catIngat.isian.value) : ''
      };
      if (statusBeli && pembeli) kirim.status_beli = statusBeli.nilai();
      const j = await panggil('simpanKlien', kirim);
      S.sibuk = false;
      if (j.ok) {
        simpanKeDaftar(S.data.klien, 'id_klien', j.data.klien);
        const kb = j.data.klien;
        let pesan = kb.nama;
        if (kb.peran === 'Pembeli' && punyaKebutuhan(kb)) {
          const n = propertiCocok(kb).cocok.length;
          pesan = n ? 'Ada ' + n + ' properti yang cocok. Lihat di bawah.' : 'Belum ada properti yang cocok. Nanti muncul otomatis saat ada properti baru.';
        }
        S.bannerBerikut = { jenis: 'sukses', judul: (ubah ? 'Perubahan tersimpan' : kb.nama + ' tersimpan'), pesan: pesan };
        if (ubah) history.back();
        else buka('profil', { id: idKlien }, { ganti: true });
        return;
      }
      tampilBanner(wb, { jenis: 'gagal', judul: 'Gagal tersimpan', pesan: j.pesan });
    } catch (e) {
      S.sibuk = false;
      if (e instanceof GalatSesi) return;
      tampilBanner(wb, { jenis: 'waspada', judul: 'Hasil belum pasti', pesan: 'Koneksi terputus saat menyimpan. Periksa internet, lalu tekan Simpan sekali lagi. Data tidak akan tersimpan dobel.' });
    }
    tombolSimpanSibuk(tombolSimpan, false);
  }

  async function hapusKlien() {
    const ps = propertiKlien(k.id_klien);
    const ya = await konfirmasiHapus('klien ' + k.nama, ps.length ? 'Ikut terhapus: ' + ps.length + ' properti dan ' + dokumenKlien(k.id_klien).length + ' foto dokumen.' : '');
    if (!ya) return;
    await jalankanHapus('klien', k.id_klien, k.nama, wb, function () { buka('beranda', {}, { ganti: true }); });
  }
}

/** Kirim permintaan hapus, perbarui data di memori, lalu pindah layar. */
async function jalankanHapus(jenis, id, nama, wb, lalu) {
  tampilMemuat('Menghapus...');
  try {
    const j = await panggil('hapus', { jenis: jenis, id: id });
    tutupMemuat();
    if (!j.ok) { tampilBanner(wb, { jenis: 'gagal', judul: 'Gagal menghapus', pesan: j.pesan }); return false; }
    if (jenis === 'klien') hapusKlienDariData(id);
    else if (jenis === 'properti') hapusPropertiDariData(id);
    else hapusDokumenDariData(id);
    S.bannerBerikut = { jenis: 'sukses', judul: nama + ' dihapus', pesan: 'Bisa dipulihkan dari menu Baru dihapus selama 30 hari.' };
    lalu();
    return true;
  } catch (e) {
    tutupMemuat();
    if (e instanceof GalatSesi) return false;
    tampilBanner(wb, { jenis: 'waspada', judul: 'Hasil belum pasti', pesan: 'Koneksi terputus. Tekan Perbarui di Beranda untuk melihat hasilnya.' });
    return false;
  }
}

/* ── Properti baru, ubah status dan data properti ── */

/**
 * Harga promo (diskon) untuk jual atau sewa. Tiga cara isi: harga promo, potongan Rp, atau potongan %.
 * Yang disimpan hanya harga promo akhir (angka). Kosong = tidak ada promo.
 * ambilNormal(): harga normal saat ini (string angka). judulTanda: teks kotak centang.
 */
function blokPromo(kode, judulTanda, ambilNormal, awalPromo) {
  let cara = 'harga';
  const hargaF = bidangRupiah('fPromo' + kode + 'Harga', 'Harga promo', 'Harga baru setelah diskon', awalPromo || '');
  const rpF = bidangRupiah('fPromo' + kode + 'Rp', 'Potongan', 'Rupiah yang dikurangkan', '');
  const pctF = bidangAngka('fPromo' + kode + 'Pct', 'Potongan', '%', '', true);
  const bacaan = el('p', { class: 'bacaan-angka', 'aria-live': 'polite' });
  const pesan = el('p', { class: 'pesan-salah tersembunyi' });
  const pilihCara = grupPilihan('Diisi sebagai', '', [
    { nilai: 'harga', label: 'Harga promo' }, { nilai: 'rp', label: 'Potongan Rp' }, { nilai: 'persen', label: 'Potongan %' }
  ], 'harga', function (v) { cara = v; aturCara(); }, false, 'baris-3');
  const tanda = kotakCentang(judulTanda, 'Tampil sebagai harga coret di daftar dan detail', !!awalPromo, function (baru) {
    isiBlok.classList.toggle('tersembunyi', !baru);
    segarkan();
  });
  const isiBlok = el('div', { class: 'kartu kotak-promo' + (awalPromo ? '' : ' tersembunyi') },
    pilihCara.wadah, hargaF.wadah, rpF.wadah, pctF.wadah, bacaan, pesan);
  hargaF.isian.addEventListener('input', function () { segarkan(); });
  rpF.isian.addEventListener('input', function () { segarkan(); });
  pctF.isian.addEventListener('input', function () { segarkan(); });
  // Tampilan awal sesuai pilihan bawaan ("Harga promo"): isian potongan disembunyikan dulu.
  rpF.wadah.classList.add('tersembunyi');
  pctF.wadah.classList.add('tersembunyi');

  function aturCara() {
    hargaF.wadah.classList.toggle('tersembunyi', cara !== 'harga');
    rpF.wadah.classList.toggle('tersembunyi', cara !== 'rp');
    pctF.wadah.classList.toggle('tersembunyi', cara !== 'persen');
    segarkan();
  }
  // Hitung harga promo akhir dan pesan salahnya. Hasil: { promo, salah }.
  function hitung() {
    const normal = Number(ambilNormal() || 0);
    if (cara === 'harga') {
      const v = Number(hargaF.nilai() || 0);
      if (!v) return { promo: 0, salah: 'Isi harga promo dulu, atau matikan Ada harga promo.' };
      if (!normal) return { promo: 0, salah: 'Isi harga normal dulu sebelum harga promo.' };
      if (v >= normal) return { promo: 0, salah: 'Harga promo harus lebih kecil dari harga normal.' };
      return { promo: v, salah: '' };
    }
    if (!normal) return { promo: 0, salah: 'Isi harga normal dulu sebelum harga promo.' };
    if (cara === 'rp') {
      const v = Number(rpF.nilai() || 0);
      if (!v) return { promo: 0, salah: 'Isi potongannya dulu, atau matikan Ada harga promo.' };
      if (v >= normal) return { promo: 0, salah: 'Potongan harus lebih kecil dari harga normal.' };
      return { promo: Math.round((normal - v) / 1000) * 1000, salah: '' };
    }
    const persen = Number(String(pctF.nilai() || '0').replace(',', '.'));
    if (!(persen > 0 && persen < 100)) return { promo: 0, salah: 'Potongan antara 0 sampai 100 persen.' };
    return { promo: Math.round(normal * (1 - persen / 100) / 1000) * 1000, salah: '' };
  }
  function segarkan() {
    if (tanda.getAttribute('aria-checked') !== 'true') { bacaan.textContent = ''; return; }
    const normal = Number(ambilNormal() || 0);
    const h = hitung();
    if (h.salah) { bacaan.textContent = ''; return; }
    bacaan.textContent = 'Harga promo ' + rupiahPendek(h.promo) + (normal ? ' · hemat ' + rupiahPendek(normal - h.promo) : '');
  }
  return {
    wadah: el('div', { class: 'bidang' }, tanda, isiBlok),
    aktif: function () { return tanda.getAttribute('aria-checked') === 'true'; },
    /** Nilai yang dikirim: harga promo akhir, atau '' bila tidak ada promo. */
    nilai: function () { if (!this.aktif()) return ''; const h = hitung(); return h.salah ? '' : String(h.promo); },
    /** Periksa isian; bila salah, tampilkan pesannya dan kembalikan false. */
    periksa: function () {
      if (!this.aktif()) return true;
      const h = hitung();
      pesan.textContent = h.salah;
      pesan.classList.toggle('tersembunyi', !h.salah);
      if (h.salah) { (cara === 'harga' ? hargaF : cara === 'rp' ? rpF : pctF).isian.focus(); }
      return !h.salah;
    },
    segarkan: segarkan,
    fokus: function () { (cara === 'harga' ? hargaF : cara === 'rp' ? rpF : pctF).isian.focus(); }
  };
}

function layarFormProperti(isi, p) {
  const ubah = p.mode === 'ubah';
  const k = cariKlien(p.id_klien);
  const pr = ubah ? cariProperti(p.id) : null;
  if (!k || (ubah && (!pr || pr.id_klien !== k.id_klien))) return tidakAda();
  if (!ubah && !/^p[0-9a-f]{32}$/.test(p.id || '')) { gantiParam({ id: idBaru('p') }); p = S.layar.param; }
  const idProperti = ubah ? pr.id_properti : p.id;
  kepala({ judul: ubah ? 'Ubah Properti' : 'Properti Baru' });

  isi.append(el('div', { class: 'kartu' }, el('div', { class: 'kepala-klien' }, avatar(k.nama),
    el('div', {}, el('span', { class: 'kecil redup', text: 'Klien' }), el('div', { class: 'tebal', text: k.nama })))));
  const wb = el('div', { class: 'jarak-atas' });
  isi.append(wb);

  // Progres dan pembeli (untuk Deal/Sold)
  const dealKotak = el('div', { class: 'kartu kartu-hijau bidang' });
  const progres = grupPilihan('Progres', ubah ? 'Ketuk untuk mengubah' : 'Tersedia bila tidak diubah',
    PROGRES_PROP.map(function (x) { return { nilai: x, label: labelProgres(x) }; }),
    ubah ? progresProp(pr) : 'Tersedia', function (v) {
      dealKotak.classList.toggle('tersembunyi', v !== 'Deal' && v !== 'Sold');
      judulDeal.textContent = v === 'Sold' ? 'Terjual atau disewa ke siapa?' : 'Deal dengan siapa?';
    });
  const pilihDeal = el('select', { class: 'isian', id: 'fDeal' },
    el('option', { value: '', text: 'Belum dipilih' }),
    S.data.klien.filter(function (x) { return x.id_klien !== k.id_klien; })
      .sort(function (a, b) { return ((a.peran === 'Pembeli' ? 0 : 1) - (b.peran === 'Pembeli' ? 0 : 1)) || urutNama(a, b, 'nama'); })
      .map(function (x) { return el('option', { value: x.id_klien, text: x.nama + ' · ' + x.peran }); }));
  pilihDeal.value = ubah && pr.id_klien_deal && cariKlien(pr.id_klien_deal) ? pr.id_klien_deal : '';
  const judulDeal = el('span', { text: ubah && sudahSold(pr) ? 'Terjual atau disewa ke siapa?' : 'Deal dengan siapa?' });
  dealKotak.append(
    el('label', { class: 'label', for: 'fDeal' }, judulDeal, el('span', { class: 'keterangan', text: 'Boleh dikosongkan' })),
    pilihDeal,
    el('p', { class: 'kecil redup jarak-atas-kecil', text: 'Pilih dari daftar klien. Pembeli belum ada? Tambah dulu lewat Klien Baru.' }));
  dealKotak.classList.toggle('tersembunyi', !(ubah && denganPembeli(pr)));

  const nama = bidangTeks('fNamaProp', 'Nama properti', 'Wajib', ubah ? pr.nama_properti : '', { autocomplete: 'off', maxlength: '150', placeholder: 'Contoh: Rumah Jl. Melati 12' });
  pasangRapi(nama.isian, function (v) { return rapiJudul_(v, false); });
  const alamat = bidangTeks('fAlamat', 'Alamat', 'Boleh kosong', ubah ? pr.alamat : '', { maxlength: '300' }, true);
  pasangRapi(alamat.isian, function (v) { return rapiJudul_(v, true); });
  const jenisAwal = ubah ? pr.jenis : null;
  const awalLain = /^Lainnya: ?/.test(jenisAwal || '');
  const jenisLain = bidangTeks('fJenisLain', 'Jenis lainnya', 'Wajib diketik', awalLain ? jenisAwal.replace(/^Lainnya: ?/, '') : '', { autocomplete: 'off', maxlength: '40', placeholder: 'Contoh: Gudang, Apartemen, Kos' });
  pasangRapi(jenisLain.isian, function (v) { return rapiJudul_(v, false); });
  jenisLain.wadah.classList.toggle('tersembunyi', !awalLain);
  jenisLain.isian.addEventListener('input', function () { jenisLain.salah(''); });
  const jenis = grupPilihan('Jenis', 'Wajib dipilih', JENIS_PROP, awalLain ? 'Lainnya' : jenisAwal, function (v) {
    jenisLain.wadah.classList.toggle('tersembunyi', v !== 'Lainnya');
    if (v === 'Lainnya') jenisLain.isian.focus();
  });
  const area = bidangArea('fArea', 'Area', 'Kelurahan atau kompleks', ubah ? (pr.area || '') : '');
  const kondisi = grupPilihan('Kondisi', 'Boleh kosong', KONDISI, ubah ? (pr.kondisi || null) : null, null, true);

  // Ditawarkan: Dijual dan/atau Disewakan, masing-masing dengan harganya.
  const hargaJual = bidangRupiah('fHargaJual', 'Harga jual', 'Boleh kosong', ubah ? pr.harga_jual : '');
  const hargaSewa = bidangRupiah('fHargaSewa', 'Harga sewa', 'Boleh kosong', ubah ? pr.harga_sewa : '');
  const satuan = grupPilihan('Harga sewa dihitung', '', [{ nilai: 'tahun', label: 'Per tahun' }, { nilai: 'bulan', label: 'Per bulan' }], ubah && pr.satuan_sewa === 'bulan' ? 'bulan' : 'tahun');
  const promoJual = blokPromo('jual', 'Ada harga promo (jual)', function () { return hargaJual.nilai(); }, ubah ? (pr.harga_jual_promo || '') : '');
  hargaJual.isian.addEventListener('input', function () { promoJual.segarkan(); });
  const promoSewa = blokPromo('sewa', 'Ada harga promo (sewa)', function () { return hargaSewa.nilai(); }, ubah ? (pr.harga_sewa_promo || '') : '');
  hargaSewa.isian.addEventListener('input', function () { promoSewa.segarkan(); });
  const kotakSewa = el('div', {}, hargaSewa.wadah, satuan.wadah, promoSewa.wadah);
  const tawar = grupCentang('Ditawarkan untuk', 'Boleh dua-duanya', [{ nilai: 'dijual', label: 'Dijual' }, { nilai: 'disewakan', label: 'Disewakan' }],
    { dijual: ubah ? pr.dijual : false, disewakan: ubah ? pr.disewakan : false }, aturHarga);
  function aturHarga(v) {
    hargaJual.wadah.classList.toggle('tersembunyi', !v.dijual);
    promoJual.wadah.classList.toggle('tersembunyi', !v.dijual);
    kotakSewa.classList.toggle('tersembunyi', !v.disewakan);
  }
  aturHarga(tawar.nilai());

  // BU: tanda untuk penjual yang butuh uang (cepat laku). Tidak ikut dibagikan ke pembeli.
  const buTanda = kotakCentang('BU (butuh uang)', 'Penjual ingin cepat laku. Tampil sebagai label BU.', ubah && pr.bu === true, null);

  // Detail yang dilipat supaya formulir tidak panjang.
  const lt = bidangAngka('fLt', 'Luas tanah', 'm²', ubah ? pr.luas_tanah : '', true);
  const lb = bidangAngka('fLb', 'Luas bangunan', 'm²', ubah ? pr.luas_bangunan : '', true);
  const kt = bidangAngka('fKt', 'Kamar tidur', '', ubah ? pr.kamar_tidur : '', false);
  const km = bidangAngka('fKm', 'Kamar mandi', '', ubah ? pr.kamar_mandi : '', false);
  const sertAwal = ubah ? (pr.sertifikat || '') : '';
  const sertLainAwal = /^Lainnya: ?/.test(sertAwal);
  const sertLain = bidangTeks('fSertLain', 'Sertifikat lainnya', 'Wajib diketik', sertLainAwal ? sertAwal.replace(/^Lainnya: ?/, '') : '', { autocomplete: 'off', maxlength: '40', placeholder: 'Contoh: Letter C' });
  pasangRapi(sertLain.isian, function (v) { return rapiJudul_(v, false); });
  sertLain.wadah.classList.toggle('tersembunyi', !sertLainAwal);
  const sertifikat = grupPilihan('Sertifikat', 'Boleh kosong', SERTIFIKAT, sertLainAwal ? 'Lainnya' : (sertAwal || null), function (v) {
    sertLain.wadah.classList.toggle('tersembunyi', v !== 'Lainnya');
    if (v === 'Lainnya') sertLain.isian.focus();
  }, true, 'baris-3');
  const komisiJenis = grupPilihan('Komisi agen', 'Boleh kosong', [{ nilai: 'persen', label: 'Persen' }, { nilai: 'nominal', label: 'Rupiah' }],
    ubah ? (pr.komisi_jenis || null) : null, function (v) {
      komisiPersen.wadah.classList.toggle('tersembunyi', v !== 'persen');
      komisiRp.wadah.classList.toggle('tersembunyi', v !== 'nominal');
    }, true);
  const komisiPersen = bidangAngka('fKomisiP', 'Besar komisi', '%', ubah && pr.komisi_jenis === 'persen' ? pr.komisi_nilai : '', true);
  const komisiRp = bidangRupiah('fKomisiRp', 'Besar komisi', '', ubah && pr.komisi_jenis === 'nominal' ? pr.komisi_nilai : '');
  komisiPersen.wadah.classList.toggle('tersembunyi', !(ubah && pr.komisi_jenis === 'persen'));
  komisiRp.wadah.classList.toggle('tersembunyi', !(ubah && pr.komisi_jenis === 'nominal'));
  // Fasilitas (4.6): ukuran tanah P x L, carport, listrik, sumber air, menghadap.
  const pjg = bidangAngka('fPanjang', 'Panjang tanah', 'm', ubah ? pr.panjang_tanah : '', true);
  const lbr = bidangAngka('fLebar', 'Lebar tanah', 'm', ubah ? pr.lebar_tanah : '', true);
  const catatLuas = el('p', { class: 'kecil redup jarak-atas-kecil tersembunyi' });
  let luasOtomatis = null;   // luas terakhir yang diisi otomatis dari P x L
  function hitungLuasDariPanjang() {
    const a = Number(String(pjg.nilai() || '0').replace(',', '.')), b = Number(String(lbr.nilai() || '0').replace(',', '.'));
    if (!(a > 0 && b > 0)) { catatLuas.classList.add('tersembunyi'); return; }
    if (!lt.nilai() || lt.nilai() === luasOtomatis) {
      lt.isian.value = angkaTampil(String(Math.round(a * b * 100) / 100));
      luasOtomatis = lt.nilai();
      catatLuas.classList.add('tersembunyi');
    } else {
      catatLuas.textContent = 'Luas tanah sudah terisi, jadi tidak diubah otomatis. Kosongkan dulu bila mau dihitung dari panjang × lebar.';
      catatLuas.classList.remove('tersembunyi');
    }
  }
  pjg.isian.addEventListener('input', hitungLuasDariPanjang);
  lbr.isian.addEventListener('input', hitungLuasDariPanjang);
  const carport = grupPilihan('Carport (jumlah mobil)', 'Boleh kosong',
    [{ nilai: '0', label: 'Tidak ada' }, { nilai: '1', label: '1 mobil' }, { nilai: '2', label: '2 mobil' }, { nilai: '3', label: '3 mobil' }, { nilai: '4', label: '4 atau lebih' }],
    ubah && pr.carport !== '' && pr.carport != null ? String(pr.carport) : null, null, true, 'baris-3');
  const listrikAwal = ubah ? String(pr.listrik_va || '') : '';
  const listrikLain = !!listrikAwal && LISTRIK_VA.indexOf(listrikAwal) < 0;
  const listrikKetik = bidangAngka('fListrikLain', 'Daya listrik lainnya', 'watt', listrikLain ? listrikAwal : '', false);
  listrikKetik.wadah.classList.toggle('tersembunyi', !listrikLain);
  const listrik = grupPilihan('Daya listrik (watt)', 'Boleh kosong',
    LISTRIK_VA.map(function (v) { return { nilai: v, label: formatRibuan(v) + ' watt' }; }).concat([{ nilai: 'lain', label: 'Lainnya' }]),
    listrikLain ? 'lain' : (listrikAwal || null), function (v) {
      listrikKetik.wadah.classList.toggle('tersembunyi', v !== 'lain');
      if (v === 'lain') listrikKetik.isian.focus();
    }, true, 'baris-3');
  const airAwal = ubah ? (pr.sumber_air || '') : '';
  const air = grupCentang('Sumber air', 'Boleh dua-duanya', [{ nilai: 'pdam', label: 'PDAM' }, { nilai: 'sumur', label: 'Sumur' }],
    { pdam: /PDAM/.test(airAwal), sumur: /Sumur/.test(airAwal) }, null);
  const arah = grupPilihan('Menghadap ke', 'Boleh kosong', ARAH_HADAP, ubah ? (pr.menghadap || null) : null, null, true);
  const ringkasDetail = ubah ? [ukuranTeks(pr), komisiTeks(pr) ? 'komisi ' + komisiTeks(pr) : ''].filter(Boolean).join(' · ') : '';
  const lipat = el('details', { class: 'lipat' },
    el('summary', {}, ikon('penggaris'), el('span', { class: 'tengah' },
      el('span', { class: 'judul-lipat', text: 'Ukuran, fasilitas, sertifikat, komisi' }),
      el('span', { class: 'sub-lipat', text: ringkasDetail || 'Boleh kosong · ketuk untuk mengisi' }))),
    el('div', { class: 'lipat-isi' },
      el('div', { class: 'baris-2' }, pjg.wadah, lbr.wadah),
      catatLuas,
      el('div', { class: 'baris-2' }, lt.wadah, lb.wadah),
      el('div', { class: 'baris-2' }, kt.wadah, km.wadah),
      carport.wadah,
      el('div', {}, listrik.wadah, listrikKetik.wadah),
      air.wadah,
      arah.wadah,
      sertifikat.wadah, sertLain.wadah,
      el('div', { class: 'kotak-komisi' }, komisiJenis.wadah, komisiPersen.wadah, komisiRp.wadah,
        el('p', { class: 'kecil redup catatan-komisi' }, ikon('perisai', 'ikon-mini'), 'Hanya untuk agen. Tidak pernah ikut dibagikan ke pembeli atau dicetak di PDF.'))));

  const cat = bidangTeks('fCatProp', 'Catatan', 'Boleh kosong', ubah ? pr.catatan : '', { maxlength: '1000' }, true);
  pasangRapi(cat.isian, rapiKalimat_);
  const tombolSimpan = tombol('tombol-utama', 'centang', 'Simpan', simpan);

  const bagianBu = el('div', { class: 'bidang' }, buTanda);
  if (ubah) isi.append(progres.wadah, dealKotak, nama.wadah, alamat.wadah, area.wadah, jenis.wadah, jenisLain.wadah, kondisi.wadah, tawar.wadah, bagianBu, hargaJual.wadah, promoJual.wadah, kotakSewa, lipat, cat.wadah);
  else isi.append(nama.wadah, alamat.wadah, area.wadah, jenis.wadah, jenisLain.wadah, kondisi.wadah, tawar.wadah, bagianBu, hargaJual.wadah, promoJual.wadah, kotakSewa, lipat, progres.wadah, dealKotak, cat.wadah);
  isi.append(tombolSimpan);

  if (ubah) {
    isi.append(judulBagian('Hapus properti'),
      el('p', { class: 'kecil redup', text: 'Properti yang dihapus hilang dari aplikasi beserta fotonya. Masih bisa dipulihkan dari Baru dihapus selama 30 hari.' }),
      tombol('tombol-bahaya', 'sampah', 'Hapus properti ini', hapusProp));
  }

  async function simpan() {
    [nama, jenis, jenisLain, tawar, sertLain].forEach(function (b) { b.salah(''); });
    nama.isian.value = rapiJudul_(nama.isian.value, false);
    alamat.isian.value = rapiJudul_(alamat.isian.value, true);
    const nilaiNama = nama.isian.value.trim();
    let pertama = null;
    if (!nilaiNama) { nama.salah('Nama properti wajib diisi.'); pertama = pertama || nama; }
    if (!jenis.nilai()) { jenis.salah('Pilih jenis properti.'); pertama = pertama || jenis; }
    const teksLain = rapiJudul_(jenisLain.isian.value, false);
    if (jenis.nilai() === 'Lainnya' && !teksLain) { jenisLain.salah('Ketik jenis propertinya.'); pertama = pertama || jenisLain; }
    const t = tawar.nilai();
    if (!t.dijual && !t.disewakan) { tawar.salah('Pilih Dijual atau Disewakan (boleh dua-duanya).'); pertama = pertama || tawar; }
    [lt, lb, kt, km, komisiPersen, pjg, lbr].forEach(function (b) { if (!b.periksa()) { lipat.open = true; pertama = pertama || b; } });
    if (listrik.nilai() === 'lain' && !listrikKetik.periksa()) { lipat.open = true; pertama = pertama || listrikKetik; }
    if (t.dijual && !promoJual.periksa()) { pertama = pertama || promoJual; }
    if (t.disewakan && !promoSewa.periksa()) { pertama = pertama || promoSewa; }
    const teksSert = rapiJudul_(sertLain.isian.value, false);
    if (sertifikat.nilai() === 'Lainnya' && !teksSert) { sertLain.salah('Ketik jenis sertifikatnya.'); lipat.open = true; pertama = pertama || sertLain; }
    if (komisiJenis.nilai() === 'persen' && Number(komisiPersen.nilai()) > 100) { komisiPersen.salah('Komisi persen paling besar 100.'); lipat.open = true; pertama = pertama || komisiPersen; }
    if (pertama) {
      if (pertama.fokus) pertama.fokus(); else pertama.isian.focus();
      umumkan('Ada isian yang perlu diperbaiki.');
      return;
    }
    const nilaiJenis = jenis.nilai() === 'Lainnya' ? 'Lainnya: ' + teksLain : jenis.nilai();
    const kj = komisiJenis.nilai() || '';
    const progresLama = ubah ? progresProp(pr) : '';
    const progresBaru = progres.nilai();

    tombolSimpanSibuk(tombolSimpan, true);
    S.sibuk = true;
    try {
      const j = await panggil('simpanProperti', {
        mode: ubah ? 'ubah' : 'baru', id_properti: idProperti, id_klien: k.id_klien,
        nama_properti: nilaiNama, alamat: alamat.isian.value, area: area.nilai(), jenis: nilaiJenis,
        kondisi: kondisi.nilai() || '', dijual: !!t.dijual, disewakan: !!t.disewakan,
        harga_jual: t.dijual ? hargaJual.nilai() : '', harga_sewa: t.disewakan ? hargaSewa.nilai() : '', satuan_sewa: t.disewakan ? satuan.nilai() : '',
        luas_tanah: lt.nilai(), luas_bangunan: lb.nilai(), kamar_tidur: kt.nilai(), kamar_mandi: km.nilai(),
        panjang_tanah: pjg.nilai(), lebar_tanah: lbr.nilai(), carport: carport.nilai() || '',
        listrik_va: listrik.nilai() === 'lain' ? listrikKetik.nilai() : (listrik.nilai() || ''),
        sumber_air: airDariPilihan(air.nilai()), menghadap: arah.nilai() || '',
        bu: buTanda.getAttribute('aria-checked') === 'true' ? 'ya' : '',
        harga_jual_promo: t.dijual ? promoJual.nilai() : '', harga_sewa_promo: t.disewakan ? promoSewa.nilai() : '',
        sertifikat: sertifikat.nilai() === 'Lainnya' ? 'Lainnya: ' + teksSert : (sertifikat.nilai() || ''),
        komisi_jenis: kj, komisi_nilai: kj === 'persen' ? komisiPersen.nilai() : kj === 'nominal' ? komisiRp.nilai() : '',
        progres: progresBaru, id_klien_deal: progresBaru === 'Deal' || progresBaru === 'Sold' ? pilihDeal.value : '',
        catatan: rapiKalimat_(cat.isian.value)
      });
      S.sibuk = false;
      if (j.ok) {
        const baru = j.data.properti;
        simpanKeDaftar(S.data.properti, 'id_properti', baru);
        S.bannerBerikut = { jenis: 'sukses', judul: ubah ? 'Perubahan tersimpan' : 'Properti tersimpan', pesan: baru.nama_properti + ' · ' + labelProgres(baru.progres) };
        if (!ubah && dipasarkan(baru)) {
          const n = pembeliCocok(baru).cocok.length;
          if (n) S.bannerBerikut.pesan += '. Ada ' + n + ' pembeli yang mencari properti seperti ini.';
        }
        await setelahGantiProgres(baru, progresLama);
        if (S.layar && S.layar.nama !== 'formProperti') return;   // sudah pindah (misalnya setelah dihapus)
        if (ubah) history.back();
        else buka('properti', { id: idProperti }, { ganti: true });
        return;
      }
      tampilBanner(wb, { jenis: 'gagal', judul: 'Gagal tersimpan', pesan: j.pesan });
    } catch (e) {
      S.sibuk = false;
      if (e instanceof GalatSesi) return;
      tampilBanner(wb, { jenis: 'waspada', judul: 'Hasil belum pasti', pesan: 'Koneksi terputus saat menyimpan. Periksa internet, lalu tekan Simpan sekali lagi. Data tidak akan tersimpan dobel.' });
    }
    tombolSimpanSibuk(tombolSimpan, false);
  }

  /** Setelah progres berubah: Sold -> tandai pembeli sudah dapat; Laku agen lain -> tawarkan hapus. */
  async function setelahGantiProgres(baru, lama) {
    if (baru.progres === lama) return;
    if (baru.progres === 'Sold' && baru.id_klien_deal) {
      const l = cariKlien(baru.id_klien_deal);
      if (l && l.peran === 'Pembeli' && (l.status_beli || 'Mencari') === 'Mencari') {
        const ya = await konfirmasi('Tandai ' + l.nama + ' sudah dapat?', 'Supaya tidak muncul lagi di daftar pembeli yang masih mencari.', 'Ya, sudah dapat', 'tombol-utama');
        if (ya) await ubahStatusPembeli(l, 'Sudah dapat');
      }
    }
    if (baru.progres === 'Agen lain') {
      const lain = propertiKlien(k.id_klien).filter(function (x) { return x.id_properti !== baru.id_properti && (dipasarkan(x) || denganPembeli(x)); });
      const pilih = await pilihDialog({
        judul: 'Laku lewat agen lain',
        pesan: 'Mau hapus datanya supaya arsip tetap rapi? Yang dihapus masih bisa dipulihkan dari Baru dihapus selama 30 hari.',
        pilihan: [
          { nilai: 'properti', teks: 'Hapus properti ini saja', kelas: 'tombol-bahaya-penuh', ikon: 'sampah' },
          lain.length ? null : { nilai: 'klien', teks: 'Hapus penjual (' + k.nama + ') dan semua propertinya', kelas: 'tombol-bahaya', ikon: 'sampah' }
        ].filter(Boolean),
        teksBatal: 'Jangan hapus, simpan sebagai riwayat'
      });
      if (pilih === 'properti') {
        await jalankanHapus('properti', baru.id_properti, baru.nama_properti, wb, function () { buka('profil', { id: k.id_klien }, { ganti: true }); });
      } else if (pilih === 'klien') {
        await jalankanHapus('klien', k.id_klien, k.nama, wb, function () { buka('beranda', {}, { ganti: true }); });
      }
    }
  }

  async function hapusProp() {
    const nDok = S.data.dokumen.filter(function (d) { return d.id_properti === pr.id_properti; }).length;
    const ya = await konfirmasiHapus('properti ' + pr.nama_properti, nDok ? 'Ikut terhapus: ' + nDok + ' foto dokumen properti ini.' : '');
    if (!ya) return;
    await jalankanHapus('properti', pr.id_properti, pr.nama_properti, wb, function () { buka('profil', { id: k.id_klien }, { ganti: true }); });
  }
}

/* ════════════════════════════════════════════════════════════
   LAYAR: CETAK PDF
   ════════════════════════════════════════════════════════════ */

/** Pilihan sumber air (PDAM dan/atau Sumur) menjadi teks yang disimpan. */
function airDariPilihan(a) {
  if (a.pdam && a.sumur) return 'PDAM + Sumur';
  if (a.pdam) return 'PDAM';
  if (a.sumur) return 'Sumur';
  return '';
}

function kotakCentang(judul, sub, nilai, saatUbah) {
  const b = el('button', { type: 'button', class: 'centang', role: 'checkbox', 'aria-checked': nilai ? 'true' : 'false' },
    el('span', { class: 'kotak' }, ikon('centang')),
    el('span', { class: 'tengah' }, el('span', { class: 'judul', text: judul }), el('span', { class: 'sub', text: sub })));
  b.addEventListener('click', async function () {
    const baru = !nilai;
    if (saatUbah && (await saatUbah(baru)) === false) return;   // saatUbah boleh menolak (misalnya konfirmasi dibatalkan)
    nilai = baru;
    b.setAttribute('aria-checked', nilai ? 'true' : 'false');
  });
  b.aturNilai = function (v) { nilai = !!v; b.setAttribute('aria-checked', nilai ? 'true' : 'false'); };
  return b;
}

function layarCetak(isi, p) {
  const k = cariKlien(p.id_klien);
  if (!k) return tidakAda();
  kepala({ judul: 'Cetak PDF' });
  const st = S.layar;
  const props = propertiKlien(k.id_klien);
  const jumlahFoto = dokumenKlien(k.id_klien).length;
  const pilih = { dataDiri: true, daftarProperti: true, fotoDokumen: jumlahFoto > 0 };
  const perJenis = {};
  dokumenKlien(k.id_klien).forEach(function (d) { perJenis[d.jenis] = (perJenis[d.jenis] || 0) + 1; });
  const jenisAda = JENIS_DOK.filter(function (j) { return perJenis[j]; });
  const jenisDipilih = new Set(jenisAda);
  function hitungFoto() {
    let n = 0;
    jenisDipilih.forEach(function (j) { n += perJenis[j] || 0; });
    return n;
  }
  const ringkasFoto = el('p', { class: 'kecil tebal jarak-atas-kecil' });
  const kotakJenis = [];
  function segarkanRingkas() {
    const n = hitungFoto();
    ringkasFoto.textContent = n + ' foto akan masuk ke PDF.' + (n > CONFIG.PDF_MAKS_FOTO ? ' Hanya ' + CONFIG.PDF_MAKS_FOTO + ' foto pertama yang dimuat.' : '');
    ringkasFoto.classList.toggle('teks-aksen', n > CONFIG.PDF_MAKS_FOTO);
  }
  const blokJenis = el('div', { class: 'jarak-atas-kecil' },
    el('div', { class: 'baris-judul-kecil' },
      el('span', { class: 'tebal', text: 'Foto apa saja yang dimasukkan?' }),
      el('span', { class: 'aksi-mini' },
        el('button', { type: 'button', class: 'tautan', onclick: function () { aturSemuaJenis(true); } }, el('span', { text: 'Pilih semua' })),
        el('button', { type: 'button', class: 'tautan', onclick: function () { aturSemuaJenis(false); } }, el('span', { text: 'Kosongkan' })))),
    el('div', { class: 'daftar' }, jenisAda.map(function (j) {
      const kc = kotakCentang(j, perJenis[j] + ' foto', true, function (v) {
        if (v) jenisDipilih.add(j); else jenisDipilih.delete(j);
        segarkanRingkas();
      });
      kotakJenis.push({ j: j, kc: kc });
      return kc;
    })),
    ringkasFoto);
  function aturSemuaJenis(v) {
    kotakJenis.forEach(function (x) {
      x.kc.aturNilai(v);
      if (v) jenisDipilih.add(x.j); else jenisDipilih.delete(x.j);
    });
    segarkanRingkas();
  }
  segarkanRingkas();
  blokJenis.classList.toggle('tersembunyi', !pilih.fotoDokumen);

  isi.append(el('div', { class: 'kartu' }, el('div', { class: 'kepala-klien' }, avatar(k.nama),
    el('div', {}, el('div', { class: 'tebal', text: k.nama }), el('span', { class: 'kecil redup', text: props.length + ' properti · ' + jumlahFoto + ' dokumen' })))));
  const wb = el('div', { class: 'jarak-atas' });
  const hasil = el('div', { class: 'tumpuk jarak-atas' });
  const tombolBuat = tombol('tombol-utama', 'dokumen', 'Buat PDF', buat);

  tambahAnak(isi, [wb, judulBagian('Yang mau dimasukkan'),
    el('div', { class: 'daftar' },
      kotakCentang('Data diri', 'Nama, peran, nomor HP, dan catatan', pilih.dataDiri, function (v) { pilih.dataDiri = v; }),
      kotakCentang('Daftar properti', props.length + ' properti beserta harga dan progresnya', pilih.daftarProperti, function (v) { pilih.daftarProperti = v; }),
      kotakCentang('Foto dokumen', jumlahFoto ? jumlahFoto + ' foto tersedia. Pilih jenisnya di bawah.' : 'Belum ada foto', pilih.fotoDokumen, function (v) { pilih.fotoDokumen = v; blokJenis.classList.toggle('tersembunyi', !v); })),
    jumlahFoto ? blokJenis : null,
    el('div', { class: 'petunjuk jarak-atas' }, ikon('dokumen'), el('div', { text: 'Hasilnya satu file PDF ukuran A4. Komisi tidak pernah ikut. Bisa diunduh, dicetak, atau dikirim lewat WhatsApp.' })),
    el('div', { class: 'jarak-atas' }, tombolBuat), hasil]);

  async function buat() {
    if (!pilih.dataDiri && !pilih.daftarProperti && !pilih.fotoDokumen) {
      tampilBanner(wb, { jenis: 'gagal', judul: 'Pilih minimal satu bagian' });
      return;
    }
    if (pilih.fotoDokumen && jenisAda.length && jenisDipilih.size === 0) {
      tampilBanner(wb, { jenis: 'gagal', judul: 'Pilih minimal satu jenis foto', pesan: 'Centang jenis foto yang mau dimasukkan, atau matikan Foto dokumen.' });
      return;
    }
    kosongkan(hasil);
    kosongkan(wb);
    lepasPdf();
    tampilMemuat('Sedang membuat PDF. Bisa sampai 1 atau 2 menit. Jangan tutup aplikasi.');
    try {
      const j = await panggil('buatPdf', { id_klien: k.id_klien, dataDiri: pilih.dataDiri, daftarProperti: pilih.daftarProperti, fotoDokumen: pilih.fotoDokumen && jenisDipilih.size > 0, jenisDokumen: Array.from(jenisDipilih) }, { batas: CONFIG.BATAS_WAKTU_PDF_MS });
      tutupMemuat();
      if (S.layar !== st) return;
      if (!j.ok) { tampilBanner(wb, { jenis: 'gagal', judul: 'PDF gagal dibuat', pesan: j.pesan }); return; }
      const blob = base64KeBlob(j.data.pdf, 'application/pdf');
      S.pdf = { blob: blob, url: URL.createObjectURL(blob), namaFile: j.data.namaFile };
      hasil.append(
        buatBanner({
          jenis: 'sukses', tanpaTutup: true, judul: 'PDF siap',
          pesan: j.data.namaFile + ' · ' + j.data.jumlahFoto + ' foto' +
            (j.data.terpotong ? '. ' + j.data.terpotong + ' foto tidak dimuat karena batas ' + CONFIG.PDF_MAKS_FOTO + ' foto.' : '')
        }),
        tombol('tombol-utama', 'unduh', 'Unduh PDF', unduh),
        tombol('', 'bagikan', 'Kirim atau Cetak', bagikan),
        el('p', { class: 'kecil redup', text: 'Kirim atau Cetak membuka menu Bagikan di HP. Pilih aplikasi printer, Google Drive, atau WhatsApp.' }));
      hasil.scrollIntoView({ block: 'start', behavior: 'smooth' });
      umumkan('PDF siap');
    } catch (e) {
      tutupMemuat();
      if (e instanceof GalatSesi) return;
      tampilBanner(wb, { jenis: 'gagal', judul: 'PDF gagal dibuat', pesan: 'Koneksi terputus atau server terlalu lama menjawab. Coba lagi.' });
    }
  }

  function unduh() {
    if (!S.pdf) return;
    unduhBlob(S.pdf.url, S.pdf.namaFile);
    tampilBanner(wb, { jenis: 'info', judul: 'Mengunduh PDF', pesan: 'Bila berhasil, file ada di folder Download HP.' });
  }

  async function bagikan() {
    if (!S.pdf) return;
    const file = new File([S.pdf.blob], S.pdf.namaFile, { type: 'application/pdf' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: S.pdf.namaFile });
      } catch (e) {
        if (e && e.name === 'AbortError') return;
        tampilBanner(wb, { jenis: 'gagal', judul: 'Menu Bagikan tidak terbuka', pesan: 'Pakai Unduh PDF, lalu buka file dari folder Download dan pilih Cetak.' });
      }
    } else {
      tampilBanner(wb, { jenis: 'info', judul: 'HP ini belum mendukung', pesan: 'Pakai Unduh PDF, lalu buka file dari folder Download dan pilih Cetak.' });
    }
  }
}

function unduhBlob(url, nama) {
  const a = el('a', { href: url, download: nama, class: 'tersembunyi' });
  document.body.append(a);
  a.click();
  a.remove();
}

/* ════════════════════════════════════════════════════════════
   LAYAR: BAGIKAN KE PEMBELI (WhatsApp)
   - Default: foto properti + keterangan. KTP dan NPWP tidak pernah ditawarkan.
   - PBB/Sertifikat hanya bila dicentang dan penjual sudah setuju.
   - Komisi tidak pernah ikut.
   - Foto disiapkan lebih dulu, supaya saat tombol ditekan menu Bagikan HP langsung terbuka.
   ════════════════════════════════════════════════════════════ */

function lepasBagikan() { /* foto besar tetap di memori sementara untuk dipakai lagi */ }

function teksPromosi(props, untuk) {
  const baris = [];
  if (untuk) {
    baris.push('Halo ' + namaSapaan(untuk.nama) + ', berikut ' + (props.length > 1 ? 'beberapa properti' : 'properti') + ' yang mungkin cocok:', '');
  }
  props.forEach(function (pr, i) {
    baris.push((props.length > 1 ? (i + 1) + '. ' : '') + '*' + pr.nama_properti + '*');
    baris.push(namaJenis(pr.jenis) + (pr.kondisi ? ' ' + pr.kondisi.toLowerCase() : '') + (pr.area ? ' di ' + pr.area : ''));
    // Harga promo: harga normal dicoret (~), harga promo tebal (*), seperti "~Rp 1,3 M~ *Rp 1,2 M*"
    const hargaWa = function (normal, promo, akhiran) {
      if (!normal) return '';
      const b = Number(promo) > 0 && Number(promo) < Number(normal);
      return b ? '~' + rupiahPendek(normal) + '~ *' + rupiahPendek(promo) + '*' + akhiran : rupiahPendek(normal) + akhiran;
    };
    if (pr.dijual) baris.push('Dijual' + (pr.harga_jual ? ' ' + hargaWa(pr.harga_jual, pr.harga_jual_promo, '') : ''));
    if (pr.disewakan) baris.push('Disewakan' + (pr.harga_sewa ? ' ' + hargaWa(pr.harga_sewa, pr.harga_sewa_promo, ' ' + satuanSewa(pr, true)) : ''));
    const u = [
      pr.luas_tanah ? 'LT ' + angkaTampil(pr.luas_tanah) + ' m²' : '',
      pr.luas_bangunan ? 'LB ' + angkaTampil(pr.luas_bangunan) + ' m²' : '',
      pr.kamar_tidur ? pr.kamar_tidur + ' KT' : '',
      pr.kamar_mandi ? pr.kamar_mandi + ' KM' : ''
    ].filter(Boolean).join(' · ');
    if (u) baris.push(u);
    if (pr.panjang_tanah && pr.lebar_tanah) baris.push('Tanah ' + angkaTampil(pr.panjang_tanah) + ' x ' + angkaTampil(pr.lebar_tanah) + ' m');
    if (carportTeks(pr)) baris.push('Carport ' + carportTeks(pr).toLowerCase());
    if (pr.listrik_va) baris.push('Listrik ' + formatRibuan(pr.listrik_va) + ' watt');
    if (pr.sumber_air) baris.push('Air ' + pr.sumber_air);
    if (pr.menghadap) baris.push('Menghadap ' + pr.menghadap);
    if (adaBU(pr)) baris.push('BU (penjual butuh uang)');
    if (pr.sertifikat) baris.push('Sertifikat ' + namaJenis(pr.sertifikat));
    baris.push('');
  });
  baris.push('Info dan jadwal survei hubungi ' + CONFIG.NAMA_PEMILIK + '.');
  return baris.join('\n');
}

function layarBagikan(isi, p) {
  const ids = Array.isArray(p.ids) ? p.ids : [];
  const props = ids.map(cariProperti).filter(Boolean);
  if (!props.length) return tidakAda();
  kepala({ judul: 'Bagikan ke Pembeli' });
  const st = S.layar;
  const wb = el('div');

  // Untuk siapa (boleh kosong: pilih kontak di WhatsApp)
  const pembeli = S.data.klien.filter(function (k) { return k.peran === 'Pembeli'; });
  const cocok = {};
  props.forEach(function (pr) { pembeliCocok(pr).cocok.forEach(function (k) { cocok[k.id_klien] = true; }); });
  pembeli.sort(function (a, b) {
    return ((cocok[a.id_klien] ? 0 : 1) - (cocok[b.id_klien] ? 0 : 1)) ||
      (((a.status_beli || 'Mencari') === 'Mencari' ? 0 : 1) - ((b.status_beli || 'Mencari') === 'Mencari' ? 0 : 1)) || urutNama(a, b, 'nama');
  });
  const selUntuk = el('select', { class: 'isian', id: 'bUntuk' },
    el('option', { value: '', text: 'Belum dipilih (pilih kontaknya di WhatsApp)' }),
    pembeli.map(function (k) { return el('option', { value: k.id_klien, text: k.nama + (cocok[k.id_klien] ? ' · cocok' : '') + (k.no_hp ? '' : ' · tanpa nomor') }); }));
  selUntuk.value = p.untuk && cariKlien(p.untuk) ? p.untuk : '';

  // Keterangan
  const teks = el('textarea', { class: 'isian', id: 'bTeks', rows: '10', maxlength: '3000' });
  let teksDiubah = false;
  const untuk = function () { return selUntuk.value ? cariKlien(selUntuk.value) : null; };
  teks.value = teksPromosi(props, untuk());
  teks.addEventListener('input', function () { teksDiubah = true; segarkanChat(); });

  // Foto properti: satu properti -> semua (maks 10); beberapa properti -> satu per properti.
  const semuaFoto = [];
  props.forEach(function (pr) {
    fotoProperti(pr).forEach(function (d, i) {
      semuaFoto.push({ d: d, pr: pr, pilih: props.length === 1 ? i < BAGIKAN_FOTO_MAKS : i === 0 });
    });
  });
  let n = 0;
  semuaFoto.forEach(function (x) { if (x.pilih) { n++; if (n > BAGIKAN_FOTO_MAKS) x.pilih = false; } });

  // Dokumen tambahan: PBB dan Sertifikat, mati dulu.
  const dokTambahan = [];
  props.forEach(function (pr) {
    S.data.dokumen.filter(function (d) { return d.id_properti === pr.id_properti && DOK_BOLEH_DIBAGIKAN.indexOf(d.jenis) >= 0; })
      .sort(function (a, b) { return a.dibuat_pada < b.dibuat_pada ? 1 : -1; })
      .forEach(function (d) { dokTambahan.push({ d: d, pr: pr, pilih: false }); });
  });

  const statusSiap = el('p', { class: 'kecil redup', 'aria-live': 'polite' });
  const kisi = el('div', { class: 'kisi-foto' });
  const tombolKirim = tombol('tombol-wa', ikonWa('putih'), 'Kirim ke WhatsApp', kirim);
  const wadahChat = el('div');
  const tombolSalin = tombol('tombol-kedua', 'salin', 'Salin teks saja', salin);

  let halamanFoto = 0;
  const navFoto = el('div', { class: 'nav-foto tersembunyi' });
  function gambarKisi() {
    kosongkan(kisi);
    const per = CONFIG.FOTO_PER_HALAMAN;
    const jumlahHal = Math.max(1, Math.ceil(semuaFoto.length / per));
    halamanFoto = Math.min(halamanFoto, jumlahHal - 1);
    const awal = halamanFoto * per;
    kosongkan(navFoto);
    navFoto.classList.toggle('tersembunyi', jumlahHal < 2);
    if (jumlahHal > 1) {
      navFoto.append(
        tombol('tombol-kedua tombol-kecil', 'kiri', 'Sebelumnya', function () { halamanFoto--; gambarKisi(); }),
        el('span', { class: 'kecil tebal tengah-teks', text: 'Hal. ' + (halamanFoto + 1) + ' dari ' + jumlahHal }),
        tombol('tombol-kedua tombol-kecil', 'kanan', 'Berikutnya', function () { halamanFoto++; gambarKisi(); }));
      navFoto.children[0].disabled = halamanFoto === 0;
      navFoto.children[2].disabled = halamanFoto >= jumlahHal - 1;
    }
    semuaFoto.slice(awal, awal + per).forEach(function (x, j) {
      const i = awal + j;
      const b = el('button', { type: 'button', class: 'ubin-foto', 'aria-pressed': x.pilih ? 'true' : 'false', 'aria-label': 'Foto ' + (i + 1) + ' ' + x.pr.nama_properti },
        ikon('gambar'), el('span', { class: 'centang-foto' }, ikon('centang')));
      pasangMini(b, x.d.id_dokumen);
      b.addEventListener('click', function () {
        if (!x.pilih && jumlahPilih() >= BAGIKAN_FOTO_MAKS) {
          tampilBanner(wb, { jenis: 'waspada', judul: 'Paling banyak ' + BAGIKAN_FOTO_MAKS + ' foto sekali kirim', pesan: 'Matikan foto lain dulu.' });
          return;
        }
        x.pilih = !x.pilih;
        b.setAttribute('aria-pressed', x.pilih ? 'true' : 'false');
        siapkan();
      });
      kisi.append(b);
    });
  }
  function jumlahPilih() {
    return semuaFoto.filter(function (x) { return x.pilih; }).length + dokTambahan.filter(function (x) { return x.pilih; }).length;
  }

  const daftarDok = dokTambahan.length ? el('div', { class: 'daftar' }, dokTambahan.map(function (x) {
    const penjual = cariKlien(x.pr.id_klien);
    return kotakCentang((x.d.judul || x.d.jenis) + (props.length > 1 ? ' · ' + x.pr.nama_properti : ''), 'Difoto ' + formatTanggal(x.d.dibuat_pada), false, async function (v) {
      if (v) {
        if (jumlahPilih() >= BAGIKAN_FOTO_MAKS) {
          tampilBanner(wb, { jenis: 'waspada', judul: 'Paling banyak ' + BAGIKAN_FOTO_MAKS + ' foto sekali kirim', pesan: 'Matikan foto lain dulu.' });
          return false;
        }
        const k = untuk();
        const ya = await konfirmasi('Penjual sudah setuju?',
          (penjual ? penjual.nama : 'Penjual') + ' sudah setuju foto ' + (x.d.judul || x.d.jenis) + ' ini dikirim' + (k ? ' ke ' + k.nama : ' ke pembeli') + '?',
          'Ya, sudah setuju', 'tombol-utama');
        if (!ya) return false;
      }
      x.pilih = v;
      siapkan();
      return true;
    });
  })) : null;

  tambahAnak(isi, [wb,
    el('p', { class: 'redup', text: props.length > 1 ? props.length + ' properti' : props[0].nama_properti }),
    el('div', { class: 'bidang jarak-atas-kecil' }, el('label', { class: 'label', for: 'bUntuk' }, el('span', { text: 'Untuk siapa?' }), el('span', { class: 'keterangan', text: 'Boleh kosong' })), selUntuk),
    judulBagian('Foto properti (' + semuaFoto.length + ')'),
    semuaFoto.length ? el('div', {}, kisi, navFoto) : el('p', { class: 'redup', text: 'Belum ada foto properti. Keterangan tetap bisa dikirim.' }),
    dokTambahan.length ? judulBagian('Dokumen tambahan') : null,
    dokTambahan.length ? el('p', { class: 'kecil redup', text: 'Hanya bila penjual sudah setuju. KTP dan NPWP tidak pernah bisa dibagikan dari sini.' }) : null,
    daftarDok,
    el('div', { class: 'bidang jarak-atas' }, el('label', { class: 'label', for: 'bTeks' }, el('span', { text: 'Keterangan' }), el('span', { class: 'keterangan', text: 'Boleh diubah' })), teks,
      el('p', { class: 'kecil redup', text: 'Alamat lengkap dan komisi tidak dimasukkan. Tambahkan sendiri bila perlu.' })),
    el('div', { class: 'tumpuk' }, statusSiap, tombolKirim, wadahChat, tombolSalin)]);

  selUntuk.addEventListener('change', function () {
    gantiParam({ untuk: selUntuk.value });
    if (!teksDiubah) teks.value = teksPromosi(props, untuk());
    segarkanChat();
  });

  function segarkanChat() {
    kosongkan(wadahChat);
    const k = untuk();
    if (k && k.no_hp) wadahChat.append(tautanWa(k.no_hp, teks.value, 'tombol-wa-garis', 'Chat ' + k.nama + ' di WhatsApp (tanpa foto)'));
  }

  // Siapkan foto besar yang dipilih (diambil dari server), supaya tombol Kirim bisa langsung membuka menu Bagikan.
  let urutanSiap = 0;
  async function siapkan() {
    const nomor = ++urutanSiap;
    const dipilih = semuaFoto.filter(function (x) { return x.pilih; }).concat(dokTambahan.filter(function (x) { return x.pilih; }));
    const belum = dipilih.filter(function (x) { return !S.urlFoto.has(x.d.id_dokumen); });
    tombolKirim.disabled = belum.length > 0;
    for (let i = 0; i < belum.length; i++) {
      if (nomor !== urutanSiap || S.layar !== st) return;
      statusSiap.textContent = 'Menyiapkan foto ' + (i + 1) + ' dari ' + belum.length + '...';
      try {
        await ambilFotoBesar(belum[i].d.id_dokumen, 'bagikan');
      } catch (e) {
        if (e instanceof GalatSesi) return;
        statusSiap.textContent = 'Foto belum bisa disiapkan. Periksa internet.';
        tombolKirim.disabled = false;   // tetap bisa kirim; foto yang gagal tidak ikut
        return;
      }
    }
    if (nomor !== urutanSiap) return;
    statusSiap.textContent = dipilih.length ? dipilih.length + ' foto siap dikirim.' : 'Tidak ada foto dipilih. Hanya keterangan yang dikirim.';
    tombolKirim.disabled = false;
  }

  function berkasTerpilih() {
    const dipilih = semuaFoto.filter(function (x) { return x.pilih; }).concat(dokTambahan.filter(function (x) { return x.pilih; }));
    // Gerbang terakhir: KTP dan NPWP tidak pernah ikut. Pagar di ambilFotoBesar terlewati bila
    // fotonya sudah ada di memori (pernah dibuka di Lihat Dokumen), karena foto itu tidak diminta ulang.
    return dipilih.filter(function (x) { return S.urlFoto.has(x.d.id_dokumen) && DOK_KLIEN.indexOf(x.d.jenis) < 0; }).map(function (x, i) {
      const nama = bersihkanNama(x.pr.nama_properti) + ' - ' + (x.d.judul || x.d.jenis) + ' ' + (i + 1) + '.jpg';
      return new File([S.urlFoto.get(x.d.id_dokumen).blob], nama, { type: 'image/jpeg' });
    });
  }

  function salinKeClipboard() {
    try { if (navigator.clipboard) navigator.clipboard.writeText(teks.value).catch(function () { /* abaikan */ }); } catch (e) { /* abaikan */ }
  }

  function kirim() {
    const files = berkasTerpilih();
    salinKeClipboard();
    // Menu Bagikan HP harus dibuka langsung saat tombol ditekan (tanpa menunggu apa pun).
    if (navigator.share && (!files.length || (navigator.canShare && navigator.canShare({ files: files })))) {
      const data = files.length ? { files: files, text: teks.value } : { text: teks.value };
      navigator.share(data).then(function () {
        tampilBanner(wb, { jenis: 'sukses', judul: 'Menu Bagikan sudah dibuka', pesan: 'Keterangan juga sudah disalin. Bila tidak ikut terkirim di WhatsApp, tekan lama kolom pesan lalu Tempel.' });
      }).catch(function (e) {
        if (e && e.name === 'AbortError') return;
        cadanganKirim(files);
      });
      return;
    }
    cadanganKirim(files);
  }

  /** Laptop atau HP yang tidak bisa membagikan file: foto diunduh, WhatsApp dibuka dengan teksnya. */
  function cadanganKirim(files) {
    files.forEach(function (f) {
      const u = URL.createObjectURL(f);
      unduhBlob(u, f.name);
      setTimeout(function () { URL.revokeObjectURL(u); }, 10000);
    });
    const k = untuk();
    window.open('https://wa.me/' + (k && k.no_hp ? keWa(k.no_hp) : '') + '?text=' + encodeURIComponent(teks.value), '_blank', 'noopener');
    tampilBanner(wb, { jenis: 'info', judul: 'WhatsApp dibuka dengan keterangannya', pesan: files.length ? files.length + ' foto diunduh ke folder Download. Lampirkan dari sana di WhatsApp.' : 'Pilih kontaknya lalu kirim.' });
  }

  function salin() {
    salinKeClipboard();
    tampilBanner(wb, { jenis: 'sukses', judul: 'Teks disalin', pesan: 'Tempel di WhatsApp atau aplikasi lain.' });
  }

  gambarKisi();
  segarkanChat();
  siapkan();
}

function bersihkanNama(s) {
  return String(s || '').replace(/[\\/:*?"<>|]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60) || 'Properti';
}

/* ════════════════════════════════════════════════════════════
   LAYAR: BARU DIHAPUS
   ════════════════════════════════════════════════════════════ */

function layarDihapus(isi) {
  kepala({ judul: 'Baru Dihapus' });
  const st = S.layar;
  const wb = el('div');
  const daftar = el('div', { class: 'jarak-atas-kecil' }, el('div', { class: 'kosong' }, el('div', { class: 'pemutar', 'aria-hidden': 'true' }), el('p', { class: 'tebal', text: 'Membuka daftar...' })));
  isi.append(el('p', { class: 'redup', text: 'Data yang dihapus disimpan 30 hari. Setelah itu dibuang permanen secara otomatis.' }), wb, daftar);
  sisipBanner(wb);

  async function muat() {
    try {
      const j = await panggil('daftarDihapus', {});
      if (S.layar !== st) return;
      kosongkan(daftar);
      if (!j.ok) { daftar.append(buatBanner({ jenis: 'gagal', tanpaTutup: true, judul: 'Daftar belum bisa dibuka', pesan: j.pesan })); return; }
      if (!j.data.daftar.length) {
        daftar.append(el('div', { class: 'kosong' }, el('div', { class: 'lingkar-ikon' }, ikon('sampah')), el('h2', { text: 'Kosong' }), el('p', { class: 'redup', text: 'Tidak ada data yang baru dihapus.' })));
        return;
      }
      daftar.append(el('div', { class: 'daftar' }, j.data.daftar.map(function (x) {
        const ikut = [x.ikutProperti ? x.ikutProperti + ' properti' : '', x.ikutDokumen ? x.ikutDokumen + ' foto' : ''].filter(Boolean).join(' dan ');
        return el('div', { class: 'baris baris-statis baris-dihapus' },
          el('span', { class: 'ubin-ikon' }, ikon(x.jenis === 'klien' ? 'orang' : x.jenis === 'properti' ? 'rumah' : 'gambar')),
          el('span', { class: 'tengah' },
            el('span', { class: 'judul', text: x.nama }),
            el('span', { class: 'sub', text: x.keterangan + (ikut ? ' · beserta ' + ikut : '') }),
            el('span', { class: 'sub' + (x.sisaHari <= 3 ? ' teks-aksen tebal' : ''), text: 'Dihapus ' + formatTanggal(x.dihapus_pada) + ' · sisa ' + x.sisaHari + ' hari' })),
          tombol('tombol-kecil', 'ulang', 'Pulihkan', function () { pulihkan(x); }));
      })));
    } catch (e) {
      if (e instanceof GalatSesi || S.layar !== st) return;
      kosongkan(daftar);
      daftar.append(buatBanner({ jenis: 'waspada', tanpaTutup: true, judul: 'Butuh internet', pesan: 'Periksa internet, lalu buka lagi.' }),
        tombol('tombol-utama', 'ulang', 'Coba lagi', function () { tampilkan(S.layar); }));
    }
  }

  async function pulihkan(x) {
    tampilMemuat('Memulihkan ' + x.nama + '...');
    try {
      const j = await panggil('pulihkan', { jenis: x.jenis, id: x.id });
      if (!j.ok) { tutupMemuat(); tampilBanner(wb, { jenis: 'gagal', judul: 'Belum bisa dipulihkan', pesan: j.pesan }); return; }
      const m = await panggil('muatData', {});
      tutupMemuat();
      if (m.ok) terimaData(m.data);
      S.bannerBerikut = { jenis: 'sukses', judul: x.nama + ' dipulihkan', pesan: 'Sudah tampil lagi di aplikasi.' };
      tampilkan(S.layar);
    } catch (e) {
      tutupMemuat();
      if (e instanceof GalatSesi) return;
      tampilBanner(wb, { jenis: 'waspada', judul: 'Hasil belum pasti', pesan: 'Koneksi terputus. Buka lagi menu ini untuk melihat hasilnya.' });
    }
  }

  muat();
}

/* ════════════════════════════════════════════════════════════
   LAYAR: RAPIKAN AREA
   Satukan area yang sama tapi ejaannya berbeda (Jaksel = Jakarta Selatan).
   ════════════════════════════════════════════════════════════ */

function layarRapikanArea(isi) {
  kepala({ judul: 'Rapikan Area' });
  const wb = el('div');
  isi.append(el('p', { class: 'redup', text: 'Ketuk area untuk mengganti namanya atau menggabungkannya ke area lain. Properti dan pembeli ikut pindah.' }), wb);
  sisipBanner(wb);
  const hitung = {};
  S.data.properti.forEach(function (pr) { if (pr.area) { hitung[pr.area] = hitung[pr.area] || { p: 0, b: 0 }; hitung[pr.area].p++; } });
  S.data.klien.forEach(function (k) { if (k.kebutuhan_area) { hitung[k.kebutuhan_area] = hitung[k.kebutuhan_area] || { p: 0, b: 0 }; hitung[k.kebutuhan_area].b++; } });
  const area = Object.keys(hitung).sort(function (a, b) { return norm(a).localeCompare(norm(b), 'id'); });
  if (!area.length) {
    isi.append(el('div', { class: 'kosong' }, el('div', { class: 'lingkar-ikon' }, ikon('area')), el('h2', { text: 'Belum ada area' }),
      el('p', { class: 'redup', text: 'Area diisi di data properti dan di yang dicari pembeli.' })));
    return;
  }
  // Tandai pasangan yang ejaannya mirip.
  const mirip = {};
  area.forEach(function (a, i) {
    area.slice(i + 1).forEach(function (b) {
      const x = norm(a), y = norm(b);
      if (x.indexOf(y) === 0 || y.indexOf(x) === 0 || jarakEjaan(x, y) <= 2) { mirip[a] = true; mirip[b] = true; }
    });
  });
  isi.append(el('div', { class: 'daftar jarak-atas-kecil' }, area.map(function (a) {
    const h = hitung[a];
    return el('button', { type: 'button', class: 'baris', onclick: function () { ubahArea(a); } },
      el('span', { class: 'ubin-ikon' }, ikon('pin')),
      el('span', { class: 'tengah' },
        el('span', { class: 'judul', text: a }),
        el('span', { class: 'sub', text: [h.p ? h.p + ' properti' : '', h.b ? h.b + ' pembeli' : ''].filter(Boolean).join(' · ') }),
        mirip[a] ? el('span', { class: 'sub teks-aksen tebal', text: 'Mungkin sama dengan area lain' }) : null),
      ikon('pensil', 'panah'));
  })));

  async function ubahArea(a) {
    const lain = area.filter(function (x) { return x !== a; });
    const sel = el('select', { class: 'isian', id: 'raKe' },
      el('option', { value: '', text: 'Ganti nama (ketik di bawah)' }),
      lain.map(function (x) { return el('option', { value: x, text: 'Gabungkan ke: ' + x }); }));
    const input = el('input', { class: 'isian', id: 'raNama', type: 'text', maxlength: '60', autocomplete: 'off' });
    input.value = a;
    pasangRapi(input, function (v) { return rapiJudul_(v, false); });
    const salah = el('p', { class: 'pesan-salah tersembunyi', text: 'Ketik nama area yang baru.' });
    sel.addEventListener('change', function () { input.disabled = !!sel.value; });
    const pilih = await pilihDialog({
      judul: 'Area: ' + a,
      isi: el('div', {},
        el('div', { class: 'bidang' }, el('label', { class: 'label', for: 'raKe' }, el('span', { text: 'Mau diapakan?' })), sel),
        el('div', { class: 'bidang' }, el('label', { class: 'label', for: 'raNama' }, el('span', { text: 'Nama area' })), input, salah)),
      pilihan: [{ nilai: 'ok', teks: 'Simpan', kelas: 'tombol-utama', periksa: function () {
        const ok = !!sel.value || !!rapiJudul_(input.value, false);
        salah.classList.toggle('tersembunyi', ok);
        return ok;
      } }]
    });
    if (pilih !== 'ok') return;
    const ke = sel.value || rapiJudul_(input.value, false);
    if (ke === a) return;
    tampilMemuat('Merapikan area...');
    try {
      const j = await panggil('gabungArea', { dari: a, ke: ke });
      tutupMemuat();
      if (!j.ok) { tampilBanner(wb, { jenis: 'gagal', judul: 'Belum berhasil', pesan: j.pesan }); return; }
      const hasil = j.data.ke;
      S.data.properti.forEach(function (pr) { if (pr.area === a) pr.area = hasil; });
      S.data.klien.forEach(function (k) { if (k.kebutuhan_area === a) k.kebutuhan_area = hasil; });
      S.bannerBerikut = { jenis: 'sukses', judul: a + ' sekarang ' + hasil, pesan: j.data.jumlah + ' data ikut dipindah.' };
      tampilkan(S.layar);
    } catch (e) {
      tutupMemuat();
      if (e instanceof GalatSesi) return;
      tampilBanner(wb, { jenis: 'waspada', judul: 'Hasil belum pasti', pesan: 'Koneksi terputus. Tekan Perbarui di Beranda untuk melihat hasilnya.' });
    }
  }
}

/* ════════════════════════════════════════════════════════════
   LAYAR: TANPA INTERNET
   ════════════════════════════════════════════════════════════ */

function layarTanpaInternet(isi, p) {
  kepala({ judul: 'Arsip Properti', tanpaKembali: true });
  isi.append(el('div', { class: 'kosong' },
    el('div', { class: 'lingkar-ikon' }, ikon('awanPutus')),
    el('h2', { text: 'Butuh internet untuk membuka data' }),
    el('p', { class: 'redup', text: 'Periksa Wi-Fi atau paket data HP, lalu tekan Coba lagi.' }),
    jumlahFotoTertunda() ? el('p', { class: 'tebal', text: 'Foto yang belum tersimpan tetap aman di HP ini.' }) : null,
    el('div', { class: 'jarak-atas' }, tombol('tombol-utama', 'ulang', 'Coba lagi', function () {
      if (S.tiket) muatData(p.tujuan);
      else buka('masuk', {}, { ganti: true });
    }))));
}

/* ════════════════════════════════════════════════════════════
   MULAI
   ════════════════════════════════════════════════════════════ */

/** Muat ulang halaman bila ada versi baru dan pengguna sedang di Beranda atau layar masuk. */
function muatUlangBilaAman() {
  if (!S.perluMuatUlang || S.sibuk) return;
  const n = S.layar && S.layar.nama;
  if (!n || n === 'beranda' || n === 'masuk') {
    S.perluMuatUlang = false;
    location.reload();
  }
}

/** Pita oranye di bagian atas halaman pada versi uji. Versi asli tidak punya pita ini. */
function pasangPitaUji() {
  if (CONFIG.MODE !== 'uji') return;
  document.body.prepend(el('div', { class: 'pita-uji', role: 'status', text: 'VERSI UJI — akun virakhususgame@gmail.com' }));
}

function mulai() {
  pasangPitaUji();
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    const adaPengendali = !!navigator.serviceWorker.controller;
    // Versi baru terpasang -> muat ulang sendiri pada saat aman (tidak sedang mengisi formulir).
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (!adaPengendali) return;
      S.perluMuatUlang = true;
      muatUlangBilaAman();
    });
    navigator.serviceWorker.register('./sw.js', { scope: './' }).then(function (reg) {
      // Cek versi baru setiap kali aplikasi dibuka kembali dari latar belakang.
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') reg.update().catch(function () { /* abaikan */ });
      });
      reg.update().catch(function () { /* abaikan */ });
    }).catch(function () { /* aplikasi tetap jalan */ });
  }
  document.getElementById('tombolKembali').addEventListener('click', function () { history.back(); });

  S.tiket = bacaTiket();
  try { S.baruDibuka = JSON.parse(bacaSesi('ap_baru') || '[]').filter(function (x) { return typeof x === 'string'; }); } catch (e) { S.baruDibuka = []; }

  const awal = history.state && LAYAR[history.state.nama] && history.state.nama !== 'simpanFoto'
    ? history.state : { nama: S.tiket ? 'beranda' : 'masuk', param: {} };
  if (S.tiket && configLengkap()) {
    muatFotoTertunda().then(function () {
      if (!navigator.onLine) { buka('tanpaInternet', { tujuan: awal }, { ganti: true }); return; }
      muatData(awal);
    });
  } else {
    S.tiket = null;
    // Tidak ada tiket yang sah (misalnya sudah lewat 14 hari): sisa foto di HP ikut dibuang.
    dbBuang('kv', 'foto');
    dbKosongkan('mini');
    history.replaceState({ nama: 'masuk', param: {} }, '', '#masuk');
    tampilkan({ nama: 'masuk', param: {} });
  }
}

document.addEventListener('DOMContentLoaded', mulai);
