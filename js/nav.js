/**
 * nav.js — Shared utility: live clock + mobile sidebar toggle
 * Loaded as a regular script (<script src>), not a module.
 *
 * Course Outcome 4: JavaScript Interactivity & DOM
 *   - DOM Manipulation (sidebar.classList.toggle, element selection)
 *   - Event handling (click listeners on buttons and links)
 *   - Timing & Execution (setInterval for live clock)
 */
(function () {    // Course Outcome 4: Timing & setInterval for continuous updates    // ── Live clock ──────────────────────────────────────────
    const clockEl = document.getElementById('liveClock');
    function tick() {
        if (clockEl) {
            const now = new Date();
            clockEl.textContent = now.toLocaleTimeString('en-IN', { hour12: false });
        }
    }
    tick();
    setInterval(tick, 1000);
    // Course Outcome 4: Event handling (click listeners), classList manipulation    // ── Mobile sidebar toggle ──────────────────────────────
    const btn     = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    if (btn && sidebar) {
        btn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });
        // Close sidebar when a nav link is clicked
        sidebar.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', () => sidebar.classList.remove('mobile-open'));
        });
    }
})();
