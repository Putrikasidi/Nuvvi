/* app.js — semua interaksi, dipilih dari <body data-page="..."> */
(function () {
  var D = window.NUVVI_DATA;
  var APP_PAGES = ["dashboard", "meal-plan", "sport-plan", "wellness", "komunitas", "profile"];

  /* ============ Pembantu kecil ============ */
  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function img(name) {
    return "assets/img/" + name;
  }

  /* ============ Titik masuk ============ */
  document.addEventListener("DOMContentLoaded", function () {
    var page = document.body.getAttribute("data-page") || "";

    if (APP_PAGES.indexOf(page) !== -1 && window.NuvviLayout) {
      NuvviLayout.mount(page);
      setupSearch();
    }
    if ((page === "wellness-quiz" || page === "blog") && window.NuvviLayout) {
      NuvviLayout.mount(page === "blog" ? "komunitas" : "wellness");
      setupSearch();
    }

    var setups = {
      home: setupHome,
      login: setupAuthForm,
      register: setupAuthForm,
      dashboard: setupDashboard,
      "meal-plan": setupMealPlan,
      "sport-plan": setupSportPlan,
      wellness: setupWellness,
      "wellness-quiz": setupWellnessQuiz,
      komunitas: setupKomunitas,
      blog: setupBlog,
      profile: setupProfile,
    };
    if (setups[page]) setups[page]();

    // animasi masuk untuk halaman aplikasi (kartu naik + grafik gerak)
    var ANIM_PAGES = APP_PAGES.concat(["wellness-quiz", "blog"]);
    if (ANIM_PAGES.indexOf(page) !== -1) animateApp();

    setupRevealOnScroll();
    setupMarketingNav();
  });

  /* ============ Navbar marketing (menu hamburger di HP) ============ */
  function setupMarketingNav() {
    var btn = qs("[data-nav-toggle]");
    var menu = qs("[data-nav-menu]");
    if (!btn || !menu) return;
    btn.addEventListener("click", function () {
      // di HP: ganti antara tersembunyi <-> tampil sebagai kolom
      menu.classList.toggle("hidden");
      menu.classList.toggle("flex");
    });
  }

  /* Fade-up saat scroll (halaman Home) */
  function setupRevealOnScroll() {
    var items = qsa(".nv-reveal");
    if (!items.length) return;

    function reveal(el) {
      el.classList.add("is-visible");
    }
    if (!("IntersectionObserver" in window)) {
      items.forEach(reveal);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            reveal(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    var vh = window.innerHeight;
    var visibleIndex = 0;
    items.forEach(function (i) {
      var top = i.getBoundingClientRect().top;
      i.classList.add("is-pending");
      if (top < vh) {
        // muncul bertahap (stagger), maksimal 320ms
        i.style.transitionDelay = Math.min(visibleIndex * 80, 320) + "ms";
        visibleIndex++;
        // dua rAF supaya state awal sempat dilukis, transisi baru jalan
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            reveal(i);
          });
        });
      } else {
        io.observe(i);
      }
    });

    // Failsafe: pastikan semua tampil setelah 900ms
    setTimeout(function () {
      items.forEach(reveal);
    }, 900);
  }

  /* ============ Search di topbar (saran artikel) ============ */
  function setupSearch() {
    var input = qs("#nv-search");
    var box = qs("#nv-search-results");
    if (!input || !box) return;

    function render(list) {
      if (!list.length) {
        box.classList.add("hidden");
        box.innerHTML = "";
        return;
      }
      box.innerHTML = list
        .map(function (t) {
          return (
            '<button type="button" class="flex w-full items-center gap-3 px-5 py-3 text-left font-display font-bold text-cocoa hover:bg-leaf/60">' +
            window.nvIcon("search", "w-4 h-4 text-cocoa/50") +
            "<span>" +
            esc(t) +
            "</span></button>"
          );
        })
        .join("");
      box.classList.remove("hidden");
    }

    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      if (!q) return render([]);
      render(
        D.searchIndex
          .filter(function (t) {
            return t.toLowerCase().indexOf(q) !== -1;
          })
          .slice(0, 6)
      );
    });
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      input.value = b.textContent.trim();
      render([]);
      input.focus();
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest("#nv-search") && !e.target.closest("#nv-search-results")) render([]);
    });
  }

  /* ============ HOME ============ */
  function setupHome() {
    var tabs = qsa("[data-feature-tab]");
    var image = qs("#nv-feature-image");
    if (!tabs.length || !image) return;

    function activate(key) {
      var active = null;
      tabs.forEach(function (t) {
        var on = t.getAttribute("data-feature-tab") === key;
        t.classList.toggle("nv-nav-pill--active", on);
        if (on) active = t;
      });
      if (active) {
        image.src = img("preview-" + key + ".png");
        image.alt = "Tampilan " + active.textContent.trim();
      }
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activate(tab.getAttribute("data-feature-tab"));
      });
    });

    // Dari footer (#fitur-<key>): aktifkan tab lalu scroll ke bagian Fitur
    function goToFitur() {
      if (location.hash.indexOf("#fitur") !== 0) return;
      var key = location.hash.slice(6).replace(/^-/, "");
      if (key) activate(key);
      var sec = document.getElementById("fitur");
      if (sec) sec.scrollIntoView({ behavior: "smooth" });
    }
    if (location.hash.indexOf("#fitur") === 0) {
      requestAnimationFrame(goToFitur);
      // ulangi setelah gambar hero selesai load (biar posisi scroll pas)
      window.addEventListener("load", goToFitur);
    }
    // klik footer di halaman Home yang sama (hash berubah tanpa reload)
    window.addEventListener("hashchange", goToFitur);
  }

  /* ============ LOGIN / REGISTER ============ */
  function setupAuthForm() {
    var form = qs("form[data-auth]");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {};
      qsa("input", form).forEach(function (i) {
        if (i.name) data[i.name] = i.value;
      });
      window.nvSet("auth", { email: data.email || "", loggedIn: true });
      if (form.getAttribute("data-auth") === "register" && data.name) {
        var p = window.nvGet("profile", D.defaultProfile);
        p.name = data.name;
        if (data.email) p.email = data.email;
        window.nvSet("profile", p);
      }
      window.location.href = "dashboard.html";
    });
  }

  /* ============ DASHBOARD ============ */
  function showDemoPopup() {
    var el = document.createElement("div");
    el.className = "fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4";
    el.innerHTML =
      '<div class="w-full max-w-sm rounded-card bg-white p-6 text-center shadow-soft">' +
      '<img src="assets/img/mascot-nuna-wave.png" alt="" class="mx-auto mb-3 w-24">' +
      '<h3 class="font-display text-xl font-bold text-cocoa">Halo! 👋</h3>' +
      '<p class="mt-2 text-cocoa/70">Kamu baru saja memasuki halaman demo - free trial 7 hari.</p>' +
      '<button type="button" data-demo-close class="nv-btn nv-btn--primary mt-5 w-full">Oke, mengerti</button>' +
      "</div>";
    document.body.appendChild(el);
    el.addEventListener("click", function (e) {
      if (e.target === el || e.target.closest("[data-demo-close]")) el.remove();
    });
  }

  function setupDashboard() {
    showDemoPopup();

    // Donut "Daily Reflection"
    var donut = qs("#nv-donut");
    var legend = qs("#nv-donut-legend");
    if (donut) {
      var acc = 0;
      var stops = D.dailyReflection
        .map(function (s) {
          var from = acc;
          acc += s.value;
          return s.color + " " + from + "% " + acc + "%";
        })
        .join(", ");
      donut.style.background = "conic-gradient(" + stops + ")";
      var top = D.dailyReflection.slice().sort(function (a, b) {
        return b.value - a.value;
      })[0];
      donut.innerHTML =
        '<div class="grid h-24 w-24 place-items-center rounded-full bg-white text-center leading-none">' +
        '<span data-donut-num class="font-display text-2xl font-bold text-cocoa">0%</span>' +
        '<span class="mt-1 text-xs text-cocoa/60">' + esc(top.label) + "</span></div>";
      var dn = qs("[data-donut-num]", donut);
      if (dn) {
        var s0 = null;
        requestAnimationFrame(function count(ts) {
          if (s0 === null) s0 = ts;
          var t = Math.min((ts - s0) / 750, 1);
          dn.textContent = (top.value * (1 - Math.pow(1 - t, 3))).toFixed(1) + "%";
          if (t < 1) requestAnimationFrame(count);
        });
      }
    }
    if (legend) {
      legend.innerHTML = D.dailyReflection
        .map(function (s) {
          return (
            '<li class="flex items-center gap-2 text-sm text-cocoa/80">' +
            '<span class="h-3 w-3 rounded-full" style="background:' +
            s.color +
            '"></span>' +
            esc(s.label) +
            ' <span class="text-cocoa/70">' +
            s.value +
            "%</span></li>"
          );
        })
        .join("");
    }

    // Kartu nutrisi
    var nut = qs("#nv-nutrients");
    if (nut) {
      var lastOdd = D.nutrientStats.length % 2 === 1;
      nut.innerHTML = D.nutrientStats
        .map(function (n, i) {
          var span = lastOdd && i === D.nutrientStats.length - 1 ? " sm:col-span-2" : "";
          return (
            '<div class="flex items-center gap-4 rounded-card bg-white p-4 shadow-soft transition hover:-translate-y-0.5' + span + '">' +
            '<span class="grid h-14 w-14 shrink-0 place-items-center rounded-full" style="background:' +
            n.ring +
            '33"><img src="' +
            img(n.icon) +
            '" alt="" class="h-9 w-9 object-contain"></span>' +
            '<span><span class="block font-display text-lg font-bold text-cocoa">' +
            esc(n.value) +
            '</span><span class="block text-sm text-cocoa/60">' +
            esc(n.label) +
            "</span></span></div>"
          );
        })
        .join("");
    }

    // Recent Scans
    var rs = qs("#nv-recent-scans");
    if (rs) {
      rs.innerHTML = D.recentScans
        .map(function (s) {
          return (
            '<li class="flex items-center gap-4">' +
            '<img src="' +
            img(s.img) +
            '" alt="" class="h-14 w-14 rounded-2xl object-cover">' +
            '<span class="flex-1"><span class="block font-display font-bold text-cocoa">' +
            esc(s.name) +
            '</span><span class="block text-sm text-cocoa/60">' +
            esc(s.detail) +
            "</span></span>" +
            '<span class="nv-badge nv-badge--' +
            s.level +
            '">' +
            esc(s.status) +
            "</span></li>"
          );
        })
        .join("");
    }
  }

  /* ============ MEAL PLAN ============ */
  function setupMealPlan() {
    // Upload + preview + kamera
    var input = qs("#nv-upload-input");
    var preview = qs("#nv-upload-preview");
    var placeholder = qs("#nv-upload-placeholder");
    var result = qs("#nv-scan-result");

    // Tampilkan foto + hasil "analisa". Dipakai dua-duanya: upload file & foto dari kamera.
    function showScan(dataUrl) {
      if (!preview) return;
      preview.src = dataUrl;
      preview.classList.remove("hidden");
      if (placeholder) placeholder.classList.add("hidden");
      if (!result) return;
      result.classList.remove("hidden");
      result.innerHTML =
        '<p class="font-display text-lg font-bold text-cocoa">' +
        esc(D.scanResult.name) +
        '</p><p class="mb-3 text-sm text-cocoa/60">Perkiraan ' +
        esc(D.scanResult.calories) +
        '</p><div class="grid grid-cols-2 gap-2">' +
        D.scanResult.macros
          .map(function (m) {
            return (
              '<span class="rounded-2xl bg-leaf/60 px-3 py-2 text-sm"><b class="font-display">' +
              esc(m.value) +
              '</b> <span class="text-cocoa/60">' +
              esc(m.label) +
              "</span></span>"
            );
          })
          .join("") +
        "</div>";
    }

    if (input && preview) {
      input.addEventListener("change", function () {
        var file = input.files && input.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
          alert("Ukuran gambar maksimal 5 MB.");
          input.value = "";
          return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
          showScan(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }

    // Kamera langsung: buka kamera perangkat, jepret foto, langsung "di-scan".
    // (butuh https atau localhost - kalau file HTML dibuka langsung, kamera diblokir browser)
    var camOpen = qs("#nv-camera-open");
    var camPanel = qs("#nv-camera-panel");
    var camVideo = qs("#nv-camera-video");
    var camShot = qs("#nv-camera-shot");
    var camClose = qs("#nv-camera-close");
    var camCanvas = qs("#nv-camera-canvas");
    var camStream = null;

    function stopCamera() {
      if (camStream) {
        camStream.getTracks().forEach(function (t) {
          t.stop();
        });
        camStream = null;
      }
      if (camVideo) camVideo.srcObject = null;
      if (camPanel) camPanel.classList.add("hidden");
    }

    if (camOpen && camVideo && camPanel) {
      camOpen.addEventListener("click", function () {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          alert("Browser ini belum mendukung kamera. Coba upload foto dari galeri ya.");
          return;
        }
        // facingMode "environment" = utamakan kamera belakang di HP
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: "environment" }, audio: false })
          .then(function (stream) {
            camStream = stream;
            camVideo.srcObject = stream;
            camPanel.classList.remove("hidden");
          })
          .catch(function () {
            alert("Nggak bisa buka kamera. Cek izin kamera di browser, atau upload foto dari galeri ya.");
          });
      });

      if (camShot && camCanvas) {
        camShot.addEventListener("click", function () {
          var w = camVideo.videoWidth;
          var h = camVideo.videoHeight;
          if (!w || !h) return; // video belum siap
          camCanvas.width = w;
          camCanvas.height = h;
          camCanvas.getContext("2d").drawImage(camVideo, 0, 0, w, h);
          showScan(camCanvas.toDataURL("image/jpeg", 0.9));
          stopCamera();
        });
      }

      if (camClose) camClose.addEventListener("click", stopCamera);
    }

    // Your Meal Plan
    var mp = qs("#nv-meal-plan");
    if (mp) {
      mp.innerHTML = D.mealPlan
        .map(function (m) {
          return (
            '<li class="flex items-center gap-4">' +
            '<img src="' +
            img(m.img) +
            '" alt="" class="h-16 w-16 rounded-2xl object-cover">' +
            '<span class="flex-1"><span class="block font-display font-bold text-cocoa">' +
            esc(m.meal) +
            '</span><span class="block text-sm text-cocoa/60">' +
            esc(m.name) +
            "</span></span>" +
            '<span class="hidden grid-cols-2 gap-x-3 gap-y-1 sm:grid">' +
            m.macros
              .map(function (x) {
                return (
                  '<span class="flex items-center gap-1 text-xs text-cocoa/70"><img src="' +
                  img(x.icon) +
                  '" alt="" class="h-3.5 w-3.5">' +
                  esc(x.value) +
                  "</span>"
                );
              })
              .join("") +
            "</span></li>"
          );
        })
        .join("");
    }

    // Recommended For You
    var rec = qs("#nv-recommended-meals");
    if (rec) {
      rec.innerHTML = D.recommendedMeals
        .map(function (r) {
          return (
            '<article class="rounded-2xl bg-leaf/60 p-4">' +
            '<img src="' +
            img(r.img) +
            '" alt="" class="mb-3 h-32 w-full rounded-xl object-cover">' +
            '<h4 class="font-display font-bold text-cocoa">' +
            esc(r.name) +
            '</h4><p class="text-sm text-cocoa/70">' +
            esc(r.desc) +
            "</p></article>"
          );
        })
        .join("");
    }
  }

  /* ============ SPORT PLAN ============ */
  function setupSportPlan() {
    // Strip tanggal: 7 hari terakhir sampai hari ini
    var dates = qs("#nv-sport-dates");
    if (dates) {
      var dayAbbr = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
      var monAbbr = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      var today = new Date();
      var last7 = [];
      for (var k = 6; k >= 0; k--) {
        var dt = new Date(today);
        dt.setDate(today.getDate() - k);
        last7.push({ day: dayAbbr[dt.getDay()], date: dt.getDate() + " " + monAbbr[dt.getMonth()], isToday: k === 0 });
      }
      var ON = ["bg-white", "text-cocoa", "shadow-soft-sm"];
      var OFF = ["bg-white/40", "text-cocoa/70", "hover:bg-white/70"];
      dates.innerHTML = last7
        .map(function (d) {
          return (
            '<button type="button" data-date class="min-w-[64px] rounded-2xl px-3 py-2 text-center font-display transition ' +
            (d.isToday ? ON.join(" ") : OFF.join(" ")) +
            '"><span class="block text-sm font-bold">' +
            d.day +
            '</span><span class="block text-xs">' +
            d.date +
            "</span></button>"
          );
        })
        .join("");
      dates.addEventListener("click", function (e) {
        var b = e.target.closest("[data-date]");
        if (!b) return;
        qsa("[data-date]", dates).forEach(function (x) {
          x.classList.remove.apply(x.classList, ON);
          x.classList.add.apply(x.classList, OFF);
        });
        b.classList.remove.apply(b.classList, OFF);
        b.classList.add.apply(b.classList, ON);
      });
    }

    // Bar chart Weekly Activity (+ garis bantu & label sumbu)
    var chart = qs("#nv-weekly-chart");
    if (chart) {
      var maxLbl = D.weeklyActivityMax;
      var axis = [maxLbl, maxLbl * 0.75, maxLbl * 0.5, maxLbl * 0.25, 0]
        .map(function (v) {
          return '<span class="leading-none">' + v.toLocaleString("id-ID") + "</span>";
        })
        .join("");
      var gridlines = [0, 25, 50, 75, 100]
        .map(function (p) {
          return '<div class="absolute inset-x-0 border-t border-cocoa/10" style="top:' + p + '%"></div>';
        })
        .join("");
      var bars = D.weeklyActivity
        .map(function (d, i) {
          var h = Math.round((d.value / D.weeklyActivityMax) * 100);
          return (
            '<button type="button" data-bar="' +
            i +
            '" class="group flex h-full flex-1 cursor-pointer flex-col items-center justify-end" aria-label="' +
            esc(d.day) +
            '">' +
            '<div data-bar-fill class="w-6 rounded-t-md bg-forest transition group-hover:bg-sage-dark sm:w-7" style="height:' +
            h +
            '%"></div></button>'
          );
        })
        .join("");
      // sumbu Y, gridlines, dan batang berbagi satu area plot h-40 (satu origin)
      chart.innerHTML =
        '<div class="flex gap-2">' +
        '<div class="flex h-40 w-9 flex-col justify-between pr-1 text-right text-[10px] font-bold text-cocoa/50">' +
        axis +
        "</div>" +
        '<div class="relative h-40 flex-1">' +
        gridlines +
        '<div class="absolute inset-0 flex items-end gap-1.5">' +
        bars +
        "</div></div></div>" +
        '<div class="mt-2 flex gap-2"><div class="w-9"></div>' +
        '<div class="flex flex-1 justify-between gap-1.5 text-center text-xs text-cocoa/60">' +
        D.weeklyActivity
          .map(function (d) {
            return '<span class="flex-1">' + esc(d.day) + "</span>";
          })
          .join("") +
        "</div></div>";

      // Animasi: batang tumbuh dari 0 ke tingginya
      qsa("[data-bar-fill]", chart).forEach(function (f) {
        var target = f.style.height;
        f.style.height = "0%";
        f.style.transition = "height .8s cubic-bezier(.22,1,.36,1)";
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            f.style.height = target;
          });
        });
      });

      // Klik batang -> highlight + tampilkan rincian kalori hari itu (bisa dipakai, bukan cuma dilihat)
      var summaryEl = qs("#nv-weekly-summary");
      var dayNames = { Mon: "Senin", Tue: "Selasa", Wed: "Rabu", Thu: "Kamis", Fri: "Jumat", Sat: "Sabtu", Sun: "Minggu" };
      chart.addEventListener("click", function (e) {
        var b = e.target.closest("[data-bar]");
        if (!b) return;
        var d = D.weeklyActivity[Number(b.getAttribute("data-bar"))];
        qsa("[data-bar-fill]", chart).forEach(function (f) {
          f.classList.remove("bg-amber-cta");
          f.classList.add("bg-forest");
        });
        qs("[data-bar-fill]", b).classList.remove("bg-forest");
        qs("[data-bar-fill]", b).classList.add("bg-amber-cta");
        if (summaryEl) {
          summaryEl.textContent =
            (dayNames[d.day] || d.day) + ": " + d.value.toLocaleString("id-ID") + " kcal terbakar";
        }
      });
    }

    // Activity summary ring
    var sum = qs("#nv-activity-summary");
    if (sum) {
      var a = D.activitySummary;
      var clockIcon2 =
        '<svg class="h-5 w-5 text-cocoa/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>';
      var footIcon =
        '<svg class="h-5 w-5 text-cocoa/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="10" cy="7" rx="2.4" ry="3.2"/><path d="M8 12c0 3-2 4-2 7a2 2 0 0 0 2 2c2 0 2-2 4-2s2 2 3 2a2 2 0 0 0 2-2c0-4-3-4-3-8"/></svg>';
      sum.innerHTML =
        '<div data-ring class="grid h-36 w-36 shrink-0 place-items-center rounded-full" style="background:conic-gradient(#1E5E1E 0%, #E6E6E6 0%)">' +
        '<div data-ring-num class="grid h-28 w-28 place-items-center rounded-full bg-white font-display text-2xl font-bold text-cocoa">0%</div></div>' +
        '<ul class="space-y-3 text-sm">' +
        '<li class="flex items-center gap-3"><span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-high/30">' +
        '<img src="' + img("icon-calories.png") + '" alt="" class="h-5 w-5"></span>' +
        '<span><b class="block font-display text-base text-cocoa">' + esc(a.calories) + "</b><span class='text-cocoa/60'>Calories Burned</span></span></li>" +
        '<li class="flex items-center gap-3"><span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky">' +
        clockIcon2 +
        '</span><span><b class="block font-display text-base text-cocoa">' + esc(a.activeTime) + "</b><span class='text-cocoa/60'>Active Time</span></span></li>" +
        '<li class="flex items-center gap-3"><span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sun-soft/70">' +
        footIcon +
        '</span><span><b class="block font-display text-base text-cocoa">' + esc(a.steps) + "</b><span class='text-cocoa/60'>Total Steps</span></span></li>" +
        "</ul>";
      var ringEl = qs("[data-ring]", sum);
      if (ringEl) tweenRing(ringEl, a.percent, "#1E5E1E", "#E6E6E6", qs("[data-ring-num]", sum));
    }

    // Recommended workouts
    var wk = qs("#nv-workouts");
    if (wk) {
      var clockIcon =
        '<svg class="h-4 w-4 shrink-0 text-cocoa" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>';
      wk.innerHTML = D.recommendedWorkouts
        .map(function (w) {
          return (
            '<div class="rounded-2xl bg-leaf/60 p-4">' +
            '<img src="' +
            img(w.img) +
            '" alt="" class="mb-3 h-28 w-full rounded-xl object-cover">' +
            '<h4 class="font-display font-bold text-cocoa">' +
            esc(w.name) +
            "</h4>" +
            '<div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-cocoa/60">' +
            '<span class="flex items-center gap-1"><img src="' +
            img("icon-calories.png") +
            '" alt="" class="h-4 w-4 shrink-0"><b class="font-display text-cocoa">' +
            esc(w.calories) +
            "</b></span>" +
            '<span class="flex items-center gap-1">' +
            clockIcon +
            '<b class="font-display text-cocoa">' +
            esc(w.time) +
            "</b></span>" +
            "</div></div>"
          );
        })
        .join("");
    }
  }

  /* ============ WELLNESS (jadwal + progress) ============ */
  function wellnessDone() {
    return window.nvGet("wellness", D.wellnessDoneDefault); // { s1: true, ... }
  }
  function setupWellness() {
    var list = qs("#nv-schedule");
    var rings = qs("#nv-progress-rings");

    var dateEl = qs("#nv-today-date");
    if (dateEl) {
      var hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      var bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      var t = new Date();
      dateEl.textContent = hari[t.getDay()] + ", " + t.getDate() + " " + bulan[t.getMonth()] + " " + t.getFullYear();
    }

    function paint() {
      var done = wellnessDone();

      if (list) {
        list.innerHTML = D.wellnessSchedule
          .map(function (s) {
            var on = !!done[s.id];
            return (
              '<li><label class="flex cursor-pointer items-center gap-4 rounded-2xl bg-sky-soft p-3">' +
              '<img src="' +
              img(s.img) +
              '" alt="" class="h-12 w-12 rounded-full bg-white object-cover">' +
              '<span class="flex-1"><span class="block font-display font-bold text-cocoa">' +
              esc(s.title) +
              '</span><span class="block text-sm text-cocoa/60">' +
              esc(s.note) +
              "</span></span>" +
              '<span class="text-sm text-cocoa/60">' +
              esc(s.time) +
              "</span>" +
              '<input type="checkbox" data-sched="' +
              s.id +
              '" class="h-6 w-6 accent-forest"' +
              (on ? " checked" : "") +
              "></label></li>"
            );
          })
          .join("");
      }

      if (rings) {
        rings.innerHTML = D.wellnessTargets
          .map(function (t) {
            var count = D.wellnessSchedule.filter(function (s) {
              return s.group === t.group && done[s.id];
            }).length;
            var pct = Math.min(100, Math.round((count / t.target) * 100));
            return (
              '<div class="flex items-center gap-3">' +
              '<div data-ring data-pct="' +
              pct +
              '" data-color="' +
              t.color +
              '" class="grid h-16 w-16 shrink-0 place-items-center rounded-full" style="background:conic-gradient(' +
              t.color +
              " " +
              pct +
              "%, #EAEAEA " +
              pct +
              '%)">' +
              '<div data-ring-num class="grid h-12 w-12 place-items-center rounded-full bg-white text-xs font-display font-bold text-cocoa">' +
              pct +
              "%</div></div>" +
              '<span><span class="block font-display font-bold text-cocoa">' +
              esc(t.label) +
              '</span><span class="block text-sm text-cocoa/60">' +
              count +
              "/" +
              t.target +
              "</span></span></div>"
            );
          })
          .join("");
      }
    }

    if (list) {
      list.addEventListener("change", function (e) {
        var cb = e.target.closest("[data-sched]");
        if (!cb) return;
        var done = wellnessDone();
        done[cb.getAttribute("data-sched")] = cb.checked;
        window.nvSet("wellness", done);
        paint();
      });
    }
    paint();

    // Animasikan ring sekali saat halaman dibuka
    if (rings) {
      qsa("[data-ring]", rings).forEach(function (r) {
        tweenRing(r, Number(r.getAttribute("data-pct")), r.getAttribute("data-color"), "#EAEAEA", qs("[data-ring-num]", r));
      });
    }

    /* ---- Kondisi kesehatan & obat (bagian baru) ---- */
    var condWrap = qs("#nv-conditions");
    var condTip = qs("#nv-condition-tip");
    var medList = qs("#nv-meds");

    function renderConditions() {
      if (!condWrap) return;
      var picked = window.nvGet("conditions", {});
      condWrap.innerHTML = (D.healthConditions || [])
        .map(function (c) {
          var on = !!picked[c.id];
          // dipilih = hijau penuh, belum = outline abu
          var cls = on
            ? "border-forest bg-forest text-white"
            : "border-cocoa/20 bg-white text-cocoa/80";
          return (
            '<button type="button" data-cond="' +
            c.id +
            '" class="rounded-md border px-3 py-1.5 text-sm font-bold transition ' +
            cls +
            '">' +
            esc(c.label) +
            "</button>"
          );
        })
        .join("");

      if (condTip) {
        var tips = (D.healthConditions || [])
          .filter(function (c) {
            return picked[c.id] && D.conditionTips && D.conditionTips[c.id];
          })
          .map(function (c) {
            return D.conditionTips[c.id];
          });
        condTip.textContent = tips.length
          ? "💡 " + tips.join(" ")
          : "Belum ada kondisi dipilih. Kalau nggak punya, biarkan kosong aja.";
      }
    }

    function renderMeds() {
      if (!medList) return;
      var taken = window.nvGet("medsTaken", {});
      medList.innerHTML = (D.medications || [])
        .map(function (m) {
          var on = !!taken[m.id];
          return (
            '<li><label class="flex cursor-pointer items-center gap-4 rounded-2xl bg-sky-soft p-3">' +
            '<span class="flex-1"><span class="block font-display font-bold text-cocoa">' +
            esc(m.name) +
            '</span><span class="block text-sm text-cocoa/60">' +
            esc(m.dose) +
            " · " +
            esc(m.time) +
            "</span></span>" +
            '<input type="checkbox" data-med="' +
            m.id +
            '" class="h-6 w-6 accent-forest"' +
            (on ? " checked" : "") +
            "></label></li>"
          );
        })
        .join("");
    }

    if (condWrap) {
      condWrap.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-cond]");
        if (!btn) return;
        var picked = window.nvGet("conditions", {});
        var id = btn.getAttribute("data-cond");
        picked[id] = !picked[id];
        window.nvSet("conditions", picked);
        renderConditions();
      });
    }
    if (medList) {
      medList.addEventListener("change", function (e) {
        var cb = e.target.closest("[data-med]");
        if (!cb) return;
        var taken = window.nvGet("medsTaken", {});
        taken[cb.getAttribute("data-med")] = cb.checked;
        window.nvSet("medsTaken", taken);
      });
    }

    renderConditions();
    renderMeds();
  }

  /* ============ WELLNESS QUIZ (pertanyaan satu per satu) ============ */
  function setupWellnessQuiz() {
    var root = qs("#nv-quiz");
    if (!root) return;
    var questions = D.quizQuestions;
    var answers = window.nvGet("wellnessPrefs", {});
    var step = 0;

    function render() {
      if (step >= questions.length) {
        root.innerHTML =
          '<div class="text-center">' +
          '<p class="mb-2 text-5xl">✅</p>' +
          '<h3 class="mb-2 font-display text-2xl font-bold text-cocoa">Preferensi kamu tersimpan</h3>' +
          '<p class="mb-6 text-cocoa/60">Nuvvi akan menyesuaikan pengingat & rekomendasi untukmu.</p>' +
          '<ul class="mx-auto mb-8 max-w-md space-y-2 text-left">' +
          questions
            .map(function (q) {
              return (
                '<li class="flex justify-between gap-4 rounded-2xl bg-leaf/60 px-4 py-3">' +
                '<span class="text-cocoa/70">' +
                esc(q.text) +
                '</span><b class="font-display text-cocoa">' +
                esc(answers[q.id] || "-") +
                "</b></li>"
              );
            })
            .join("") +
          "</ul>" +
          '<a href="wellness.html" class="nv-btn nv-btn--primary">Selesai</a></div>';
        return;
      }

      var q = questions[step];
      root.innerHTML =
        '<div class="mb-6 flex items-center justify-between">' +
        '<span class="font-display font-bold text-cocoa/70">' +
        (step + 1) +
        " / " +
        questions.length +
        "</span>" +
        (step > 0
          ? '<button type="button" data-quiz-back class="font-display font-bold text-cocoa/60 hover:text-cocoa">&larr; Kembali</button>'
          : "<span></span>") +
        "</div>" +
        '<h3 class="mb-8 text-center font-display text-2xl font-bold leading-snug text-cocoa">' +
        q.emoji +
        " " +
        esc(q.text) +
        "</h3>" +
        '<div class="mx-auto flex max-w-md flex-col gap-3">' +
        q.options
          .map(function (opt) {
            var on = answers[q.id] === opt;
            return (
              '<button type="button" data-quiz-opt="' +
              esc(opt) +
              '" class="rounded-md px-6 py-3 text-center font-display font-bold transition ' +
              (on ? "bg-sky text-cocoa" : "bg-leaf/60 text-cocoa/80 hover:bg-leaf") +
              '">' +
              esc(opt) +
              "</button>"
            );
          })
          .join("") +
        "</div>" +
        '<div class="mt-8 text-center">' +
        '<button type="button" data-quiz-next class="nv-btn nv-btn--primary disabled:opacity-40" ' +
        (answers[q.id] ? "" : "disabled") +
        ">" +
        (step === questions.length - 1 ? "Simpan" : "Lanjut") +
        "</button></div>";
    }

    root.addEventListener("click", function (e) {
      var opt = e.target.closest("[data-quiz-opt]");
      var next = e.target.closest("[data-quiz-next]");
      var back = e.target.closest("[data-quiz-back]");
      if (opt) {
        answers[questions[step].id] = opt.getAttribute("data-quiz-opt");
        window.nvSet("wellnessPrefs", answers);
        render();
      } else if (next) {
        step++;
        render();
      } else if (back) {
        step--;
        render();
      }
    });

    render();
  }

  /* ============ KOMUNITAS ============ */
  function setupKomunitas() {
    var grid = qs("#nv-communities");
    var artList = qs("#nv-articles");

    function joined() {
      return window.nvGet("joinedCommunities", []);
    }

    if (grid) {
      function paintCommunities() {
        var mine = joined();
        grid.innerHTML = D.communities
          .map(function (c) {
            var on = mine.indexOf(c.id) !== -1;
            return (
              '<article class="flex items-center gap-3 rounded-card bg-white/80 p-3">' +
              '<img src="' +
              img(c.img) +
              '" alt="" class="h-14 w-14 rounded-2xl object-cover">' +
              '<span class="flex-1"><span class="block font-display font-bold text-cocoa">' +
              esc(c.name) +
              '</span><span class="block text-xs text-cocoa/60">' +
              (c.members + (on ? 1 : 0)) +
              " anggota</span></span>" +
              '<button type="button" data-join="' +
              c.id +
              '" class="rounded-md px-4 py-2 font-display text-sm font-bold transition ' +
              (on ? "bg-sage-dark text-white" : "bg-good/30 text-[#3f6b23] hover:bg-good/50") +
              '">' +
              (on ? "Tergabung" : "Gabung") +
              "</button></article>"
            );
          })
          .join("");
      }
      grid.addEventListener("click", function (e) {
        var b = e.target.closest("[data-join]");
        if (!b) return;
        var id = b.getAttribute("data-join");
        var mine = joined();
        var i = mine.indexOf(id);
        if (i === -1) mine.push(id);
        else mine.splice(i, 1);
        window.nvSet("joinedCommunities", mine);
        paintCommunities();
      });
      paintCommunities();
    }

    if (artList) {
      var ACT = {
        heart:
          '<path d="M12 20s-7-4.5-9.5-9C1 8 2.5 4.5 6 4.5c2 0 3.2 1 4 2.2.8-1.2 2-2.2 4-2.2 3.5 0 5 3.5 3.5 6.5C19 15.5 12 20 12 20Z"/>',
        comment: '<path d="M21 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-5.4A8 8 0 1 1 21 11.5Z"/>',
        repost: '<path d="M4 8V7a3 3 0 0 1 3-3h10l-2.5-2.5M20 16v1a3 3 0 0 1-3 3H7l2.5 2.5"/>',
        share: '<path d="M12 15V3m0 0 4 4m-4-4-4 4"/><path d="M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"/>',
        trash: '<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/>',
      };
      function actIcon(name, filled) {
        return (
          '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="' +
          (filled ? "currentColor" : "none") +
          '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          ACT[name] +
          "</svg>"
        );
      }
      // dataURL (post user) dipakai langsung; selain itu ambil dari folder assets
      function assetSrc(v) {
        return v && v.indexOf("data:") === 0 ? v : img(v);
      }
      function userPosts() {
        return window.nvGet("userArticles", []);
      }

      function paintArticles() {
        var liked = window.nvGet("likedArticles", {});
        var all = userPosts().concat(D.threads);
        artList.className = "divide-y divide-cocoa/10";
        artList.innerHTML = all
          .map(function (a) {
            var on = !!liked[a.id];
            var isUser = String(a.id).charAt(0) === "u";
            var title = a.title ? '<p class="mt-1 font-display font-semibold text-cocoa">' + esc(a.title) + "</p>" : "";
            var body = a.body ? '<p class="mt-0.5 whitespace-pre-line text-sm leading-relaxed text-cocoa/80">' + esc(a.body) + "</p>" : "";
            var media = a.img ? '<img src="' + assetSrc(a.img) + '" alt="" class="mt-3 max-h-64 w-full rounded-2xl object-cover">' : "";
            var del = isUser
              ? '<button type="button" data-del-post="' + a.id + '" class="ml-auto text-cocoa/40 transition hover:text-high" aria-label="Hapus">' + actIcon("trash") + "</button>"
              : "";
            return (
              '<article class="flex gap-3 py-4">' +
              '<img src="' + assetSrc(a.avatar) + '" alt="" class="h-11 w-11 shrink-0 rounded-full bg-white object-cover">' +
              '<div class="min-w-0 flex-1">' +
              '<div class="flex flex-wrap items-center gap-x-2 text-sm">' +
              '<span class="font-display font-bold text-cocoa">' + esc(a.author) + "</span>" +
              '<span class="text-cocoa/50">' + esc(a.handle) + "</span>" +
              '<span class="text-cocoa/40">· ' + esc(a.time) + "</span>" +
              del +
              "</div>" +
              title +
              body +
              media +
              '<div class="mt-3 flex items-center gap-6 text-cocoa/55">' +
              '<button type="button" data-like="' + a.id + '" class="flex items-center gap-1.5 text-sm transition hover:text-high ' + (on ? "text-high" : "") + '">' +
              actIcon("heart", on) + "<span>" + (a.likes + (on ? 1 : 0)) + "</span></button>" +
              '<span class="flex items-center gap-1.5 text-sm">' + actIcon("comment") + a.replies + "</span>" +
              '<span class="flex items-center gap-1.5 text-sm">' + actIcon("repost") + "</span>" +
              '<span class="flex items-center gap-1.5 text-sm">' + actIcon("share") + "</span>" +
              "</div></div></article>"
            );
          })
          .join("");
      }

      artList.addEventListener("click", function (e) {
        var likeBtn = e.target.closest("[data-like]");
        var delBtn = e.target.closest("[data-del-post]");
        if (likeBtn) {
          var id = likeBtn.getAttribute("data-like");
          var liked = window.nvGet("likedArticles", {});
          liked[id] = !liked[id];
          window.nvSet("likedArticles", liked);
          paintArticles();
        } else if (delBtn) {
          var pid = delBtn.getAttribute("data-del-post");
          window.nvSet(
            "userArticles",
            userPosts().filter(function (p) {
              return p.id !== pid;
            })
          );
          paintArticles();
        }
      });

      // Composer: ketik + foto opsional + kirim
      var composer = qs("#nv-composer-input");
      var composerImg = qs("#nv-composer-img");
      var composerPreview = qs("#nv-composer-preview");
      var composerSend = qs("#nv-composer-send");
      var pendingImg = "";
      if (composerImg) {
        composerImg.addEventListener("change", function () {
          var f = composerImg.files && composerImg.files[0];
          if (!f) return;
          if (f.size > 4 * 1024 * 1024) {
            alert("Ukuran foto maksimal 4 MB.");
            composerImg.value = "";
            return;
          }
          var reader = new FileReader();
          reader.onload = function (ev) {
            pendingImg = ev.target.result;
            if (composerPreview) {
              composerPreview.src = pendingImg;
              composerPreview.classList.remove("hidden");
            }
          };
          reader.readAsDataURL(f);
        });
      }
      if (composerSend && composer) {
        composerSend.addEventListener("click", function () {
          var text = composer.value.trim();
          if (!text && !pendingImg) return;
          var profile = window.nvGet("profile", D.defaultProfile);
          var posts = userPosts();
          posts.unshift({
            id: "u" + Date.now(),
            author: profile.name || "Mia",
            handle: "@" + (profile.username || "mia.nuvvi"),
            avatar: "avatar-mia.png",
            time: "Baru saja",
            likes: 0,
            replies: 0,
            title: "",
            img: pendingImg || "",
            body: text,
          });
          window.nvSet("userArticles", posts);
          composer.value = "";
          pendingImg = "";
          if (composerImg) composerImg.value = "";
          if (composerPreview) {
            composerPreview.src = "";
            composerPreview.classList.add("hidden");
          }
          paintArticles();
        });
      }

      paintArticles();
    }

    // Sidebar kanan: selalu "Artikel Populer" (blog, beda dari feed) untuk kedua tab
    var sidebarList = qs("#nv-sidebar-list");
    var sidebarTitle = qs("#nv-sidebar-title");
    if (sidebarList) {
      if (sidebarTitle) sidebarTitle.textContent = "Artikel Populer";
      sidebarList.innerHTML = D.blogs
        .map(function (a) {
          return (
            '<a href="blog.html?id=' +
            a.id +
            '" class="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-white/60">' +
            '<img src="' +
            img(a.img) +
            '" alt="" class="h-12 w-12 shrink-0 rounded-2xl object-cover">' +
            '<span class="min-w-0"><span class="block font-display font-bold leading-snug text-cocoa">' +
            esc(a.title) +
            '</span><span class="block text-xs text-cocoa/60">' +
            esc(a.author) +
            "</span></span></a>"
          );
        })
        .join("");
    }

    // Tab Artikel / Komunitas
    var tabs = qsa("[data-komunitas-tab]");
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        var name = t.getAttribute("data-komunitas-tab");
        tabs.forEach(function (x) {
          x.classList.toggle("bg-forest", x === t);
          x.classList.toggle("text-white", x === t);
          x.classList.toggle("bg-white/60", x !== t);
          x.classList.toggle("text-cocoa/70", x !== t);
        });
        qsa("[data-komunitas-panel]").forEach(function (p) {
          p.classList.toggle("hidden", p.getAttribute("data-komunitas-panel") !== name);
        });
      });
    });
  }

  /* ============ BLOG (detail artikel) ============ */
  function setupBlog() {
    var box = qs("#nv-blog");
    if (!box) return;
    var id = new URLSearchParams(location.search).get("id");
    var a =
      D.blogs.filter(function (x) {
        return x.id === id;
      })[0] || D.blogs[0];
    if (!a) return;
    function assetSrc(v) {
      return v && v.indexOf("data:") === 0 ? v : img(v);
    }
    var hero = a.img ? '<img src="' + assetSrc(a.img) + '" alt="" class="mb-6 max-h-80 w-full rounded-card object-cover">' : "";
    box.innerHTML =
      '<article class="nv-card mx-auto max-w-3xl">' +
      (a.title ? '<h1 class="font-display text-3xl font-bold leading-tight text-cocoa">' + esc(a.title) + "</h1>" : "") +
      '<div class="mt-3 flex items-center gap-3">' +
      '<img src="' + assetSrc(a.avatar) + '" alt="" class="h-10 w-10 rounded-full bg-white object-cover">' +
      '<span class="text-sm"><span class="block font-display font-bold text-cocoa">' + esc(a.author) + "</span>" +
      '<span class="block text-cocoa/50">' + esc(a.handle) + " · " + esc(a.time) + "</span></span></div>" +
      '<div class="mt-6">' + hero + "</div>" +
      '<p class="whitespace-pre-line leading-relaxed text-cocoa/80">' + esc(a.body) + "</p>" +
      "</article>";
  }

  /* ============ Animasi masuk halaman aplikasi ============ */
  function animateApp() {
    var main = qs("main");
    if (!main) return;
    var blocks = qsa(":scope > *", main);
    blocks.forEach(function (el, i) {
      el.style.animationDelay = Math.min(i * 90, 450) + "ms";
      el.classList.add("nv-anim");
    });
  }

  /* Tween angka + isi ring conic-gradient dari 0 ke target */
  function tweenRing(el, pct, color, track, numEl) {
    var start = null;
    var dur = 750;
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      var cur = Math.round(pct * eased);
      el.style.background = "conic-gradient(" + color + " " + cur + "%, " + track + " " + cur + "%)";
      if (numEl) numEl.textContent = cur + "%";
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ============ PROFILE ============ */
  function setupProfile() {
    var form = qs("#nv-profile-form");
    if (!form) return;
    var editBtn = qs("#nv-profile-edit");
    var actions = qs("#nv-profile-actions");
    var fields = qsa("input", form);
    var profile = window.nvGet("profile", D.defaultProfile);

    // isi nilai
    fields.forEach(function (f) {
      if (profile[f.name] != null) f.value = profile[f.name];
      f.readOnly = true;
    });

    function setEditing(on) {
      fields.forEach(function (f) {
        f.readOnly = !on;
        f.classList.toggle("bg-white", on);
        f.classList.toggle("bg-white/60", !on);
      });
      editBtn.classList.toggle("hidden", on);
      actions.classList.toggle("hidden", !on);
      actions.classList.toggle("flex", on);
    }

    editBtn.addEventListener("click", function () {
      setEditing(true);
      fields[0].focus();
    });

    qs("[data-profile-cancel]", actions).addEventListener("click", function () {
      fields.forEach(function (f) {
        if (profile[f.name] != null) f.value = profile[f.name];
      });
      setEditing(false);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      fields.forEach(function (f) {
        if (f.name) profile[f.name] = f.value;
      });
      window.nvSet("profile", profile);
      var nameEl = qs("#nv-user-name");
      if (nameEl) nameEl.textContent = profile.name;
      setEditing(false);
    });

    setEditing(false);
  }
})();
