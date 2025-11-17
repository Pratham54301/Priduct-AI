
## 🔮 PredictAI – AI-Powered Market Forecasting Platform

**PredictAI** is an advanced, full-stack web platform that leverages artificial intelligence and real-time data to provide precise predictions for a wide range of financial assets including **stocks, cryptocurrencies, commodities, and currencies**. Designed to support both new and experienced investors, PredictAI simplifies decision-making with clean visuals, smart tools, and fast data.

---

### 🚀 Features

* **Live Market Dashboard**
  View real-time data for thousands of global assets including Indian and US stocks, forex pairs, crypto coins, and commodities — all in one unified dashboard with filtering, search, and sliding animations.

* **AI-Powered Predictions**
  Our intelligent algorithms analyze technical indicators, historical trends, and global data to forecast market movements with high accuracy.

* **Asset Categories**

  * ✅ Stocks: 600+ Indian stocks and 200+ US stocks
  * ✅ Cryptocurrencies: Top 100+ tokens with real-time updates
  * ✅ Commodities: Gold, Oil, Silver, and more
  * ✅ Currencies: All major global pairs

* **Search & Filter System**
  Instantly search assets by name, symbol, or category with toggle filters for “Top Gainers”, “Top Losers”, “Trending”, and “By Market Type”.

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
* **APIs**: MarketStack, CoinGecko, Alpha Vantage (for live data)
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
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o
MARKET_API_KEY=your_market_data_api_key # e.g., from Twelve Data, Alpha Vantage
MARKET_PROVIDER=twelve-data # or alpha-vantage, yahoo-finance

# Optional: Email configuration for nodemailer (if used)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

Create a `.env.local` file in the root directory with the following variable:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000 # Or your backend's staging/production URL
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

* Retail investors looking for AI-driven prediction tools
* Financial bloggers and educators
* Trading platforms & fintech partners
* Crypto and commodity analysts

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

