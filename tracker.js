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


//   // Analytics olish funksiyasi (global)
//   window.sinbadGetAnalytics = function () {
//     return getAnalytics();
//   };

//   trackVisit();
// })();


// =============================================
// SINBAD VISITOR TRACKER v2 — Supabase
// Barcha sahifalarga qo'shing: <script src="tracker.js"></script>
// =============================================

(function () {

  // 🔧 SHU IKKI QATORNI O'ZGARTIRING:
  const SUPABASE_URL = "https://equskdaiieajgrantwfj.supabase.co";  // Project Settings > API > Project URL
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxdXNrZGFpaWVhamdyYW50d2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NTcyNzYsImV4cCI6MjA5NzMzMzI3Nn0.wIFD0a1EFmOIWhYwmhzB_iLpnqkrM-19Fb0jV6uNYbk";               // Project Settings > API > anon public

  // ─────────────────────────────────────────────
  const SESSION_KEY = "sinbad_session";

  const HEADERS = {
    "Content-Type": "application/json",
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": "Bearer " + SUPABASE_ANON_KEY,
  };

  // ── Manba aniqlash ──────────────────────────
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

  // ── Tashrif qo'shish ────────────────────────
  async function trackVisit() {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");

    const source = getSource();
    const today = new Date().toISOString().split("T")[0];

    try {
      await fetch(SUPABASE_URL + "/rest/v1/visits", {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({ source: source, date: today }),
      });
    } catch (err) {
      console.warn("[Sinbad] Tashrif saqlashda xato:", err);
    }
  }

  // ── Booking saqlash (global) ─────────────────
  // Ishlatish: await sinbadSaveBooking({ name: "Ali", phone: "+998901234567", message: "..." })
  window.sinbadSaveBooking = async function (booking) {
    try {
      const res = await fetch(SUPABASE_URL + "/rest/v1/bookings", {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(Object.assign({}, booking, {
          source: getSource(),
          created_at: new Date().toISOString(),
        })),
      });
      if (!res.ok) {
        const err = await res.json();
        console.warn("[Sinbad] Booking xatosi:", err);
        return { success: false, error: err };
      }
      return { success: true };
    } catch (err) {
      console.warn("[Sinbad] Booking saqlashda xato:", err);
      return { success: false, error: err };
    }
  };

  // ── Analytics olish (global) — avvalgi bilan bir xil interfeys ──
  // Admin panel: const data = await sinbadGetAnalytics();
  window.sinbadGetAnalytics = async function () {
    try {
      const [visitsRes, bookingsRes] = await Promise.all([
        fetch(SUPABASE_URL + "/rest/v1/visits?select=source,date&order=date.desc", { headers: HEADERS }),
        fetch(SUPABASE_URL + "/rest/v1/bookings?select=*&order=created_at.desc", { headers: HEADERS }),
      ]);

      const visits   = await visitsRes.json();
      const bookings = await bookingsRes.json();

      const sources = { instagram: 0, telegram: 0, google_maps: 0, yandex_maps: 0, direct: 0, other: 0 };
      const daily   = {};

      (Array.isArray(visits) ? visits : []).forEach(function (v) {
        sources[v.source] !== undefined ? sources[v.source]++ : sources.other++;
        if (v.date) daily[v.date] = (daily[v.date] || 0) + 1;
      });

      return {
        total:    Array.isArray(visits)   ? visits.length   : 0,
        sources:  sources,
        daily:    daily,
        bookings: Array.isArray(bookings) ? bookings : [],
      };

    } catch (err) {
      console.warn("[Sinbad] Analytics olishda xato:", err);
      return {
        total: 0,
        sources: { instagram: 0, telegram: 0, google_maps: 0, yandex_maps: 0, direct: 0, other: 0 },
        daily: {},
        bookings: [],
      };
    }
  };

  // ── Ishga tushirish ─────────────────────────
  trackVisit();

})();