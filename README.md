# Intelligent Car Parking Space Allocation System

A full-stack web application for managing parking slots using advanced data structures and algorithms. Built with vanilla JavaScript, HTML5, CSS3, and optimized backend algorithms including HashMap, LinkedList, Quick Sort, and Binary Search.

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

---

## 📚 Course Outcomes Covered

### **CO1: Internet Fundamentals, HTML & Introductory CSS Styling**
- ✅ HTML document structure with semantic markup
- ✅ HTML headings, paragraphs, and links
- ✅ CSS syntax and core selectors
- ✅ Typography essentials and color representations
- ✅ Foundational spacing (padding, margin, border)

### **CO2: HTML Forms, Semantic Tags & Comprehensive CSS Layouts**
- ✅ HTML form elements and input types with validation
- ✅ Semantic HTML tags (`<header>`, `<nav>`, `<main>`, `<section>`)
- ✅ Advanced CSS selectors and layouts (Flexbox, CSS Grid)
- ✅ CSS transitions and animations with `@keyframes`
- ✅ Media queries for responsive design
- ✅ Theme management using CSS custom properties
- ✅ Accessibility attributes (aria-label, role)

### **CO3: JavaScript Programming Essentials**
- ✅ Basic expressions, operators, conditions, and loops
- ✅ Functions and arrow functions
- ✅ Callback functions (sorting, searching)
- ✅ Objects and object-oriented design
- ✅ Object inheritance and prototypes
- ✅ Arrays and array methods (map, filter, reduce, forEach)
- ✅ Custom data structures (HashMap, LinkedList)

### **CO4: JavaScript Interactivity & DOM**
- ✅ DOM manipulation (getElementById, createElement, innerHTML)
- ✅ Event handling (click, change, keydown listeners)
- ✅ Browser storage (localStorage persistence)
- ✅ Asynchronous operations with setTimeout
- ✅ Performance optimization (O(log n) search algorithms)

### **CO5: Advanced Web Development & Deployment**
- ✅ ES6 modules (import/export)
- ✅ Form validation with JavaScript
- ✅ Dynamic user input handling
- ✅ SEO meta tags for deployment
- ✅ Page load optimization
- ✅ CORS-ready architecture

---

## ✨ Key Features

### Real-Time Parking Management
- 📊 **Dashboard**: Visual grid showing slot status with live stats
- 🔍 **Smart Search**: Binary search for exact slots, linear search for partial matching
- 📋 **Activity Logs**: Complete history of all bookings and releases
- 🔄 **Sort Toolbar**: Sort slots by price, ID, or type

### Advanced Data Structures
- **HashMap**: O(1) average-case slot storage and retrieval
- **Doubly Linked List**: O(1) activity log append with head/tail traversal
- **Quick Sort**: O(n log n) average-case sorting with median-of-three pivot selection
- **Binary Search**: O(log n) exact slot lookup on sorted arrays
- **Linear Search**: O(n) flexible search on unsorted data

### Responsive & Accessible UI
- Dark, operational theme optimized for managers
- Mobile-friendly navigation with sidebar toggle
- Glass-morphism design with backdrop filters
- Full keyboard navigation support
- Live digital clock in navbar

### Data Persistence
- LocalStorage integration for seamless session persistence
- All data survives page navigation
- No backend required for demo

---

## 🏗️ Project Structure

```
Parking Slot Management System/
├── index.html                 # Main dashboard page
├── dashboard.html             # Alternative dashboard layout
├── search.html               # Search & filter page
├── logs.html                 # Activity logs page
│
├── css/
│   └── style.css             # Global styles (CSS Grid, Flexbox, Animations)
│
├── js/
│   ├── main.js               # Main dashboard controller
│   ├── dashboard.js          # Dashboard page logic
│   ├── search.js             # Search page logic
│   ├── logs.js               # Logs page logic
│   ├── nav.js                # Navbar & sidebar utilities
│   └── toast.js              # Toast notification system
│
└── backend/
    ├── parkingSystem.js      # Core system controller (integrates all DSA)
    ├── hashMap.js            # HashMap implementation
    ├── linkedList.js         # Doubly Linked List implementation
    ├── quickSort.js          # Quick Sort algorithm
    ├── binarySearch.js       # Binary & Linear Search algorithms
    └── (future: could add server)
```

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- No backend server required (uses localStorage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zaid858/Intelligent-Car-Parking-Space-Allocation.git
   cd Intelligent-Car-Parking-Space-Allocation
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   # Or use a local server:
   python -m http.server 8000
   # Then visit: http://localhost:8000
   ```

### Quick Demo

1. **Dashboard**: View all parking slots with real-time stats
2. **Book a Slot**: Click any available slot, enter plate number
3. **Release a Slot**: Click an occupied slot to free it up
4. **Search**: Find slots by ID or vehicle plate using two algorithms
5. **Sort**: Order slots by price, ID, or type
6. **View Logs**: Track all booking/release activity with timestamps

---

## 🎯 Core DSA Components

### HashMap (O(1) Slot Storage)
```javascript
// Fast access to any slot by ID
const slot = system.hashMap.get('S-07');  // O(1) lookup
system.hashMap.set('S-07', updatedSlot);  // O(1) update
```

### Doubly Linked List (O(1) Log Append)
```javascript
// Efficient activity log with head/tail pointers
system.activityLog.add(logEntry);          // O(1) append
const recent = system.activityLog.getRecent(10);  // O(10) retrieval
```

### Quick Sort (O(n log n) Sorting)
```javascript
// Sort slots with median-of-three pivot & insertion sort fallback
const sorted = system.sortedSlots('price', 'asc');  // O(n log n) avg
```

### Binary Search (O(log n) Lookup)
```javascript
// Fast exact-match on sorted data
const { slot, steps } = system.binarySearchSlot('S-07');  // O(log n)
```

### Linear Search (O(n) Flexible)
```javascript
// Partial match fallback for unsorted queries
const { results } = system.linearSearchSlots('MH123');  // O(n)
```

---

## 🎨 Technology Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **Styling** | CSS Grid, Flexbox, CSS Custom Properties |
| **UI/UX** | Glass-morphism, Dark theme, Responsive design |
| **State Management** | Singleton pattern (ParkingSystem) |
| **Data Persistence** | Browser LocalStorage API |
| **Module System** | ES6 Import/Export |
| **Icons** | Font Awesome 6.5.0 |
| **Fonts** | Inter, JetBrains Mono, Outfit |

---

## 📊 Algorithm Complexity Analysis

| Operation | Algorithm | Time | Space |
|-----------|-----------|------|-------|
| Add/Get Slot | HashMap | O(1) avg | O(n) |
| Add Log | LinkedList | O(1) | O(1) |
| Sort All | Quick Sort | O(n log n) avg | O(log n) |
| Find by ID | Binary Search | O(log n) | O(1) |
| Find by Plate | Linear Search | O(n) | O(1) |
| Get Stats | Array Methods | O(n) | O(n) |

---

## 🎮 Usage Examples

### Booking a Slot
```javascript
const result = system.bookSlot('S-07', 'MH12AB3456', 'Rahul Sharma');
if (result.success) {
    console.log('Slot booked:', result.slot);
    // Log added automatically
    // UI updated via renderGrid()
}
```

### Searching for a Slot
```javascript
// Binary Search (exact ID)
const { slot, steps } = system.binarySearchSlot('S-07');
console.log(`Found in ${steps} steps`);

// Linear Search (partial match)
const { results } = system.linearSearchSlots('MH123');
console.log(`Found ${results.length} matches`);
```

### Sorting Slots
```javascript
const byPrice = system.sortedSlots('price', 'asc');
const byType = system.sortedSlots('type', 'asc');
const byId = system.sortedSlots('id', 'desc');
```

### Getting Statistics
```javascript
const stats = system.getStats();
console.log(`Available: ${stats.available}/${stats.total}`);
console.log(`Revenue: $${stats.revenue}`);
```

---

## 🔄 Data Flow

```
User Interaction (UI)
    ↓
Event Listener (Click, Change)
    ↓
Form Validation
    ↓
ParkingSystem Method Call
    ↓
HashMap/LinkedList Operation
    ↓
localStorage.setItem() (Persistence)
    ↓
Render Functions Update DOM
    ↓
User Sees Updated UI
```

---

## 📝 Slot States & Pricing

| Type | Price | Icon | Capacity |
|------|-------|------|----------|
| **Standard** | $20/hr | 🚗 | 6 |
| **Compact** | $15/hr | 🚙 | 6 |
| **Premium** | $40/hr | ⭐ | 6 |
| **Handicap** | $10/hr | ♿ | 6 |
| **EV Charging** | $35/hr | ⚡ | 6 |

---

## 🌐 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📚 Course Integration

This project demonstrates **all five course outcomes** through practical implementation:

- **CO1**: HTML structure in `index.html`, `dashboard.html`, `search.html`
- **CO2**: Form elements in booking modals, semantic tags throughout
- **CO3**: All DSA implementations in `backend/` folder
- **CO4**: DOM manipulation and event handling in `js/` folder
- **CO5**: ES6 modules, localStorage, SEO meta tags, optimization

Every function is annotated with its corresponding course outcome.

---

## 🎓 Learning Outcomes

After studying this project, you will understand:

1. ✅ How to implement custom data structures (HashMap, LinkedList)
2. ✅ Real-world applications of classic algorithms (Binary Search, Quick Sort)
3. ✅ Full-stack JavaScript development patterns
4. ✅ CSS layouts (Grid, Flexbox) and modern styling techniques
5. ✅ Event-driven architecture and DOM manipulation
6. ✅ Performance optimization through algorithm selection
7. ✅ Responsive design and mobile-first approach
8. ✅ Code organization with ES6 modules

---

## 🐛 Known Limitations

- No multi-user support (single-user localStorage)
- No backend database (uses browser storage)
- No user authentication
- Data clears on browser cache clear
- No real payment integration

---

## 🚀 Future Enhancements

- [ ] Backend API with Node.js + Express
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication & role-based access
- [ ] Real parking camera integration
- [ ] Mobile app with React Native
- [ ] Real-time slot updates with WebSockets
- [ ] Payment gateway integration
- [ ] Analytics dashboard

---

## 📄 License

MIT License - feel free to use this project for educational purposes.

---

## 👤 Author

**Mohammad Zaid**
- GitHub: [@zaid858](https://github.com/zaid858)
- Email: mohammadzaidamaan@gmail.com

---

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Course curriculum for DSA concepts

---

## 📞 Support

For issues, questions, or suggestions:
1. Check existing [GitHub Issues](https://github.com/zaid858/Intelligent-Car-Parking-Space-Allocation/issues)
2. Create a new issue with detailed description
3. Include browser version and steps to reproduce

---

**Built with ❤️ for learning Data Structures & Algorithms**
