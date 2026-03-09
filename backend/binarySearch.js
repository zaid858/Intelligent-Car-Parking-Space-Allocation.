/**
 * =============================================================
 * BACKEND MODULE: Binary Search & Linear Search
 * =============================================================
 * Purpose  : Slot lookup algorithms used by the Search page.
 *
 * Binary Search  — O(log n)  — exact slot ID on a sorted array
 * Linear Search  — O(n)      — partial match on any field (fallback)
 *
 * Used by  : ParkingSystem.binarySearchSlot()
 *            ParkingSystem.linearSearchSlots()
 * =============================================================
 */

// ─── Binary Search ─────────────────────────────────────────────

/**
 * Classic iterative Binary Search.
 * REQUIRES the input array to be sorted by 'id' field (ascending).
 * Time complexity: O(log n)
 *
 * @param {Array<object>} sortedSlots - Slots sorted by ID string
 * @param {string}        targetId    - The slot ID to find (e.g. 'S-07')
 * @returns {{ index: number, slot: object|null, steps: number }}
 *   - index : position in array (-1 if not found)
 *   - slot  : the matching slot object (null if not found)
 *   - steps : number of comparisons made
 */
export function binarySearchById(sortedSlots, targetId) {
    let low   = 0;
    let high  = sortedSlots.length - 1;
    let steps = 0;

    while (low <= high) {
        steps++;
        const mid    = Math.floor((low + high) / 2);
        const midVal = sortedSlots[mid].id;

        if (midVal === targetId) {
            return { index: mid, slot: sortedSlots[mid], steps };
        } else if (midVal < targetId) {
            low = mid + 1;   // target is in the RIGHT half
        } else {
            high = mid - 1;  // target is in the LEFT half
        }
    }

    return { index: -1, slot: null, steps };
}

// ─── Linear Search ─────────────────────────────────────────────

/**
 * Linear Search (brute-force) — works on UNSORTED arrays.
 * Supports partial matching on slot ID or vehicle plate number.
 * Time complexity: O(n)
 *
 * @param {Array<object>} slots - Any slot array
 * @param {string}        query - Search string (checked against id and carNumber)
 * @returns {{ results: Array<object>, steps: number }}
 */
export function linearSearch(slots, query) {
    const q       = query.trim().toUpperCase();
    const results = [];
    let   steps   = 0;

    for (const slot of slots) {
        steps++;
        const matchId  = slot.id.toUpperCase().includes(q);
        const matchCar = slot.carNumber && slot.carNumber.toUpperCase().includes(q);

        if (matchId || matchCar) {
            results.push(slot);
        }
    }

    return { results, steps };
}
