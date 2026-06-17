# SINBAD — Бассейный комплекс | Веб-сайт

Sinbad basseyn kompleksi uchun statik (HTML/CSS/JS) sayt. Rus tilida, "pool/beach" uslubida, yorqin ranglarda. Hech qanday framework yoki murakkab build kerak emas — oddiy ochib ishga tushiriladi.

---

## 📂 Fayllar tuzilishi

```
sinbad-website/
├── index.html          ← asosiy sahifa (barcha bo'limlar shu yerda)
├── css/
│   └── styles.css       ← dizayn / ranglar / animatsiyalar
├── js/
│   └── script.js        ← mobil menyu va scroll animatsiyalari
├── images/
│   └── logo.svg          ← logotip (SVG)
└── README.md
```

Saytdagi bo'limlar: **Главная → О комплексе → Цены → Меню → Бар → Правила → Галерея → Контакты**.

---

## ⬇️ Nima yuklab olish kerak

Sayt toza HTML/CSS/JS'da yozilgan, shuning uchun **hech narsa o'rnatish shart emas** — `index.html` ni brauzerda ochsangiz ishlaydi. Lekin qulay tahrirlash va ishga tushirish uchun quyidagilarni tavsiya qilaman:

1. **Visual Studio Code** (kod muharriri) — majburiy
   https://code.visualstudio.com/

2. **Live Server** (VS Code kengaytmasi) — tavsiya etiladi
   VS Code'da `Extensions` (chap paneldagi kvadratlar) → qidiruvga `Live Server` (muallif: Ritwick Dey) → `Install`.
   Bu sahifani avtomatik brauzerda ochib, har bir o'zgarishni real vaqtda ko'rsatadi.

3. **Internet aloqasi** (sayt birinchi ochilishida) — shrift va galereya rasmlari onlayn yuklanadi:
   - Shriftlar: Google Fonts (`Unbounded`, `Nunito`)
   - Galereya rasmlari: Unsplash (vaqtinchalik namuna rasmlar)

> Internetsiz ishlatmoqchi bo'lsangiz, pastdagi "Shriftlarni offline qilish" bo'limiga qarang.

---

## ▶️ Qanday ishga tushiriladi

**1-usul (eng oson):**
`index.html` faylini ustiga ikki marta bosing — u brauzerda ochiladi.

**2-usul (VS Code + Live Server, tavsiya etiladi):**
1. VS Code'ni oching → `File → Open Folder` → `sinbad-website` papkasini tanlang.
2. `index.html` ni oching.
3. Pastki o'ng burchakdagi **"Go Live"** tugmasini bosing (yoki faylga o'ng tugma → `Open with Live Server`).
4. Sayt brauzerda `http://127.0.0.1:5500` da ochiladi.

---

## 🖼 Rasmlarni o'z rasmlaringizga almashtirish

Hozir galereyada **vaqtinchalik namuna rasmlar** (Unsplash) turibdi. O'zingizning Instagram (`@sinbad.uz`) rasmlaringizga almashtirish uchun:

1. Instagram'dan kerakli rasmlarni yuklab oling.
2. Ularni `images/` papkasiga tashlang, masalan: `images/pool1.jpg`, `images/bar.jpg`, va h.k.
3. `index.html` ichida **«ГАЛЕРЕЯ»** bo'limini toping va har bir `<img src="https://images.unsplash.com/...">` ni o'zingiznikiga o'zgartiring:

   ```html
   <!-- edi: -->
   <img src="https://images.unsplash.com/photo-..." alt="..." loading="lazy" />
   <!-- bo'ldi: -->
   <img src="images/pool1.jpg" alt="Бассейн SINBAD" loading="lazy" />
   ```

> Maslahat: barcha rasmlarni `.jpg` formatida, ~1200px kenglikda saqlang — sayt tezroq yuklanadi.

### Logotip
Logotip kod ichida SVG sifatida chizilgan (Instagram brendiga mos — **quyosh + to'lqin**) va `images/logo.svg` faylida ham mavjud. Agar sizda tayyor (rasmli) logo bo'lsa, uni `images/logo.png` qilib tashlang va `index.html` dagi `<span class="logo__mark">...</span>` ichidagi SVG'ni `<img src="images/logo.png" alt="SINBAD" height="44">` bilan almashtiring.

---

## ✏️ Matn va narxlarni tahrirlash

Barcha matn **`index.html`** ichida. Hech qanday dasturlash bilmasangiz ham, kerakli so'zni topib o'zgartirsangiz bo'ladi:

- **Narxlar** → `<section id="prices">` bo'limi
- **Menyu (oshxona)** → `<section id="menu">` bo'limi
- **Bar (kokteyl/ichimliklar)** → `<section id="bar">` bo'limi
- **Правила (qoidalar)** → `<section id="rules">` bo'limi
- **Kontaktlar / telefon / manzil** → `<section id="contacts">` bo'limi

> ⚠️ Menyu va bardagi narxlar **namuna** sifatida qo'yilgan. Ularni haqiqiy narxlaringizga o'zgartiring.

Ma'lumotlar manbai (Google Maps, Instagram `@sinbad.uz`, ochiq manbalardan):
- Manzil: г. Ташкент, Учтепинский район, ул. Фозилтепа, Чиланзар-25, 11/1
- Telefon: +998 93 118 88 80 / +998 77 182 88 80
- Ish vaqti: har kuni 10:10 – 22:00
- Kirish narxi (2026): budni — kattalar 150 000 / 18:00 dan keyin 80 000 / bolalar 70 000; dam olish kunlari — kattalar 180 000 / bolalar 90 000

---

## 🎨 Ranglarni o'zgartirish

`css/styles.css` faylining boshidagi `:root` bo'limida barcha asosiy ranglar:

```css
--aqua:#14B8D4;     /* asosiy turkuaz */
--coral:#FF7A59;    /* marjon (tugmalar) */
--sun:#FFC93C;      /* quyosh sariq */
--aqua-deep:#0B6E86;/* to'q (sarlavhalar) */
```

Bu yerda HEX kodni o'zgartirsangiz, butun sayt bo'ylab rang yangilanadi.

---

## 🌐 Shriftlarni offline qilish (ixtiyoriy)

Agar internetsiz ham aniq shriftlar kerak bo'lsa:
1. https://fonts.google.com/ dan `Unbounded` va `Nunito` ni yuklab oling.
2. `fonts/` papka yarating, `.woff2` fayllarni tashlang.
3. `index.html` dagi Google Fonts `<link>` larini o'chirib, `styles.css` ga `@font-face` qoidalarini qo'shing.

---

Savol bo'lsa — yozing, qo'shimcha bo'lim yoki dizaynni o'zgartirib beraman. 🏖

# Sinbad Website — O'rnatish Qo'llanmasi

## Fayllar
```
sinbad-website/
├── tracker.js     → Barcha sahifalarга qo'shing (tracking uchun)
├── booking.html   → Qabulga yozilish formasi
├── admin.html     → Admin panel (faqat siz uchun)
└── README.md      → Shu fayl
```

---

## 1. tracker.js ni saytga qo'shish

Saytingizning BARCHA sahifalarida `<head>` qismiga qo'shing:

```html
<script src="tracker.js"></script>
```

---

## 2. booking.html

Qabulga yozilish sahifasi. Siz xohlagan link orqali ochiladi:
- `yoursite.com/booking.html`

Xizmat turlarini o'zgartirish uchun `booking.html` faylida `<select id="serviceType">` qismini tahrirlang.

---

## 3. admin.html (MAXFIY SAHIFA)

**Faqat siz bilasiz!** Hech kimga link bermang.

URL: `yoursite.com/admin.html`

### Kirish paroli o'zgartirish:
`admin.html` faylini oching, quyidagi qatorni toping:
```javascript
const ADMIN_PASSWORD = "sinbad2025";
```
`sinbad2025` o'rniga o'zingizning parolingizni yozing.

---

## 4. Manba kuzatish (UTM Links)

Instagram, Telegram, Google Maps dan to'g'ri kuzatish uchun linkga parametr qo'shing:

### Instagram
```
yoursite.com/?utm_source=instagram&utm_medium=social
```

### Telegram
```
yoursite.com/?utm_source=telegram&utm_medium=social
```

### Google Maps
```
yoursite.com/?utm_source=google&utm_medium=maps
```

### Yandex Maps
```
yoursite.com/?utm_source=yandex&utm_medium=maps
```

---

## 5. Excel Yuklab Olish

Admin panelga kirib **"↓ Excel Yuklab Olish"** tugmasini bosing.

- **Mac**: Numbers yoki Excel bilan oching
- **Windows**: Excel bilan to'g'ri ochiladi
- Fayl nomi: `sinbad-hisobot-YYYY-MM-DD.csv`

Admin panel **har 30 soniyada** avtomatik yangilanadi.

---

## Muhim Eslatma

Ma'lumotlar **brauzer localStorage** da saqlanadi. 
Agar serverga ko'chirmoqchi bo'lsangiz, backend (Node.js, PHP, va h.k.) kerak bo'ladi.
Yordam uchun murojaat qiling.
