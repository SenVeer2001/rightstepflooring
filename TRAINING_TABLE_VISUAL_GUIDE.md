# Training Courses Table View - Visual Guide

## Desktop Table Layout

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Training Courses                                                    [+ Add Course] │
└─────────────────────────────────────────────────────────────────────────────────┘

[Search input] [All Categories ▼] [All Status ▼]

┌─────────────────────────────────────────────────────────────────────────────────┐
│ Course Name        │ Category    │ Subcategory │ Questions │ Marks │ Status │ Act.│
├─────────────────────────────────────────────────────────────────────────────────┤
│ Basic Python       │ Programming │ Beginner    │    12     │   100  │ Draft  │👁 ✎ 🗑│
│ Intro to Python... │             │             │           │        │   ▼    │   │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Web Development    │ Web         │ Frontend    │    25     │   250  │Publish│👁 ✎ 🗑│
│ Learn HTML CSS ... │             │             │           │        │   ▼    │   │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Advanced JS        │ Programming │ Advanced    │    18     │   180  │ Draft  │👁 ✎ 🗑│
│ Master JavaScript..│             │             │           │        │   ▼    │   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Mobile Card Layout

```
┌──────────────────────────────────┐
│ Course Name                      │
│                                  │
│ Course Name                      │
│ Basic Python                     │
│                                  │
│ Category        │ Subcategory    │
│ Programming     │ Beginner       │
│                                  │
│ Questions       │ Marks          │
│ 12              │ 100            │
│                                  │
│ Status                           │
│ [Draft    ▼ ]                    │
│                                  │
│ [View] [Edit] [Delete]           │
└──────────────────────────────────┘
```

---

## Status Dropdown States

### Draft Status
```
┌─────────────────┐
│ Draft   ▼       │ ← Yellow background
│ ─────────────── │
│ Draft           │
│ Published       │
└─────────────────┘
```

### Published Status
```
┌─────────────────┐
│ Published ▼     │ ← Green background
│ ─────────────── │
│ Draft           │
│ Published       │
└─────────────────┘
```

---

## Features Breakdown

### 1. Search Box
```
[🔍 Search courses...        ]
- Search by course name
- Search by description
```

### 2. Filter Dropdowns
```
[All Categories ▼]  [All Status ▼]
- Filter by category
- Filter by status (Draft/Published)
```

### 3. Course Row (Desktop)
```
Course Name             Category       Subcategory    Q    M   Status   Actions
└─ Description line     └─ Category    └─ Subcategory │    │   └─ ▼    └─👁 ✎ 🗑
```

### 4. Status Dropdown
```
Dynamic color-coded status selector
- Draft:      Yellow/Orange
- Published:  Green

✅ One-click status changes
✅ Immediate visual feedback
```

### 5. Action Icons (Desktop)
```
👁  → View course details
✎   → Edit course
🗑  → Delete course
```

### 6. Action Buttons (Mobile)
```
[👁 View]  [✎ Edit]  [🗑 Delete]
Blue       Gray      Red
```

---

## Interactions

### Changing Status

**Desktop:**
```
User clicks dropdown ↓
Select new status ↓
Status updates immediately ↓
Color changes in real-time
```

**Mobile:**
```
User taps dropdown ↓
Select new status ↓
Status updates immediately ↓
Color changes in real-time
```

### View Course
```
User clicks/taps View (👁) ↓
Navigate to course view page
```

### Edit Course
```
User clicks/taps Edit (✎) ↓
Navigate to course edit page
```

### Delete Course
```
User clicks/taps Delete (🗑) ↓
Remove course from table ↓
Table updates immediately
```

---

## Responsive Breakpoints

### Tablet (md: 768px)
- Table switches from full to partial visible columns
- Action buttons remain icon-only
- Status dropdown compact

### Mobile (below md: 768px)
- Full card layout
- All fields visible vertically
- Full-width buttons with labels
- Status dropdown spans full width

### Mobile XS (below 320px)
- Optimized padding
- Smaller text
- Compact button sizes
- Touch-friendly spacing

---

## Color Coding

### Status Colors
```
Draft       : #FBBF24 (Yellow) - bg-yellow-100 text-yellow-700
Published   : #10B981 (Green)  - bg-green-100 text-green-700
```

### Action Button Colors
```
View (Eye)  : #3B82F6 (Blue)   - text-blue-600 hover:bg-blue-100
Edit        : #4B5563 (Gray)   - text-gray-600 hover:bg-gray-200
Delete      : #EF4444 (Red)    - text-red-600 hover:bg-red-100
```

### Hover Effects
```
Row hover     : Light gray background (hover:bg-gray-50)
Button hover  : Darker background color
Status hover  : Standard select styling
```

---

## Data Display

### Per Row Information

```
Course Name
├─ Full name displayed
└─ Description preview (line-clamp-1)

Category
├─ Course category name
└─ Single cell

Subcategory
├─ Course subcategory name
└─ Single cell

Questions
├─ Total question count
├─ Centered alignment
└─ Bold text

Marks
├─ Total marks
├─ Centered alignment
└─ Bold text

Status
├─ Current status (Draft/Published)
├─ Color-coded
└─ Dropdown for changes

Actions
├─ View icon/button
├─ Edit icon/button
└─ Delete icon/button
```

---

## Accessibility Features

✅ **Semantic HTML**
- Proper table structure
- Clear labels and headers

✅ **Keyboard Navigation**
- Tab through interactive elements
- Enter/Space to activate buttons
- Arrow keys in dropdowns

✅ **Screen Readers**
- Proper heading hierarchy
- Descriptive button titles
- Status color meaning not solely relied upon

✅ **Touch Friendly**
- Mobile layout optimized
- 44px minimum button size
- Adequate spacing between elements

---

## Performance

✅ **Optimized Rendering**
- Virtual scrolling ready
- Efficient state updates
- Smooth transitions

✅ **Responsive Design**
- Mobile-first approach
- Progressive enhancement
- CSS media queries

✅ **User Experience**
- Quick status changes
- Immediate visual feedback
- Smooth animations

---

## State Management

```typescript
// Course state
const [courses, setCourses] = useState<Course[]>()

// Search & Filter state
const [searchTerm, setSearchTerm] = useState('')
const [filterCategory, setFilterCategory] = useState('')
const [filterStatus, setFilterStatus] = useState('')

// Filtering logic
const filteredCourses = courses.filter(...)

// Update handlers
const handleStatusChange = () => {...}
const handleDelete = () => {...}
```

---

## Summary

The table view provides:

📊 **Better Data Overview**
- All course information in one view
- Easy comparison between courses
- Efficient space utilization

⚡ **Faster Management**
- Quick status changes
- One-click actions
- No page navigation needed

📱 **Mobile Friendly**
- Responsive layout
- Touch-optimized
- Card format on small screens

✅ **Professional Look**
- Clean table design
- Color-coded status
- Intuitive controls

🎯 **User-Focused**
- Clear information hierarchy
- Easy to search and filter
- Immediate feedback

---

All features are production-ready! 🚀
