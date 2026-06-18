// // =============================================
// // SINBAD VISITOR TRACKER
// // Barcha sahifalarga qo'shing: <script src="tracker.js"></script>
// // =============================================

// (function () {
//   const STORAGE_KEY = "sinbad_analytics";
//   const SESSION_KEY = "sinbad_session";

//   function getSource() {
//     const ref = document.referrer || "";
//     const params = new URLSearchParams(window.location.search);
//     const utm = params.get("utm_source") || "";
//     const utmMedium = params.get("utm_medium") || "";

//     if (utm.includes("instagram") || utmMedium.includes("instagram") || ref.includes("instagram.com") || ref.includes("l.instagram.com")) return "instagram";
//     if (utm.includes("telegram") || utmMedium.includes("telegram") || ref.includes("t.me") || ref.includes("telegram")) return "telegram";
//     if (utm.includes("google") || ref.includes("google.com") || ref.includes("maps.google")) return "google_maps";
//     if (utm.includes("yandex") || ref.includes("yandex") || ref.includes("yandex.com/maps")) return "yandex_maps";
//     if (ref === "") return "direct";
//     return "other";
//   }

//   function getAnalytics() {
//     try {
//       return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
//         total: 0,
//         sources: { instagram: 0, telegram: 0, google_maps: 0, yandex_maps: 0, direct: 0, other: 0 },
//         daily: {},
//         bookings: []
//       };
//     } catch { return { total: 0, sources: { instagram: 0, telegram: 0, google_maps: 0, yandex_maps: 0, direct: 0, other: 0 }, daily: {}, bookings: [] }; }
//   }

//   function saveAnalytics(data) {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
//   }

//   function trackVisit() {
//     // Har session uchun bir marta hisoblash
//     if (sessionStorage.getItem(SESSION_KEY)) return;
//     sessionStorage.setItem(SESSION_KEY, "1");

//     const data = getAnalytics();
//     const source = getSource();
//     const today = new Date().toISOString().split("T")[0];

//     data.total = (data.total || 0) + 1;
//     data.sources[source] = (data.sources[source] || 0) + 1;
//     data.daily[today] = (data.daily[today] || 0) + 1;

//     saveAnalytics(data);
//   }

//   // Booking saqlash funksiyasi (global)
//   window.sinbadSaveBooking = function (booking) {
//     const data = getAnalytics();
//     if (!data.bookings) data.bookings = [];
//     booking.id = Date.now();
//     booking.date = new Date().toISOString();
//     booking.source = getSource();
//     data.bookings.push(booking);
//     saveAnalytics(data);
//   };

//   // Analytics olish funksiyasi (global)
//   window.sinbadGetAnalytics = function () {
//     return getAnalytics();
//   };

//   trackVisit();
// })();


(function () {
  const STORAGE_KEY = "sinbad_analytics";
  const SESSION_KEY = "sinbad_last_visit";
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 daqiqa

  function getSource() {
    const ref = document.referrer || "";
    const params = new URLSearchParams(window.location.search);
    const utm = params.get("utm_source") || "";
    const utmMedium = params.get("utm_medium") || "";

    if (utm.includes("instagram") || utmMedium.includes("instagram") || ref.includes("instagram.com") || ref.includes("l.instagram.com")) return "instagram";
    if (utm.includes("telegram") || utmMedium.includes("telegram") || ref.includes("t.me") || ref.includes("telegram")) return "telegram";
    if (utm.includes("google") || ref.includes("google.com") || ref.includes("maps.google")) return "google_maps";
    if (utm.includes("yandex") || ref.includes("yandex") || ref.includes("yandex.com/maps")) return "yandex_maps";
    if (ref === "") return "direct";
    return "other";
  }

  function getAnalytics() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        total: 0,
        sources: { instagram: 0, telegram: 0, google_maps: 0, yandex_maps: 0, direct: 0, other: 0 },
        daily: {},
        bookings: []
      };
    } catch {
      return {
        total: 0,
        sources: { instagram: 0, telegram: 0, google_maps: 0, yandex_maps: 0, direct: 0, other: 0 },
        daily: {},
        bookings: []
      };
    }
  }

  function saveAnalytics(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function isNewSession() {
    try {
      const lastVisit = localStorage.getItem(SESSION_KEY);
      const now = Date.now();

      if (!lastVisit) {
        localStorage.setItem(SESSION_KEY, now.toString());
        return true;
      }

      const diff = now - parseInt(lastVisit, 10);

      // 30 daqiqadan ko'p o'tgan bo'lsa — yangi session
      if (diff > SESSION_TIMEOUT) {
        localStorage.setItem(SESSION_KEY, now.toString());
        return true;
      }

      // Session davomida har sahifa o'tishda vaqtni yangilab tur
      localStorage.setItem(SESSION_KEY, now.toString());
      return false;

    } catch {
      return true; // Xato bo'lsa — hisobla
    }
  }

  function trackVisit() {
    if (!isNewSession()) return;

    const data = getAnalytics();
    const source = getSource();
    const today = new Date().toISOString().split("T")[0];

    data.total = (data.total || 0) + 1;
    data.sources[source] = (data.sources[source] || 0) + 1;
    data.daily[today] = (data.daily[today] || 0) + 1;

    saveAnalytics(data);
  }

  window.sinbadSaveBooking = function (booking) {
    const data = getAnalytics();
    if (!data.bookings) data.bookings = [];
    booking.id = Date.now();
    booking.date = new Date().toISOString();
    booking.source = getSource();
    data.bookings.push(booking);
    saveAnalytics(data);
  };

  window.sinbadGetAnalytics = function () {
    return getAnalytics();
  };

  trackVisit();
})();