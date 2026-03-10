/**
 * =============================================================
 * BACKEND MODULE: Quick Sort
 * =============================================================
 * Course Outcome 3: JavaScript Programming Essentials
 *   - Functions and recursive algorithms
 *   - Callback functions (compareFn for custom sorting)
 *   - Array manipulation and in-place modifications
 *
 * Purpose  : Sort an array of slot objects by any field.
 * Algorithm: In-place Quick Sort with:
 *   - Median-of-Three pivot selection  → reduces worst-case
 *   - Insertion Sort fallback          → fast on tiny sub-arrays
 * Average time complexity: O(n log n)
 * Worst case:             O(n²)  [rare with median-of-three]
 * Used by  : Dashboard sort toolbar, Search page sort
 * =============================================================
 */

// Course Outcome 3: Callback functions, Functions, Array manipulation
/**
 * Choose a pivot using the Median-of-Three heuristic.
 * Reduces worst-case likelihood on already-sorted data.
 * @param {Array}    arr
 * @param {number}   low
 * @param {number}   high
 * @param {Function} compareFn
 */
function medianOfThree(arr, low, high, compareFn) {
    const mid = Math.floor((low + high) / 2);

    if (compareFn(arr[low], arr[mid]) > 0)  [arr[low],  arr[mid]]  = [arr[mid],  arr[low]];
    if (compareFn(arr[low], arr[high]) > 0)  [arr[low],  arr[high]] = [arr[high], arr[low]];
    if (compareFn(arr[mid], arr[high]) > 0)  [arr[mid],  arr[high]] = [arr[high], arr[mid]];

    // Place pivot just before high for Lomuto partition
    [arr[mid], arr[high - 1]] = [arr[high - 1], arr[mid]];
    return arr[high - 1];
}

// Course Outcome 3: Functions, Conditions, Array destructuring
/**
 * Lomuto partition scheme.
 * Moves elements <= pivot to the left, > pivot to the right.
 * @returns {number} final pivot index
 */
function partition(arr, low, high, compareFn) {
    const pivot = arr[high];
    let   i     = low - 1;

    for (let j = low; j < high; j++) {
        if (compareFn(arr[j], pivot) <= 0) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}

// Course Outcome 3: Loops, Conditions, Array access patterns
/**
 * Insertion sort — used as a base-case for tiny sub-arrays (< 10 elements).
 * Outperforms Quick Sort at very small array sizes due to low overhead.
 */
function insertionSort(arr, low, high, compareFn) {
    for (let i = low + 1; i <= high; i++) {
        const key = arr[i];
        let   j   = i - 1;
        while (j >= low && compareFn(arr[j], key) > 0) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

/**
 * Recursive Quick Sort implementation.
 * @param {Array}    arr
 * @param {number}   low
 * @param {number}   high
 * @param {Function} compareFn - (a, b) => number  (like Array.sort callback)
 */
function quickSortRecursive(arr, low, high, compareFn) {
    if (low < high) {
        // Fallback to insertion sort on tiny sub-arrays
        if (high - low < 10) {
            insertionSort(arr, low, high, compareFn);
            return;
        }

        medianOfThree(arr, low, high, compareFn);
        const pivotIndex = partition(arr, low, high, compareFn);

        quickSortRecursive(arr, low,           pivotIndex - 1, compareFn);
        quickSortRecursive(arr, pivotIndex + 1, high,          compareFn);
    }
}

// ─── Public API ────────────────────────────────────────────────

/**
 * Sort an array of parking slots by a given field.
 * Returns a NEW sorted array (does NOT mutate input).
 *
 * @param {Array<object>} slots     - Array of slot objects
 * @param {string}        field     - Field to sort by: 'price' | 'id' | 'type'
 * @param {'asc'|'desc'}  direction - Sort direction
 * @returns {Array<object>} sorted copy
 */
export function sortSlots(slots, field = 'price', direction = 'asc') {
    const copy = [...slots]; // non-destructive copy

    const compareFn = (a, b) => {
        const valA = typeof a[field] === 'string'
            ? a[field].localeCompare(b[field])
            : a[field] - b[field];
        return direction === 'asc' ? valA : -valA;
    };

    if (copy.length > 1) {
        quickSortRecursive(copy, 0, copy.length - 1, compareFn);
    }

    return copy;
}
