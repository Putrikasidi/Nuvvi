/*
  data.js
  -------
  Semua data CONTOH (dummy) untuk website Nuvvi dikumpulkan di sini supaya
  gampang diubah. Belum pakai backend / database.
  Semua variabel ditaruh di window.NUVVI_DATA.
*/
window.NUVVI_DATA = {
  /* Menu sidebar aplikasi. "icon" merujuk ke nama SVG di layout.js */
  appMenu: [
    { id: "dashboard", label: "Dashboard", icon: "home", href: "dashboard.html" },
    { id: "meal-plan", label: "Meal Plan", icon: "camera", href: "meal-plan.html" },
    { id: "sport-plan", label: "Sport Plan", icon: "run", href: "sport-plan.html" },
    { id: "wellness", label: "Wellness", icon: "heart", href: "wellness.html" },
    { id: "komunitas", label: "Komunitas", icon: "users", href: "komunitas.html" },
  ],

  /* Saran yang muncul saat mengetik di kolom "Search article" */
  searchIndex: [
    "Salad Buah",
    "Salad Sayur",
    "Salad untuk diet",
    "Manfaat olahraga untuk kesehatan mental",
    "Cara Mengatur Kalori Seharian",
    "Sarapan sehat untuk pagi yang cerah",
    "6 penyakit berbahaya bagi tubuh",
    "Tips minum air yang cukup",
    "Yoga untuk pemula",
    "Menu makan malam rendah kalori",
  ],

  /* Kartu ringkasan nutrisi di Dashboard */
  nutrientStats: [
    { label: "Total Calories", value: "1.225 kcal", icon: "icon-calories.png", ring: "#F7B267" },
    { label: "Protein", value: "67 g", icon: "icon-protein.png", ring: "#E8837B" },
    { label: "Fat", value: "57 g", icon: "icon-fat.png", ring: "#F7D24E" },
    { label: "Carbohydrate", value: "190 g", icon: "icon-carbs.png", ring: "#F2C14E" },
    { label: "Fiber", value: "30 g", icon: "icon-fiber.png", ring: "#8FBF6B" },
  ],

  /* Donut "Daily Reflection" di Dashboard (persen mood) */
  dailyReflection: [
    { label: "Happy", value: 38.6, color: "#F7D24E" },
    { label: "Sad", value: 28.1, color: "#5BB4E5" },
    { label: "Angry", value: 14, color: "#E4574C" },
    { label: "Stressed", value: 10.5, color: "#8FB56B" },
    { label: "Shied", value: 8.8, color: "#F1A9D0" },
  ],

  /* Daftar "Recent Scans" di Dashboard */
  recentScans: [
    { name: "Chicken (Grilled)", detail: "100 Kcal / 100g", status: "Health", level: "good", img: "food-chicken.png" },
    { name: "Instant Noodle", detail: "380 Kcal / 1 Serving", status: "Moderate", level: "moderate", img: "food-noodle.png" },
    { name: "Boba Tea", detail: "270 Kcal / 1 Cup", status: "High", level: "high", img: "food-boba.png" },
  ],

  /* "Your Meal Plan" di halaman Meal Plan */
  /* Urutan macro mengikuti grid 2x2 di desain: kalori & karbo di baris atas,
     protein & lemak di baris bawah (ikon dari assets/img/icon-*.png). */
  mealPlan: [
    {
      meal: "Breakfast",
      name: "Yogurt Bowl",
      img: "food-yogurt.png",
      macros: [
        { icon: "icon-calories.png", value: "24 g kcal" },
        { icon: "icon-carbs.png", value: "30 g" },
        { icon: "icon-protein.png", value: "67 g" },
        { icon: "icon-fat.png", value: "20 g" },
      ],
    },
    {
      meal: "Lunch",
      name: "Egg & Avocado Toast",
      img: "food-toast.png",
      macros: [
        { icon: "icon-calories.png", value: "24 g kcal" },
        { icon: "icon-carbs.png", value: "30 g" },
        { icon: "icon-protein.png", value: "67 g" },
        { icon: "icon-fat.png", value: "20 g" },
      ],
    },
    {
      meal: "Dinner",
      name: "Oatmeal Banana Bowl",
      img: "food-oatmeal.png",
      macros: [
        { icon: "icon-calories.png", value: "24 g kcal" },
        { icon: "icon-carbs.png", value: "30 g" },
        { icon: "icon-protein.png", value: "67 g" },
        { icon: "icon-fat.png", value: "20 g" },
      ],
    },
  ],

  /* "Recommended For You" di halaman Meal Plan */
  recommendedMeals: [
    { name: "Yogurt", img: "food-yogurt.png", desc: "A light snack with protein, probiotics, and natural sweetness." },
    { name: "Egg & Avocado Toast", img: "food-toast.png", desc: "A simple combination of protein, healthy fats, and carbohydrates." },
    { name: "Oatmeal Banana Bowl", img: "food-oatmeal.png", desc: "A filling breakfast with fiber and carbohydrates for daily energy." },
  ],

  /* Hasil "analisa" dummy setelah upload foto makanan di Meal Plan */
  scanResult: {
    name: "Nasi Ayam Sayur",
    calories: "540 kcal",
    macros: [
      { label: "Protein", value: "32 g" },
      { label: "Carbohydrate", value: "68 g" },
      { label: "Fat", value: "18 g" },
      { label: "Fiber", value: "6 g" },
    ],
  },

  /* Strip tanggal di Sport Plan */
  sportDates: [
    { day: "Mon", date: "7 Sep" },
    { day: "Tue", date: "8 Sep" },
    { day: "Wed", date: "9 Sep" },
    { day: "Thu", date: "10 Sep" },
    { day: "Fri", date: "11 Sep" },
    { day: "Sat", date: "12 Sep" },
    { day: "Sun", date: "13 Sep" },
    { day: "Mon", date: "14 Sep" },
    { day: "Tue", date: "15 Sep" },
  ],

  /* Bar chart "Weekly Activity" (kkal per hari), sumbu maks 1400 */
  weeklyActivity: [
    { day: "Mon", value: 400 },
    { day: "Tue", value: 500 },
    { day: "Wed", value: 790 },
    { day: "Thu", value: 990 },
    { day: "Fri", value: 690 },
    { day: "Sat", value: 1230 },
    { day: "Sun", value: 300 },
  ],
  weeklyActivityMax: 1400,

  /* "Your Activity Summary" di Sport Plan */
  activitySummary: {
    percent: 67,
    calories: "230 kcal",
    activeTime: "30 min",
    steps: "4.872 steps",
  },

  /* "Recommended Workouts" di Sport Plan */
  recommendedWorkouts: [
    { name: "Walking", img: "workout-walking.png", calories: "300 kcal", time: "30 min" },
    { name: "Yoga", img: "workout-yoga.png", calories: "300 kcal", time: "30 min" },
    { name: "Pilates", img: "workout-pilates.png", calories: "300 kcal", time: "30 min" },
    { name: "Cardio", img: "workout-cardio.png", calories: "300 kcal", time: "30 min" },
  ],

  /* "Jadwal Hari Ini" di Wellness. "group" dipakai untuk menghitung Progress Harian */
  /* Jadwal sehari penuh - 3x makan, 3x minum obat, 3x minum air, 1x olahraga.
     Jumlahnya sengaja dibuat 3/3/3/1 supaya progress di "Progress Harian" (Makan 2/3,
     Minum Obat 1/3, dst - sesuai desain) benar-benar dihitung dari checklist ini,
     bukan angka tetap. Centang/lepas centang di sini langsung mengubah ring progress. */
  wellnessSchedule: [
    { id: "s1", title: "Sarapan", note: "Yogurt", time: "07.00", img: "meal-salad-man.png", group: "makan" },
    { id: "s2", title: "Makan Siang", note: "Nasi & sayur", time: "12.00", img: "food-toast.png", group: "makan" },
    { id: "s3", title: "Makan Malam", note: "Sup ayam", time: "19.00", img: "food-oatmeal.png", group: "makan" },
    { id: "s4", title: "Minum Obat Pagi", note: "Vitamin Omega3", time: "08.00", img: "meal-pills.png", group: "obat" },
    { id: "s5", title: "Minum Obat Siang", note: "Obat maag", time: "13.00", img: "meal-pills.png", group: "obat" },
    { id: "s6", title: "Minum Obat Malam", note: "Vitamin C", time: "20.00", img: "meal-pills.png", group: "obat" },
    { id: "s7", title: "Minum Air", note: "2 gelas", time: "09.00", img: "food-boba.png", group: "air" },
    { id: "s8", title: "Minum Air", note: "2 gelas", time: "14.00", img: "food-boba.png", group: "air" },
    { id: "s9", title: "Minum Air", note: "2 gelas", time: "18.00", img: "food-boba.png", group: "air" },
    { id: "s10", title: "Olahraga", note: "30 menit - walking", time: "10.00", img: "workout-run.png", group: "olahraga" },
  ],

  /* Berapa banyak item jadwal per kategori yang sudah dicentang, saat pertama kali
     dibuka (sebelum user mengubah apa pun) - dipilih supaya cocok dengan angka di
     desain: Makan 2/3, Minum Obat 1/3, Minum Air 2/3, Olahraga 0/1. */
  wellnessDoneDefault: {
    s1: true, s2: true, s3: false,
    s4: true, s5: false, s6: false,
    s7: true, s8: true, s9: false,
    s10: false,
  },

  /* Target Progress Harian di Wellness (target = jumlah jadwal per grup di atas). */
  /* Urutan sesuai PDF: kolom kiri Makan/Minum Obat/Olahraga bertumpuk, kolom kanan Minum Air.
     Dipasangkan dengan #nv-progress-rings yang pakai grid-flow-col grid-rows-3. */
  wellnessTargets: [
    { group: "makan", label: "Makan", color: "#6E9A46", target: 3 },
    { group: "obat", label: "Minum Obat", color: "#E4574C", target: 3 },
    { group: "olahraga", label: "Olahraga", color: "#3E9BD1", target: 1 },
    { group: "air", label: "Minum Air", color: "#E0930E", target: 3 },
  ],

  /* Pertanyaan Wellness (dijawab satu per satu). Sesuai Desain Canva.pdf hal. 15-22 */
  quizQuestions: [
    {
      id: "reminder",
      emoji: "🔔",
      text: "Reminder apa yang ingin kamu aktifkan?",
      options: ["Minum obat", "Sarapan", "Makan siang", "Makan malam", "Olahraga"],
    },
    {
      id: "freq-olahraga",
      emoji: "📅",
      text: "Berapa kali kamu biasanya berolahraga dalam seminggu?",
      options: ["Belum rutin", "1-2 kali", "3-4 kali", "5+ kali"],
    },
    {
      id: "durasi-olahraga",
      emoji: "🏃",
      text: "Berapa lama biasanya kamu berolahraga dalam satu sesi?",
      options: ["Belum rutin", "< 15 menit", "15-30 menit", "30-60 menit", "> 60 menit"],
    },
    {
      id: "waktu-olahraga",
      emoji: "🏋️",
      text: "Kapan kamu biasanya berolahraga?",
      options: ["Tidak tentu", "Pagi", "Siang", "Sore", "Malam"],
    },
    {
      id: "makan-malam",
      emoji: "🌙",
      text: "Biasanya kamu makan malam jam berapa?",
      options: ["Tidak tentu", "17.00 - 18.00", "18.00 - 19.00", "19.00 - 20.00", "> 20.00"],
    },
    {
      id: "makan-siang",
      emoji: "☀️",
      text: "Biasanya kamu makan siang jam berapa?",
      options: ["Tidak tentu", "11.00 - 12.00", "12.00 - 13.00", "13.00 - 14.00", "> 14.00"],
    },
    {
      id: "sarapan",
      emoji: "🌅",
      text: "Biasanya kamu sarapan jam berapa?",
      options: ["Tidak tentu", "06.00 - 07.00", "07.00 - 08.00", "08.00 - 09.00", "> 09.00"],
    },
    {
      id: "minum-obat",
      emoji: "💊",
      text: "Biasanya kamu perlu minum obat pada waktu kapan?",
      options: ["Saya tidak minum obat rutin", "Pagi", "Siang", "Malam", "Pagi & Malam"],
    },
  ],

  /* Kartu di halaman Komunitas */
  communities: [
    { id: "c1", name: "Lari Pagi Bersama", members: 270, img: "community-run.png" },
    { id: "c2", name: "Dapur Sehat", members: 270, img: "food-toast.png" },
    { id: "c3", name: "Yoga & Mindful", members: 270, img: "workout-yoga.png" },
    { id: "c4", name: "Diet Seimbang", members: 270, img: "food-oatmeal.png" },
    { id: "c5", name: "Teman Olahraga Sore", members: 270, img: "workout-walking.png" },
    { id: "c6", name: "Hidup Tanpa Gula", members: 270, img: "community-noodle.png" },
  ],

  articles: [
    {
      id: "a1",
      title: "Manfaat olahraga untuk kesehatan mental",
      img: "workout-pilates.png",
      body: "Olahraga teratur membantu tubuh melepaskan endorfin yang membuat suasana hati lebih baik, mengurangi stres, dan memperbaiki kualitas tidur. Mulai dari 20 menit jalan kaki setiap hari sudah cukup untuk merasakan manfaatnya.",
    },
    {
      id: "a2",
      title: "Cara Mengatur Kalori Seharian",
      img: "food-chicken.png",
      body: "Kenali kebutuhan kalori harianmu, lalu bagi ke dalam sarapan, makan siang, makan malam, dan camilan. Utamakan protein dan serat agar kenyang lebih lama, serta batasi minuman manis.",
    },
    {
      id: "a3",
      title: "Sarapan sehat untuk pagi yang cerah",
      img: "food-yogurt.png",
      body: "Sarapan bergizi seimbang seperti oatmeal dengan buah atau telur dengan roti gandum memberi energi stabil sampai siang dan membantu konsentrasi saat beraktivitas.",
    },
    {
      id: "a4",
      title: "6 penyakit berbahaya bagi tubuh",
      img: "workout-cardio.png",
      body: "Pola makan tinggi gula dan garam serta kurang gerak meningkatkan risiko diabetes, hipertensi, penyakit jantung, obesitas, kolesterol tinggi, dan gangguan ginjal. Pemeriksaan rutin membantu deteksi dini.",
    },
  ],

  /* Nilai awal halaman Profile (dipakai kalau belum pernah disimpan).
     Nama dipakai juga di chip user pada topbar ("GOOD MORNING, MIA!"). */
  defaultProfile: {
    name: "Mia",
    username: "mia.nuvvi",
    gender: "Perempuan",
    phone: "0812-3456-7890",
    email: "mia@example.com",
    address: "Jl. Kaluku Fazrani No. 12, Denpasar",
  },
  profileTagline: "Stay Healthy!",
};
