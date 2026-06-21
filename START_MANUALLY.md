# JanLunMS - MANUAL STARTUP REQUIRED

## Problem
The automated npm/pnpm installs keep timing out in this environment.
You need to run the installation commands manually in your local terminal.

## Step 1: Open 4 PowerShell Windows

### Window 1 - Install & Start API:
```powershell
cd D:\Projects\janlums\apps\api
npm install
npm run dev
```

### Window 2 - Install & Start Pressing Web:
```powershell
cd D:\Projects\janlums\apps\pressing-web
npm install
npm run dev
```

### Window 3 - Install & Start Customer Web:
```powershell
cd D:\Projects\janlums\apps\customer-web
npm install
npm run dev
```

### Window 4 - Install & Start Admin Web:
```powershell
cd D:\Projects\janlums\apps\admin-web
npm install
npm run dev
```

## Step 2: Wait for installations
Each `npm install` may take 2-5 minutes. Wait for it to complete before running `npm run dev`.

## Step 3: Access the apps
- API: http://localhost:3015/api/docs
- Pressing Web: http://localhost:3025
- Customer Web: http://localhost:3035
- Admin Web: http://localhost:3085

## Alternative: One-Line PowerShell
Copy and paste this entire block into PowerShell:

```powershell
# Start API
Start-Process powershell -ArgumentList "-NoExit","-Command","cd D:\Projects\janlums\apps\api; npm install; npm run dev"

# Start Pressing Web  
Start-Process powershell -ArgumentList "-NoExit","-Command","cd D:\Projects\janlums\apps\pressing-web; npm install; npm run dev"

# Start Customer Web
Start-Process powershell -ArgumentList "-NoExit","-Command","cd D:\Projects\janlums\apps\customer-web; npm install; npm run dev"

# Start Admin Web
Start-Process powershell -ArgumentList "-NoExit","-Command","cd D:\Projects\janlums\apps\admin-web; npm install; npm run dev"
```

This will open 4 separate windows that run independently.
