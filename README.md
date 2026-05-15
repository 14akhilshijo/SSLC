# 🎓 Kerala SSLC Result Portal 2026

> Production-ready, scalable result portal for Kerala SSLC Examination 2026  
> **Live:** https://sslc.akhilshijoinnov.site

---

## 🏗️ Architecture

```
kerala-sslc-portal/
├── frontend/          # Next.js 14 + Tailwind CSS + Framer Motion
│   ├── app/           # App Router pages
│   ├── components/    # UI components
│   └── lib/           # API client, types, utils
├── backend/           # Node.js + Express API
│   └── src/
│       ├── config/    # DB + Redis config
│       ├── models/    # MongoDB schemas
│       ├── routes/    # API routes
│       ├── services/  # Business logic + PDF + API health
│       ├── middleware/ # Auth, error handling
│       └── utils/     # Logger
└── README.md
```

---

## ✨ Features

### Frontend
- 🎨 **Glassmorphism UI** — Blue/white Kerala government theme
- 🌙 **Dark mode** — System preference + manual toggle
- ⚡ **Framer Motion** — Smooth animations throughout
- 🎊 **Confetti** — Celebrates PASS results
- 📊 **Live statistics** — District-wise pass percentages
- 🔢 **Live traffic counter** — Real-time search count
- 📱 **Fully responsive** — Mobile-first design
- 🖨️ **Print-ready** — Clean print stylesheet
- 📄 **PDF download** — Server-generated mark sheet
- 📲 **WhatsApp share** — One-click result sharing
- 🔲 **QR code** — Verification QR on result card
- 🏫 **School results** — Paginated school-wise view

### Backend
- 🔄 **API failover** — Primary + 2 mirror APIs with auto-switching
- ⚡ **Redis caching** — 24h result cache, memory fallback
- 🛡️ **Rate limiting** — 100 req/15min global, 20/min for results
- 🔒 **Security** — Helmet, CORS, mongo-sanitize, HPP
- 📝 **Analytics** — Search tracking, district stats
- 🔑 **Admin panel** — JWT-protected dashboard
- 📊 **Health monitoring** — API endpoint health checks every 2min
- 📄 **PDF generation** — PDFKit mark sheets with QR codes
- 🗄️ **MongoDB** — Results, schools, analytics, API logs

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis (optional — falls back to memory cache)

### 1. Clone & Install

```bash
git clone https://github.com/your-repo/kerala-sslc-portal
cd kerala-sslc-portal

# Install all dependencies
npm install
npm install --workspace=frontend
npm install --workspace=backend
```

### 2. Configure Environment

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Frontend
cp frontend/.env.local.example frontend/.env.local
# Edit NEXT_PUBLIC_API_URL
```

### 3. Run Development

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/api/health

---

## 🌐 Deployment

### Frontend → Vercel

```bash
cd frontend
npx vercel --prod

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_API_URL = https://your-backend.railway.app
# NEXT_PUBLIC_SITE_URL = https://sslc.akhilshijoinnov.site
```

### Backend → Railway

```bash
cd backend
# Push to GitHub, then connect repo in Railway dashboard
# Set all env vars from .env.example in Railway Variables tab
```

### Backend → Render

```bash
# render.yaml is pre-configured
# Connect GitHub repo in Render dashboard
# Set secret env vars manually
```

---

## 🌍 DNS Setup (sslc.akhilshijoinnov.site)

In your DNS provider (Cloudflare recommended):

| Type  | Name | Value                          | Proxy |
|-------|------|--------------------------------|-------|
| CNAME | sslc | cname.vercel-dns.com           | ✅    |
| CNAME | api  | your-backend.railway.app       | ✅    |

Then in Vercel: Add custom domain `sslc.akhilshijoinnov.site`

---

## 📡 API Reference

### Individual Result
```
GET /api/results/individual?regno=1234567&dob=2009-05-15
```

### School Results
```
GET /api/results/school?code=12345&page=1&limit=20
```

### Statistics
```
GET /api/results/statistics
```

### Download PDF
```
GET /api/results/pdf?regno=1234567&dob=2009-05-15
```

### Health Check
```
GET /api/health
```

---

## 🗄️ Database Schema

### Result
```js
{
  registerNumber: String,   // Indexed
  dateOfBirth: String,
  studentName: String,
  schoolCode: String,       // Indexed
  schoolName: String,
  district: String,
  subjects: [{
    code, name, theory, practical, total, grade, isAPlus
  }],
  totalMarks, maxMarks, percentage,
  result: 'PASS' | 'FAIL' | 'WITHHELD' | 'ABSENT',
  grade, aPlusCount, year,
  qrCode, fetchedAt, source
}
```

### Analytics (auto-expires 30 days)
```js
{ type, registerNumber, schoolCode, ip, success, responseTime, apiSource, timestamp }
```

---

## 🔒 Security Features

- **Helmet.js** — HTTP security headers
- **CORS** — Whitelist-only origins
- **Rate limiting** — Per-IP request throttling
- **Input validation** — express-validator on all inputs
- **Mongo sanitize** — NoSQL injection prevention
- **HPP** — HTTP parameter pollution prevention
- **JWT** — Admin route protection
- **Environment variables** — All secrets in .env

---

## 📊 Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Score | > 95 |
| First Contentful Paint | < 1.5s |
| API Response (cached) | < 50ms |
| API Response (fresh) | < 2s |
| Concurrent Users | 50,000+ |

---

## 🎨 Grading Scale

| Grade | Percentage |
|-------|-----------|
| A+    | 90 – 100  |
| A     | 80 – 89   |
| B+    | 70 – 79   |
| B     | 60 – 69   |
| C+    | 50 – 59   |
| C     | 40 – 49   |
| D     | 30 – 39   |
| E     | 0 – 29    |

---

## 📞 Support

- Website: https://sslc.akhilshijoinnov.site
- Kerala Pareeksha Bhavan: https://keralapareekshabhavan.in

---

*Built with ❤️ for Kerala students — Kerala SSLC Result Portal 2026*
