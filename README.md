# Nuvvi — Eat Better, Live Healthier test

Website kesehatan **Nuvvi**, dibangun mengikuti desain di `Desain Canva.pdf` untuk **Lomba Desain
Web PNB ITC#18** (subtema Kesehatan).

Dibuat dengan **HTML biasa + Tailwind CSS + JavaScript murni** (tanpa React/framework JS, tanpa
backend) — sesuai aturan lomba yang hanya mengizinkan HTML/CSS wajib, Tailwind CSS sebagai
framework, dan JavaScript bersifat opsional.

## Menjalankan di komputer sendiri

Tidak wajib install apa pun — file `assets/css/output.css` sudah jadi (hasil build Tailwind), jadi
paling gampang:

**Cara 1 (paling simpel):** dobel-klik `index.html`, terbuka di browser.

**Cara 2 (disarankan, supaya semua path & fitur jalan mulus):** jalankan server statis lokal dari
folder ini:

```
python -m http.server 8080
```

lalu buka `http://localhost:8080` di browser. (Kalau pakai VS Code, klik kanan `index.html` →
"Open with Live Server" juga bisa.)

## Struktur folder

```
nuvvi/
├── index.html            Home (hero + preview fitur + CTA harga)
├── pricing.html          Pricing (paket Free Trial & Premium)
├── login.html            Login
├── register.html         Create Account
├── dashboard.html        Dashboard (kalori, nutrisi, Daily Reflection, Recent Scans, search)
├── meal-plan.html        Meal Plan (upload foto, meal plan harian, rekomendasi makanan)
├── sport-plan.html       Sport Plan (weekly activity, activity summary, rekomendasi workout)
├── wellness.html         Wellness (jadwal harian + progress harian)
├── wellness-quiz.html    Wellness — 8 pertanyaan personalisasi, satu per layar
├── komunitas.html        Komunitas (artikel & komunitas yang bisa diikuti)
├── profile.html          Profile (bisa diedit & disimpan)
├── assets/
│   ├── css/
│   │   ├── input.css     Sumber Tailwind: @tailwind + class custom (.nv-btn, .nv-card, dst)
│   │   └── output.css    Hasil build Tailwind — INI yang dipakai semua halaman
│   ├── js/
│   │   ├── storage.js    Pembungkus localStorage (nvGet / nvSet)
│   │   ├── data.js       Semua data contoh (dummy) di satu tempat
│   │   ├── layout.js     Membuat Sidebar & Topbar aplikasi, dipasang lewat JS ke tiap halaman
│   │   └── app.js        Semua interaksi: render data, klik, form, dsb.
│   └── img/               Aset gambar (logo, maskot, foto makanan, ikon, ilustrasi olahraga)
├── tailwind.config.js    Warna, font, radius khas Nuvvi
├── package.json          Skrip build CSS (butuh Node.js kalau mau pakai npm)
└── tools/tailwindcss.exe  Tailwind CLI mandiri (tidak perlu Node.js) — dipakai untuk build CSS
```

## Kalau ingin mengubah tampilan (edit class Tailwind)

Karena `output.css` adalah file hasil build, setiap kali mengubah class Tailwind di file HTML/JS,
CSS-nya perlu di-build ulang. Dari dalam folder `nuvvi/`, jalankan salah satu:

```
# tanpa Node.js (pakai CLI mandiri yang sudah disediakan di tools/)
./tools/tailwindcss.exe -i ./assets/css/input.css -o ./assets/css/output.css --minify

# atau kalau sudah install Node.js
npm install
npm run build:css        # build sekali
npm run watch:css        # otomatis build ulang tiap ada perubahan
```

## Cara kerja komponen (biar gampang dipahami)

- **Sidebar & Topbar aplikasi** tidak ditulis ulang di 7 halaman — cukup ditulis sekali di
  `assets/js/layout.js`, lalu setiap halaman aplikasi punya `<aside id="app-sidebar">` dan
  `<header id="app-topbar">` kosong yang diisi otomatis oleh `NuvviLayout.mount(...)`.
- **Data contoh** (kalori, meal plan, komunitas, pertanyaan wellness, dst) semua ada di
  `assets/js/data.js` — kalau mau ganti angka/teks, cukup ubah di situ.
- **Class berulang** (tombol, kartu, badge, input, pill menu) dijadikan class custom di
  `assets/css/input.css` bagian `@layer components` (`.nv-btn`, `.nv-card`, `.nv-badge`, dst) biar
  tidak perlu menulis daftar class Tailwind yang sama berkali-kali di HTML.
- **Penyimpanan** memakai `localStorage` lewat `assets/js/storage.js` (semua key diberi awalan
  `nuvvi:`), dipakai untuk: login/register, jawaban kuis Wellness, centang jadwal harian, komunitas
  yang diikuti, dan data Profile.

## Fitur yang bisa dicoba (bukan cuma tampilan)

- Menu sidebar & navbar berpindah halaman sungguhan.
- Kolom search menampilkan saran artikel saat mengetik.
- Meal Plan: upload foto makanan menampilkan pratinjau gambar + hasil nutrisi contoh.
- Home: klik tab fitur (Dashboard/Meal Plan/dst) mengganti gambar preview.
- Wellness: kuis 8 pertanyaan dijawab satu per satu, tersimpan, lalu muncul ringkasan.
- Wellness: mencentang jadwal harian mengubah ring "Progress Harian" secara langsung.
- Komunitas: tombol "Gabung" berubah jadi "Tergabung" dan jumlah anggota bertambah.
- Profile: tombol "Edit profile info" membuka form, tombol "Simpan" menyimpan perubahan.
- Semua data di atas tersimpan di `localStorage`, jadi tetap ada walau halaman di-refresh.

## Responsive

Dirancang mengikuti 3 ukuran yang disyaratkan panitia lomba:

- **Desktop** 1440×1024 — tampilan dibuat semirip mungkin dengan `Desain Canva.pdf`.
- **Tablet** 820×1180 — sidebar aplikasi berpindah jadi menu atas + tombol menu.
- **Mobile** 390×844 — sidebar jadi laci (drawer) yang muncul dari kiri, semua bagian menumpuk 1
  kolom.

## Menyiapkan berkas untuk dikumpulkan (submission lomba)

1. Pastikan `assets/css/output.css` sudah ter-build (lihat bagian di atas).
2. Kompres folder `nuvvi/` ini menjadi `.zip` (folder `node_modules/` dan `tools/` boleh
   dikecualikan supaya ukurannya kecil — situs tetap jalan tanpa keduanya karena `output.css`
   sudah jadi dan semua JS-nya JavaScript biasa).
3. Ikuti format nama file sesuai juklak lomba (`[NamaPeserta]_Website.zip`, dsb).

## Sumber desain & aset

Semua warna, layout, teks, dan gambar (maskot, foto makanan, ikon nutrisi, ilustrasi olahraga)
diambil/diikuti dari `Desain Canva.pdf` yang dibuat sendiri oleh pemilik proyek ini.
