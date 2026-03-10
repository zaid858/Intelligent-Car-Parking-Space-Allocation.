/**
 * search.js — Search & Sort Page Controller
 *
 * Backend uses:
 *   - Hash Map  : slot storage (O(1) lookup)
 *   - Linear Search : full-field query
 *   - Binary Search : exact slot ID lookup
 *   - Quick Sort    : slot ordering
 */

import ParkingSystem from '../DSA/parkingSystem.js';
import { showToast } from './toast.js';

const system = new ParkingSystem();

// ─── DOM ───────────────────────────────────────────────────────
const searchInput  = document.getElementById('searchInput');
const algoSelect   = document.getElementById('algoSelect');
const searchBtn    = document.getElementById('searchBtn');
const clearBtn     = document.getElementById('clearBtn');
const sortField    = document.getElementById('sortField');
const sortDir      = document.getElementById('sortDir');
const sortBtn      = document.getElementById('sortBtn');
const resultGrid   = document.getElementById('resultGrid');
const resultMeta   = document.getElementById('resultMeta');
const metaCount    = document.getElementById('metaCount');
const metaStatus   = document.getElementById('metaStatus');

// ─── Rendering ─────────────────────────────────────────────────
/**
 * Build one slot card. Highlight the matching text part if provided.
 */
function slotCardHTML(slot, query = '') {
    const isOccupied = slot.status === 'occupied';
    const q = query.trim().toUpperCase();

    // Highlight slot ID if query is in it
    let idDisplay = slot.id;
    if (q && slot.id.toUpperCase().includes(q)) {
        idDisplay = slot.id.replace(
            new RegExp(q.replace(/[-]/g, '\\$&'), 'gi'),
            m => `<mark style="background:rgba(99,102,241,0.35);color:var(--primary);border-radius:2px;padding:0 1px;">${m}</mark>`
        );
    }

    return `
        <div class="slot-card ${slot.status}" style="cursor:default;" title="${slot.id} · ${slot.type} · ${slot.status}">
            <span class="slot-number">${idDisplay}</span>
            <span class="slot-icon">${slot.icon}</span>
            <span class="slot-type-badge">${slot.type}</span>
            <span class="slot-price">$${slot.price}/hr</span>
            ${isOccupied
                ? `<span class="slot-car-tag" title="${slot.carNumber}">🚘 ${slot.carNumber}</span>`
                : '<div class="slot-avail-dot"></div>'}
        </div>
    `;
}

// Course Outcome 4: DOM Manipulation (innerHTML, grid generation)
/**
 * Render slots into the result grid.
 */
function renderResults(slots, query = '') {
    if (!slots?.length) {
        resultGrid.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1;">
                <i class="fas fa-magnifying-glass"></i>
                <p>No matching slots found.</p>
            </div>`;
        return;
    }
    resultGrid.innerHTML = slots.map(s => slotCardHTML(s, query)).join('');
}

// Course Outcome 4: DOM & Events - Update UI based on search results
/**
 * Show the result summary bar.
 */
function showMeta(count, status = '') {
    resultMeta.style.display = 'flex';
    metaCount.textContent  = `${count} result${count !== 1 ? 's' : ''} found`;
    metaStatus.textContent = status;
}

// ─── Initial View ──────────────────────────────────────────────
function showAll() {
    renderResults(system.getAllSlots());
    resultMeta.style.display = 'none';
}

// Course Outcome 3: Conditions, Functions
// Course Outcome 4 & 5: Form validation & Search API integration
function performSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        showToast('Enter a slot ID or car plate to search.', 'error');
        return;
    }

    const algo  = algoSelect.value;
    const total = system.getAllSlots().length;

    if (algo === 'binary') {
        // Exact ID lookup via Binary Search (backend)
        const { slot } = system.binarySearchSlot(query.toUpperCase());

        if (slot) {
            renderResults([slot], query);
            showMeta(1, `Exact match: ${slot.id}`);
            showToast(`Slot ${slot.id} found!`, 'success');
        } else {
            renderResults([], query);
            showMeta(0, 'No exact match — try Search All Fields');
            showToast(`Slot "${query}" not found. Use exact format e.g. S-07.`, 'error');
        }
    } else {
        // Partial match on ID or car plate via Linear Search (backend)
        const { results } = system.linearSearchSlots(query);
        showMeta(results.length, results.length > 0 ? `Matched on ID or plate` : 'No matches');

        renderResults(results, query);
        if (results.length > 0) {
            showToast(`Found ${results.length} result(s).`, 'success');
        } else {
            showToast(`No slots matched "${query}".`, 'error');
        }
    }
}
// Course Outcome 3: Callback functions (arrow functions)
// Course Outcome 4: Event handling & DOM updates// ─── Sort ─────────────────────────────────────────────────────
sortBtn.addEventListener('click', () => {
    const field  = sortField.value;
    const dir    = sortDir.value;
    const sorted = system.sortedSlots(field, dir);
    renderResults(sorted);
    searchInput.value = '';
    const dirLabel = dir === 'asc' ? '↑' : '↓';
    showMeta(sorted.length, `Sorted by ${field} ${dirLabel}`);
    showToast(`Sorted ${sorted.length} slots by ${field}.`, 'info');
});
// Course Outcome 4: Event handling - KeyUp, Click events// ─── Events ────────────────────────────────────────────────────
searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') performSearch(); });
clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    showAll();
});

// ─── Init ──────────────────────────────────────────────────────
showAll();
