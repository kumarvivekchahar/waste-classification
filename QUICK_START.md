# Quick Start Guide - Waste Classification System

## 🚀 Start the Application (3 Easy Steps)

### Step 1: Open Terminal 1 - Backend API
```powershell
cd e:\waste_dataset\backend
python app.py
```
✅ Wait for: "Running on http://127.0.0.1:10001"

### Step 2: Open Terminal 2 - Frontend Server  
```powershell
cd e:\waste_dataset\frontend
python -m http.server 3000
```
✅ Wait for: "Serving HTTP on :: port 3000"

### Step 3: Open Browser
```
http://127.0.0.1:3000
```
✅ You should see the Glacier Farm dashboard

---

## 📊 Dashboard Features

| Feature | Status | Location |
|---------|--------|----------|
| Analytics (Scans, Confidence, Bins) | ✅ Working | Dashboard Tab |
| Waste Distribution Chart | ✅ Working | Dashboard Tab |
| Recent Scans List | ✅ Working | Dashboard Tab |
| Image Upload & Classification | ✅ Working | Scan Tab |
| Hyderabad Bin Map | ✅ Working | Map Tab |
| Route Optimization | ✅ Working | Map Tab (81 km) |
| IoT Simulation | ✅ Working | Settings Tab |

---

## 🗺️ Hyderabad Locations (20 Smart Bins)

**North Hyderabad:**
- Gachibowli, Hitech City, Madhapur, Kondapur, Kukatpally

**Central Hyderabad:**
- Banjara Hills, Jubilee Hills, Begumpet, Somajiguda, Ameerpet

**South/East Hyderabad:**
- Dilsukhnagar, Tarnaka, Uppal, Malkajgiri, Mehdipatnam

**Old City:**
- Abids, Nampally, Charminar, Himayatnagar

**Depot:** GHMC HQ, Tarnaka

---

## 🔧 API Endpoints

```bash
# Get all bins
curl http://127.0.0.1:10001/api/bins

# Get analytics dashboard data
curl http://127.0.0.1:10001/dashboard-data

# Get optimized route
curl http://127.0.0.1:10001/api/route

# Simulate IoT tick
curl -X POST http://127.0.0.1:10001/api/simulate

# Upload image for classification
curl -X POST http://127.0.0.1:10001/predict \
  -F "file=@image.jpg" \
  -F "location=Gachibowli"
```

---

## 📁 Project Structure

```
e:\waste_dataset\
├── frontend/                    # Web UI (Glacier Design)
│   ├── index.html              # Main SPA page
│   ├── js/app.js               # Frontend logic
│   └── netlify.toml            # Deployment config
│
├── backend/                     # Flask API
│   ├── app.py                  # Main Flask app
│   ├── bin_simulator.py        # Smart bin logic
│   ├── route_optimizer.py      # Route optimization
│   ├── utils/
│   │   └── waste_classifier.py # TensorFlow model
│   ├── data/
│   │   └── bins.json           # Hyderabad bins data
│   ├── uploads/                # Classified images
│   └── waste_classifier.keras  # AI model file
│
├── data.csv                    # Prediction logs
├── SETUP_COMPLETE.md           # This guide
└── QUICK_START.md              # Quick reference
```

---

## 🔍 Testing Endpoints

### Test 1: Check Backend Health
```powershell
python -c "import requests; print(requests.get('http://127.0.0.1:10001/').json())"
```
Expected: `{"status": "Circular Waste Intelligence API is alive and running!"}`

### Test 2: Get Hyderabad Bins
```powershell
python -c "import requests, json; r = requests.get('http://127.0.0.1:10001/api/bins'); print(f'Found {len(r.json()[\"bins\"])} bins'); print([b['area'] for b in r.json()['bins'][:5]])"
```
Expected: `['Gachibowli', 'Hitech City', 'Banjara Hills', 'Jubilee Hills', 'Kukatpally']`

### Test 3: Get Route Optimization
```powershell
python -c "import requests, json; r = requests.get('http://127.0.0.1:10001/api/route'); print(f\"Distance: {r.json()['distance_km']} km\")"
```
Expected: `Distance: ~81 km`

---

## 🎨 UI Navigation

| Tab | Purpose | Key Features |
|-----|---------|--------------|
| 📊 Dashboard | Overview | KPIs, Charts, Recent Scans |
| ☁️ Scan | Upload images | Classification Results |
| 🗺️ Map | Bin locations | Route Optimization, Fleet Control |
| ⚙️ Settings | Configuration | IoT Simulation, Reset Bins |

---

## 💾 Data Storage

- **bins.json**: 20 smart bins with Hyderabad coordinates
- **data.csv**: Prediction history with timestamps
- **waste_classifier.keras**: TensorFlow trained model
- **uploads/**: Classified image files

---

## ✅ Verification Checklist

- [x] Frontend running on port 3000
- [x] Backend running on port 10001
- [x] API endpoints responding correctly
- [x] TensorFlow model loaded
- [x] Hyderabad locations in bins.json
- [x] Map showing 20 bins
- [x] Route optimization working (81 km)
- [x] Dashboard analytics displayed
- [x] Waste classification ready
- [x] Real-time syncing working

---

## 🛑 Stopping the Application

**Terminal 1 (Backend):**
```
Press Ctrl+C
```

**Terminal 2 (Frontend):**
```
Press Ctrl+C
```

---

## 📝 Log Files

- **Backend logs**: Terminal output from `python app.py`
- **Frontend logs**: Browser console (F12 → Console tab)
- **Prediction logs**: `e:\waste_dataset\data.csv`
- **Bin data**: `e:\waste_dataset\backend\data\bins.json`

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 10001 already in use | Kill process or use different port |
| TensorFlow model not found | Check if waste_classifier.keras exists in backend/ |
| Frontend shows "Cannot connect" | Ensure backend is running on 10001 |
| Map not showing bins | Clear browser cache, reload page |
| No predictions logging | Check data.csv is writable |

---

## 🎯 Next Steps

1. **Upload an image** via Scan tab to test classification
2. **Simulate IoT ticks** in Settings to watch bins fill up
3. **Optimize route** to see different paths
4. **Collect bins** to reset their fill levels

---

**System Status**: ✅ PRODUCTION READY
**Location**: Hyderabad, India 🇮🇳
**Last Updated**: 2026-05-24
