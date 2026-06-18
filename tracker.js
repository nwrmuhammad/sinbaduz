// =============================================
// SINBAD VISITOR TRACKER v2 — Supabase
// Barcha sahifalarga qo'shing: <script src="tracker.js"></script>
// =============================================

(function () {

  // 🔧 SHU IKKI QATORNI O'ZGARTIRING:
  const SUPABASE_URL = "https://equskdaiieajgrantwfj.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxdXNrZGFpaWVhamdyYW50d2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NTcyNzYsImV4cCI6MjA5NzMzMzI3Nn0.wIFD0a1EFmOIWhYwmhzB_iLpnqkrM-19Fb0jV6uNYbk";

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

  // ── Analytics olish (global) ─────────────────
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

  // ── Admin panel funksiyalari ─────────────────

  window.checkPassword = function () {
    const ADMIN_PASSWORD = "sinbad2025";
    const val = document.getElementById('passwordInput').value;
    if (val === ADMIN_PASSWORD) {
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      loadDashboard();
      setInterval(loadDashboard, 30000);
    } else {
      document.getElementById('loginError').style.display = 'block';
      document.getElementById('passwordInput').value = '';
    }
  };

  window.logout = function () {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('passwordInput').value = '';
  };

  window.refreshData = function () {
    loadDashboard();
  };

  async function loadDashboard() {
    // sinbadGetAnalytics endi async — await bilan chaqiramiz
    const data = await window.sinbadGetAnalytics();

    const total    = data.total    || 0;
    const sources  = data.sources  || {};
    const bookings = data.bookings || [];
    const daily    = data.daily    || {};

    // --- STATS GRID ---
    const sourceConfig = [
      { key: 'total',       label: 'Jami Tashrif', icon: '👁',  cls: 'total',     value: total, noPercent: true },
      { key: 'instagram',   label: 'Instagram',    icon: '📸',  cls: 'instagram'  },
      { key: 'telegram',    label: 'Telegram',     icon: '✈️',  cls: 'telegram'   },
      { key: 'google_maps', label: 'Google Maps',  icon: '🗺',  cls: 'google'     },
      { key: 'yandex_maps', label: 'Yandex Maps',  icon: '📍',  cls: 'yandex'     },
      { key: 'direct',      label: "To'g'ridan",   icon: '🔗',  cls: 'direct'     },
      { key: 'other',       label: 'Boshqa',       icon: '🌐',  cls: 'other'      },
    ];

    const statsHtml = sourceConfig.map(function (s) {
      const count = s.noPercent ? s.value : (sources[s.key] || 0);
      const pct   = total > 0 && !s.noPercent ? Math.round(count / total * 100) : null;
      return '<div class="stat-card ' + s.cls + '">' +
        '<div class="stat-icon">' + s.icon + '</div>' +
        '<div class="stat-number">' + count + '</div>' +
        '<div class="stat-label">' + s.label + '</div>' +
        (pct !== null ? '<div class="stat-pct">' + pct + '%</div>' : '') +
        '</div>';
    }).join('');

    document.getElementById('statsGrid').innerHTML = statsHtml;

    // --- BAR CHART ---
    const barKeys = [
      { key: 'instagram',   label: 'Instagram',      color: '#E1306C' },
      { key: 'telegram',    label: 'Telegram',       color: '#2CA5E0' },
      { key: 'google_maps', label: 'Google Maps',    color: '#4285F4' },
      { key: 'yandex_maps', label: 'Yandex Maps',    color: '#FF0000' },
      { key: 'direct',      label: "To'g'ri kirish", color: '#8B7355' },
      { key: 'other',       label: 'Boshqa',         color: '#5A5A5A' },
    ];

    const maxVal = Math.max.apply(null, barKeys.map(function (b) { return sources[b.key] || 0; }).concat([1]));
    const barsHtml = barKeys.map(function (b) {
      const count = sources[b.key] || 0;
      const width = Math.round(count / maxVal * 100);
      return '<div class="bar-row">' +
        '<div class="bar-label"><span class="bar-dot" style="background:' + b.color + '"></span>' + b.label + '</div>' +
        '<div class="bar-track"><div class="bar-fill" style="width:' + width + '%;background:' + b.color + '"></div></div>' +
        '<div class="bar-count">' + count + '</div>' +
        '</div>';
    }).join('');

    document.getElementById('barSection').innerHTML = barsHtml;

    // --- DAILY GRID ---
    const sortedDays = Object.entries(daily).sort(function (a, b) { return b[0].localeCompare(a[0]); }).slice(0, 30);
    const dailyHtml = sortedDays.length > 0
      ? sortedDays.map(function (entry) {
          return '<div class="day-cell"><div class="day-date">' + entry[0].slice(5) + '</div><div class="day-count">' + entry[1] + '</div></div>';
        }).join('')
      : '<p style="color:var(--text-muted);font-size:0.82rem;padding:12px">Hozircha ma\'lumot yo\'q</p>';

    document.getElementById('dailyGrid').innerHTML = dailyHtml;

    // --- BOOKINGS TABLE ---
    document.getElementById('bookingCountBadge').textContent = bookings.length + ' ta';

    if (bookings.length === 0) {
      document.getElementById('tableContainer').innerHTML =
        '<div class="empty-state"><div class="empty-icon">📋</div><div>Hozircha yozuvlar yo\'q</div></div>';
    } else {
      const srcMap = { instagram: 'Instagram', telegram: 'Telegram', google_maps: 'Google Maps', yandex_maps: 'Yandex Maps', direct: "To'g'ri", other: 'Boshqa' };
      const rows = bookings.slice().reverse().map(function (b) {
        const src      = b.source || 'other';
        const srcLabel = srcMap[src] || src;
        const dateStr  = b.created_at ? new Date(b.created_at).toLocaleString('uz-UZ') : '—';
        return '<tr>' +
          '<td>' + (b.fullName     || '—') + '</td>' +
          '<td>' + (b.phone        || '—') + '</td>' +
          '<td>' + (b.serviceType  || '—') + '</td>' +
          '<td>' + (b.bookingDate  || '—') + '</td>' +
          '<td>' + (b.bookingTime  || '—') + '</td>' +
          '<td><span class="source-tag ' + src + '">' + srcLabel + '</span></td>' +
          '<td style="color:var(--text-muted);font-size:0.78rem">' + dateStr + '</td>' +
          '</tr>';
      }).join('');

      document.getElementById('tableContainer').innerHTML =
        '<table><thead><tr>' +
        '<th>Ism Familiya</th><th>Telefon</th><th>Xizmat</th><th>Sana</th><th>Vaqt</th><th>Manba</th><th>Yozilgan</th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table>';
    }

    document.getElementById('refreshInfo').textContent =
      'Oxirgi yangilanish: ' + new Date().toLocaleString('uz-UZ') + ' · Har 30 soniyada avtomatik yangilanadi';
  }

  // ── Excel yuklash ────────────────────────────
  window.downloadAllExcel = async function () {
    const data     = await window.sinbadGetAnalytics();
    const bookings = data.bookings || [];
    const sources  = data.sources  || {};
    const total    = data.total    || 0;
    const daily    = data.daily    || {};

    let csv = '\uFEFF';

    csv += 'UMUMIY STATISTIKA\n';
    csv += 'Jami tashrif,' + total + '\n';
    csv += 'Instagram,' + (sources.instagram || 0) + '\n';
    csv += 'Telegram,' + (sources.telegram || 0) + '\n';
    csv += 'Google Maps,' + (sources.google_maps || 0) + '\n';
    csv += 'Yandex Maps,' + (sources.yandex_maps || 0) + '\n';
    csv += "To'g'ri kirish," + (sources.direct || 0) + '\n';
    csv += 'Boshqa,' + (sources.other || 0) + '\n';
    csv += 'Hisobot sanasi,' + new Date().toLocaleString('uz-UZ') + '\n\n';

    csv += 'QABULGA YOZILGANLAR\n';
    csv += 'Ism Familiya,Telefon,Yosh,Email,Xizmat Turi,Qabul Sanasi,Qabul Vaqti,Manba,Yozilgan Vaqt,Izoh\n';

    var srcMap2 = { instagram: 'Instagram', telegram: 'Telegram', google_maps: 'Google Maps', yandex_maps: 'Yandex Maps', direct: "To'g'ri kirish", other: 'Boshqa' };
    bookings.forEach(function (b) {
      var srcLabel = srcMap2[b.source] || b.source || "Noma'lum";
      var dateStr  = b.created_at ? new Date(b.created_at).toLocaleString('uz-UZ') : '';
      csv += [
        '"' + (b.fullName    || '') + '"',
        '"' + (b.phone       || '') + '"',
        '"' + (b.age         || '') + '"',
        '"' + (b.email       || '') + '"',
        '"' + (b.serviceType || '') + '"',
        '"' + (b.bookingDate || '') + '"',
        '"' + (b.bookingTime || '') + '"',
        '"' + srcLabel + '"',
        '"' + dateStr + '"',
        '"' + (b.notes || '').replace(/"/g, "'") + '"',
      ].join(',') + '\n';
    });

    csv += '\nKUNLIK TASHRIF\nSana,Tashrif Soni\n';
    Object.entries(daily).sort(function (a, b) { return b[0].localeCompare(a[0]); }).forEach(function (entry) {
      csv += '"' + entry[0] + '",' + entry[1] + '\n';
    });

    var dateTag  = new Date().toISOString().split('T')[0];
    var filename = 'sinbad-hisobot-' + dateTag + '.csv';
    var blob     = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url      = URL.createObjectURL(blob);
    var a        = document.createElement('a');
    a.href       = url;
    a.download   = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ── Ishga tushirish ─────────────────────────
  trackVisit();

})();