"""
Smart Bin Simulator - IoT Bin Simulation Module
Simulates a fleet of smart dustbins across Hyderabad with fill levels, waste types, and priority logic.

Can be run standalone for testing:
    python bin_simulator.py
"""

import os
import json
import random
from datetime import datetime

# --- Configuration ---
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
BINS_FILE = os.path.join(DATA_DIR, 'bins.json')

# Hyderabad locations with realistic coordinates (nearby clusters)
LOCATIONS = [
    {"area": "Gachibowli",           "lat": 17.4401, "lng": 78.3489},
    {"area": "Hitech City",          "lat": 17.4435, "lng": 78.3772},
    {"area": "Banjara Hills",        "lat": 17.4156, "lng": 78.4342},
    {"area": "Jubilee Hills",        "lat": 17.4324, "lng": 78.4070},
    {"area": "Kukatpally",           "lat": 17.4948, "lng": 78.3996},
    {"area": "Madhapur",             "lat": 17.4504, "lng": 78.3884},
    {"area": "Secunderabad",         "lat": 17.4399, "lng": 78.4983},
    {"area": "Kondapur",             "lat": 17.4699, "lng": 78.3576},
    {"area": "Begumpet",             "lat": 17.4447, "lng": 78.4677},
    {"area": "Somajiguda",           "lat": 17.4284, "lng": 78.4567},
    {"area": "Ameerpet",             "lat": 17.4375, "lng": 78.4483},
    {"area": "Dilsukhnagar",         "lat": 17.3688, "lng": 78.5247},
    {"area": "Tarnaka",              "lat": 17.4274, "lng": 78.5411},
    {"area": "Uppal",                "lat": 17.3994, "lng": 78.5583},
    {"area": "Malkajgiri",           "lat": 17.4478, "lng": 78.5263},
    {"area": "Mehdipatnam",          "lat": 17.3919, "lng": 78.4375},
    {"area": "Abids",                "lat": 17.3894, "lng": 78.4761},
    {"area": "Nampally",             "lat": 17.3864, "lng": 78.4736},
    {"area": "Charminar",            "lat": 17.3616, "lng": 78.4747},
    {"area": "Himayatnagar",         "lat": 17.4028, "lng": 78.4847},
]

WASTE_TYPES = ['dry_waste', 'wet_waste', 'other_waste']

# Truck depot (GHMC Headquarters, Hyderabad)
DEPOT = {"area": "GHMC HQ, Tarnaka", "lat": 17.4274, "lng": 78.5411}


# --- Priority Logic ---
def get_priority(fill_level):
    """Determine bin priority based on fill level."""
    if fill_level > 70:
        return 'HIGH'
    elif fill_level >= 40:
        return 'MEDIUM'
    else:
        return 'LOW'


def get_priority_emoji(priority):
    return {'HIGH': '🔴', 'MEDIUM': '🟡', 'LOW': '🟢'}.get(priority, '⚪')


# --- Core Functions ---
def initialize_bins():
    """Create initial bin data with randomized fill levels."""
    os.makedirs(DATA_DIR, exist_ok=True)

    bins = []
    for i, loc in enumerate(LOCATIONS):
        fill = random.randint(10, 95)
        wtype = random.choice(WASTE_TYPES)
        bins.append({
            'bin_id': 'BIN-{:03d}'.format(i + 1),
            'area': loc['area'],
            'lat': loc['lat'],
            'lng': loc['lng'],
            'fill_level': fill,
            'waste_type': wtype,
            'priority': get_priority(fill),
            'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        })

    save_bins(bins)
    return bins


def load_bins():
    """Load bins from JSON file, or initialize if not found."""
    if not os.path.exists(BINS_FILE):
        return initialize_bins()

    with open(BINS_FILE, 'r', encoding='utf-8') as f:
        bins = json.load(f)

    # Recompute priorities
    for b in bins:
        b['priority'] = get_priority(b['fill_level'])

    return bins


def save_bins(bins):
    """Save bins to JSON file."""
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(BINS_FILE, 'w', encoding='utf-8') as f:
        json.dump(bins, f, indent=2, ensure_ascii=False)


def simulate_tick():
    """
    Simulate one IoT update cycle:
    - Each bin's fill level increases by a random amount (1-8%)
    - Bins at 100% stay at 100 (overflowing)
    """
    bins = load_bins()
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    for b in bins:
        increase = random.randint(1, 8)
        b['fill_level'] = min(100, b['fill_level'] + increase)
        b['priority'] = get_priority(b['fill_level'])
        b['last_updated'] = now

    save_bins(bins)
    return bins


def collect_bin(bin_id):
    """Mark a bin as collected (reset fill level to ~5-15%)."""
    bins = load_bins()
    for b in bins:
        if b['bin_id'] == bin_id:
            b['fill_level'] = random.randint(5, 15)
            b['priority'] = get_priority(b['fill_level'])
            b['last_updated'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            break
    save_bins(bins)
    return bins


def update_bin_from_scan(waste_type, location_name=''):
    """
    When waste is classified by AI, increase the nearest matching bin's fill level.
    Links the AI classification layer to the IoT simulation.
    """
    bins = load_bins()

    # Find best matching bin by area name
    best_bin = None
    for b in bins:
        if location_name and location_name.lower() in b['area'].lower():
            best_bin = b
            break

    # Fallback: pick a random bin with matching waste type
    if best_bin is None:
        matching = [b for b in bins if b['waste_type'] == waste_type]
        if matching:
            best_bin = random.choice(matching)
        else:
            best_bin = random.choice(bins)

    # Increase fill level
    best_bin['fill_level'] = min(100, best_bin['fill_level'] + random.randint(3, 10))
    best_bin['priority'] = get_priority(best_bin['fill_level'])
    best_bin['last_updated'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    save_bins(bins)
    return best_bin


def get_bins_for_pickup():
    """Return only HIGH and MEDIUM priority bins (candidates for collection)."""
    bins = load_bins()
    return [b for b in bins if b['priority'] in ('HIGH', 'MEDIUM')]


def get_bin_stats():
    """Get summary statistics for all bins."""
    bins = load_bins()
    total = len(bins)

    priority_counts = {'HIGH': 0, 'MEDIUM': 0, 'LOW': 0}
    type_counts = {'dry_waste': 0, 'wet_waste': 0, 'other_waste': 0}
    avg_fill = 0

    for b in bins:
        priority_counts[b['priority']] = priority_counts.get(b['priority'], 0) + 1
        type_counts[b['waste_type']] = type_counts.get(b['waste_type'], 0) + 1
        avg_fill += b['fill_level']

    avg_fill = round(avg_fill / total, 1) if total > 0 else 0

    return {
        'total_bins': total,
        'priority_counts': priority_counts,
        'type_counts': type_counts,
        'avg_fill_level': avg_fill,
        'pickup_needed': priority_counts['HIGH'] + priority_counts['MEDIUM'],
    }


# --- Standalone CLI ---
if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("  Smart Bin Simulator - IoT Simulation (Hyderabad)")
    print("=" * 60)

    bins = initialize_bins()
    print("\n  Initialized {} smart bins across Hyderabad\n".format(len(bins)))

    for b in bins:
        emoji = get_priority_emoji(b['priority'])
        bar_filled = b['fill_level'] // 5
        bar = '#' * bar_filled + '-' * (20 - bar_filled)
        print("  {} {}  {:25s}  [{}] {:3d}%  {}".format(
            emoji, b['bin_id'], b['area'], bar, b['fill_level'], b['waste_type']))

    print("\n  Running 3 simulation ticks...\n")
    for tick in range(3):
        bins = simulate_tick()
        stats = get_bin_stats()
        print("  Tick {}: Avg fill = {}%  |  HIGH: {}  MEDIUM: {}  LOW: {}".format(
            tick + 1, stats['avg_fill_level'],
            stats['priority_counts']['HIGH'],
            stats['priority_counts']['MEDIUM'],
            stats['priority_counts']['LOW']))

    pickup = get_bins_for_pickup()
    print("\n  Bins needing pickup: {}".format(len(pickup)))
    for b in pickup:
        emoji = get_priority_emoji(b['priority'])
        print("     {} {}  {:25s}  {}%".format(emoji, b['bin_id'], b['area'], b['fill_level']))

    print("\n  Done!\n")
