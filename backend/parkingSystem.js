/**
 * =============================================================
 * BACKEND: ParkingSystem — Core System Controller
 * =============================================================
 * This is the main backend engine for ParkX.
 * It ties together all algorithms and data structures:
 *
 *   HashMap       — O(1) slot CRUD (hashMap.js)
 *   LinkedList    — O(1) log append, O(n) traversal (linkedList.js)
 *   Quick Sort    — O(n log n) sort by any field (quickSort.js)
 *   Binary Search — O(log n) slot ID lookup (binarySearch.js)
 *   Linear Search — O(n) partial/fallback search (binarySearch.js)
 *
 * State is persisted in localStorage so data survives page
 * navigation without a server.
 * =============================================================
 */

import ParkingHashMap     from './hashMap.js';
import ActivityLinkedList from './linkedList.js';
import { sortSlots }      from './quickSort.js';
import { binarySearchById, linearSearch } from './binarySearch.js';

// ── LocalStorage keys ─────────────────────────────────────────
const STORAGE_KEY_SLOTS = 'parkx_slots';
const STORAGE_KEY_LOGS  = 'parkx_logs';

// ── Slot types and prices ─────────────────────────────────────
const SLOT_TYPES = [
    { type: 'Standard', price: 20, icon: '🚗' },
    { type: 'Compact',  price: 15, icon: '🚙' },
    { type: 'Premium',  price: 40, icon: '⭐' },
    { type: 'Handicap', price: 10, icon: '♿' },
    { type: 'EV',       price: 35, icon: '⚡' },
];

class ParkingSystem {
    /**
     * @param {number} totalSlots - Number of slots to initialize
     *                             (ignored if already persisted in localStorage)
     */
    constructor(totalSlots = 30) {
        this.hashMap     = new ParkingHashMap();      // HashMap  — O(1) slot store
        this.activityLog = new ActivityLinkedList();  // LinkedList — O(1) log append
        this._load(totalSlots);
    }

    // ─────────────────────────── Initialization ────────────────

    /**
     * Load stored data from localStorage, or initialize fresh slots.
     * @private
     */
    _load(totalSlots) {
        const storedSlots = localStorage.getItem(STORAGE_KEY_SLOTS);
        const storedLogs  = localStorage.getItem(STORAGE_KEY_LOGS);

        if (storedSlots) {
            this.hashMap.fromJSON(JSON.parse(storedSlots));
        } else {
            this._initSlots(totalSlots);
        }

        if (storedLogs) {
            this.activityLog.fromJSON(JSON.parse(storedLogs));
        }
    }

    /**
     * Persist current state to localStorage after every write.
     * @private
     */
    _save() {
        localStorage.setItem(STORAGE_KEY_SLOTS, JSON.stringify(this.hashMap.toJSON()));
        localStorage.setItem(STORAGE_KEY_LOGS,  JSON.stringify(this.activityLog.toJSON()));
    }

    /**
     * Generate the initial parking slots across 5 types.
     * @private
     */
    _initSlots(totalSlots) {
        for (let i = 1; i <= totalSlots; i++) {
            const id       = `S-${i.toString().padStart(2, '0')}`;
            const typeInfo = SLOT_TYPES[(i - 1) % SLOT_TYPES.length];

            this.hashMap.set(id, {  // HashMap.set() — O(1)
                id,
                type:      typeInfo.type,
                icon:      typeInfo.icon,
                price:     typeInfo.price,
                status:    'available',
                carNumber: null,
                ownerName: null,
                parkedAt:  null,
                duration:  null,
            });
        }
        this._save();
    }

    // ─────────────────────────── Booking / Release ─────────────

    /**
     * Book a slot.
     * Uses HashMap.get()  → O(1)
     * Uses HashMap.set()  → O(1)
     * Appends to LinkedList log → O(1)
     *
     * @param {string} id         - Slot ID
     * @param {string} carNumber  - Vehicle plate
     * @param {string} ownerName  - Owner's name
     * @returns {{ success: boolean, slot?: object, message?: string }}
     */
    bookSlot(id, carNumber, ownerName = 'Unknown') {
        const slot = this.hashMap.get(id);          // O(1) HashMap lookup

        if (!slot) {
            return { success: false, message: `Slot "${id}" does not exist.` };
        }
        if (slot.status === 'occupied') {
            return { success: false, message: `Slot "${id}" is already occupied.` };
        }

        const now      = new Date();
        slot.status    = 'occupied';
        slot.carNumber = carNumber.trim().toUpperCase();
        slot.ownerName = ownerName.trim();
        slot.parkedAt  = now.toISOString();

        this.hashMap.set(id, slot);                 // O(1) HashMap update

        this.activityLog.add({                      // O(1) LinkedList append
            action:    'Booked',
            slotId:    id,
            carNumber: slot.carNumber,
            owner:     ownerName,
            time:      now.toLocaleTimeString(),
            date:      now.toLocaleDateString(),
            timestamp: now.getTime(),
        });

        this._save();
        return { success: true, slot };
    }

    /**
     * Release an occupied slot.
     * Uses HashMap.get()  → O(1)
     * Uses HashMap.set()  → O(1)
     * Appends to LinkedList log → O(1)
     *
     * @param {string} id - Slot ID
     * @returns {{ success: boolean, slot?: object, message?: string }}
     */
    releaseSlot(id) {
        const slot = this.hashMap.get(id);          // O(1) HashMap lookup

        if (!slot) {
            return { success: false, message: `Slot "${id}" does not exist.` };
        }
        if (slot.status === 'available') {
            return { success: false, message: `Slot "${id}" is already free.` };
        }

        const now          = new Date();
        const parkedMs     = now.getTime() - new Date(slot.parkedAt).getTime();
        const durationMins = Math.floor(parkedMs / 60000);

        const lastCar   = slot.carNumber;
        const lastOwner = slot.ownerName;

        slot.status    = 'available';
        slot.carNumber = null;
        slot.ownerName = null;
        slot.parkedAt  = null;
        slot.duration  = null;

        this.hashMap.set(id, slot);                 // O(1) HashMap update

        this.activityLog.add({                      // O(1) LinkedList append
            action:    'Released',
            slotId:    id,
            carNumber: lastCar,
            owner:     lastOwner,
            time:      now.toLocaleTimeString(),
            date:      now.toLocaleDateString(),
            timestamp: now.getTime(),
            duration:  durationMins,
        });

        this._save();
        return { success: true, slot };
    }

    // ─────────────────────────── Querying ──────────────────────

    /**
     * Get all slots as an array (from HashMap buckets).
     * @returns {Array<object>}
     */
    getAllSlots() {
        return this.hashMap.getAllAsArray();
    }

    /**
     * Get a single slot by ID — O(1) via HashMap.
     * @param {string} id
     * @returns {object|null}
     */
    getSlot(id) {
        return this.hashMap.get(id);
    }

    /**
     * Filter to only available slots.
     * @returns {Array<object>}
     */
    getAvailableSlots() {
        return this.getAllSlots().filter(s => s.status === 'available');
    }

    /**
     * Filter to only occupied slots.
     * @returns {Array<object>}
     */
    getOccupiedSlots() {
        return this.getAllSlots().filter(s => s.status === 'occupied');
    }

    /**
     * Summary statistics used on the dashboard.
     * @returns {{ total, available, occupied, revenue }}
     */
    getStats() {
        const slots    = this.getAllSlots();
        const occupied = slots.filter(s => s.status === 'occupied');
        const revenue  = occupied.reduce((sum, s) => sum + s.price, 0);
        return {
            total:     slots.length,
            available: slots.length - occupied.length,
            occupied:  occupied.length,
            revenue,
        };
    }

    // ─────────────────────────── Sorting ───────────────────────

    /**
     * Sort all slots using the Quick Sort algorithm.
     * Average: O(n log n) | Worst: O(n²) [mitigated by median-of-three]
     *
     * @param {string}        field     - 'price' | 'id' | 'type'
     * @param {'asc'|'desc'}  direction
     * @returns {Array<object>}
     */
    sortedSlots(field = 'price', direction = 'asc') {
        return sortSlots(this.getAllSlots(), field, direction);
    }

    // ─────────────────────────── Searching ─────────────────────

    /**
     * Binary Search by exact slot ID — O(log n).
     * Array is pre-sorted by ID before searching.
     *
     * @param {string} id
     * @returns {{ index, slot, steps }}
     */
    binarySearchSlot(id) {
        const sorted = sortSlots(this.getAllSlots(), 'id', 'asc');
        return binarySearchById(sorted, id);
    }

    /**
     * Linear Search — O(n) partial match on slot ID or car plate.
     * Used as a fallback / for fuzzy queries.
     *
     * @param {string} query
     * @returns {{ results, steps }}
     */
    linearSearchSlots(query) {
        return linearSearch(this.getAllSlots(), query);
    }

    // ─────────────────────────── Logs ──────────────────────────

    /**
     * Get recent log entries (LinkedList tail traversal) — O(limit).
     * @param {number} limit
     * @returns {Array<object>}
     */
    getRecentLogs(limit = 20) {
        return this.activityLog.getRecent(limit);
    }

    /**
     * Get all logs — LinkedList head→tail traversal O(n).
     * @returns {Array<object>}
     */
    getAllLogs() {
        return this.activityLog.getAll();
    }

    /**
     * Reset everything to a fresh state.
     */
    reset(totalSlots = 30) {
        this.hashMap.fromJSON({});
        this.activityLog.clear();
        this._initSlots(totalSlots);
    }
}

export default ParkingSystem;
