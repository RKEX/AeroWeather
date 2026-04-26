# 🌦 AeroWeather

Modern **AI-enhanced weather dashboard** built with **Next.js 16**, **Bun package manager**, and deployed on **Vercel**.

🔗 **Live at:**
https://aeroweather-mauve.vercel.app/

---

# ✨ Features

* 🌤 Real-time Weather Data
* 📍 Location-based Forecast
* 📊 Hourly & Daily Weather Forecast
* 🌫 Air Quality Index (AQI)
* 🌌 Animated Sky Background
* ⚡ Smooth Scrolling UI (Lenis)
* 📱 Responsive Modern UI
* 🚀 Fast build with Bun

---

# 🧠 Tech Stack

| Technology     | Purpose                   |
| -------------- | ------------------------- |
| Next.js 16     | React Framework           |
| Bun            | Package Manager & Runtime |
| TypeScript     | Type Safety               |
| Open-Meteo API | Weather Data              |
| Tailwind CSS   | Styling                   |
| Vercel         | Deployment                |

---

# 📦 Package Manager

This project uses **Bun** instead of npm or yarn.

Bun includes:

* JavaScript runtime
* package manager
* bundler
* test runner

All in one fast developer toolkit.

---

# ⚙️ Installation

## 1️⃣ Install Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

Check installation

```bash
bun --version
```

---

# 📥 Clone the Repository

```bash
git clone https://github.com/RKEX/aeroweather.git
cd aeroweather
```

---

# 📦 Install Dependencies

```bash
bun install
```

---

# ▶ Run Development Server

Create a local environment file before starting:

```bash
cp .env.example .env.local
```

Set this value in `.env.local`:

```bash
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

The Impact Intelligence Calendar uses OpenWeather One Call and Air Pollution APIs through a server route and requires this key.

```bash
bun run dev
```

Open in browser

```
http://localhost:3000
```

---

# 🏗 Build for Production

```bash
bun run build
```

---

# 🚀 Start Production Server

```bash
bun run start
```

---

# 📁 Project Structure

```
src
 ├─ app
 │   ├─ layout.tsx
 │   ├─ page.tsx
 │
 ├─ components
 │   └─ weather
 │       └─ sky-background.tsx
 │
 ├─ lib
 │   └─ fonts.ts
 │
 ├─ types
 │   └─ weather.ts
 │
 └─ styles
     └─ globals.css
```

---

# 🌍 API

Weather data powered by:

* Open-Meteo Weather API
* Open-Meteo Air Quality API

---

# 🚀 Deployment

Deployed on **Vercel**

```bash
bun run build
vercel deploy
```

---

# 👨‍💻 Author

**RKEX**

GitHub
https://github.com/RKEX

---

# ⭐ Support

If you like this project:

⭐ Star the repository
🚀 Share with developers
