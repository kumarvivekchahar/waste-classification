# Product Requirements Document (PRD)

## Circular Waste Intelligence System — Hyderabad Prototype

| Field             | Details                                                        |
|-------------------|----------------------------------------------------------------|
| **Product Name**  | Circular Waste Intelligence System                             |
| **Version**       | 1.0                                                            |
| **Date**          | April 2026                                                     |
| **Author**        | Project Team                                                   |
| **Target**        | National-Level Smart City Competition (India 🇮🇳)             |
| **Status**        | In Development                                                 |

---

## 1. Executive Summary

The **Circular Waste Intelligence System** is an end-to-end AI-powered urban waste management platform built as a working prototype for Hyderabad. It combines **Computer Vision** for automated waste classification, **IoT simulation** for real-time smart bin monitoring, and **Operations Research** for dynamic garbage truck route optimization — all delivered through a responsive, glassmorphism-themed web dashboard.

The system addresses the critical inefficiencies in India's urban solid waste management — where schedule-based static routes, manual sorting, and lack of real-time visibility lead to overflowing bins, wasted fuel, and poor recycling rates. By demonstrating a data-driven, AI-first approach, this prototype shows how smart city infrastructure can reduce collection costs by **~30-40%**, improve segregation accuracy, and cut carbon emissions from garbage fleet operations.

---

## 2. Problem Statement

### 2.1 Context

India generates over **62 million tonnes** of municipal solid waste annually (CPCB), with Hyderabad alone producing ~11,000 tonnes/day. Current waste collection systems suffer from:

### 2.2 Pain Points

| # | Problem                                  | Impact                                                           |
|---|------------------------------------------|------------------------------------------------------------------|
| 1 | **Static, schedule-based collection**    | Trucks visit bins regardless of fill level — wasting fuel, time, and increasing emissions |
| 2 | **Manual sorting at source**             | Low segregation compliance (<30%) leads to contaminated recyclables sent to landfill |
| 3 | **No real-time visibility**              | Municipal authorities have zero data on which bins are full, overflowing, or underutilized |
| 4 | **Unoptimized truck routes**             | Random/fixed routes result in ~40% more travel distance than necessary |
| 5 | **No feedback loop to citizens**         | Users dumping waste get no guidance on proper segregation or circular economy actions |

### 2.3 Opportunity

A centralized intelligence platform that integrates AI classification, IoT monitoring, and dynamic routing can:
- Reduce collection fleet fuel consumption by **30-40%**
- Improve waste segregation accuracy to **>85%** (vs. ~30% manual)
- Enable proactive overflow prevention instead of reactive complaints
- Provide actionable circular economy recommendations (recycle / compost / special handling)

---

## 3. Target Users

| User Persona            | Description                                                                              | Key Needs                                      |
|-------------------------|------------------------------------------------------------------------------------------|------------------------------------------------|
| **Municipal Operator**  | GHMC waste management staff monitoring city-wide bins and dispatching collection trucks    | Real-time bin status, optimized routes, alerts |
| **Waste Sorter / RWA**  | Resident welfare associations or community waste workers scanning waste at source         | Quick AI classification, segregation guidance  |
| **City Administrator**  | Decision-makers reviewing analytics for policy and budget planning                       | Aggregate analytics, dashboards, trend data    |
| **Competition Judge**   | Evaluator assessing technical innovation, impact, and feasibility of the prototype       | Clear demo flow, quantifiable results          |

---

## 4. Solution Overview

The system is architected as a **decoupled frontend + API backend**, organized into four interconnected pillars:

```
┌──────────────────────────────────────────────────────────────────────┐
│                     CIRCULAR WASTE INTELLIGENCE                      │
├──────────────┬──────────────┬──────────────────┬─────────────────────┤
│  AI Waste    │  IoT Smart   │  Route           │  Analytics          │
│  Classifier  │  Bin Sim.    │  Optimizer        │  Dashboard          │
│              │              │                  │                     │
│ EfficientNet │ 20 Hyderabad │ Nearest Neighbor │ Chart.js + Leaflet  │
│ B0 (Keras)   │ locations    │ + Haversine      │ Real-time charts    │
│ 3-class      │ Fill sensors │ TSP approx.      │ Map visualization   │
│ inference    │ Priority sys │ Fuel savings est │ Prediction logs     │
└──────────────┴──────────────┴──────────────────┴─────────────────────┘
         ▲              ▲               ▲                ▲
         │              │               │                │
         └──────────────┴───────────────┴────────────────┘
                        Flask REST API
                     (Python Backend)
```

---

## 5. System Architecture

### 5.1 High-Level Architecture

```
                    ┌─────────────────────┐
                    │   Static Frontend   │
                    │  (Netlify / CDN)    │
                    │  HTML + CSS + JS    │
                    │  Chart.js, Leaflet  │
                    └────────┬────────────┘
                             │ HTTPS (fetch API)
                             ▼
                    ┌─────────────────────┐
                    │   Flask API Server  │
                    │   (Render / Local)  │
                    │                     │
                    │  ┌───────────────┐  │
                    │  │ /predict      │  │ ← Image upload + AI inference
                    │  │ /api/bins     │  │ ← IoT bin data
                    │  │ /api/route    │  │ ← Route optimization
                    │  │ /api/simulate │  │ ← IoT tick simulation
                    │  │ /dashboard    │  │ ← Analytics data
                    │  └───────────────┘  │
                    │         │           │
                    │    ┌────┴────┐      │
                    │    ▼         ▼      │
                    │ bins.json  data.csv  │
                    │ (IoT state)(AI log) │
                    └─────────────────────┘
                             │
                    ┌────────┴────────────┐
                    │  waste_classifier    │
                    │  .keras (54MB)       │
                    │  EfficientNetB0      │
                    └─────────────────────┘
```

### 5.2 Technology Stack

| Layer                | Technology                                                 | Rationale                                     |
|----------------------|------------------------------------------------------------|-----------------------------------------------|
| **AI / ML**          | TensorFlow 2.x, Keras, EfficientNetB0                     | State-of-the-art image classification, transfer learning |
| **Backend**          | Python 3.10+, Flask, Flask-CORS                            | Lightweight, fast prototyping, easy deployment |
| **Frontend**         | HTML5, Vanilla CSS (glassmorphism), Vanilla JS             | Zero build step, instant deployment to CDN    |
| **Charts**           | Chart.js 4.x                                              | Rich, responsive data visualizations          |
| **Maps**             | Leaflet.js 1.9 + OpenStreetMap                             | Open-source, mobile-friendly map rendering    |
| **Typography**       | Inter (Google Fonts)                                       | Modern, highly legible UI typeface            |
| **Data Storage**     | JSON (bins.json), CSV (data.csv)                           | File-based, zero-config, demo-friendly        |
| **Deployment**       | Render (backend), Netlify (frontend)                       | Free tier, auto-deploy from Git               |
| **Model Hosting**    | Google Drive (gdown auto-download)                         | Free large file hosting for the 54MB model    |
| **WSGI Server**      | Gunicorn                                                   | Production-grade Python HTTP server           |

### 5.3 Repository Structure

```
waste_dataset/
│
├── backend/
│   ├── app.py                    # Flask application — all API routes
│   ├── bin_simulator.py          # IoT smart bin simulation engine
│   ├── route_optimizer.py        # Haversine + Nearest Neighbor routing
│   ├── dashboard.py              # Standalone matplotlib analytics
│   ├── main_simulation.py        # CLI demo of full pipeline
│   ├── requirements.txt          # Python dependencies
│   ├── render.yaml               # Render deployment config
│   ├── utils/
│   │   └── waste_classifier.py   # AI inference module (TF/Keras)
│   ├── data/
│   │   └── bins.json             # Smart bin state (auto-generated)
│   ├── uploads/                  # Uploaded waste images
│   └── data.csv                  # Prediction log
│
├── frontend/
│   ├── index.html                # Single-page app (4-tab UI)
│   ├── css/style.css             # Dark glassmorphism design system
│   ├── js/app.js                 # Application logic + API integration
│   ├── netlify.toml              # Netlify deployment config
│   └── uploads/                  # (unused, frontend assets)
│
├── waste_classifier.keras        # Trained EfficientNetB0 model (~54MB)
├── PRD.md                        # This document
├── README.md                     # Quick-start guide
├── DEPLOYMENT.md                 # Render + Netlify deployment guide
└── .gitignore
```

---

## 6. Functional Requirements

### 6.1 Pillar A — AI Waste Classification

| ID     | Requirement                                                                                          | Priority |
|--------|------------------------------------------------------------------------------------------------------|----------|
| A-01   | Users can upload waste images via drag-and-drop or file browser (PNG, JPG, WEBP, BMP, GIF)           | P0       |
| A-02   | Uploaded images are capped at **16 MB** and resized to **224×224** for inference                      | P0       |
| A-03   | The EfficientNetB0 model classifies images into **3 categories**: `dry_waste`, `wet_waste`, `other_waste` | P0       |
| A-04   | The API returns: predicted class, display name, confidence %, all-class probabilities, and circular economy action | P0       |
| A-05   | Each prediction is logged to `data.csv` with: timestamp, waste_type, confidence, location            | P0       |
| A-06   | Optional location field allows users to tag scans with a geographic context                          | P1       |
| A-07   | Upon classification, the nearest matching smart bin's fill level is automatically incremented         | P1       |
| A-08   | If the model file is missing at startup, it is auto-downloaded from Google Drive (~54MB)             | P0       |
| A-09   | If model loading fails, a graceful fallback returns `unknown` class with 0% confidence               | P0       |

#### AI Model Specifications

| Property           | Value                                      |
|--------------------|--------------------------------------------|
| Architecture       | EfficientNetB0 (fine-tuned)                |
| Framework          | TensorFlow / Keras                         |
| Input Size         | 224 × 224 × 3 (RGB)                       |
| Preprocessing      | `efficientnet.preprocess_input()`          |
| Output Classes     | `dry_waste`, `other_waste`, `wet_waste`    |
| Output Layer       | Softmax (3 neurons)                        |
| Model Format       | `.keras` (native Keras format)             |
| Model Size         | ~54 MB                                     |

---

### 6.2 Pillar B — IoT Smart Bin Simulation

| ID     | Requirement                                                                                        | Priority |
|--------|----------------------------------------------------------------------------------------------------|----------|
| B-01   | The system simulates **20 smart bins** across realistic Hyderabad locations                            | P0       |
| B-02   | Each bin tracks: `bin_id`, `area`, `lat/lng`, `fill_level` (0-100%), `waste_type`, `priority`, `last_updated` | P0       |
| B-03   | Priority is computed dynamically: **HIGH** (>70%), **MEDIUM** (40-70%), **LOW** (<40%)             | P0       |
| B-04   | "Simulate IoT Tick" increases each bin's fill level by a random amount (1-8%) per tick             | P0       |
| B-05   | Fill levels are capped at 100% (overflow state)                                                    | P0       |
| B-06   | Individual bins can be "collected" — resetting fill level to 5-15%                                 | P1       |
| B-07   | "Reset Bins" reinitializes all 20 bins with fresh random fill levels (10-95%)                      | P1       |
| B-08   | Bin state is persisted to `data/bins.json` between server restarts                                 | P0       |
| B-09   | AI waste scans automatically update the nearest matching bin (by area name or waste type)           | P1       |

#### Simulated Bin Locations (Hyderabad)

| #  | Area                    | Coordinates (lat, lng)    |
|----|-------------------------|---------------------------|
| 1  | Gachibowli              | 17.4401, 78.3489          |
| 2  | Hitech City             | 17.4435, 78.3772          |
| 3  | Banjara Hills           | 17.4156, 78.4342          |
| 4  | Jubilee Hills           | 17.4324, 78.4070          |
| 5  | Kukatpally              | 17.4948, 78.3996          |
| 6  | Madhapur                | 17.4504, 78.3884          |
| 7  | Secunderabad            | 17.4399, 78.4983          |
| 8  | Kondapur                | 17.4699, 78.3576          |
| 9  | Begumpet                | 17.4447, 78.4677          |
| 10 | Somajiguda              | 17.4284, 78.4567          |
| 11 | Ameerpet                | 17.4375, 78.4483          |
| 12 | Dilsukhnagar            | 17.3688, 78.5247          |
| 13 | Tarnaka                 | 17.4274, 78.5411          |
| 14 | Uppal                   | 17.3994, 78.5583          |
| 15 | Malkajgiri              | 17.4478, 78.5263          |
| 16 | Mehdipatnam             | 17.3919, 78.4375          |
| 17 | Abids                   | 17.3894, 78.4761          |
| 18 | Nampally                | 17.3864, 78.4736          |
| 19 | Charminar               | 17.3616, 78.4747          |
| 20 | Himayatnagar            | 17.4028, 78.4847          |

**Depot (Origin):** GHMC HQ, Tarnaka — 17.4274, 78.5411

---

### 6.3 Pillar C — Route Optimization Engine

| ID     | Requirement                                                                                          | Priority |
|--------|------------------------------------------------------------------------------------------------------|----------|
| C-01   | The system filters bins with fill level ≥ 40% (HIGH + MEDIUM priority) as pickup candidates          | P0       |
| C-02   | The **Nearest Neighbor** heuristic (greedy TSP approximation) computes the shortest sequential path  | P0       |
| C-03   | Distance between bins is calculated using the **Haversine formula** (spherical Earth, R = 6371 km)   | P0       |
| C-04   | The route starts and ends at the **GHMC HQ Depot** (Tarnaka, Hyderabad)                              | P0       |
| C-05   | Output includes: ordered stop list, total distance (km), return distance, estimated time, bin count  | P0       |
| C-06   | **Estimated travel time** = (distance / 20 km/h) × 60 + (3 min/bin collection time)                 | P0       |
| C-07   | **Fuel savings %** is computed by Monte Carlo simulation: 100 random route shuffles vs optimized     | P1       |
| C-08   | Route coordinates are returned as a polyline array for Leaflet.js map rendering                      | P0       |
| C-09   | HIGH priority bins are sorted first in the output display for operator attention                     | P1       |

#### Algorithm Details

```
NEAREST NEIGHBOR HEURISTIC (Greedy TSP)
────────────────────────────────────────
Input:  Set of N pickup bins + Depot location
Output: Ordered route minimizing total travel distance

1. current_location ← Depot
2. unvisited ← all pickup bins
3. route ← []

4. WHILE unvisited is not empty:
     nearest ← bin in unvisited with min(haversine(current, bin))
     route.append(nearest)
     current_location ← nearest
     unvisited.remove(nearest)

5. Add return leg: current_location → Depot
6. Compute total_distance, estimated_time, fuel_savings

Time Complexity: O(N²)
Space Complexity: O(N)
```

---

### 6.4 Pillar D — Web Dashboard & Analytics

| ID     | Requirement                                                                                          | Priority |
|--------|------------------------------------------------------------------------------------------------------|----------|
| D-01   | Single-page application with **4 tabbed views**: Dashboard, Smart Bins, Route Optimization, Analytics | P0      |
| D-02   | **Dashboard tab**: Hero section, stats cards, image upload with drag-and-drop, classification result display, recent predictions table | P0 |
| D-03   | **Smart Bins tab**: Stats grid, interactive Leaflet.js map with color-coded markers (🔴🟡🟢), bin card grid, IoT simulation controls | P0 |
| D-04   | **Route Optimization tab**: Recompute button, route map with polyline overlay, route metrics board, stop-by-stop itinerary | P0 |
| D-05   | **Analytics tab**: Aggregate stats, Chart.js bar chart + doughnut chart, system info panels          | P0       |
| D-06   | All data is fetched from the backend API via `fetch()` with auto-refresh                             | P0       |
| D-07   | Dark theme with **glassmorphism** design system (backdrop-blur, translucent cards, gradient accents)  | P0       |
| D-08   | Animated background particles for visual polish                                                      | P1       |
| D-09   | "System Live" badge with pulsing green dot indicator                                                 | P1       |
| D-10   | Fully responsive layout (desktop, tablet, mobile)                                                    | P0       |
| D-11   | Image preview with remove button before classification submission                                    | P1       |
| D-12   | Confidence shown as animated progress bar + percentage text                                          | P1       |

---

## 7. API Contract

### 7.1 Endpoints

| Method | Endpoint           | Description                            | Request Body              | Response Format             |
|--------|--------------------|----------------------------------------|---------------------------|-----------------------------|
| GET    | `/`                | Health check                           | —                         | `{ status: string }`        |
| POST   | `/predict`         | Upload image → AI classification       | `multipart/form-data` (file + location) | Prediction result object |
| GET    | `/dashboard-data`  | Aggregated analytics for charts        | —                         | Analytics object             |
| GET    | `/optimize`        | Compute optimized route                | —                         | Route result object          |
| GET    | `/api/bins`        | All bin data + stats                   | —                         | `{ bins, stats, depot }`     |
| POST   | `/api/simulate`    | Simulate one IoT tick                  | —                         | `{ bins, stats, message }`   |
| GET    | `/api/route`       | Compute optimized route (alias)        | —                         | Route result object          |
| POST   | `/api/collect`     | Mark a bin as collected                | `{ bin_id: string }`      | `{ success, bins }`         |
| POST   | `/api/reset-bins`  | Reset all bins                         | —                         | `{ bins, stats, message }`   |

### 7.2 Response Schemas

#### POST `/predict` — Prediction Result
```json
{
  "class": "dry_waste",
  "label": "dry_waste",
  "display_name": "♻️ Dry Waste",
  "confidence": 92.5,
  "action": "Can be recycled → Paper, plastic, metal recovery",
  "all_predictions": {
    "dry_waste": 92.5,
    "wet_waste": 5.3,
    "other_waste": 2.2
  },
  "location": "Connaught Place",
  "image_url": "/uploads/waste_20260403_215500.jpg",
  "updated_bin": {
    "bin_id": "BIN-001",
    "area": "Connaught Place",
    "fill_level": 78,
    "priority": "HIGH"
  }
}
```

#### GET `/dashboard-data` — Analytics
```json
{
  "total": 42,
  "counts": { "dry_waste": 18, "wet_waste": 15, "other_waste": 9 },
  "percentages": { "dry_waste": 42.9, "wet_waste": 35.7, "other_waste": 21.4 },
  "recent": [
    { "timestamp": "2026-04-03 21:55:00", "waste_type": "dry_waste", "confidence": "92.5", "location": "Connaught Place" }
  ]
}
```

#### GET `/api/route` — Route Optimization Result
```json
{
  "route": [
    {
      "stop": 1,
      "bin_id": "BIN-008",
      "area": "Chandni Chowk",
      "lat": 28.6506,
      "lng": 77.2301,
      "fill_level": 88,
      "priority": "HIGH",
      "waste_type": "wet_waste",
      "distance_from_prev_km": 2.15
    }
  ],
  "total_distance_km": 48.72,
  "return_distance_km": 5.31,
  "bins_collected": 12,
  "estimated_time_min": 182,
  "depot": { "area": "GHMC HQ, Tarnaka", "lat": 17.4274, "lng": 78.5411 },
  "route_coordinates": [[28.6329, 77.2195], [28.6506, 77.2301], "..."],
  "high_priority_count": 8,
  "medium_priority_count": 4,
  "fuel_savings_pct": 34.2
}
```

---

## 8. Data Models

### 8.1 Prediction Log (`data.csv`)

| Column       | Type      | Description                              | Example                  |
|--------------|-----------|------------------------------------------|--------------------------|
| `timestamp`  | datetime  | When the prediction was made             | `2026-04-03 21:55:00`    |
| `waste_type` | string    | Predicted waste category                 | `dry_waste`              |
| `confidence` | float     | Model confidence percentage              | `92.5`                   |
| `location`   | string    | User-provided location tag               | `Connaught Place`        |

### 8.2 Smart Bin State (`data/bins.json`)

| Field          | Type      | Description                             | Example                 |
|----------------|-----------|-----------------------------------------|-------------------------|
| `bin_id`       | string    | Unique identifier                       | `BIN-001`               |
| `area`         | string    | Hyderabad neighborhood name                 | `Gachibowli`       |
| `lat`          | float     | Latitude coordinate                     | `28.6315`               |
| `lng`          | float     | Longitude coordinate                    | `77.2167`               |
| `fill_level`   | int       | Current fill percentage (0-100)         | `72`                    |
| `waste_type`   | string    | Predominant waste type in this bin      | `dry_waste`             |
| `priority`     | string    | Computed priority level                 | `HIGH`                  |
| `last_updated` | datetime  | Last sensor update timestamp            | `2026-04-03 21:55:00`   |

---

## 9. Non-Functional Requirements

| Category           | Requirement                                                                                   |
|--------------------|-----------------------------------------------------------------------------------------------|
| **Performance**    | AI prediction completes in < 3 seconds on a standard machine                                  |
| **Performance**    | Route optimization for 20 bins completes in < 500ms                                           |
| **Performance**    | Frontend loads and renders first paint in < 2 seconds on broadband                            |
| **Reliability**    | Graceful degradation if AI model is unavailable (returns `unknown` class)                     |
| **Reliability**    | Auto-download model from Google Drive if missing at startup                                   |
| **Security**       | File upload size capped at 16 MB; only image extensions allowed                               |
| **Security**       | CORS enabled with wildcard origin for demo purposes                                           |
| **Scalability**    | File-based storage is acceptable for prototype (< 1000 records)                               |
| **Usability**      | Single-page app with tab navigation — no page reloads required                                |
| **Usability**      | Drag-and-drop image upload with instant preview                                               |
| **Accessibility**  | Semantic HTML, readable font sizes, sufficient color contrast                                  |
| **Deployment**     | Backend deployable to Render free tier (auto-sleep after 15 min idle)                         |
| **Deployment**     | Frontend deployable to Netlify via drag-and-drop or Git integration                           |
| **Portability**    | Runs locally with `python app.py` — zero external service dependencies for core functionality |

---

## 10. User Flows

### 10.1 Waste Classification Flow

```
User opens Dashboard tab
  │
  ├─→ Drags waste image onto upload zone (or clicks to browse)
  │     │
  │     ├─→ Image preview shown with ✕ remove button
  │     │
  │     ├─→ (Optional) Types location in text field
  │     │
  │     └─→ Clicks "🔍 Classify Waste"
  │           │
  │           ├─→ POST /predict (multipart form)
  │           │
  │           ├─→ Result card appears:
  │           │     • Classified image
  │           │     • Waste type badge (♻️ Dry / 🍃 Wet / 🔶 Other)
  │           │     • Confidence bar (animated)
  │           │     • Per-class probability breakdown
  │           │     • Circular Economy action recommendation
  │           │
  │           ├─→ Nearest smart bin fill level updated
  │           │
  │           └─→ Recent Predictions table refreshed
  │
  └─→ Stats cards update (total scans, per-type counts)
```

### 10.2 Smart Bin Monitoring Flow

```
User switches to Smart Bins tab
  │
  ├─→ GET /api/bins → bin data loaded
  │
  ├─→ Stats grid: Total bins, avg fill, pickup needed, priority counts
  │
  ├─→ Leaflet map renders with 20 color-coded markers
  │     • 🔴 Red   = HIGH priority (>70%)
  │     • 🟡 Yellow = MEDIUM priority (40-70%)
  │     • 🟢 Green  = LOW priority (<40%)
  │
  ├─→ Bin cards grid shows all 20 bins with fill bars
  │
  ├─→ User clicks "⏱️ Simulate IoT Tick"
  │     └─→ POST /api/simulate → fill levels increase → UI refreshes
  │
  ├─→ User clicks "🔄 Reset Bins"
  │     └─→ POST /api/reset-bins → fresh random state
  │
  └─→ User clicks "🧭 Optimize Route" → switches to Routes tab
```

### 10.3 Route Optimization Flow

```
User is on Route Optimization tab
  │
  ├─→ GET /api/route → optimized route computed
  │
  ├─→ Route metrics displayed:
  │     • Total distance (km)
  │     • Estimated time (min)
  │     • Bins to collect
  │     • Fuel savings vs random (%)
  │
  ├─→ Map shows route polyline (Depot → Bin₁ → Bin₂ → ... → Depot)
  │
  ├─→ Stop-by-stop itinerary table
  │
  └─→ User clicks "🔄 Recompute Route" after simulating more ticks
```

---

## 11. Deployment Strategy

### 11.1 Architecture

| Component     | Platform     | URL Pattern                              | Cost     |
|---------------|-------------|------------------------------------------|----------|
| Backend API   | Render       | `https://<name>.onrender.com`            | Free tier |
| Frontend SPA  | Netlify      | `https://<name>.netlify.app`             | Free tier |
| AI Model      | Google Drive | Auto-downloaded at server startup        | Free     |

### 11.2 Backend (Render)

- **Runtime:** Python 3
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `gunicorn app:app`
- **Port:** `10000` (Render default)
- **Config:** `render.yaml` in repository root

### 11.3 Frontend (Netlify)

- **Type:** Static site (no build step)
- **Publish Directory:** `frontend/`
- **Config:** `netlify.toml` for clean URL handling
- **API Base:** Update `API_BASE` constant in `js/app.js` to point to Render URL

### 11.4 Local Development

```bash
# Terminal 1 — Backend
cd backend
pip install -r requirements.txt
python app.py                    # Runs on http://0.0.0.0:10000

# Terminal 2 — Frontend (any static server)
cd frontend
npx serve .                      # Or open index.html directly
```

---

## 12. Success Metrics

| Metric                              | Target                        | Measurement Method                  |
|--------------------------------------|-------------------------------|-------------------------------------|
| **AI Classification Accuracy**       | ≥ 85% on test set             | Confusion matrix on holdout data    |
| **Route Distance Savings**           | ≥ 25% vs random routes        | Monte Carlo comparison (100 trials) |
| **Prediction Latency**               | < 3s per image                | Server-side timing                  |
| **Route Computation Latency**        | < 500ms for 20 bins           | Server-side timing                  |
| **Frontend Load Time**               | < 2s first contentful paint   | Lighthouse / browser devtools       |
| **Bin Priority Accuracy**            | 100% correct threshold logic  | Unit test validation                |
| **API Uptime (demo)**               | 99% during competition window | Manual monitoring                   |

---

## 13. Risk Assessment

| Risk                                     | Impact | Likelihood | Mitigation                                                      |
|------------------------------------------|--------|------------|------------------------------------------------------------------|
| Model file too large for Git             | High   | High       | Host on Google Drive; auto-download via `gdown` at startup       |
| Render free tier cold-start delay        | Medium | High       | First request takes ~30s; pre-warm before demo                   |
| TensorFlow import slow on cold start     | Medium | Medium     | Accept ~10s startup; display loading states in frontend          |
| CORS misconfiguration                    | High   | Low        | Wildcard CORS (`*`) enabled; tighten for production              |
| File-based storage data loss             | Medium | Medium     | Acceptable for demo; migrate to DB for production                |
| Model accuracy on edge cases             | Medium | Medium     | 3-class model; fine-tune on larger dataset for production        |
| API rate limiting absent                 | Low    | Low        | Add Flask-Limiter for production deployment                      |

---

## 14. Future Roadmap

### Phase 2 — Hardware Integration
- [ ] Replace simulation with real **ESP32/Arduino** microcontrollers
- [ ] Integrate **ultrasonic distance sensors** (HC-SR04) for actual fill measurement
- [ ] Add **LoRa/NB-IoT** wireless modules for long-range bin communication
- [ ] Build a physical prototype bin with embedded sensors

### Phase 3 — Advanced AI Pipeline
- [ ] Upgrade to **YOLOv8** or **DETR** for real-time multi-object detection
- [ ] Add **video stream classification** from CCTV feeds at dumping points
- [ ] Expand to **10+ waste categories** (e-waste, medical, hazardous, glass, textiles)
- [ ] Implement **on-device inference** using TensorFlow Lite for edge deployment

### Phase 4 — Cloud & Scale
- [ ] Migrate to **PostgreSQL** or **Firebase** for scalable data storage
- [ ] Deploy backend to **AWS Elastic Beanstalk** or **GCP App Engine**
- [ ] Add **user authentication** (OAuth 2.0) for multi-tenant access
- [ ] Implement **real-time WebSocket** updates for live bin status streaming
- [ ] Build **mobile app** (React Native) for field workers

### Phase 5 — Advanced Operations Research
- [ ] Upgrade to **Google OR-Tools** VRP solver for multi-truck fleet optimization
- [ ] Add **time windows** (bins must be collected before overflow deadline)
- [ ] Implement **truck capacity constraints** (weight/volume limits)
- [ ] Add **traffic-aware routing** using Google Maps Directions API
- [ ] Predictive analytics: forecast bin fill rates using historical data

---

## 15. Glossary

| Term                    | Definition                                                                       |
|-------------------------|----------------------------------------------------------------------------------|
| **EfficientNetB0**      | A compact, high-accuracy CNN architecture by Google for image classification     |
| **Haversine Formula**   | Equation to calculate great-circle distance between two lat/lng points on Earth  |
| **Nearest Neighbor**    | Greedy heuristic for TSP: always visit the closest unvisited node next           |
| **TSP**                 | Travelling Salesman Problem — find shortest route visiting all nodes exactly once |
| **VRP**                 | Vehicle Routing Problem — TSP extended to multiple vehicles with constraints     |
| **IoT Tick**            | One simulated sensor update cycle where bin fill levels increase                 |
| **Glassmorphism**       | UI design trend using frosted-glass effects (blur, transparency, borders)        |
| **Circular Economy**    | Economic model focused on reuse, recycling, and waste reduction                  |
| **Digital Twin**        | Virtual replica of physical assets (bins) updated in real-time                   |
| **GHMC**               | Greater Hyderabad Municipal Corporation — local government body managing waste            |

---

*Built for a national-level competition 🇮🇳 • AI for Sustainability • April 2026*
