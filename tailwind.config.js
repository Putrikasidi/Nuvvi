/** @type {import('tailwindcss').Config} */
// Konfigurasi Tailwind untuk website Nuvvi.
// "content" = daftar file yang dipindai Tailwind untuk mencari class yang dipakai.
// "theme.extend" = tambahan warna / font / radius khas desain Nuvvi (dari Desain Canva.pdf).
module.exports = {
  content: ["./*.html", "./assets/js/**/*.js"],
  // Class ini dirangkai di app.js ("nv-badge--" + level) sehingga tidak terbaca
  // pemindai Tailwind. Daftarkan manual supaya tidak ikut terhapus saat build.
  safelist: ["nv-badge--good", "nv-badge--moderate", "nv-badge--high"],
  theme: {
    extend: {
      colors: {
        leaf: "#E4F4C4", // background halaman marketing (Home, Pricing, Login, Register)
        cream: "#FBF4E0", // background shell aplikasi (topbar + area luar)
        sage: "#93B56A", // panel konten aplikasi
        "sage-dark": "#6E9A46", // panel form Profile & aksen hijau tua
        forest: "#1E5E1E", // tombol utama
        "forest-hover": "#174a17",
        sun: "#F7D24E", // kartu hero kuning, pill menu aktif
        "sun-soft": "#FCE58C", // kartu kuning muda
        "amber-cta": "#E0930E", // tombol "Langganan Sekarang"
        sky: "#B4E1F5", // header & item Wellness
        "sky-soft": "#D6EEFA",
        cocoa: "#4A2A16", // warna teks utama
        taupe: "#B7AC93", // isian input pada halaman auth
        good: "#8FBF6B", // badge "Health"
        moderate: "#F2C14E", // badge "Moderate"
        high: "#E8837B", // badge "High"
      },
      fontFamily: {
        display: ['"Poppins"', '"Segoe UI"', "system-ui", "sans-serif"],
        sans: ['"Poppins"', '"Segoe UI"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        pill: "9999px",
        btn: "4px", // sudut tombol - dibikin lebih kotak biar tampilannya tegas
      },
      boxShadow: {
        soft: "0 10px 30px rgba(74, 42, 22, 0.10)",
        "soft-sm": "0 6px 18px rgba(74, 42, 22, 0.08)",
      },
    },
  },
  plugins: [],
};
