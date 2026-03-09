/**
 * =============================================================
 * BACKEND MODULE: HashMap (Hash Table)
 * =============================================================
 * Purpose  : O(1) average-case insertion, deletion, and lookup
 *            for parking slot storage.
 * Algorithm: djb2-style polynomial rolling hash with chaining
 * Used by  : ParkingSystem (core slot store)
 * =============================================================
 */

class ParkingHashMap {
    /**
     * @param {number} capacity - Initial bucket count (default: 64)
     */
    constructor(capacity = 64) {
        this.capacity = capacity;
        this.buckets  = new Array(capacity).fill(null).map(() => []);
        this.size     = 0;
    }

    // ─── Private: hash function ────────────────────────────────
    /**
     * Converts a string key to a bucket index using a polynomial
     * rolling hash (djb2-style).
     * @param {string} key
     * @returns {number} bucket index
     */
    _hash(key) {
        let hash = 5381;
        for (let i = 0; i < key.length; i++) {
            hash = (hash * 33) ^ key.charCodeAt(i);
        }
        return Math.abs(hash) % this.capacity;
    }

    // ─── Core map operations ───────────────────────────────────

    /**
     * Insert or update a key-value pair.  O(1) average.
     * @param {string} key
     * @param {object} value - slot data object
     */
    set(key, value) {
        const index  = this._hash(key);
        const bucket = this.buckets[index];

        const existing = bucket.find(pair => pair[0] === key);
        if (existing) {
            existing[1] = value;
        } else {
            bucket.push([key, value]);
            this.size++;
        }
    }

    /**
     * Retrieve a value by key.  O(1) average.
     * @param {string} key
     * @returns {object|null}
     */
    get(key) {
        const index  = this._hash(key);
        const bucket = this.buckets[index];
        const pair   = bucket.find(p => p[0] === key);
        return pair ? pair[1] : null;
    }

    /**
     * Check if a key exists.
     * @param {string} key
     * @returns {boolean}
     */
    has(key) {
        return this.get(key) !== null;
    }

    /**
     * Delete a key-value pair.  O(1) average.
     * @param {string} key
     * @returns {boolean}
     */
    delete(key) {
        const index  = this._hash(key);
        const bucket = this.buckets[index];
        const idx    = bucket.findIndex(p => p[0] === key);
        if (idx === -1) return false;
        bucket.splice(idx, 1);
        this.size--;
        return true;
    }

    /**
     * Return all stored values as a flat array.
     * @returns {Array<object>}
     */
    getAllAsArray() {
        const result = [];
        for (const bucket of this.buckets) {
            for (const [, value] of bucket) {
                result.push(value);
            }
        }
        return result;
    }

    /**
     * Serialize the map to a plain object for localStorage persistence.
     * @returns {object}
     */
    toJSON() {
        const obj = {};
        for (const bucket of this.buckets) {
            for (const [key, value] of bucket) {
                obj[key] = value;
            }
        }
        return obj;
    }

    /**
     * Restore map data from a plain object (localStorage load).
     * @param {object} obj
     */
    fromJSON(obj) {
        this.buckets = new Array(this.capacity).fill(null).map(() => []);
        this.size    = 0;
        for (const key in obj) {
            this.set(key, obj[key]);
        }
    }
}

export default ParkingHashMap;
