/*
  app.js
  ------
  Satu file untuk menyalakan semua interaksi. Cara kerjanya:
  1. Baca <body data-page="..."> untuk tahu sedang di halaman apa.
  2. Untuk halaman aplikasi, panggil NuvviLayout.mount() (pasang sidebar + topbar).
  3. Jalankan fungsi setup khusus halaman tersebut.

  Semua fungsi ditulis sederhana. Data contoh diambil dari window.NUVVI_DATA (data.js).
*/
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
    if (page === "wellness-quiz" && window.NuvviLayout) {
      NuvviLayout.mount("wellness");
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
      profile: setupProfile,
    };
    if (setups[page]) setups[page]();

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

  /* ============ Efek muncul halus saat scroll (halaman Home) ============
     Prinsip: konten TIDAK PERNAH tersembunyi permanen.
     - Elemen yang sedang terlihat -> disembunyikan sekejap lalu di-fade-in.
     - Elemen di bawah layar -> di-fade-in begitu ter-scroll ke tampilan,
       dan tetap dimunculkan otomatis oleh failsafe walau tak di-scroll. */
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
    items.forEach(function (i) {
      var top = i.getBoundingClientRect().top;
      i.classList.add("is-pending");
      if (top < vh) {
        // sudah terlihat -> animasikan sekarang
        requestAnimationFrame(function () {
          reveal(i);
        });
      } else {
        io.observe(i);
      }
    });

    // Failsafe cepat: setelah 700 ms semua pasti tampil (aman untuk screenshot).
    setTimeout(function () {
      items.forEach(reveal);
    }, 700);
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
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) {
          t.classList.remove("nv-nav-pill--active");
        });
        tab.classList.add("nv-nav-pill--active");
        image.src = img("preview-" + tab.getAttribute("data-feature-tab") + ".png");
        image.alt = "Tampilan " + tab.textContent.trim();
      });
    });
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
  function setupDashboard() {
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
      nut.innerHTML = D.nutrientStats
        .map(function (n) {
          return (
            '<div class="nv-card flex items-center gap-4 !p-4">' +
            '<span class="grid h-14 w-14 shrink-0 place-items-center rounded-full" style="background:' +
            n.ring +
            '33"><img src="' +
            img(n.icon) +
            '" alt="" class="h-9 w-9 object-contain"></span>' +
            '<span><span class="block font-display text-lg font-extrabold text-cocoa">' +
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
        '<p class="font-display text-lg font-extrabold text-cocoa">' +
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
            '<span class="flex-1"><span class="block font-display font-extrabold text-cocoa">' +
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
            '<article class="w-64 rounded-card bg-leaf/70 p-4">' +
            '<img src="' +
            img(r.img) +
            '" alt="" class="mb-3 h-32 w-full rounded-2xl object-cover">' +
            '<h4 class="font-display font-extrabold text-cocoa">' +
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
    // Strip tanggal
    var dates = qs("#nv-sport-dates");
    if (dates) {
      dates.innerHTML = D.sportDates
        .map(function (d, i) {
          return (
            '<button type="button" data-date class="min-w-[68px] rounded-2xl px-3 py-2 text-center font-display transition ' +
            (i === 2 ? "bg-white text-cocoa shadow-soft-sm" : "bg-white/40 text-cocoa/70 hover:bg-white/70") +
            '"><span class="block text-sm font-bold">' +
            esc(d.day) +
            '</span><span class="block text-xs">' +
            esc(d.date) +
            "</span></button>"
          );
        })
        .join("");
      dates.addEventListener("click", function (e) {
        var b = e.target.closest("[data-date]");
        if (!b) return;
        qsa("[data-date]", dates).forEach(function (x) {
          x.className = x.className.replace("bg-white text-cocoa shadow-soft-sm", "bg-white/40 text-cocoa/70 hover:bg-white/70");
        });
        b.className = b.className.replace("bg-white/40 text-cocoa/70 hover:bg-white/70", "bg-white text-cocoa shadow-soft-sm");
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
      var grid =
        '<div class="pointer-events-none absolute inset-x-10 top-0 h-40">' +
        [0, 25, 50, 75, 100]
          .map(function (p) {
            return '<div class="absolute inset-x-0 border-t border-cocoa/10" style="top:' + p + '%"></div>';
          })
          .join("") +
        "</div>";
      var bars = D.weeklyActivity
        .map(function (d, i) {
          var h = Math.round((d.value / D.weeklyActivityMax) * 100);
          return (
            '<button type="button" data-bar="' +
            i +
            '" class="group relative z-10 flex flex-1 cursor-pointer flex-col items-center gap-2">' +
            '<span class="pointer-events-none text-[11px] font-bold text-cocoa">' +
            d.value.toLocaleString("id-ID") +
            "</span>" +
            '<div class="flex h-40 w-full items-end justify-center">' +
            '<div data-bar-fill class="w-7 rounded-t-lg bg-forest transition group-hover:bg-sage-dark" style="height:' +
            h +
            '%"></div></div>' +
            '<span class="text-xs text-cocoa/60">' +
            esc(d.day) +
            "</span></button>"
          );
        })
        .join("");
      chart.innerHTML =
        grid +
        '<div class="flex w-10 flex-col justify-between pr-1 text-right text-[10px] font-bold text-cocoa/60" style="height:10rem">' +
        axis +
        "</div>" +
        bars;

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
        '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>';
      var footIcon =
        '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="#8a6410" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="10" cy="7" rx="2.4" ry="3.2"/><path d="M8 12c0 3-2 4-2 7a2 2 0 0 0 2 2c2 0 2-2 4-2s2 2 3 2a2 2 0 0 0 2-2c0-4-3-4-3-8"/></svg>';
      sum.innerHTML =
        '<div class="grid h-36 w-36 shrink-0 place-items-center rounded-full" style="background:conic-gradient(#6E9A46 ' +
        a.percent +
        "%, #DDE9CE " +
        a.percent +
        '%)">' +
        '<div class="grid h-28 w-28 place-items-center rounded-full bg-white font-display text-2xl font-extrabold text-cocoa">' +
        a.percent +
        "%</div></div>" +
        '<ul class="space-y-3 text-sm">' +
        '<li class="flex items-center gap-3"><span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-high/30">' +
        '<img src="' + img("icon-calories.png") + '" alt="" class="h-5 w-5"></span>' +
        '<span><b class="block font-display text-base text-cocoa">' + esc(a.calories) + "</b><span class='text-cocoa/60'>Calories Burned</span></span></li>" +
        '<li class="flex items-center gap-3"><span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky">' +
        clockIcon2 +
        '</span><span><b class="block font-display text-base text-cocoa">' + esc(a.activeTime) + "</b><span class='text-cocoa/60'>Active Time</span></span></li>" +
        '<li class="flex items-center gap-3"><span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sun-soft/70">' +
        footIcon +
        '</span><span><b class="block font-display text-base text-cocoa">' + esc(a.steps) + "</b><span class='text-cocoa/60'>Total steps</span></span></li>" +
        "</ul>";
    }

    // Recommended workouts
    var wk = qs("#nv-workouts");
    if (wk) {
      var clockIcon =
        '<svg class="h-4 w-4 shrink-0 text-cocoa" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>';
      wk.innerHTML = D.recommendedWorkouts
        .map(function (w) {
          return (
            '<div class="flex w-60 items-center gap-3">' +
            '<img src="' +
            img(w.img) +
            '" alt="" class="h-20 w-20 shrink-0 rounded-2xl object-cover">' +
            "<div>" +
            '<h4 class="font-display font-extrabold text-cocoa">' +
            esc(w.name) +
            "</h4>" +
            '<div class="mt-1 flex items-center gap-1.5">' +
            '<img src="' +
            img("icon-calories.png") +
            '" alt="" class="h-4 w-4 shrink-0">' +
            '<span class="text-xs text-cocoa/60"><b class="font-display text-sm font-bold text-cocoa">' +
            esc(w.calories) +
            "</b> Calories Burned</span>" +
            "</div>" +
            '<div class="mt-1 flex items-center gap-1.5">' +
            clockIcon +
            '<span class="text-xs text-cocoa/60"><b class="font-display text-sm font-bold text-cocoa">' +
            esc(w.time) +
            "</b> Active Time</span>" +
            "</div>" +
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

    function paint() {
      var done = wellnessDone();

      if (list) {
        list.innerHTML = D.wellnessSchedule
          .map(function (s) {
            var on = !!done[s.id];
            return (
              '<li><label class="flex cursor-pointer items-center gap-4 rounded-2xl bg-sky-soft p-4">' +
              '<img src="' +
              img(s.img) +
              '" alt="" class="h-12 w-12 rounded-full bg-white object-cover">' +
              '<span class="flex-1"><span class="block font-display font-extrabold text-cocoa">' +
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
              '<div class="grid h-16 w-16 shrink-0 place-items-center rounded-full" style="background:conic-gradient(' +
              t.color +
              " " +
              pct +
              "%, #EAEAEA " +
              pct +
              '%)">' +
              '<div class="grid h-12 w-12 place-items-center rounded-full bg-white text-xs font-display font-extrabold text-cocoa">' +
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
            '<li><label class="flex cursor-pointer items-center gap-4 rounded-md bg-sky-soft p-3">' +
            '<span class="flex-1"><span class="block font-display font-extrabold text-cocoa">' +
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
          '<h3 class="mb-2 font-display text-2xl font-extrabold text-cocoa">Preferensi kamu tersimpan</h3>' +
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
        '<h3 class="mb-8 text-center font-display text-2xl font-extrabold leading-snug text-cocoa">' +
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
    var modal = qs("#nv-article-modal");

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
              '<span class="flex-1"><span class="block font-display font-extrabold text-cocoa">' +
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
      artList.innerHTML = D.articles
        .map(function (a) {
          return (
            '<button type="button" data-article="' +
            a.id +
            '" class="flex w-full items-center gap-3 rounded-2xl p-2 text-left hover:bg-white/60">' +
            '<img src="' +
            img(a.img) +
            '" alt="" class="h-14 w-14 rounded-2xl object-cover">' +
            '<span class="font-display font-bold text-cocoa">' +
            esc(a.title) +
            "</span></button>"
          );
        })
        .join("");
    }

    // Sidebar kanan: menampilkan kebalikan dari tab yang aktif di kiri
    // (tab Komunitas aktif -> sidebar Artikel; tab Artikel aktif -> sidebar Komunitas)
    var sidebarLabel = qs("#nv-sidebar-label");
    var sidebarList = qs("#nv-sidebar-list");
    function paintSidebar(activeTab) {
      if (!sidebarList) return;
      var showArticles = activeTab === "komunitas"; // isi sidebar = lawan dari tab aktif
      if (sidebarLabel) sidebarLabel.textContent = showArticles ? "Artikel" : "Komunitas";
      var items = showArticles ? D.articles : D.communities;
      sidebarList.innerHTML = items
        .map(function (item) {
          if (showArticles) {
            return (
              '<button type="button" data-article="' +
              item.id +
              '" class="flex w-full items-center gap-3 rounded-2xl p-2 text-left hover:bg-white/60">' +
              '<img src="' +
              img(item.img) +
              '" alt="" class="h-14 w-14 shrink-0 rounded-2xl object-cover">' +
              '<span class="font-display font-bold leading-snug text-cocoa">' +
              esc(item.title) +
              "</span></button>"
            );
          }
          return (
            '<div class="flex items-center gap-3 rounded-2xl p-2">' +
            '<img src="' +
            img(item.img) +
            '" alt="" class="h-14 w-14 shrink-0 rounded-2xl object-cover">' +
            '<span><span class="block font-display font-bold leading-snug text-cocoa">' +
            esc(item.name) +
            '</span><span class="block text-xs text-cocoa/60">' +
            item.members +
            " anggota</span></span></div>"
          );
        })
        .join("");
    }
    paintSidebar("komunitas"); // sesuai tab default yang aktif

    if (modal) {
      document.addEventListener("click", function (e) {
        var open = e.target.closest("[data-article]");
        var close = e.target.closest("[data-modal-close]");
        if (open) {
          var a = D.articles.filter(function (x) {
            return x.id === open.getAttribute("data-article");
          })[0];
          if (!a) return;
          qs("[data-modal-title]", modal).textContent = a.title;
          qs("[data-modal-body]", modal).textContent = a.body;
          qs("[data-modal-img]", modal).src = img(a.img);
          modal.classList.remove("hidden");
          modal.classList.add("flex");
        } else if (close || e.target === modal) {
          modal.classList.add("hidden");
          modal.classList.remove("flex");
        }
      });
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
        paintSidebar(name);
      });
    });
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
