// Course Outcome 5: ES6 modules
import ParkingSystem from '../DSA/parkingSystem.js';

// Course Outcome 4: DOM Manipulation - document.getElementById for element selection
// Initialize the system
const system = new ParkingSystem(20);

// DOM Elements
const parkingGrid = document.getElementById('parking-grid');
const logList = document.getElementById('log-list');
const modalOverlay = document.getElementById('modal-overlay');
const carNumberInput = document.getElementById('car-number');
const confirmBookingBtn = document.getElementById('confirm-booking');
const closeModalBtn = document.getElementById('close-modal');
const modalTitle = document.getElementById('modal-title');
const totalSlotsEl = document.getElementById('total-slots-count');
const availableSlotsEl = document.getElementById('available-slots-count');
const occupiedSlotsEl = document.getElementById('occupied-slots-count');
const sortFilter = document.getElementById('sort-filter');
const carSearch = document.getElementById('car-search');

let currentSlotId = null;

// Course Outcome 4: DOM Manipulation & Event handling
/**
 * Update the UI stats
 */
function updateStats() {
    const slots = system.hashMap.getAllAsArray();
    const available = slots.filter(s => s.status === 'available').length;
    const occupied = slots.filter(s => s.status === 'occupied').length;

    totalSlotsEl.textContent = slots.length;
    availableSlotsEl.textContent = available;
    occupiedSlotsEl.textContent = occupied;
}

// Course Outcome 4: DOM Manipulation (createElement, innerHTML), Loops
/**
 * Render the parking grid
 */
function renderGrid(slots = null) {
    const displaySlots = slots || system.hashMap.getAllAsArray();
    parkingGrid.innerHTML = '';

    displaySlots.forEach(slot => {
        const slotDiv = document.createElement('div');
        slotDiv.className = `slot glass-container ${slot.status}`;
        slotDiv.dataset.id = slot.id;

        slotDiv.innerHTML = `
            <div class="slot-icon">
                <i class="fas ${slot.status === 'available' ? 'fa-square' : 'fa-car'} fa-3x"></i>
            </div>
            <span class="slot-id">${slot.id}</span>
            <span class="slot-price">$${slot.price}</span>
            <span class="slot-status">${slot.status}</span>
        `;

        slotDiv.addEventListener('click', () => handleSlotClick(slot));
        parkingGrid.appendChild(slotDiv);
    });
}

// Course Outcome 4: DOM Manipulation, Array methods (forEach)
/**
 * Render activity logs
 * Uses LinkedList traversal
 */
function renderLogs() {
    const logs = system.activityLog.getRecent(15);
    if (logs.length === 0) return;

    logList.innerHTML = '';
    logs.forEach(log => {
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        logItem.innerHTML = `
            <div class="log-header">
                <span class="log-action" style="color: ${log.action === 'Booked' ? 'var(--primary)' : 'var(--accent)'}">
                    ${log.action}
                </span>
                <span class="log-time">${log.time}</span>
            </div>
            <div class="log-details">
                Slot ${log.slotId} - Plate: ${log.carNumber}
            </div>
        `;
        logList.appendChild(logItem);
    });
}

// Course Outcome 4: Event handling (user interactions)
// Course Outcome 5: Form validation with JavaScript
/**
 * Handle Slot Click
 */
function handleSlotClick(slot) {
    if (slot.status === 'available') {
        currentSlotId = slot.id;
        modalTitle.textContent = `Book Slot ${slot.id}`;
        carNumberInput.value = '';
        modalOverlay.classList.add('active');
    } else {
        if (confirm(`Do you want to release slot ${slot.id}?`)) {
            const result = system.releaseSlot(slot.id);
            if (result.success) {
                updateUI();
            }
        }
    }
}

// Course Outcome 4: DOM Manipulation - Update entire UI from data changes
/**
 * Update all UI components
 */
function updateUI() {
    updateStats();
    renderGrid();
    renderLogs();
}

// Course Outcome 4: Event handling (addEventListener, click, change events)
// Course Outcome 5: Form validation & user input handling
// ── Event Listeners
confirmBookingBtn.addEventListener('click', () => {
    const carNumber = carNumberInput.value.trim();
    if (!carNumber) {
        alert('Please enter a car plate number.');
        return;
    }

    const result = system.bookSlot(currentSlotId, carNumber);
    if (result.success) {
        modalOverlay.classList.remove('active');
        updateUI();
    } else {
        alert(result.message);
    }
});

closeModalBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
});

sortFilter.addEventListener('change', (e) => {
    const val = e.target.value;
    let sortedSlots;
    if (val === 'price-asc') {
        sortedSlots = system.sortSlotsByPrice(true);
    } else if (val === 'price-desc') {
        sortedSlots = system.sortSlotsByPrice(false);
    } else {
        sortedSlots = system.hashMap.getAllAsArray();
    }
    renderGrid(sortedSlots);
});

carSearch.addEventListener('input', (e) => {
    const query = e.target.value.toUpperCase();
    if (!query) {
        renderGrid();
        return;
    }
    const filtered = system.hashMap.getAllAsArray().filter(slot => 
        slot.carNumber && slot.carNumber.toUpperCase().includes(query)
    );
    renderGrid(filtered);
});

// Initial Render
updateUI();
console.log("Intelligent Car Parking Space Allocation System Initialized with DSA Components.");
