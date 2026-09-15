/*
  layout.js
  ---------
  Membuat Sidebar + Topbar aplikasi lalu menyuntikkannya ke halaman.
  Dipanggil di setiap halaman aplikasi dengan:  NuvviLayout.mount("dashboard")

  Kenapa lewat JS? Supaya menu cukup ditulis SEKALI di sini, tidak disalin di
  7 halaman. Halaman marketing (Home/Pricing/Login/Register) tidak memakai ini.
*/
(function () {
  var D = window.NUVVI_DATA;

  /* ---------- Kumpulan ikon (SVG kecil, warna mengikuti teks) ---------- */
  var ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
    camera:
      '<path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L19 6h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><circle cx="12" cy="13" r="3.5"/>',
    run: '<circle cx="15" cy="5" r="2"/><path d="m8 21 2-5 3-2-1-4-4 2-1 3"/><path d="m13 14 3 2 3-1"/><path d="M10 9 6 8"/>',
    heart:
      '<path d="M12 20s-7-4.5-9.5-9C1 8 2.5 4.5 6 4.5c2 0 3.2 1 4 2.2.8-1.2 2-2.2 4-2.2 3.5 0 5 3.5 3.5 6.5C19 15.5 12 20 12 20Z"/><path d="m8 12 2-3 2 4 2-3h2"/>',
    users:
      '<circle cx="9" cy="8" r="3"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 6a3 3 0 0 1 0 6"/><path d="M18 20a5.5 5.5 0 0 0-3-4.9"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    bell: '<path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4Z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    edit: '<path d="M4 20h4L20 8l-4-4L4 16Z"/><path d="m14 6 4 4"/>',
    chevronRight: '<path d="m9 6 6 6-6 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    logout: '<path d="M15 4h4v16h-4"/><path d="M10 8 6 12l4 4"/><path d="M6 12h9"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    check: '<path d="m5 12 5 5 9-11"/>',
  };

  function icon(name, cls) {
    return (
      '<svg class="' +
      (cls || "w-5 h-5") +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONS[name] || "") +
      "</svg>"
    );
  }
  window.nvIcon = icon; // dipakai halaman lain juga

  /* ---------- HTML Sidebar ---------- */
  function sidebarHTML(active) {
    var items = D.appMenu
      .map(function (m) {
        var on = m.id === active;
        return (
          '<a href="' +
          m.href +
          '" class="flex items-center gap-3 rounded-2xl px-4 py-3 font-display font-bold transition ' +
          (on ? "bg-sage/20 text-cocoa" : "text-cocoa/70 hover:bg-sage/10 hover:text-cocoa") +
          '">' +
          icon(m.icon, "w-5 h-5 shrink-0") +
          "<span>" +
          m.label +
          "</span></a>"
        );
      })
      .join("");

    var profileOn = active === "profile";

    return (
      '<div class="flex h-full flex-col gap-6 p-5">' +
      '  <a href="dashboard.html" class="flex items-center gap-2 px-2">' +
      '    <img src="assets/img/logo.png" alt="Logo Nuvvi" class="w-10 h-10 rounded-full object-cover">' +
      '    <span class="font-display text-2xl font-extrabold text-cocoa">Nuvvi</span>' +
      "  </a>" +
      '  <nav class="flex flex-col gap-1">' +
      items +
      "  </nav>" +
      '  <div class="mt-auto flex flex-col gap-1 border-t border-cocoa/10 pt-4">' +
      '    <a href="profile.html" class="flex items-center gap-3 rounded-2xl px-4 py-3 font-display font-bold transition ' +
      (profileOn ? "bg-sage/20 text-cocoa" : "text-cocoa/70 hover:bg-sage/10 hover:text-cocoa") +
      '">' +
      icon("edit", "w-5 h-5 shrink-0") +
      "<span>Profile</span></a>" +
      '    <a id="nv-logout" href="index.html" class="flex items-center gap-3 rounded-2xl px-4 py-3 font-display font-bold text-cocoa/70 transition hover:bg-sage/10 hover:text-cocoa">' +
      icon("logout", "w-5 h-5 shrink-0") +
      "<span>Log out</span></a>" +
      "  </div>" +
      "</div>"
    );
  }

  /* ---------- HTML Topbar ---------- */
  function topbarHTML() {
    var profile = window.nvGet ? window.nvGet("profile", D.defaultProfile) : D.defaultProfile;
    return (
      '<div class="flex min-w-0 items-center gap-2 px-3 py-3 sm:gap-3 sm:px-4 lg:px-6">' +
      '  <button id="nv-menu-btn" type="button" aria-label="Buka menu" class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-cocoa shadow-soft-sm lg:hidden">' +
      icon("menu", "w-6 h-6") +
      "  </button>" +
      '  <label class="relative min-w-0 flex-1">' +
      '    <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cocoa/50">' +
      icon("search", "w-5 h-5") +
      "</span>" +
      '    <input id="nv-search" type="text" autocomplete="off" placeholder="Search article"' +
      '      class="w-full rounded-md border-0 bg-[#C9BCA9]/60 py-3 pl-12 pr-4 text-cocoa placeholder:text-cocoa/60 focus:outline-none focus:ring-4 focus:ring-forest/15">' +
      '    <div id="nv-search-results" class="absolute left-0 right-0 top-full z-30 mt-2 hidden overflow-hidden rounded-3xl bg-white shadow-soft"></div>' +
      "  </label>" +
      '  <button type="button" aria-label="Notifikasi" class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-cocoa hover:bg-white">' +
      icon("bell", "w-6 h-6") +
      "  </button>" +
      '  <a href="profile.html" class="flex shrink-0 items-center gap-2">' +
      '    <img src="assets/img/avatar-mia.png" alt="Foto profil" class="h-11 w-11 rounded-full object-cover">' +
      '    <span class="hidden leading-tight sm:block">' +
      '      <span id="nv-user-name" class="block font-display font-bold text-cocoa">' +
      (profile.name || "Mia") +
      "</span>" +
      '      <span class="block text-xs text-cocoa/60">' +
      (D.profileTagline || "Stay Healthy!") +
      "</span>" +
      "    </span>" +
      "  </a>" +
      "</div>"
    );
  }

  /* ---------- Banner trial (muncul kalau belum login) ---------- */
  function bannerHTML() {
    return (
      '<div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 bg-forest px-4 py-2.5 text-center text-sm font-bold text-white">' +
      "<span>🎁 Kamu buka trial 7 hari! Login / Daftar buat fitur penuh.</span>" +
      '<span class="flex gap-2">' +
      '<a href="login.html" class="rounded-md bg-white/20 px-3 py-1 transition hover:bg-white/30">Login</a>' +
      '<a href="register.html" class="rounded-md bg-sun px-3 py-1 text-cocoa transition hover:brightness-95">Daftar</a>' +
      "</span></div>"
    );
  }

  /* ---------- Footer (dipakai bersama di semua halaman aplikasi) ---------- */
  function footerHTML() {
    return (
      '<footer class="mt-auto border-t border-cocoa/10 bg-cream py-8 text-center text-sm text-cocoa/70">' +
      '<div class="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4">' +
      '<div class="flex items-center gap-2">' +
      '<img src="assets/img/logo.png" alt="" class="h-7 w-7 rounded-full">' +
      '<span class="font-display font-bold text-cocoa">Nuvvi</span>' +
      "</div>" +
      "<p>&copy; 2026 Nuvvi. Eat better, live healthier.</p>" +
      "</div></footer>"
    );
  }

  /* ---------- Pasang ke halaman + interaksi drawer ---------- */
  function mount(active) {
    var sb = document.getElementById("app-sidebar");
    var tb = document.getElementById("app-topbar");
    if (sb) sb.innerHTML = sidebarHTML(active);
    if (tb) {
      tb.innerHTML = topbarHTML();
      // Belum login = mode demo -> tampilkan banner trial di bawah topbar
      var loggedIn = window.nvGet && window.nvGet("auth", {}).loggedIn;
      if (!loggedIn) tb.insertAdjacentHTML("afterend", bannerHTML());
      // Footer dipasang sekali di kolom konten (di bawah <main>)
      if (tb.parentElement) tb.parentElement.insertAdjacentHTML("beforeend", footerHTML());
    }

    var menuBtn = document.getElementById("nv-menu-btn");
    var backdrop = document.getElementById("app-backdrop");

    function openNav() {
      if (sb) sb.classList.add("is-open");
      if (backdrop) backdrop.classList.remove("hidden");
    }
    function closeNav() {
      if (sb) sb.classList.remove("is-open");
      if (backdrop) backdrop.classList.add("hidden");
    }
    if (menuBtn) menuBtn.addEventListener("click", openNav);
    if (backdrop) backdrop.addEventListener("click", closeNav);

    // Log out: hapus sesi lalu balik ke Home (banner trial muncul lagi)
    var logoutBtn = document.getElementById("nv-logout");
    if (logoutBtn)
      logoutBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (window.nvRemove) window.nvRemove("auth");
        window.location.href = "index.html";
      });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    // Tutup drawer saat salah satu menu diklik (mobile)
    if (sb)
      sb.addEventListener("click", function (e) {
        if (e.target.closest("a")) closeNav();
      });
  }

  window.NuvviLayout = { mount: mount };
})();
