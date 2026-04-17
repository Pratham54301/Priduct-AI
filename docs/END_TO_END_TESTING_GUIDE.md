# 🧪 End-to-End Testing Guide - AI Model Integration

## 📋 Overview

This guide will walk you through setting up the OpenAI API key and running complete end-to-end tests for the AI prediction system.

**Estimated Time:** 30-45 minutes  
**Prerequisites:** Backend and frontend code is ready, MongoDB is connected

---

## ✅ STEP 1: SET UP OPENAI API KEY

### **1.1 Get OpenAI API Key**

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Give it a name (e.g., "Product.AI - Production")
5. Copy the key immediately (you won't see it again)
6. **Important:** Save it securely

### **1.2 Add API Key to Backend**

1. Open `backend/.env` file
2. Add or update:
   ```env
   OPENAI_API_KEY=sk-your-actual-api-key-here
   OPENAI_MODEL=gpt-4o
   ```
3. Save the file
4. **Verify:** Check that `.env` is in `.gitignore` (never commit API keys!)

### **1.3 Verify Environment Variables**

**Test in Backend:**
```bash
cd backend
node -e "require('dotenv').config(); console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET ✓' : 'NOT SET ✗');"
```

**Expected Output:**
```
OPENAI_API_KEY: SET ✓
```

---

## ✅ STEP 2: START SERVERS

### **2.1 Start Backend Server**

```bash
cd backend
npm run dev
```

**Verify Backend Started:**
- [ ] See: `MongoDB connected`
- [ ] See: `Server running on port 5000`
- [ ] No errors in console

**If Errors:**
- Check `MONGO_URI` is set correctly
- Check `JWT_SECRET` is set
- Check all dependencies installed: `npm install`

### **2.2 Start Frontend Server**

```bash
# In a new terminal
npm run dev
```

**Verify Frontend Started:**
- [ ] See: `Ready on http://localhost:3000`
- [ ] No errors in console

**If Errors:**
- Check `NEXT_PUBLIC_BACKEND_URL` is set
- Check all dependencies installed: `npm install`

---

## ✅ STEP 3: LOGIN AND GET JWT TOKEN

### **3.1 Login to Dashboard**

1. Open browser: http://localhost:3000
2. Navigate to login page
3. Login with your credentials
4. **Verify:** You're redirected to dashboard

### **3.2 Verify Token Storage**

**In Browser Console (F12):**
```javascript
localStorage.getItem('token')
```

**Expected Output:**
```
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." (long JWT token string)
```

**If Token Missing:**
- [ ] Check login was successful
- [ ] Check backend auth route is working
- [ ] Check browser console for errors

---

## ✅ STEP 4: TEST PREDICTION GENERATION

### **4.1 Search for Stock**

1. In dashboard, use stock search
2. Search for: **"RELIANCE"**
3. Select from dropdown
4. **Verify:** Stock appears selected

### **4.2 Select Exchange**

1. Use Exchange Selector dropdown
2. Select: **"NSE"**
3. **Verify:** Exchange shows "NSE"

### **4.3 Generate Prediction**

1. Click **"Get AI Prediction"** button
2. **Verify:** Button shows loading state (spinner/disabled)
3. **Wait:** 10-30 seconds for prediction

**What Happens Behind the Scenes:**
- Frontend sends request to `/api/predict`
- Next.js API proxies to backend
- Backend validates token
- Backend fetches market data from Alpha Vantage
- Backend calculates technical indicators
- Backend calls OpenAI API
- Backend saves prediction to MongoDB
- Response sent back to frontend

### **4.4 Verify Prediction Display**

**Check PredictionCard Shows:**
- [ ] Symbol: "RELIANCE"
- [ ] Exchange: "NSE"
- [ ] Current Price: ₹X,XXX.XX (formatted as INR)
- [ ] Entry Point: Valid number
- [ ] Sell Point: Valid number
- [ ] Target 1: Valid number
- [ ] Target 2: Valid number
- [ ] Stop Loss: Valid number (should be less than entry)
- [ ] Confidence: 0-100%
- [ ] Prediction Accuracy: 70-95%
- [ ] Indicators Used: Array (e.g., "RSI, MACD, EMA")
- [ ] Rationale: 2-3 sentences explaining prediction
- [ ] Last Updated: Valid timestamp
- [ ] Status Badge: "OK" (green)

**If Prediction Doesn't Appear:**
- Check browser console for errors
- Check backend console for errors
- Verify OpenAI API key is correct
- Check network tab for API responses

---

## ✅ STEP 5: VERIFY BACKEND LOGS

### **5.1 Check Backend Console**

**Expected Logs:**
```
[Predict] Fetching market data for RELIANCE on NSE...
[Predict] Generating AI prediction using OpenAI (gpt-4o)...
[Predict] Prediction generated successfully for RELIANCE on NSE
```

**If Errors Appear:**
- Note the error message
- Check error handling section below

### **5.2 Check for API Calls**

**Verify:**
- [ ] Alpha Vantage API called (check network tab or logs)
- [ ] OpenAI API called (check logs)
- [ ] No rate limit errors
- [ ] No timeout errors

---

## ✅ STEP 6: VERIFY DATABASE

### **6.1 Check MongoDB**

**Using MongoDB Compass or CLI:**
```javascript
// Connect to MongoDB
use your_database_name

// Find predictions
db.predictions.find().sort({createdAt: -1}).limit(1).pretty()
```

**Verify:**
- [ ] Prediction document exists
- [ ] `symbol`: "RELIANCE"
- [ ] `exchange`: "NSE"
- [ ] `customer`: Matches your user ID
- [ ] All fields present (current_price, entry_point, etc.)
- [ ] `createdAt`: Recent timestamp

**If Prediction Not Saved:**
- Check MongoDB connection
- Check backend logs for save errors
- Verify `MONGO_URI` is correct

---

## ✅ STEP 7: TEST ERROR HANDLING

### **7.1 Test Invalid Symbol**

1. Search for invalid symbol: "INVALID123"
2. Select exchange: "NSE"
3. Click "Get AI Prediction"
4. **Expected:** Error message displayed
5. **Verify:** Error toast appears

### **7.2 Test Invalid Exchange**

1. Search for: "RELIANCE"
2. Try to set exchange to "NYSE" (if possible)
3. Click "Get AI Prediction"
4. **Expected:** Error: "Invalid exchange: Only NSE and BSE supported"
5. **Verify:** Error message is clear

### **7.3 Test Without Token**

1. Clear token: `localStorage.removeItem('token')`
2. Try to get prediction
3. **Expected:** Error: "Please log in to get predictions"
4. **Verify:** User-friendly error message

### **7.4 Test Missing Stock Selection**

1. Don't select any stock
2. Click "Get AI Prediction"
3. **Expected:** Error: "Please select a stock first"
4. **Verify:** Validation works

---

## ✅ STEP 8: TEST RE-RUN PREDICTION

### **8.1 Re-run Existing Prediction**

1. With prediction displayed, click **"Re-run Prediction"** button
2. **Verify:** Loading state appears
3. **Verify:** New prediction generated
4. **Verify:** Values may differ (AI generates new prediction)

---

## ✅ STEP 9: TEST WITH DIFFERENT SYMBOLS

### **9.1 Test Multiple Stocks**

Test with:
- [ ] **RELIANCE** (NSE) - Large cap
- [ ] **TCS** (NSE) - IT sector
- [ ] **HDFCBANK** (NSE) - Banking
- [ ] **INFY** (NSE) - IT sector
- [ ] **SBIN** (NSE) - Banking

**For Each:**
- [ ] Prediction generates successfully
- [ ] All fields display correctly
- [ ] Values are realistic
- [ ] No errors in console

### **9.2 Test BSE Exchange**

1. Search for: "RELIANCE"
2. Select exchange: **"BSE"**
3. Click "Get AI Prediction"
4. **Note:** Some symbols may not be available on BSE
5. **If Error:** Try NSE instead (many stocks are primarily on NSE)

---

## ✅ STEP 10: PERFORMANCE TESTING

### **10.1 Measure Response Time**

**Test:**
1. Click "Get AI Prediction"
2. Start timer
3. Wait for prediction to appear
4. Stop timer

**Expected:**
- [ ] Response time: 10-30 seconds (depends on OpenAI)
- [ ] No timeout errors
- [ ] Loading state shows during wait

### **10.2 Test Multiple Requests**

1. Generate 3-5 predictions in sequence
2. **Verify:**
   - [ ] Each prediction generates successfully
   - [ ] No rate limit errors
   - [ ] Backend handles requests properly

**Note:** Alpha Vantage free tier: 25 requests/day, 5 requests/minute

---

## 🚨 TROUBLESHOOTING

### **Issue: "OPENAI_API_KEY is not set"**

**Symptoms:**
- Error in backend console
- Prediction fails immediately

**Solution:**
1. Check `backend/.env` has `OPENAI_API_KEY=sk-...`
2. Restart backend server
3. Verify with: `console.log(process.env.OPENAI_API_KEY)` in backend

### **Issue: "Failed to fetch market data"**

**Symptoms:**
- Error: "Failed to fetch market data: ..."
- Alpha Vantage API error

**Solution:**
1. Check Alpha Vantage API key: `4FVYC4DLNN34O6ME`
2. Check rate limits (25 requests/day free tier)
3. Try different symbol
4. Try NSE if BSE fails
5. Check network connectivity

### **Issue: "No token, authorization denied"**

**Symptoms:**
- 401 error
- "Please log in" message

**Solution:**
1. Verify user is logged in
2. Check token exists: `localStorage.getItem('token')`
3. Verify token is sent in Authorization header
4. Check `JWT_SECRET` matches between frontend/backend

### **Issue: Prediction takes too long (>60 seconds)**

**Symptoms:**
- Loading state persists
- No response

**Solution:**
1. Check OpenAI API is responding
2. Check network tab for pending requests
3. Check backend logs for errors
4. Verify OpenAI API key has credits/quota
5. Check for timeout errors

### **Issue: Prediction displays but values are wrong**

**Symptoms:**
- Prediction appears but fields are incorrect
- Missing fields

**Solution:**
1. Check OpenAI response in backend logs
2. Verify response validation logic
3. Check PredictionCard component receives all fields
4. Verify TypeScript types match

### **Issue: MongoDB save fails**

**Symptoms:**
- Prediction generated but not saved
- Database errors in logs

**Solution:**
1. Check `MONGO_URI` is correct
2. Verify MongoDB connection
3. Check MongoDB Atlas IP whitelist
4. Verify database permissions

---

## 📊 TEST RESULTS CHECKLIST

### **Core Functionality**
- [ ] Login works
- [ ] Token stored correctly
- [ ] Stock search works
- [ ] Exchange selection works
- [ ] Prediction generation works
- [ ] Prediction displays correctly
- [ ] All fields show valid values
- [ ] Prediction saved to MongoDB
- [ ] Customer ID associated

### **Error Handling**
- [ ] Invalid symbol → Error message
- [ ] Invalid exchange → Error message
- [ ] Missing token → Error message
- [ ] Missing stock → Error message
- [ ] Network errors → User-friendly message

### **Performance**
- [ ] Response time acceptable (10-30 seconds)
- [ ] No timeout errors
- [ ] Loading states work correctly
- [ ] Multiple requests handled properly

### **Data Validation**
- [ ] Current price is positive number
- [ ] Entry point is positive number
- [ ] Stop loss is less than entry point
- [ ] Targets are greater than entry point
- [ ] Confidence is 0-100
- [ ] Prediction accuracy is 70-95
- [ ] Indicators used is array
- [ ] Rationale is non-empty string

---

## ✅ SUCCESS CRITERIA

**Integration is successful if:**
- ✅ Prediction generates successfully
- ✅ All fields display correctly
- ✅ No console errors
- ✅ Prediction saved to MongoDB
- ✅ Error handling works
- ✅ Performance is acceptable

---

## 📝 NEXT STEPS AFTER TESTING

1. **If All Tests Pass:**
   - ✅ Integration is complete
   - ✅ Ready for production (after deployment setup)
   - ✅ Consider adding monitoring/analytics

2. **If Issues Found:**
   - Note all issues
   - Check troubleshooting section
   - Fix issues one by one
   - Re-test after fixes

3. **Optimization:**
   - Add rate limiting if needed
   - Implement caching for market data
   - Add request timeout handling
   - Improve error messages

---

**Good luck with testing! 🚀**

If you encounter any issues not covered here, check the main checklist: `docs/AI_MODEL_INTEGRATION_CHECKLIST.md`

