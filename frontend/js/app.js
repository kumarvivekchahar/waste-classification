/* ══════════════════════════════════════════════════════════
   Glacier Farm — Circular Waste Intelligence Frontend
   Unified SPA with Glacier Kinetic Design System
   ══════════════════════════════════════════════════════════ */

const API_BASE = "http://127.0.0.1:10001";

// ─── State ───────────────────────────────────────────────
let currentTab = 'dashboard';
let binsData = [];
let routeData = null;
let dashboardLoaded = false;
let binsLoaded = false;
let mapInitialized = false;
let settingsLoaded = false;

// Leaflet map instance (single map for the Map tab)
let mainMap = null;
let mapLayerGroup = null;

// ─── DOM Ready ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initUpload();
    loadDashboard();
});

// ═══════════════════════════════════════════════════════════
//  BOTTOM NAV NAVIGATION
// ═══════════════════════════════════════════════════════════
function initNavigation() {
    const navLinks = document.querySelectorAll('#bottom-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.dataset.tab;
            switchTab(tab);
        });
    });

    // Check hash
    const hash = window.location.hash.replace('#', '');
    if (['dashboard', 'scan', 'map', 'settings'].includes(hash)) {
        switchTab(hash);
    }
}

function switchTab(tabName) {
    currentTab = tabName;
    window.location.hash = tabName;

    // Update nav active states
    document.querySelectorAll('#bottom-nav .nav-link').forEach(link => {
        const isActive = link.dataset.tab === tabName;
        if (isActive) {
            link.className = 'nav-link flex flex-col items-center justify-center bg-[#F4D03F] text-[#131313] rounded-full px-5 py-2 scale-110 shadow-[0_0_15px_rgba(244,208,63,0.3)]';
            const icon = link.querySelector('.material-symbols-outlined');
            if (icon) icon.style.fontVariationSettings = "'FILL' 1";
        } else {
            link.className = 'nav-link flex flex-col items-center justify-center text-gray-500 hover:text-[#F4D03F]/70 px-4 py-2';
            const icon = link.querySelector('.material-symbols-outlined');
            if (icon) icon.style.fontVariationSettings = "'FILL' 0";
        }
    });

    // Update panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `tab-${tabName}`);
    });

    // Lazy-load data
    if (tabName === 'dashboard' && !dashboardLoaded) loadDashboard();
    if (tabName === 'map') initMapTab();
    if (tabName === 'settings' && !settingsLoaded) loadSettings();

    // Fix map size when switching to map tab
    if (tabName === 'map' && mainMap) {
        setTimeout(() => mainMap.invalidateSize(), 100);
    }
}

// ═══════════════════════════════════════════════════════════
//  DASHBOARD TAB
// ═══════════════════════════════════════════════════════════
async function loadDashboard() {
    try {
        const [dashRes, binsRes] = await Promise.all([
            fetch(`${API_BASE}/dashboard-data`),
            fetch(`${API_BASE}/api/bins`)
        ]);
        const dashData = await dashRes.json();
        const binsResult = await binsRes.json();
        binsData = binsResult.bins || [];

        renderDashboardKPIs(dashData, binsResult);
        renderDonutChart(dashData);
        renderRecentScans(dashData.recent || [], 'dashboard-recent-scans');
        dashboardLoaded = true;
    } catch (e) {
        console.error('Dashboard load error:', e);
        document.getElementById('kpi-total-scans').textContent = '—';
    }
}

function renderDashboardKPIs(dashData, binsResult) {
    const total = dashData.total || 0;
    const bins = binsResult.bins || [];
    const stats = binsResult.stats || {};

    // Total Scans
    document.getElementById('kpi-total-scans').textContent = total.toLocaleString();
    const trendEl = document.getElementById('kpi-scans-trend');
    if (total > 0) {
        trendEl.innerHTML = `<span class="material-symbols-outlined text-sm">trending_up</span><span>+${Math.round(Math.random() * 15 + 5)}%</span>`;
    }

    // Avg Confidence
    const recent = dashData.recent || [];
    let avgConf = 0;
    if (recent.length > 0) {
        const sum = recent.reduce((s, r) => s + parseFloat(r.confidence || 0), 0);
        avgConf = Math.round(sum / recent.length * 10) / 10;
    }
    document.getElementById('kpi-avg-conf').textContent = avgConf > 0 ? `${avgConf}%` : '—';
    document.getElementById('kpi-conf-bar').style.width = `${avgConf}%`;

    // Active Bins
    const activeBins = bins.filter(b => b.fill_level > 0).length;
    document.getElementById('kpi-active-bins').textContent = activeBins;
    document.getElementById('kpi-total-bins').textContent = `/ ${bins.length}`;
}

function renderDonutChart(dashData) {
    const pcts = dashData.percentages || {};
    const dryPct = pcts.dry_waste || 0;
    const wetPct = pcts.wet_waste || 0;
    const otherPct = pcts.other_waste || 0;

    // SVG donut segments (circumference = 2 * PI * 16 ≈ 100.53, we use proportional values)
    const dryArc = dryPct;
    const wetArc = wetPct;
    const otherArc = otherPct;

    document.getElementById('donut-seg-dry').setAttribute('stroke-dasharray', `${dryArc}, 100`);
    document.getElementById('donut-seg-wet').setAttribute('stroke-dasharray', `${wetArc}, 100`);
    document.getElementById('donut-seg-wet').setAttribute('stroke-dashoffset', `-${dryArc}`);
    document.getElementById('donut-seg-other').setAttribute('stroke-dasharray', `${otherArc}, 100`);
    document.getElementById('donut-seg-other').setAttribute('stroke-dashoffset', `-${dryArc + wetArc}`);

    // Legend
    document.getElementById('legend-dry').textContent = `${dryPct}%`;
    document.getElementById('legend-wet').textContent = `${wetPct}%`;
    document.getElementById('legend-other').textContent = `${otherPct}%`;
}

function renderRecentScans(recent, containerId) {
    const container = document.getElementById(containerId);
    if (!recent || recent.length === 0) {
        container.innerHTML = `<div class="text-center py-8 text-on-surface-variant text-sm">No predictions yet. Upload your first image!</div>`;
        return;
    }

    const icons = {
        'dry_waste': 'inventory_2',
        'wet_waste': 'eco',
        'other_waste': 'warning',
    };
    const iconColors = {
        'dry_waste': 'text-primary-container',
        'wet_waste': 'text-secondary',
        'other_waste': 'text-tertiary-fixed-dim',
    };

    container.innerHTML = recent.map(r => {
        const wt = r.waste_type || 'other_waste';
        const icon = icons[wt] || 'help';
        const color = iconColors[wt] || 'text-on-surface-variant';
        const conf = r.confidence || '—';
        const loc = r.location || '';
        const time = r.timestamp || '';
        const name = formatType(wt);

        return `
            <div class="flex items-center justify-between p-4 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors group">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-lg bg-background flex items-center justify-center ${color} group-hover:scale-110 transition-transform">
                        <span class="material-symbols-outlined">${icon}</span>
                    </div>
                    <div>
                        <p class="font-bold">${name}</p>
                        <p class="text-xs text-on-surface-variant">${time}${loc ? ' • ' + loc : ''}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-secondary font-bold">${conf}%</p>
                    <p class="text-[10px] uppercase font-label tracking-widest text-on-surface-variant">Conf.</p>
                </div>
            </div>
        `;
    }).join('');
}

// ═══════════════════════════════════════════════════════════
//  SCAN TAB — Upload & Classification
// ═══════════════════════════════════════════════════════════
function initUpload() {
    const zone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const preview = document.getElementById('upload-preview');
    const previewImg = document.getElementById('preview-img');
    const removeBtn = document.getElementById('remove-btn');

    zone.addEventListener('click', () => fileInput.click());

    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('bg-primary-container/10'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('bg-primary-container/10'));
    zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('bg-primary-container/10');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            showPreview(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files[0]) showPreview(fileInput.files[0]);
    });

    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.value = '';
        preview.classList.add('hidden');
        zone.classList.remove('hidden');
        document.getElementById('result-section').classList.add('hidden');
    });

    function showPreview(file) {
        const reader = new FileReader();
        reader.onload = e => {
            previewImg.src = e.target.result;
            preview.classList.remove('hidden');
            zone.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
}

async function classifyWaste() {
    const fileInput = document.getElementById('file-input');
    const btn = document.getElementById('classify-btn');
    const location = document.getElementById('location-input').value.trim();

    if (!fileInput.files[0]) return;

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-sm"></span> Classifying...';

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('location', location || '');

    try {
        const res = await fetch(`${API_BASE}/predict`, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (!res.ok) throw new Error(`API Error: ${res.status}`);

        const data = await res.json();
        renderClassificationResult(data);

        // Refresh dashboard
        dashboardLoaded = false;
        loadDashboard();
    } catch (e) {
        console.error('Classification error:', e);
        alert('Failed to classify. Check if backend is running at ' + API_BASE);
    }

    btn.disabled = false;
    btn.innerHTML = '🔍 Classify Waste';
}

function renderClassificationResult(data) {
    const section = document.getElementById('result-section');
    section.classList.remove('hidden');

    const cls = data.class || 'unknown';
    const displayName = data.display_name || formatType(cls);
    const conf = data.confidence || 0;
    const action = data.action || 'Process accordingly';
    const allPred = data.all_predictions || {};

    // Image
    let imageUrl = data.image_url || '';
    if (imageUrl.startsWith('/')) imageUrl = API_BASE + imageUrl;
    const resultImg = document.getElementById('result-image');
    if (imageUrl) resultImg.src = imageUrl;

    // Class name
    document.getElementById('result-class-name').textContent = displayName.toUpperCase();

    // Confidence
    document.getElementById('result-conf-val').textContent = `${conf}%`;
    document.getElementById('result-conf-bar').style.width = `${conf}%`;

    // Action
    document.getElementById('result-action').textContent = action;

    // Per-class probabilities
    const probContainer = document.getElementById('result-probs');
    const probColors = { 'dry_waste': 'bg-primary-container', 'wet_waste': 'bg-secondary', 'other_waste': 'bg-tertiary-fixed-dim' };
    probContainer.innerHTML = Object.entries(allPred).map(([k, v]) => {
        const pct = typeof v === 'number' && v <= 1 ? Math.round(v * 100) : v;
        const color = probColors[k] || 'bg-outline';
        return `
            <div class="flex items-center gap-3">
                <span class="text-xs text-on-surface-variant w-20 shrink-0">${formatType(k)}</span>
                <div class="flex-1 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                    <div class="${color} h-full rounded-full transition-all duration-700" style="width:${pct}%"></div>
                </div>
                <span class="text-xs font-bold w-10 text-right">${pct}%</span>
            </div>
        `;
    }).join('');

    // Also update scan tab recent list
    loadScanRecent();

    section.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function confirmAndReset() {
    document.getElementById('result-section').classList.add('hidden');
    document.getElementById('upload-preview').classList.add('hidden');
    document.getElementById('upload-zone').classList.remove('hidden');
    document.getElementById('file-input').value = '';
}

async function loadScanRecent() {
    try {
        const res = await fetch(`${API_BASE}/dashboard-data`);
        const data = await res.json();
        renderRecentScans(data.recent || [], 'scan-recent-list');
    } catch (e) { /* silent */ }
}

// ═══════════════════════════════════════════════════════════
//  MAP TAB — Leaflet + Route Optimization
// ═══════════════════════════════════════════════════════════
async function initMapTab() {
    if (!mainMap) {
        mainMap = L.map('main-map', { zoomControl: false }).setView([28.6139, 77.2090], 11);
        L.control.zoom({ position: 'bottomright' }).addTo(mainMap);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(mainMap);
        mapLayerGroup = L.layerGroup().addTo(mainMap);
    }

    setTimeout(() => mainMap.invalidateSize(), 150);

    // Load bins + route
    try {
        if (!binsData || binsData.length === 0) {
            const res = await fetch(`${API_BASE}/api/bins`);
            const data = await res.json();
            binsData = data.bins || [];
        }
        renderMapBins(binsData);
        await loadMapRoute();
    } catch (e) {
        console.error('Map init error:', e);
    }
    mapInitialized = true;
}

function getMarkerColor(priority) {
    if (priority === 'HIGH') return '#ffb4ab';
    if (priority === 'MEDIUM') return '#f4d03f';
    return '#4ae183';
}

function renderMapBins(bins) {
    if (!mainMap || !mapLayerGroup) return;
    mapLayerGroup.clearLayers();

    let bounds = L.latLngBounds();

    bins.forEach(bin => {
        if (!bin.lat || !bin.lng) return;
        const fill = Math.round(bin.fill_level);
        const priority = bin.priority || (fill > 70 ? 'HIGH' : fill > 40 ? 'MEDIUM' : 'LOW');
        const color = getMarkerColor(priority);

        const icon = L.divIcon({
            className: '',
            html: `<div style="width:14px;height:14px;background:${color};border-radius:50%;border:2px solid #131313;box-shadow:0 0 8px ${color}80;"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });

        const popup = `
            <div style="color:#1e293b;min-width:140px;">
                <strong>🗑️ ${bin.area || bin.bin_id}</strong><br>
                Fill: <strong>${fill}%</strong><br>
                Priority: <strong style="color:${priority === 'HIGH' ? '#ef4444' : priority === 'MEDIUM' ? '#f59e0b' : '#10b981'}">${priority}</strong>
            </div>`;

        L.marker([bin.lat, bin.lng], { icon }).bindPopup(popup).addTo(mapLayerGroup);
        bounds.extend([bin.lat, bin.lng]);
    });

    if (bounds.isValid()) {
        mainMap.fitBounds(bounds, { padding: [60, 60] });
    }
}

async function loadMapRoute() {
    try {
        const res = await fetch(`${API_BASE}/api/route`);
        routeData = await res.json();
        renderRouteOverlay(routeData);
        renderRoutePolyline(routeData);
    } catch (e) {
        console.error('Route load error:', e);
        document.getElementById('route-title').textContent = 'No Route';
    }
}

function renderRouteOverlay(data) {
    document.getElementById('route-title').textContent = data.bins_collected > 0 ? 'Optimal Route Found' : 'No Bins Need Pickup';
    document.getElementById('route-distance').textContent = `${data.total_distance_km || 0} km`;
    document.getElementById('route-eta').textContent = `${data.estimated_time_min || 0} mins`;
    document.getElementById('route-fuel').textContent = `${data.fuel_savings_pct || 0}%`;
    document.getElementById('route-bins-count').textContent = data.bins_collected || 0;
}

function renderRoutePolyline(data) {
    if (!mainMap || !mapLayerGroup) return;
    const coords = data.route_coordinates || [];
    if (coords.length > 1) {
        L.polyline(coords, {
            color: '#9B59B6',
            weight: 4,
            opacity: 0.8,
            dashArray: '8, 8',
            lineJoin: 'round'
        }).addTo(mapLayerGroup);
    }

    // Depot marker
    const depot = data.depot;
    if (depot && depot.lat && depot.lng) {
        const depotIcon = L.divIcon({
            className: '',
            html: `<div style="width:18px;height:18px;background:#3b82f6;border-radius:50%;border:3px solid #131313;box-shadow:0 0 12px rgba(59,130,246,0.6);"></div>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9]
        });
        L.marker([depot.lat, depot.lng], { icon: depotIcon, zIndexOffset: 1000 })
            .bindPopup(`<strong style="color:#000;">🏢 ${depot.area || 'Depot'}</strong><br>Start / End`)
            .addTo(mapLayerGroup);
    }
}

async function mapSimulateTick() {
    const btn = document.getElementById('map-sim-btn');
    btn.textContent = 'Simulating...';
    btn.disabled = true;
    try {
        const res = await fetch(`${API_BASE}/api/simulate`, { method: 'POST' });
        const data = await res.json();
        binsData = data.bins || [];
        renderMapBins(binsData);
        await loadMapRoute();
    } catch (e) { console.error(e); }
    btn.textContent = 'Simulate IoT Tick';
    btn.disabled = false;
}

async function mapOptimizeRoute() {
    const btn = document.getElementById('map-opt-btn');
    btn.textContent = 'Computing...';
    btn.disabled = true;
    try {
        await loadMapRoute();
    } catch (e) { console.error(e); }
    btn.textContent = 'Optimize Route';
    btn.disabled = false;
}

// ═══════════════════════════════════════════════════════════
//  SETTINGS / IoT CONTROLS TAB
// ═══════════════════════════════════════════════════════════
async function loadSettings() {
    try {
        const res = await fetch(`${API_BASE}/api/bins`);
        const data = await res.json();
        binsData = data.bins || [];
        const stats = data.stats || {};
        renderSettingsHealth(stats, binsData);
        renderFleetGrid(binsData);
        settingsLoaded = true;
    } catch (e) {
        console.error('Settings load error:', e);
    }
}

function renderSettingsHealth(stats, bins) {
    const total = bins.length;
    const active = bins.filter(b => b.fill_level > 0).length;

    document.getElementById('health-uptime').textContent = '99.9%';
    document.getElementById('health-uptime-bar').style.width = '99.9%';
    document.getElementById('health-bins').textContent = `${active} / ${total}`;
    document.getElementById('health-bins-bar').style.width = total > 0 ? `${(active / total) * 100}%` : '0%';
    document.getElementById('fleet-count').textContent = `View all ${total} units`;
}

function renderFleetGrid(bins) {
    const grid = document.getElementById('fleet-grid');
    if (!bins || bins.length === 0) {
        grid.innerHTML = '<div class="text-center py-8 text-on-surface-variant col-span-full">No bins available</div>';
        return;
    }

    grid.innerHTML = bins.map(bin => {
        const fill = Math.round(bin.fill_level);
        const priority = bin.priority || (fill > 70 ? 'HIGH' : fill > 40 ? 'MEDIUM' : 'LOW');

        let statusDot, statusText, statusColor, fillColor, fillLabel, iconName;
        if (priority === 'HIGH') {
            statusDot = 'bg-error'; statusText = 'Attention'; statusColor = 'text-error';
            fillColor = 'bg-error'; fillLabel = `${fill}% (High)`;
            iconName = 'warning';
        } else if (priority === 'MEDIUM') {
            statusDot = 'bg-primary-container'; statusText = 'Online'; statusColor = 'text-secondary';
            fillColor = 'bg-primary-container'; fillLabel = `${fill}% (Medium)`;
            iconName = 'delete_sweep';
        } else {
            statusDot = 'bg-secondary'; statusText = 'Online'; statusColor = 'text-secondary';
            fillColor = 'bg-secondary'; fillLabel = `${fill}% (Low)`;
            iconName = 'delete_sweep';
        }

        const battery = Math.round(50 + Math.random() * 50);
        const collectBtn = fill >= 70 ? `<button onclick="settingsCollectBin('${bin.bin_id}')" class="mt-3 w-full py-2 bg-secondary/20 text-secondary text-xs font-bold rounded-lg hover:bg-secondary/30 transition-colors">Collect</button>` : '';

        return `
            <div class="glass-card rounded-xl p-6 group hover:translate-y-[-4px] transition-all duration-300">
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h4 class="font-bold text-lg mb-1">${bin.bin_id || 'Bin'}</h4>
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full ${statusDot}"></span>
                            <span class="text-[10px] uppercase tracking-widest ${statusColor} font-bold">${statusText}</span>
                        </div>
                    </div>
                    <span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary-container transition-colors"${priority === 'HIGH' ? ' style="font-variation-settings: \'FILL\' 1; color: #ffb4ab;"' : ''}>${iconName}</span>
                </div>
                <div class="space-y-4">
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-on-surface-variant">Fill Level</span>
                        <span class="font-bold ${priority === 'HIGH' ? 'text-error' : priority === 'MEDIUM' ? 'text-primary-container' : 'text-secondary'}">${fillLabel}</span>
                    </div>
                    <div class="w-full h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                        <div class="${fillColor} h-full rounded-full transition-all duration-500" style="width:${fill}%"></div>
                    </div>
                    <div class="flex justify-between items-center text-sm pt-1">
                        <span class="text-on-surface-variant text-xs">${bin.area || ''}</span>
                        <span class="text-xs text-on-surface-variant">${bin.waste_type ? formatType(bin.waste_type) : ''}</span>
                    </div>
                    ${collectBtn}
                </div>
            </div>
        `;
    }).join('');
}

async function settingsSimulateTick() {
    const btn = document.getElementById('settings-sim-btn');
    btn.innerHTML = '<span class="spinner-sm"></span> Simulating...';
    btn.disabled = true;
    try {
        const res = await fetch(`${API_BASE}/api/simulate`, { method: 'POST' });
        const data = await res.json();
        binsData = data.bins || [];
        renderSettingsHealth(data.stats || {}, binsData);
        renderFleetGrid(binsData);
    } catch (e) { console.error(e); }
    btn.innerHTML = '<span class="material-symbols-outlined">sensors</span> Simulate IoT Tick';
    btn.disabled = false;
}

async function settingsOptimizeRoute() {
    switchTab('map');
}

async function settingsResetBins() {
    const btn = document.getElementById('settings-reset-btn');
    btn.innerHTML = '<span class="spinner-sm"></span> Resetting...';
    btn.disabled = true;
    try {
        const res = await fetch(`${API_BASE}/api/reset-bins`, { method: 'POST' });
        const data = await res.json();
        binsData = data.bins || [];
        renderSettingsHealth(data.stats || {}, binsData);
        renderFleetGrid(binsData);
        // Also refresh map if it was loaded
        mapInitialized = false;
    } catch (e) { console.error(e); }
    btn.innerHTML = '<span class="material-symbols-outlined">refresh</span> Reset Bins';
    btn.disabled = false;
}

async function settingsCollectBin(binId) {
    try {
        const res = await fetch(`${API_BASE}/api/collect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bin_id: binId })
        });
        const data = await res.json();
        binsData = data.bins || [];
        renderFleetGrid(binsData);
    } catch (e) { console.error(e); }
}

// ═══════════════════════════════════════════════════════════
//  UTILITIES
// ═══════════════════════════════════════════════════════════
function formatType(t) {
    if (!t) return 'Unknown';
    return t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
