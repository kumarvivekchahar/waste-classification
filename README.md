# 🌿 Circular Waste Intelligence System

AI-powered waste classification, smart bins monitoring, and route optimization — all in one Flask application.

---

## 📁 Project Structure

```
waste_dataset/
│
├── app.py                    # Flask application (all routes)
├── waste_classifier.keras    # Trained EfficientNet model
├── data.csv                  # Prediction log (auto-created)
├── bin_simulator.py          # IoT smart bin simulation (20 Hyderabad locations)
├── route_optimizer.py        # Haversine + Nearest Neighbor route planning
│
├── utils/
│   └── waste_classifier.py   # AI inference module
│
├── data/
│   └── bins.json             # Smart bin state (auto-created)
│
├── templates/
│   ├── index.html            # Main page: AI scanner + dashboard + route optimizer
│   └── bins.html             # Smart bins: map + IoT simulation + route view
│
├── static/
│   ├── css/
│   │   └── style.css         # Dark glassmorphism theme
│   ├── js/                   # (future JS modules)
│   ├── images/               # (future image assets)
│   └── uploads/              # Uploaded waste images
│
├── requirements.txt
└── README.md
```

---

## 🚀 How to Run

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

**Requirements:** Flask, TensorFlow, NumPy, Pillow

### 2. Start the Server

```bash
python app.py
```

### 3. Open in Browser

| Page | URL |
|------|-----|
| 🌿 AI Scanner + Dashboard | [http://127.0.0.1:5000](http://127.0.0.1:5000) |
| 📡 Smart Bins + Route Map | [http://127.0.0.1:5000/bins](http://127.0.0.1:5000/bins) |

---

## ✨ Features

### 1. AI Waste Classification
- Upload a waste image → EfficientNet model classifies it as **Dry**, **Wet**, or **Other** waste
- Shows confidence percentage and circular economy action (recycle / compost / special handling)
- All predictions logged to `data.csv` with timestamp and location

### 2. Live Analytics Dashboard
- Total scans, per-category counts and percentages
- Bar chart + doughnut chart (Chart.js)
- Recent predictions table

### 3. Smart Bin Monitoring (20 Hyderabad Locations)
- IoT simulation with fill-level sensors
- Interactive Leaflet.js map with color-coded bin markers
- Priority system: 🔴 HIGH (>70%) · 🟡 MEDIUM (40-70%) · 🟢 LOW (<40%)

### 4. Route Optimization
- Click **"🚛 Optimize Collection Route"** on the main page or bins page
- Selects bins with fill ≥ 70%
- Computes shortest route using Nearest Neighbor + Haversine distance
- Shows total distance, estimated time, and fuel savings vs random routes

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Main page (AI scanner + dashboard) |
| POST | `/predict` | Upload image → AI prediction |
| GET | `/optimize` | Compute optimized collection route (JSON) |
| GET | `/bins` | Smart bins page |
| GET | `/api/bins` | All bin data (JSON) |
| POST | `/api/simulate` | Simulate one IoT tick |
| GET | `/api/route` | Optimized route (JSON) |
| POST | `/api/collect` | Mark bin as collected |
| POST | `/api/reset-bins` | Reset all bins |
| GET | `/dashboard-data` | Analytics data (JSON) |

---

## 🏗️ Tech Stack

- **Backend:** Python / Flask
- **AI Model:** TensorFlow / EfficientNetB0
- **Frontend:** HTML5, CSS3 (glassmorphism dark theme), Vanilla JS
- **Charts:** Chart.js
- **Maps:** Leaflet.js + OpenStreetMap
- **Data:** CSV logging, JSON bin state

---

*Built for a national-level competition 🇮🇳*
