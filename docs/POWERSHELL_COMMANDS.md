# PowerShell Commands Reference

## 🔍 Search/Find Commands

### **Search for text in files (grep equivalent)**

```powershell
# Search in single file
Select-String -Pattern "pattern" -Path "file.js"

# Search recursively in directory
Select-String -Pattern "pattern" -Path "*.js" -Recurse

# Search with context (before/after lines)
Select-String -Pattern "pattern" -Path "file.js" -Context 2,2

# Case-insensitive search
Select-String -Pattern "pattern" -Path "file.js" -CaseSensitive:$false
```

### **Examples:**

```powershell
# Find OpenAI references
Select-String -Pattern "OPENAI" -Path "*.js" -Recurse

# Find console.log statements
Select-String -Pattern "console\.log" -Path "backend/**/*.js" -Recurse

# Find environment variables
Select-String -Pattern "process\.env\." -Path "backend/**/*.js" -Recurse
```

---

## 📁 File Operations

### **List files**

```powershell
# List all files
Get-ChildItem

# List with details
Get-ChildItem -Force

# List recursively
Get-ChildItem -Recurse

# List only .js files
Get-ChildItem -Filter "*.js" -Recurse
```

### **Find files by name**

```powershell
# Find file by name
Get-ChildItem -Recurse -Filter "predictController.js"

# Find files matching pattern
Get-ChildItem -Recurse -Filter "*controller*.js"
```

---

## 🔧 Environment Variables

### **Check environment variable**

```powershell
# Check in Node.js
node -e "require('dotenv').config(); console.log(process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET');"

# Check in PowerShell
$env:OPENAI_API_KEY

# List all environment variables
Get-ChildItem Env:
```

---

## 🚀 Node.js Commands

### **Run Node.js scripts**

```powershell
# Run script
node script.js

# Run with environment variables
$env:OPENAI_API_KEY="sk-..."; node script.js

# Run inline code
node -e "console.log('Hello')"
```

### **Check Node.js version**

```powershell
node --version
npm --version
```

---

## 📦 NPM Commands

### **Package management**

```powershell
# Install dependencies
npm install

# Install specific package
npm install package-name

# List installed packages
npm list

# Check for outdated packages
npm outdated

# Run scripts
npm run dev
npm run build
```

---

## 🔍 Useful PowerShell Aliases

PowerShell has some built-in aliases that work like Unix commands:

```powershell
# ls = Get-ChildItem
ls

# cat = Get-Content
cat file.js

# pwd = Get-Location
pwd

# cd = Set-Location
cd backend
```

---

## 💡 Tips

1. **Use `-Recurse` for recursive searches**
2. **Use `-Filter` for file patterns**
3. **Use `Select-String` instead of `grep`**
4. **Use `Get-Content` instead of `cat`**
5. **Use `Get-ChildItem` instead of `ls -R`**

---

## 🎯 Common Tasks

### **Search for API keys in code**

```powershell
Select-String -Pattern "API_KEY|api_key" -Path "**/*.js" -Recurse
```

### **Find all console.log statements**

```powershell
Select-String -Pattern "console\.(log|error|warn)" -Path "**/*.js" -Recurse
```

### **Find environment variable usage**

```powershell
Select-String -Pattern "process\.env\." -Path "**/*.js" -Recurse
```

### **List all .env files**

```powershell
Get-ChildItem -Recurse -Filter ".env*"
```

