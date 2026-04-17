
## 🔮 PredictAI – AI-Powered Market Forecasting Platform

**PredictAI** is an advanced, full-stack web platform that leverages artificial intelligence and real-time data to provide precise predictions for **Indian stock markets (NSE + BSE)**. Designed to support both new and experienced Indian investors, PredictAI simplifies decision-making with clean visuals, smart tools, and fast data.

---

### 🚀 Features

* **Live Market Dashboard**
  View real-time data for Indian stocks listed on NSE and BSE — all in one unified dashboard with filtering, search, and sliding animations.

* **AI-Powered Predictions**
  Our intelligent algorithms analyze technical indicators, historical trends, and Indian market data to forecast stock movements with high accuracy.

* **Indian Stock Market Support**

  * ✅ NSE (National Stock Exchange): 600+ stocks
  * ✅ BSE (Bombay Stock Exchange): 500+ stocks
  * ✅ Indian Market Indices: Nifty 50, Sensex, Bank Nifty, Nifty IT, Nifty Fin Service
  * ✅ Popular Stocks: Reliance, TCS, HDFC Bank, Infosys, SBI, ICICI Bank, Tata Motors, NTPC, ONGC, and more

* **Search & Filter System**
  Instantly search Indian stocks by name, symbol, or exchange (NSE/BSE) with toggle filters for "Top Gainers", "Top Losers", and "By Exchange".

* **Responsive UI/UX**
  Fully mobile-optimized and desktop-friendly interface with animated sections, modern navbar, and alternating background themes.

* **Dynamic Sections**

  * Hero Section with call-to-action
  * Live Market section
  * Smart Investor Testimonials with carousel
  * FAQ section with expandable items and “Load More” feature
  * Contact & Footer with all essential company links and policies

* **Authentication & User Tools**
  Secure login, free prediction access counter, “Join Our Network” section, and email-based user onboarding with location support.

---

### 🛠️ Tech Stack

* **Frontend**: Next.js 15, React, Tailwind CSS, Framer Motion
* **Backend**: Firebase App Hosting, Firebase Functions
* **APIs**: Yahoo Finance chart API (for Indian stock market data)
* **Analytics**: Google Analytics / Firebase Analytics
* **Deployment**: Firebase Hosting + GitHub Actions (CI/CD)

---

### 🤖 How to Run AI Predictions

To run the AI prediction module, you'll need to set up environment variables for both the backend and frontend, and then start the respective development servers.

#### 1. Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
JWT_SECRET=your_jwt_secret_key_here
MONGO_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash

# Optional: Email configuration for nodemailer (if used)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

Create a `.env.local` file in the root directory with the following variable:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000 # Or your backend's staging/production URL
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_connection_string
```

#### 2. Install Dependencies

In the `backend` directory, run:
```bash
npm install
```

In the root directory, run:
```bash
npm install
```

#### 3. Run Development Servers

In the `backend` directory, start the server:
```bash
npm run dev
```

In the root directory, start the Next.js development server:
```bash
npm run dev
```

---

### 📌 Use Cases

* Indian retail investors looking for AI-driven stock prediction tools
* Financial bloggers and educators focused on Indian markets
* Trading platforms & fintech partners serving Indian market
* Stock market analysts and traders

---

### 🧪 Roadmap

* [ ] Add personalized portfolio tracking
* [ ] Telegram/email alerts for price movements
* [ ] Multi-language support
* [ ] Admin dashboard for internal prediction controls
* [ ] Full accessibility (WCAG) compliance

---

### 🧠 Learn More

This project is inspired by platforms like **Motilal Oswal**, **ICICI Direct**, and **Angel One**, but enhanced with AI-first features and a clean developer-focused architecture.

---

### 📬 Contact & Support

* Email: prathams54301@gmail.com
* Phone:7777967668

