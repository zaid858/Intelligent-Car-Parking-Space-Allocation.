/**
 * toast.js — Shared Toast Utility
 * Provides showToast(message, type) for all pages.
 * Exported as ES module.
 *
 * Course Outcome 4: JavaScript Interactivity & DOM
 *   - DOM Manipulation (creating toast elements dynamically)
 *   - Event handling (animationend listener)
 *   - Timing and async operations (setTimeout for auto-dismiss)
 *
 * Course Outcome 5: ES6 Modules
 *   - Export/import ES6 module for reusable notification system
 */

/**
 * Display a toast notification.
 * 
 * Course Outcome 4: DOM Manipulation (createElement, appendChild, classList)
 * Course Outcome 4: Timing (setTimeout) & Event handling (animationend)
 * 
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 * @param {number} duration - ms before auto-dismiss (default: 3500)
 */
export function showToast(message, type = 'info', duration = 3500) {
    const wrap = document.getElementById('toast-wrap');
    if (!wrap) return;

    const iconMap = {
        success: 'fa-circle-check',
        error:   'fa-circle-xmark',
        info:    'fa-circle-info',
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fas ${iconMap[type] || iconMap.info}"></i> ${message}`;
    wrap.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        toast.addEventListener('animationend', () => toast.remove());
    }, duration);
}
