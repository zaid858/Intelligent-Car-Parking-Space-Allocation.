/**
 * logs.js — Activity Logs Page Controller
 *
 * DSA integration:
 *  ┌────────────────────────────────────────────────────────────┐
 *  │  system.getAllLogs() → LinkedList head→tail traversal O(n) │
 *  │  system.activityLog.clear() → O(1) list reset             │
 *  └────────────────────────────────────────────────────────────┘
 */

import ParkingSystem from '../backend/parkingSystem.js';
import { showToast } from './toast.js';

const system = new ParkingSystem();

// ─── DOM ───────────────────────────────────────────────────────
const logTableBody = document.getElementById('logTableBody');
const logEmpty     = document.getElementById('logEmpty');
const logFilter    = document.getElementById('logFilter');
const clearLogsBtn = document.getElementById('clearLogsBtn');
const logTotal     = document.getElementById('logTotal');
const logBooked    = document.getElementById('logBooked');
const logReleased  = document.getElementById('logReleased');

// ─── Render ────────────────────────────────────────────────────
function renderLogs() {
    // getAllLogs() does head→tail traversal (oldest first).
    // reverse() so we see newest first.
    const all     = system.getAllLogs().reverse();
    const filter  = logFilter.value;
    const display = filter ? all.filter(l => l.action === filter) : all;

    // ── Stats ──
    const booked   = all.filter(l => l.action === 'Booked').length;
    const released = all.filter(l => l.action === 'Released').length;
    logTotal.textContent    = all.length;
    logBooked.textContent   = booked;
    logReleased.textContent = released;

    // ── Empty state ──
    if (display.length === 0) {
        logTableBody.innerHTML = '';
        logEmpty.style.display = 'flex';
        return;
    }
    logEmpty.style.display = 'none';

    // ── Table rows ──
    logTableBody.innerHTML = display.map((log, i) => {
        const isBooked = log.action === 'Booked';
        const color    = isBooked ? 'var(--primary)' : 'var(--accent)';
        const icon     = isBooked ? '🔒' : '🔓';
        const duration = (log.duration !== undefined && log.duration !== null)
            ? `${log.duration} min`
            : '—';

        // Slot type from system
        const slot = system.getSlot(log.slotId);   // O(1) HashMap lookup
        const type = slot ? slot.type : '—';

        return `
            <tr>
                <td style="color:var(--text-muted); font-family:'JetBrains Mono',monospace; font-size:0.72rem;">
                    ${display.length - i}
                </td>
                <td>
                    <span style="display:inline-flex; align-items:center; gap:0.4rem; font-weight:600; color:${color};">
                        ${icon} ${log.action}
                    </span>
                </td>
                <td style="font-family:'JetBrains Mono',monospace; font-weight:600;">${log.slotId}</td>
                <td style="color:var(--text-dim);">${type}</td>
                <td style="font-family:'JetBrains Mono',monospace; color:var(--warning);">${log.carNumber || '—'}</td>
                <td style="color:var(--text-dim);">${log.owner || '—'}</td>
                <td style="color:var(--text-muted); font-size:0.78rem;">${log.date || '—'}</td>
                <td style="color:var(--text-muted); font-family:'JetBrains Mono',monospace; font-size:0.78rem;">${log.time}</td>
                <td style="color:var(--text-muted); font-size:0.78rem;">${duration}</td>
            </tr>
        `;
    }).join('');
}

// ─── Clear Logs ────────────────────────────────────────────────
clearLogsBtn.addEventListener('click', () => {
    if (!confirm('Clear all activity logs? Slot bookings will remain intact.')) return;

    system.activityLog.clear();               // O(1) — just nulls head and tail
    localStorage.setItem('parkx_logs', '[]'); // persist the empty list

    showToast('Activity log cleared.', 'info');
    renderLogs();
});

// ─── Filter ────────────────────────────────────────────────────
logFilter.addEventListener('change', renderLogs);

// ─── Init ──────────────────────────────────────────────────────
renderLogs();
