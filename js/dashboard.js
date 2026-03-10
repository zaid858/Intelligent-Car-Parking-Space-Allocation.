/**
 * dashboard.js — Main Dashboard Controller
 *
 * DSA integrations:
 *  ┌─────────────────────────────────────────────────────────┐
 *  │  HashMap      → O(1) slot get/set via system.getSlot()  │
 *  │  Quick Sort   → Sort toolbar via system.sortedSlots()   │
 *  │  LinkedList   → Recent logs via system.getRecentLogs()  │
 *  └─────────────────────────────────────────────────────────┘
 */

// Course Outcome 5: ES6 modules - Import and modular design
import ParkingSystem from '../backend/parkingSystem.js';
import { showToast } from './toast.js';

// ─── System (Singleton, persists to localStorage) ──────────────
const system = new ParkingSystem(30);

// Course Outcome 4: DOM Manipulation & Event handling
// ─── DOM refs ──────────────────────────────────────────────────
const slotGrid      = document.getElementById('slotGrid');
const sidebarLogs   = document.getElementById('sidebarLogs');
const typeBreakdown = document.getElementById('typeBreakdown');

// Stats
const statTotal      = document.getElementById('statTotal');
const statAvail      = document.getElementById('statAvail');
const statAvailPct   = document.getElementById('statAvailPct');
const statOccupied   = document.getElementById('statOccupied');
const statOccupiedPct= document.getElementById('statOccupiedPct');
const statRevenue    = document.getElementById('statRevenue');

// Toolbar
const sortSelect   = document.getElementById('sortSelect');
const filterSelect = document.getElementById('filterSelect');
const typeFilter   = document.getElementById('typeFilter');
const resetAll     = document.getElementById('resetAll');

// Booking modal
const bookingModal    = document.getElementById('bookingModal');
const modalTitle      = document.getElementById('modalTitle');
const bookingSlotInfo = document.getElementById('bookingSlotInfo');
const plateInput      = document.getElementById('plateInput');
const ownerInput      = document.getElementById('ownerInput');
const closeBooking    = document.getElementById('closeBooking');
const cancelBooking   = document.getElementById('cancelBooking');
const confirmBooking  = document.getElementById('confirmBooking');

// Release modal
const releaseModal    = document.getElementById('releaseModal');
const releaseSlotInfo = document.getElementById('releaseSlotInfo');
const closeRelease    = document.getElementById('closeRelease');
const cancelRelease   = document.getElementById('cancelRelease');
const confirmRelease  = document.getElementById('confirmRelease');

// ─── State ─────────────────────────────────────────────────────
let pendingSlotId = null;

// Course Outcome 3: Basic expressions, operators, and Functions (Arrow functions)
// ─── Stats render ──────────────────────────────────────────────
function renderStats() {
    const s = system.getStats();
    const availPct    = Math.round((s.available / s.total) * 100);
    const occupiedPct = 100 - availPct;

    statTotal.textContent       = s.total;
    statAvail.textContent       = s.available;
    statAvailPct.textContent    = `${availPct}%`;
    statOccupied.textContent    = s.occupied;
    statOccupiedPct.textContent = `${occupiedPct}%`;
    statRevenue.textContent     = `$${s.revenue}`;
}
// Course Outcome 3: Array methods (filter), Conditions
// Course Outcome 4: Optimize performance with Quick Sort// ─── Slot Grid render ──────────────────────────────────────────
function getFilteredSorted() {
    let slots = system.getAllSlots();

    // Status filter
    const status = filterSelect.value;
    if (status) slots = slots.filter(s => s.status === status);

    // Type filter
    const type = typeFilter.value;
    if (type) slots = slots.filter(s => s.type === type);

    // Sort via Quick Sort
    const sort = sortSelect.value;
    if (sort) {
        const [field, dir] = sort.split('-');
        // sortedSlots returns new sorted array (doesn't touch hashMap order)
        const sorted = system.sortedSlots(field, dir || 'asc');
        // Re-apply filters after sort
        return sorted.filter(s =>
            (!status || s.status === status) &&
            (!type   || s.type   === type)
        );
    }
    return slots;
}

// Course Outcome 4: DOM Manipulation (creating slot cards with HTML strings)
/**
 * Build a single slot card HTML string.
 */
function slotCardHTML(slot) {
    const isOccupied = slot.status === 'occupied';
    return `
        <div class="slot-card ${slot.status}" data-id="${slot.id}"
             role="button" tabindex="0"
             aria-label="${slot.id} ${slot.type} ${slot.status}">
            <span class="slot-number">${slot.id}</span>
            <span class="slot-icon">${slot.icon}</span>
            <span class="slot-type-badge">${slot.type}</span>
            <span class="slot-price">$${slot.price}/hr</span>
            ${isOccupied
                ? `<span class="slot-car-tag" title="${slot.carNumber}">🚘 ${slot.carNumber}</span>`
                : '<div class="slot-avail-dot"></div>'}
        </div>
    `;
}

// Course Outcome 4: DOM Manipulation, Event handling (click, keydown events)
function renderGrid() {
    const slots = getFilteredSorted();
    if (slots.length === 0) {
        slotGrid.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1;">
                <i class="fas fa-car-side"></i>
                <p>No slots match the current filter.</p>
            </div>`;
        return;
    }

    // Group by type for zone labels
    const types   = ['Standard', 'Compact', 'Premium', 'Handicap', 'EV'];
    const grouped = {};
    types.forEach(t => { grouped[t] = slots.filter(s => s.type === t); });

    let html = '';
    types.forEach(type => {
        const group = grouped[type];
        if (!group.length) return;
        html += `<div class="lot-zone-label">${group[0].icon} ${type} Zone (${group.length})</div>
                 <div class="slot-grid" style="margin-bottom:1rem;">
                 ${group.map(slotCardHTML).join('')}
                 </div>`;
    });

    slotGrid.innerHTML = html;

    // Attach event listeners to ALL slot cards
    slotGrid.querySelectorAll('.slot-card').forEach(card => {
        card.addEventListener('click', () => handleSlotClick(card.dataset.id));
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSlotClick(card.dataset.id);
            }
        });
    });
}
// Course Outcome 3: Array methods (filter, map)
// Course Outcome 4: LinkedList traversal performance// ─── Sidebar Logs ──────────────────────────────────────────────
function renderSidebarLogs() {
    // Uses LinkedList tail traversal — getRecentLogs()
    const logs = system.getRecentLogs(6);
    if (!logs.length) {
        sidebarLogs.innerHTML = `
            <div class="empty-state" style="padding:1rem 0;">
                <i class="fas fa-clock"></i>
                <p>No activity yet</p>
            </div>`;
        return;
    }
    sidebarLogs.innerHTML = logs.map(log => `
        <div class="log-entry">
            <div class="log-dot ${log.action.toLowerCase()}"></div>
            <div class="log-body">
                <div class="log-title">${log.action} · ${log.slotId}</div>
                <div class="log-meta">${log.carNumber} / ${log.owner}</div>
            </div>
            <div class="log-time">${log.time}</div>
        </div>
    `).join('');
}
// Course Outcome 3: Array methods (filter, map), Calculations
// Course Outcome 4: DOM Manipulation with dynamic content// ─── Type Breakdown ─────────────────────────────────────────────
function renderBreakdown() {
    const slots  = system.getAllSlots();
    const types  = ['Standard','Compact','Premium','Handicap','EV'];
    const icons  = ['🚗','🚙','⭐','♿','⚡'];

    typeBreakdown.innerHTML = types.map((type, i) => {
        const total    = slots.filter(s => s.type === type).length;
        const occupied = slots.filter(s => s.type === type && s.status === 'occupied').length;
        const pct      = total ? Math.round((occupied / total) * 100) : 0;
        return `
            <div style="display:flex; align-items:center; gap:0.6rem; padding:0.4rem 0; border-bottom:1px solid var(--border);">
                <span style="width:16px; text-align:center;">${icons[i]}</span>
                <span style="flex:1; font-size:0.78rem; color:var(--text-dim);">${type}</span>
                <span style="font-size:0.72rem; font-family:'JetBrains Mono',monospace; color:var(--text-muted);">${occupied}/${total}</span>
                <div style="width:50px; height:4px; border-radius:2px; background:rgba(255,255,255,0.07);">
                    <div style="width:${pct}%; height:100%; background:var(--primary); border-radius:2px;"></div>
                </div>
            </div>`;
    }).join('');
}

// ─── Full Refresh ───────────────────────────────────────────────
function refresh() {
    renderStats();
    renderGrid();
    renderSidebarLogs();
    renderBreakdown();
}

// ─── Slot Click Handler ─────────────────────────────────────────
function handleSlotClick(id) {
    // O(1) HashMap lookup
    const slot = system.getSlot(id);
    if (!slot) return;

    pendingSlotId = id;

    if (slot.status === 'available') {
        // ── Book ──
        modalTitle.textContent  = `Book ${id}`;
        bookingSlotInfo.innerHTML = `
            <strong>${slot.icon} ${slot.type} Slot — ${id}</strong><br>
            Rate: <strong style="color:var(--primary);">$${slot.price}/hr</strong>`;
        plateInput.value  = '';
        ownerInput.value  = '';
        bookingModal.classList.add('open');
        setTimeout(() => plateInput.focus(), 350);
    } else {
        // ── Release ──
        const dur = slot.parkedAt
            ? Math.floor((Date.now() - new Date(slot.parkedAt)) / 60000) + ' min'
            : '—';
        releaseSlotInfo.innerHTML = `
            <strong>${slot.icon} ${slot.type} — ${id}</strong><br>
            Plate: <strong>${slot.carNumber}</strong> &nbsp;·&nbsp;
            Owner: <strong>${slot.ownerName}</strong><br>
            Parked since: <strong>${new Date(slot.parkedAt).toLocaleTimeString()}</strong>
            &nbsp;(${dur})`;
        releaseModal.classList.add('open');
    }
}

// ─── Modal Events ───────────────────────────────────────────────
// BOOKING
confirmBooking.addEventListener('click', () => {
    const plate = plateInput.value.trim();
    if (!plate) {
        showToast('Please enter a vehicle plate number.', 'error');
        plateInput.focus();
        return;
    }
    const result = system.bookSlot(pendingSlotId, plate, ownerInput.value.trim() || 'Guest');
    if (result.success) {
        bookingModal.classList.remove('open');
        showToast(`✅ Slot ${pendingSlotId} booked! (${plate})`, 'success');
        refresh();
    } else {
        showToast(result.message, 'error');
    }
});

[closeBooking, cancelBooking].forEach(el => {
    el.addEventListener('click', () => bookingModal.classList.remove('open'));
});

// RELEASE
confirmRelease.addEventListener('click', () => {
    const result = system.releaseSlot(pendingSlotId);
    if (result.success) {
        releaseModal.classList.remove('open');
        showToast(`🔓 Slot ${pendingSlotId} is now available.`, 'success');
        refresh();
    } else {
        showToast(result.message, 'error');
    }
});

[closeRelease, cancelRelease].forEach(el => {
    el.addEventListener('click', () => releaseModal.classList.remove('open'));
});

// Close on backdrop click
[bookingModal, releaseModal].forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

// ESC key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        bookingModal.classList.remove('open');
        releaseModal.classList.remove('open');
    }
});

// ─── Toolbar Listeners ──────────────────────────────────────────
sortSelect.addEventListener('change', renderGrid);
filterSelect.addEventListener('change', renderGrid);
typeFilter.addEventListener('change', renderGrid);

// RESET
resetAll.addEventListener('click', () => {
    if (!confirm('Reset all slots to empty state? All bookings and logs will be cleared.')) return;
    system.reset(30);
    showToast('System reset to factory defaults.', 'info');
    refresh();
});

// ─── Init ───────────────────────────────────────────────────────
refresh();
