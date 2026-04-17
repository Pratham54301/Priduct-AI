# 🔄 Backend Server Restart Instructions

## ⚠️ IMPORTANT: Restart Required

After making changes to environment variables or the `predictController.js` file, **you must restart the backend server** for the changes to take effect.

## 📋 Steps to Restart Backend Server

### **Option 1: If Server is Running in Terminal**

1. **Stop the server:**
   - Press `Ctrl + C` in the terminal where the server is running
   - Wait for the server to stop completely

2. **Restart the server:**
   ```bash
   cd backend
   npm start
   # or
   node server.js
   ```

3. **Verify startup logs:**
   - Look for: `[predictController] Market API Key Loaded: true`
   - Look for: `[predictController] Market API Key (first 7 chars): 4FVYC4D...`
   - Look for: `Server running on port 5000`

### **Option 2: If Server is Running as Background Process**

1. **Find the process:**
   ```bash
   # Windows PowerShell
   Get-Process node | Where-Object {$_.Path -like "*backend*"}
   
   # Or check port 5000
   netstat -ano | findstr :5000
   ```

2. **Kill the process:**
   ```bash
   # Replace <PID> with the process ID from above
   taskkill /PID <PID> /F
   ```

3. **Restart:**
   ```bash
   cd backend
   npm start
   ```

## ✅ Verification Checklist

After restarting, check the backend console for:

- ✅ `[predictController] Market API Key Loaded: true`
- ✅ `[predictController] Market API Key (first 7 chars): 4FVYC4D...`
- ✅ `[predictController] PRICE_API_KEY from env: true`
- ✅ `Server running on port 5000`
- ✅ `MongoDB connected`

## 🧪 Test After Restart

1. **Open frontend** (http://localhost:3000)
2. **Select a stock** (e.g., RELIANCE)
3. **Click "Get Prediction"**
4. **Expected:** Prediction should generate without "API key not configured" error

## 🔍 Troubleshooting

### **If API key still shows as NOT SET:**

1. **Verify .env file location:**
   - Should be in `backend/.env` (not root directory)
   - Run: `Get-Content backend\.env | Select-String "PRICE_API_KEY"`

2. **Verify .env file format:**
   ```env
   PRICE_API_KEY=4FVYC4DLNN34O6ME
   ```
   - No quotes
   - No spaces around `=`
   - No trailing spaces

3. **Test environment loading:**
   ```bash
   cd backend
   node verify-env.js
   ```

4. **Check for typos:**
   - Variable name must be exactly `PRICE_API_KEY` or `MARKET_API_KEY`
   - Case-sensitive

## 📝 Quick Reference

```bash
# Stop server: Ctrl + C
# Restart server:
cd backend
npm start

# Verify environment:
node verify-env.js
```

