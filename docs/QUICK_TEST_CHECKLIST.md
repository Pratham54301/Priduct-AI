# ⚡ Quick Test Checklist - AI Prediction

Use this quick checklist during testing. Check off each item as you verify it.

## 🔑 Setup (5 minutes)

- [ ] OpenAI API key added to `backend/.env`
- [ ] Backend server started (`cd backend && npm run dev`)
- [ ] Frontend server started (`npm run dev`)
- [ ] User logged in to dashboard
- [ ] Token exists in `localStorage.getItem('token')`

## 🧪 Basic Test (5 minutes)

- [ ] Search for stock: "RELIANCE"
- [ ] Select exchange: "NSE"
- [ ] Click "Get AI Prediction"
- [ ] Loading state appears
- [ ] Prediction appears (wait 10-30 seconds)
- [ ] All fields display correctly

## ✅ Field Verification (2 minutes)

- [ ] Symbol: "RELIANCE"
- [ ] Exchange: "NSE"
- [ ] Current Price: ₹X,XXX.XX
- [ ] Entry Point: Valid number
- [ ] Stop Loss: Valid number
- [ ] Target 1: Valid number
- [ ] Target 2: Valid number
- [ ] Confidence: 0-100%
- [ ] Indicators Used: Array
- [ ] Rationale: Non-empty string
- [ ] Last Updated: Valid timestamp

## 🗄️ Database Check (1 minute)

- [ ] Prediction saved to MongoDB
- [ ] Customer ID associated
- [ ] All fields present in database

## ⚠️ Error Handling (3 minutes)

- [ ] Invalid symbol → Error message
- [ ] Invalid exchange → Error message
- [ ] Missing token → Error message
- [ ] Missing stock → Error message

## 🔄 Re-run Test (1 minute)

- [ ] Click "Re-run Prediction"
- [ ] New prediction generated
- [ ] Values updated

## 📊 Performance (1 minute)

- [ ] Response time: 10-30 seconds
- [ ] No timeout errors
- [ ] Loading states work

---

**Total Time:** ~18 minutes

**Status:** 
- ✅ All Pass = Integration Successful
- ⚠️ Some Fail = Check troubleshooting guide

