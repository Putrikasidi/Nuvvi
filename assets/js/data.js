/* data.js — data contoh (dummy) untuk Nuvvi, di window.NUVVI_DATA */
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
    { label: "Shocked", value: 8.8, color: "#F1A9D0" },
  ],

  /* Daftar "Recent Scans" di Dashboard */
  recentScans: [
    { name: "Chicken (Grilled)", detail: "100 Kcal / 100g", status: "Health", level: "good", img: "food-chicken.png" },
    { name: "Instant Noodle", detail: "380 Kcal / 1 Serving", status: "Moderate", level: "moderate", img: "food-noodle.png" },
    { name: "Boba Tea", detail: "270 Kcal / 1 Cup", status: "High", level: "high", img: "food-boba.png" },
  ],

  /* "Your Meal Plan" di halaman Meal Plan */
  /* Meal plan harian */
  mealPlan: [
    {
      meal: "Breakfast",
      name: "Yogurt Bowl",
      img: "food-yogurt.png",
      macros: [
        { icon: "icon-calories.png", value: "320 kcal" },
        { icon: "icon-carbs.png", value: "42 g" },
        { icon: "icon-protein.png", value: "18 g" },
        { icon: "icon-fat.png", value: "9 g" },
      ],
    },
    {
      meal: "Lunch",
      name: "Egg & Avocado Toast",
      img: "food-toast.png",
      macros: [
        { icon: "icon-calories.png", value: "450 kcal" },
        { icon: "icon-carbs.png", value: "38 g" },
        { icon: "icon-protein.png", value: "22 g" },
        { icon: "icon-fat.png", value: "24 g" },
      ],
    },
    {
      meal: "Dinner",
      name: "Oatmeal Banana Bowl",
      img: "food-oatmeal.png",
      macros: [
        { icon: "icon-calories.png", value: "380 kcal" },
        { icon: "icon-carbs.png", value: "60 g" },
        { icon: "icon-protein.png", value: "12 g" },
        { icon: "icon-fat.png", value: "8 g" },
      ],
    },
  ],

  /* "Recommended For You" di halaman Meal Plan */
  recommendedMeals: [
    { name: "Yogurt", img: "food-yogurt.png", desc: "Light snack, still gets you some protein and probiotics." },
    { name: "Egg & Avocado Toast", img: "food-toast.png", desc: "Protein, healthy fats and carbs in one. Pretty filling." },
    { name: "Oatmeal Banana Bowl", img: "food-oatmeal.png", desc: "Fiber-heavy breakfast that keeps you full for a while." },
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
    { name: "Walking", img: "workout-walking.png", calories: "150 kcal", time: "30 min" },
    { name: "Yoga", img: "workout-yoga.png", calories: "180 kcal", time: "40 min" },
    { name: "Pilates", img: "workout-pilates.png", calories: "220 kcal", time: "35 min" },
    { name: "Cardio", img: "workout-cardio.png", calories: "350 kcal", time: "25 min" },
  ],

  /* Jadwal Hari Ini di Wellness ("group" dipakai untuk hitung progress) */
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

  /* Centang awal jadwal (sebelum user ubah) */
  wellnessDoneDefault: {
    s1: true, s2: true, s3: false,
    s4: true, s5: false, s6: false,
    s7: true, s8: true, s9: false,
    s10: false,
  },

  /* Target Progress Harian di Wellness */
  wellnessTargets: [
    { group: "makan", label: "Makan", color: "#6E9A46", target: 3 },
    { group: "obat", label: "Minum Obat", color: "#E4574C", target: 3 },
    { group: "olahraga", label: "Olahraga", color: "#3E9BD1", target: 1 },
    { group: "air", label: "Minum Air", color: "#E0930E", target: 3 },
  ],

  /* Kondisi kesehatan yang bisa dipilih user di Wellness (boleh pilih lebih dari satu) */
  healthConditions: [
    { id: "diabetes", label: "Diabetes" },
    { id: "hipertensi", label: "Hipertensi" },
    { id: "asma", label: "Asma" },
    { id: "kolesterol", label: "Kolesterol tinggi" },
    { id: "maag", label: "Maag / GERD" },
    { id: "alergi", label: "Alergi" },
    { id: "jantung", label: "Jantung" },
  ],

  /* Pesan pengingat singkat per kondisi. Muncul kalau kondisinya dicentang. */
  conditionTips: {
    diabetes: "Jangan lupa cek gula darah & batasi makanan manis ya.",
    hipertensi: "Kurangi garam dan cek tekanan darah rutin.",
    asma: "Selalu bawa inhaler, hindari debu & udara dingin.",
    kolesterol: "Kurangi gorengan, perbanyak serat dan olahraga.",
    maag: "Makan teratur, hindari makan pedas & telat makan.",
    alergi: "Hindari pemicu alergimu dan sedia obat alergi.",
    jantung: "Jaga pola makan, rutin kontrol ke dokter.",
  },

  /* Daftar obat yang bisa dicentang "sudah diminum hari ini" di Wellness */
  medications: [
    { id: "m1", name: "Metformin", dose: "500 mg", time: "Pagi" },
    { id: "m2", name: "Vitamin D", dose: "1000 IU", time: "Siang" },
    { id: "m3", name: "Obat maag", dose: "1 tablet", time: "Malam" },
  ],

  /* Pertanyaan Wellness (satu per layar) */
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

  /* Blog (dipakai di "Artikel Populer" & halaman blog.html) */
  blogs: [
    {
      id: "a1",
      author: "Coach Vivi",
      handle: "@vivi.coach",
      avatar: "mascot-mia-circle.png",
      time: "2 jam",
      likes: 128,
      replies: 24,
      title: "Manfaat olahraga untuk kesehatan mental",
      img: "workout-pilates.png",
      body: "Olahraga teratur membantu tubuh melepaskan endorfin yang membuat suasana hati lebih baik, mengurangi stres, dan memperbaiki kualitas tidur. Mulai dari 20 menit jalan kaki setiap hari sudah cukup untuk merasakan manfaatnya.",
    },
    {
      id: "a2",
      author: "Nuvvi",
      handle: "@nuvvi.id",
      avatar: "logo.png",
      time: "5 jam",
      likes: 96,
      replies: 12,
      title: "Cara mengatur kalori seharian",
      img: "food-chicken.png",
      body: "Kenali kebutuhan kalori harianmu, lalu bagi ke dalam sarapan, makan siang, makan malam, dan camilan. Utamakan protein dan serat agar kenyang lebih lama, serta batasi minuman manis.",
    },
    {
      id: "a3",
      author: "Mia",
      handle: "@mia.nuvvi",
      avatar: "avatar-mia.png",
      time: "1 hari",
      likes: 210,
      replies: 41,
      title: "Sarapan sehat untuk pagi yang cerah",
      img: "food-yogurt.png",
      body: "Sarapan bergizi seimbang seperti oatmeal dengan buah atau telur dengan roti gandum memberi energi stabil sampai siang dan membantu konsentrasi saat beraktivitas.",
    },
    {
      id: "a4",
      author: "Nuvvi Health",
      handle: "@nuvvi.id",
      avatar: "logo.png",
      time: "2 hari",
      likes: 310,
      replies: 58,
      title: "6 penyakit berbahaya bagi tubuh",
      img: "workout-cardio.png",
      body: "Pola makan tinggi gula dan garam serta kurang gerak meningkatkan risiko diabetes, hipertensi, penyakit jantung, obesitas, kolesterol tinggi, dan gangguan ginjal. Pemeriksaan rutin membantu deteksi dini.",
    },
  ],

  /* Thread di feed Komunitas (postingan singkat, bukan blog) */
  threads: [
    { id: "t1", author: "Rani", handle: "@rani.fit", avatar: "mascot-mia-circle.png", time: "1 jam", likes: 12, replies: 3, img: "", body: "Baru selesai lari pagi 5K! Udara pagi masih seger banget 🌿" },
    { id: "t2", author: "Dimas", handle: "@dimasehat", avatar: "avatar-mia.png", time: "3 jam", likes: 8, replies: 5, img: "food-toast.png", body: "Sarapan hari ini: roti gandum + telur + alpukat. Kenyang sampai siang!" },
    { id: "t3", author: "Nuna", handle: "@nuna.wellness", avatar: "logo.png", time: "kemarin", likes: 20, replies: 6, img: "", body: "Reminder ya, jangan lupa minum air. Target 8 gelas hari ini 💧" },
  ],

  /* Nilai awal Profile */
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
