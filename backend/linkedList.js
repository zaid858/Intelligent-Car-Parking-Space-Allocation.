/**
 * =============================================================
 * BACKEND MODULE: Doubly Linked List
 * =============================================================
 * Purpose  : Efficient O(1) append and O(n) traversal
 *            for the activity log (newest-first or full history).
 * Algorithm: Doubly Linked List with head/tail pointers
 * Used by  : ParkingSystem (activityLog)
 * =============================================================
 */

// ─── Node class ───────────────────────────────────────────────
class ListNode {
    /**
     * @param {object} data - Any payload (log entry, etc.)
     */
    constructor(data) {
        this.data = data;
        this.next = null; // pointer to the next (newer) node
        this.prev = null; // pointer to the previous (older) node
    }
}

// ─── Doubly Linked List ────────────────────────────────────────
class ActivityLinkedList {
    constructor() {
        this.head = null; // oldest entry
        this.tail = null; // newest entry
        this.size = 0;
    }

    // ─── Core operations ──────────────────────────────────────

    /**
     * Append a log entry to the TAIL (newest end).
     * Time complexity: O(1)
     * @param {object} data - Log entry payload
     */
    add(data) {
        const newNode = new ListNode(data);

        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.prev   = this.tail;
            this.tail.next = newNode;
            this.tail      = newNode;
        }

        this.size++;
    }

    /**
     * Retrieve the N most recent entries by traversing from TAIL.
     * Time complexity: O(n) where n = limit
     * @param {number} limit - Max number of entries to return
     * @returns {Array<object>} Most recent entries, newest first
     */
    getRecent(limit = 10) {
        const result = [];
        let current  = this.tail;

        while (current && result.length < limit) {
            result.push(current.data);
            current = current.prev;
        }

        return result;
    }

    /**
     * Retrieve ALL entries from HEAD to TAIL (oldest to newest).
     * Time complexity: O(n)
     * @returns {Array<object>}
     */
    getAll() {
        const result = [];
        let current  = this.head;

        while (current) {
            result.push(current.data);
            current = current.next;
        }

        return result;
    }

    /**
     * Clear the entire list. O(1) — just nulls head and tail.
     */
    clear() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    /**
     * Serialize list to a plain array for localStorage.
     * @returns {Array<object>}
     */
    toJSON() {
        return this.getAll();
    }

    /**
     * Restore list from a serialized array.
     * @param {Array<object>} arr
     */
    fromJSON(arr) {
        this.clear();
        if (Array.isArray(arr)) {
            arr.forEach(item => this.add(item));
        }
    }
}

export default ActivityLinkedList;
