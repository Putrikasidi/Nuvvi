/*
  storage.js
  ----------
  Pembungkus sederhana untuk localStorage supaya:
  - semua key diberi awalan "nuvvi:" (tidak bentrok dengan data lain di browser)
  - otomatis diubah ke/dari JSON
  - aman kalau localStorage tidak tersedia (mode privat, dll)

  Dipakai di mana saja lewat window.nvGet / window.nvSet.
*/
(function () {
  var PREFIX = "nuvvi:";

  function nvGet(key, fallback) {
    try {
      var raw = localStorage.getItem(PREFIX + key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function nvSet(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function nvRemove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch (e) {}
  }

  window.nvGet = nvGet;
  window.nvSet = nvSet;
  window.nvRemove = nvRemove;
})();
