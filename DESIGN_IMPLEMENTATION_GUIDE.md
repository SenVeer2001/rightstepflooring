# Workiz Design Implementation Guide
**Based on 30 Screenshot Analysis**

---

## 1. SCREENSHOT INVENTORY (30 Screenshots)

### Key Pages Identified:
1. **Login** - Authentication screen
2. **Dashboard** - Main overview with KPIs and charts
3. **Jobs** - Jobs list with search/filters
4. **Customers** - Customer grid/list view
5. **Technicians** - Technician management
6. **Schedule/Calendar** - Week/month calendar view
7. **Dispatch** - Map-based job assignment
8. **Invoices** - Invoice management
9. **Automation** - Workflow automation builder
10. **Reports** - Analytics and reporting
11. **Settings** - General and advanced settings
12. **Multiple modals & interaction states** - Forms, confirmations, notifications

---

## 2. CORE COLOR SCHEME

### Primary Colors:
- **Primary Blue:** `#2196F3` - Buttons, links, active states, primary actions
- **Dark Sidebar:** `#2C3E50` or `#34495E` - Navigation background
- **White:** `#FFFFFF` - Card/content backgrounds

### Status/Semantic Colors:
- **Success/Completed:** `#4CAF50` - Green indicators
- **Warning/Pending:** `#FF9800` - Orange indicators
- **Error/Cancelled:** `#F44336` - Red indicators
- **Info/In Progress:** `#2196F3` - Blue indicators
- **Secondary:** `#00BCD4` - Cyan/teal for alternates

### Neutral Colors:
- **Light Background:** `#F5F5F5` - Table headers, hover states
- **Medium Gray:** `#E0E0E0` - Borders, dividers
- **Text Primary:** `#333333` - Main text
- **Text Secondary:** `#666666` - Labels, descriptions
- **Disabled/Inactive:** `#999999` - Inactive elements

---

## 3. LAYOUT STRUCTURE

### Standard Admin Layout (All main pages):
```
┌─────────────────────────────────────────────┐
│  HEADER (60-70px) - White background        │
│  [Logo] [Breadcrumbs] [User Profile] [Bell] │
└─────────────────────────────────────────────┘
┌──────────┬──────────────────────────────────┐
│          │                                  │
│ SIDEBAR  │  MAIN CONTENT AREA               │
│ 250-280  │  (White/Light background)        │
│  pixels  │                                  │
│ Dark     │  • Forms                         │
│ Theme    │  • Tables                        │
│ Dark     │  • Cards                         │
│ Text     │  • Charts                        │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

### Sidebar Navigation:
- **Width:** 250-280px
- **Background:** Dark (#2C3E50 / #34495E)
- **Text:** White/light gray
- **Active item:** Blue left border or blue text (#2196F3)
- **Hover state:** Light background overlay
- **Icons:** 20-24px, aligned with text
- **Items:** Dashboard, Jobs, Customers, Technicians, Schedule, Dispatch, Invoices, Automation, Reports, Settings

### Header:
- **Height:** 60-70px
- **Background:** White or very light gray
- **Border-bottom:** Subtle shadow or 1px light border
- **Left:** Hamburger (mobile/collapse toggle)
- **Center:** Optional breadcrumbs
- **Right:** Notifications bell, user profile dropdown, company selector

---

## 4. DETAILED UI COMPONENT SPECIFICATIONS

### 4.1 BUTTONS
**Primary Button:**
- Background: `#2196F3`
- Text: White, 14px, semibold
- Padding: 10px 24px
- Height: 40-44px
- Border-radius: 4-6px
- Hover: Darker blue (#1976D2)
- Active: Even darker (#1565C0)
- Icons: 18px, left-aligned with 8px margin

**Secondary Button:**
- Background: White
- Border: 1px solid `#E0E0E0`
- Text: Dark gray (#333), 14px, semibold
- Padding: 10px 24px
- Hover: Light gray background (#F5F5F5)

**Danger Button:**
- Background: `#F44336`
- Text: White
- Same padding/sizing as primary
- Hover: Darker red (#D32F2F)

**Text/Link Button:**
- Background: Transparent
- Text: Blue (`#2196F3`), 14px
- Underline on hover
- No padding

### 4.2 FORM INPUTS
- **Height:** 40px
- **Padding:** 10px 12px
- **Border:** 1px solid `#E0E0E0`
- **Border-radius:** 4px
- **Font:** 14px, regular
- **Focus border:** 1px solid `#2196F3`
- **Focus shadow:** 0 0 0 3px rgba(33, 150, 243, 0.1)
- **Placeholder text:** `#999999`
- **Label:** Above input, 12px, semibold, `#333`, margin-bottom 8px
- **Required indicator:** Red asterisk (*) next to label

**Textarea:**
- Resizable
- Min-height: 100-120px
- Same styling as text inputs

**Dropdown/Select:**
- Same height/padding as text inputs
- Chevron icon on right
- White background with border
- Dropdown options styled similar to table rows

**Date Picker:**
- Same input styling
- Calendar icon on right
- Click to open calendar widget
- Calendar: Month view with date grid

**Checkbox:**
- 18x18px square
- Checked: Blue background (#2196F3), white checkmark
- Unchecked: Border (`#E0E0E0`)
- Label: 14px, to the right, clickable

**Toggle/Switch:**
- 48px wide × 24px tall
- Enabled: Blue background (#2196F3), white circle
- Disabled: Gray background (#E0E0E0), gray circle
- Smooth animation on toggle

### 4.3 CARDS
- **Background:** White
- **Border:** 1px solid `#E0E0E0` (optional)
- **Border-radius:** 4-8px
- **Padding:** 16-20px
- **Box-shadow:** 0 2px 4px rgba(0,0,0,0.1) (subtle)
- **Hover shadow:** 0 4px 8px rgba(0,0,0,0.15)
- **Margin/Spacing:** 16px between cards

### 4.4 KPI CARDS (Dashboard)
- **Height:** 140-160px
- **Width:** Responsive grid (4-5 per row on desktop)
- **Content structure:**
  ```
  ┌──────────────────────────┐
  │ [Icon in circle] [Trend] │
  │                          │
  │ Metric Name (gray, 14px) │
  │ VALUE (bold, 28px)       │
  │ Trend: +12% (green)      │
  └──────────────────────────┘
  ```
- **Icon background:** Light blue (#E3F2FD)
- **Icon:** 24px, blue (#2196F3)
- **Icon container:** 40x40px circle

### 4.5 TABLES
**Table Headers:**
- Background: `#F5F5F5`
- Text: 12-13px, semibold, `#333`
- Padding: 12px
- Border-bottom: 1px solid `#E0E0E0`
- Sortable columns: Include up/down arrow icons
- Active sort column: Arrow visible, blue color

**Table Rows:**
- Height: 48-56px
- Background alternating: White + `#F9F9F9`
- Border-bottom: 1px solid `#E0E0E0`
- Text: 14px, `#333`
- Hover background: `#F5F5F5`
- Padding: 12px

**Table Actions:**
- Right-aligned icons (eye, edit, delete, more)
- Icons: 18px, gray (#999) until hover
- Hover: Darker gray (#333)
- 3-dot menu: Standard material design

**Status Badges:**
- Padding: 6px 12px
- Border-radius: 4px
- Font: 12px, semibold, white text
- Colors:
  - Pending: `#FF9800` (orange)
  - In Progress: `#2196F3` (blue)
  - Completed: `#4CAF50` (green)
  - Cancelled/Failed: `#F44336` (red)
  - Draft: `#999999` (gray)

### 4.6 MODALS/DIALOGS
- **Background overlay:** rgba(0,0,0,0.5) - semi-transparent black
- **Modal box:** White background
- **Width:** 500-700px (depends on content)
- **Border-radius:** 8px
- **Box-shadow:** 0 8px 32px rgba(0,0,0,0.2)
- **Header:** 
  - Padding: 20px
  - Border-bottom: 1px solid `#E0E0E0`
  - Title: 18px, bold, `#333`
  - Close button (X): Top-right, gray until hover
- **Body:** 
  - Padding: 20px
  - Scrollable if content exceeds height
  - Max-height: 80vh
- **Footer:**
  - Padding: 16px 20px
  - Border-top: 1px solid `#E0E0E0`
  - Buttons: Right-aligned, 8px spacing between
  - Background: Light gray (#F9F9F9)

### 4.7 SEARCH BARS
- **Height:** 40px
- **Width:** Full width or constrained
- **Style:** Text input with icon
- **Search icon:** Left side, gray (#999), 18px
- **Clear button (X):** Right side, visible when text entered, gray until hover
- **Border:** 1px solid `#E0E0E0`
- **Focus:** Blue border + shadow (same as other inputs)
- **Placeholder:** "Search by..."

### 4.8 FILTER/DROPDOWN COMPONENTS
- **Button style:** Secondary button with funnel icon
- **Dropdown panel:** White background, below button, light shadow
- **Dropdown items:** 44px height, hover background `#F5F5F5`
- **Selected item:** Checkmark icon + blue background (`#E3F2FD`)
- **Divider:** Light gray border between groups
- **Apply/Reset buttons:** At bottom of dropdown

### 4.9 PAGINATION
- **Layout:** Bottom of table/list, right-aligned (with count on left)
- **Components:**
  - "Showing X-Y of Z"
  - Previous button (disabled if on page 1)
  - Page number buttons
  - Current page: Blue background (#2196F3), white text
  - Other pages: White background, gray border
  - Next button
- **Items per page dropdown:** Left side, "Show 10/25/50/100"

### 4.10 BREADCRUMBS
- **Size:** 12px, gray (#666)
- **Separator:** "/" or ">"
- **Last item:** Bold or different color (not linked)
- **Other items:** Linked in blue (#2196F3)
- **Spacing:** 8px margin between items

### 4.11 CHARTS
- **Line Chart:**
  - Line color: Blue (#2196F3) primary, cyan (#00BCD4) secondary
  - Grid lines: Light gray (#E0E0E0)
  - Background: White
  - X-axis labels: Month names or dates
  - Y-axis labels: Numbers/currency
  - Hover tooltip: Dark background with white text
  
- **Bar Chart:**
  - Bar colors: Blue (#2196F3), orange (#FF9800), green (#4CAF50)
  - Bars: 3D effect or flat (flat preferred)
  - Hover: Darker shade of bar color
  
- **Pie Chart:**
  - Colors: Mix of blue, green, orange, cyan
  - Legend: Below or to side
  - Hover: Segment highlight or tooltip

### 4.12 STATUS INDICATORS
- **Online indicator:** Green circle (8px), in profile/tech card
- **Busy indicator:** Orange circle
- **Offline indicator:** Gray circle
- **Badge count:** Red background, white number, 20px circle, positioned top-right

### 4.13 TOOLTIPS
- **Background:** Dark gray (#333)
- **Text:** White, 12px
- **Padding:** 8px 12px
- **Border-radius:** 4px
- **Arrow:** Pointing to reference element
- **Z-index:** Always above other content

### 4.14 NOTIFICATION/TOAST
- **Position:** Bottom-right or top-right
- **Size:** 400px wide × 60-80px tall
- **Background:** White with border-left
- **Border-left color:** 
  - Success: Green (#4CAF50)
  - Error: Red (#F44336)
  - Warning: Orange (#FF9800)
  - Info: Blue (#2196F3)
- **Text:** 14px, dark gray
- **Close button:** X top-right
- **Auto-dismiss:** 5-6 seconds
- **Shadow:** Subtle

---

## 5. PAGE-SPECIFIC LAYOUTS

### 5.1 LOGIN PAGE
- **Background:** White or light gradient
- **Card:** Centered, 400px wide, white background
- **Spacing:** 20px internal padding
- **Logo:** Top, 60-80px
- **Form fields:** 
  - 2 fields: Email + Password
  - Full width, 40px height, 16px spacing
- **Buttons:**
  - Sign In (full width, primary blue)
  - Forgot Password (text link, below)
- **Bottom:** "Don't have account?" + Sign Up link

### 5.2 DASHBOARD
**KPI Section:**
- 4-5 cards in horizontal grid
- Each card: 280px × 160px
- Grid gap: 16px

**Charts Section:**
- 2-3 column layout
- Chart height: 300-350px
- Full width: 100%
- Grid gap: 16px

**Recent Activity Table:**
- Full width below charts
- 5-8 rows visible
- Pagination at bottom

### 5.3 JOBS LIST PAGE
**Header:**
- Search bar (left, flexible width)
- Filters button (secondary)
- Create Job button (primary, right)
- Padding: 16px

**Active Filters Display:**
- Below header, left-aligned
- Filter badges with X to remove
- "Clear all filters" link

**Table:**
- 8 columns: Checkbox | ID | Customer | Technician | Status | Date | Amount | Actions
- Full page width
- Pagination: 25 items default

### 5.4 CUSTOMERS PAGE
**Header:**
- Search bar (left)
- View toggle: Grid/List (center)
- Filter button (secondary)
- Add Customer button (primary, right)

**Grid View:**
- 3-4 columns responsive
- Cards: 280px × 300px
- Card content: Avatar + Name + Contact + Actions
- Grid gap: 16px

**List View:**
- Single column
- Rows: 56px height
- Same data as grid but linear

### 5.5 TECHNICIANS PAGE
**Header:**
- Same as Customers

**Grid View:**
- Cards similar to Customers
- Added: Status badge (green/yellow/gray circle)
- Added: Skills/certifications tags
- Added: Performance metrics (rating, jobs completed)

### 5.6 SCHEDULE/CALENDAR
**Header:**
- Month navigation: [<] [January 2026] [>]
- Today button
- View selector: Day | Week (active) | Month

**Calendar:**
- 7 columns (Mon-Sun)
- Left sidebar: Time slots (8 AM - 6 PM)
- Time slot blocks: Job cards with color-coded status
- Grid lines: Light gray (#E0E0E0)
- Today column: Light blue background (#E3F2FD)

**Unassigned Jobs Panel:**
- Left side below calendar
- Title: "Unassigned Jobs (X)"
- Draggable job items
- Each item: ID + Customer + Priority badge

### 5.7 DISPATCH VIEW
**Split Layout:**
- Left 40%: Job dispatch queue
- Right 60%: Map view

**Dispatch Queue:**
- Scrollable list
- Job cards: ID + Customer + Address + Priority + Time window
- Quick assign dropdown
- Sort options

**Map:**
- Full interactive map
- Markers:
  - Technicians: Green/Yellow/Gray circles
  - Jobs: Red/Orange/Blue pins
- Popups on click
- Legend bottom-right

### 5.8 INVOICES LIST
**Header:**
- Same search/filter/create structure as Jobs
- Create Invoice button (primary)

**Table:**
- 8 columns: Checkbox | Invoice # | Customer | Date | Amount | Status | Due Date | Actions
- Status badges: Draft (gray) | Sent (blue) | Paid (green) | Overdue (red)
- Overdue rows: Subtle red background (#FFEBEE)

### 5.9 INVOICE DETAIL
**Header:**
- Invoice number (large, left)
- Status badge (top-right)
- Print/Download/Send/Edit buttons (top-right)

**Content (Printable format):**
- Company info (top-left)
- Bill To (top-right)
- Invoice date | Due date (below customer info)
- Line items table:
  - Description | Qty | Unit Price | Amount
  - Subtotal | Tax | Discount | **Total** (highlighted)
- Notes section
- Footer: Thank you message

### 5.10 REPORTS
**Header:**
- Date range selector with presets
- Export button (PDF/CSV/Excel)

**Left Panel:**
- Report categories tabs
- Report list under each category

**Main Panel:**
- Chart visualization (line/bar/pie)
- Below: Data table backing the chart
- Summary statistics boxes

---

## 6. COLOR PALETTE REFERENCE

```
PRIMARY:
  Primary Blue:     #2196F3
  Dark Sidebar:     #2C3E50
  
SEMANTIC:
  Success:          #4CAF50
  Warning:          #FF9800
  Error:            #F44336
  Info:             #2196F3 (primary)
  Secondary Teal:   #00BCD4
  
NEUTRAL:
  White:            #FFFFFF
  Light Gray:       #F5F5F5
  Light Gray Alt:   #F9F9F9
  Medium Gray:      #E0E0E0
  Dark Gray:        #666666
  Text Primary:     #333333
  Text Secondary:   #666666
  Disabled:         #999999
  
SPECIAL:
  Card Hover:       Light Gray (#F5F5F5)
  Light Blue BG:    #E3F2FD (for icon backgrounds)
  Overdue BG:       #FFEBEE (light red)
  Backdrop:         rgba(0,0,0,0.5)
```

---

## 7. PRIORITY BUILD LIST (By Frequency & Importance)

### TIER 1 - CRITICAL (Build First):
1. **Sidebar Navigation** - Appears on every page
   - 10 menu items with icons
   - Active state highlighting
   - Dark theme
   - Collapse/expand toggle

2. **Header Component** - Always visible
   - Logo/branding (left)
   - Breadcrumbs (optional center)
   - User profile dropdown (right)
   - Notifications bell with badge
   - Company selector

3. **Authentication (Login Page)**
   - Centered card layout
   - Email/password inputs
   - Sign in button
   - Forgot password link
   - Sign up link

4. **Dashboard Page**
   - 5 KPI cards (with icons, values, trends)
   - 3 chart visualizations (line, bar, pie)
   - Recent activity table
   - Layout: Cards + Charts + Table

### TIER 2 - HIGH PRIORITY (Build Second):
5. **Jobs List Page**
   - Search bar with icon
   - Filter button with dropdown
   - Create Job button
   - Data table with 8 columns
   - Status badges (4 types)
   - Pagination controls
   - Select all checkbox
   - Bulk actions (if selected)

6. **Customers Page**
   - Search + Filter + Create buttons
   - Grid/List view toggle
   - Customer cards (grid view)
   - Customer rows (list view)
   - Action buttons (view/edit/delete)

7. **Technicians Page**
   - Similar structure to Customers
   - Status badges (online/busy/offline)
   - Skills tags
   - Performance metrics on cards

8. **Form Components** (Reusable)
   - Text inputs
   - Email inputs
   - Password inputs
   - Select dropdowns
   - Textarea
   - Checkboxes
   - Toggle switches
   - Date pickers
   - Multi-select tags

### TIER 3 - MEDIUM PRIORITY (Build Third):
9. **Schedule/Calendar Page**
   - Week/month/day view
   - Time slot grid
   - Job blocks with colors
   - Drag-and-drop rescheduling
   - Unassigned jobs list (left panel)
   - Legend

10. **Dispatch Page**
    - Split layout (queue + map)
    - Job dispatch queue list
    - Interactive map with markers
    - Job assignment UI
    - Map controls (zoom, pan, etc.)

11. **Invoices Page**
    - Invoice list table
    - Invoice detail view (printable format)
    - Invoice creation form
    - PDF export
    - Email send functionality

12. **Common Components** (Shared across pages)
    - Modals/Dialogs
    - Status badges (4 types)
    - Buttons (primary, secondary, danger, text)
    - Cards (general purpose)
    - Tables (sortable, paginated)
    - Search bars
    - Filter dropdowns
    - Pagination
    - Breadcrumbs

### TIER 4 - LOWER PRIORITY (Build Fourth):
13. **Automation Page**
    - Workflow list (left panel)
    - Workflow builder (right panel)
    - Trigger selector
    - Condition builder
    - Action builder
    - Save workflow

14. **Reports Page**
    - Report category tabs
    - Report selector
    - Chart visualizations
    - Data tables
    - Export options

15. **Settings Pages**
    - General settings form
    - Advanced settings form
    - Settings categories navigation
    - Form validation

16. **Additional UI States**
    - Loading skeletons
    - Empty states
    - Error states
    - Success notifications (toast)
    - Confirmation modals
    - Form validation errors

### TIER 5 - OPTIONAL/POLISH (Build Last):
17. **Animations & Transitions**
    - Page transitions
    - Modal animations (fade in/scale)
    - Hover effects
    - Loading spinners

18. **Responsive Design**
    - Mobile layout (1 column)
    - Tablet layout (2 columns)
    - Desktop layout (3-4 columns)
    - Hamburger menu on mobile
    - Sidebar collapse on tablet

19. **Accessibility**
    - ARIA labels
    - Keyboard navigation
    - Focus indicators
    - High contrast mode support

20. **Advanced Features**
    - Undo/Redo
    - Keyboard shortcuts
    - User preferences
    - Dark mode (optional)

---

## 8. KEY INTERACTION PATTERNS

### Search & Filter Pattern:
1. Search bar at top
2. Filter button opens dropdown with filters
3. Selected filters shown as removable badges below search
4. "Clear all filters" link or button
5. Results update in real-time or on "Apply" click

### Table Pattern:
1. Header row with sort indicators
2. Multiple rows with data
3. Hover effect on rows
4. Checkboxes for bulk selection
5. Action buttons (view, edit, delete, more menu)
6. Pagination at bottom

### Form Pattern:
1. Labels above inputs
2. Required field asterisks (*)
3. Consistent input styling
4. Error messages below fields (red)
5. Helper text where needed
6. Footer buttons: Cancel | Save/Submit
7. Validation on blur or form submit

### Modal Pattern:
1. Dark overlay background
2. Centered white card
3. Close button (X) top-right
4. Header with title
5. Body with content
6. Footer with buttons
7. Can have form, confirmation, or message

### Card Pattern:
1. White background with border/shadow
2. Padding: 16-20px
3. Rounded corners
4. Hover: Shadow increases
5. Can contain any content type

### List/Grid Pattern:
1. Search + filter at top
2. View toggle (grid/list) if applicable
3. Create/Add button
4. Items displayed as cards (grid) or rows (list)
5. Pagination at bottom

---

## 9. TYPOGRAPHY

### Font Family:
- **Primary:** Sans-serif (System font or 'Inter', 'Roboto', 'Open Sans')
- **Monospace:** For code/IDs (if needed)

### Font Sizes & Weights:

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page Title | 28-32px | Bold (700) | #333 |
| Section Header | 20px | Semibold (600) | #333 |
| Card Title | 16-18px | Semibold (600) | #333 |
| Body Text | 14px | Regular (400) | #333 |
| Input Label | 12px | Semibold (600) | #333 |
| Helper/Secondary | 12px | Regular (400) | #666 |
| Caption | 11px | Regular (400) | #999 |
| Table Header | 12-13px | Semibold (600) | #333 |
| Button Text | 14px | Semibold (600) | White/Blue |
| Badge Text | 12px | Semibold (600) | White |

---

## 10. SPACING & GRID

### Base Unit: 8px

| Spacing | Size |
|---------|------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |

### Layout Gaps:
- Between cards: 16px
- Between sections: 24px
- Between form fields: 16px
- Page padding: 24px
- Table row height: 48-56px

---

## 11. BORDER & SHADOWS

### Borders:
- **Default:** 1px solid #E0E0E0
- **Focus:** 1px solid #2196F3
- **Card border:** Optional 1px solid #E0E0E0

### Shadows:
- **Card shadow:** 0 2px 4px rgba(0,0,0,0.1)
- **Card hover:** 0 4px 8px rgba(0,0,0,0.15)
- **Modal shadow:** 0 8px 32px rgba(0,0,0,0.2)
- **Input focus:** 0 0 0 3px rgba(33,150,243,0.1)

### Border Radius:
- **Inputs/Buttons:** 4-6px
- **Cards:** 4-8px
- **Modals:** 8px
- **Circles (avatars):** 50%

---

## 12. RESPONSIVE BREAKPOINTS

| Device | Width | Columns | Sidebar |
|--------|-------|---------|---------|
| Mobile | < 768px | 1 | Hamburger menu |
| Tablet | 768px - 1024px | 2 | Collapsed or hidden |
| Desktop | > 1024px | 3-4 | Always visible |

---

## CONCLUSION

This design system creates a **professional, clean, data-driven interface** with:
- **Consistent branding** (blue primary color)
- **Clear information hierarchy** (typography, spacing)
- **Efficient data presentation** (tables, charts, cards)
- **Intuitive navigation** (sidebar, breadcrumbs)
- **Accessible forms** (labels, validation, spacing)
- **Status-aware UI** (color-coded badges)
- **Responsive layout** (adapts to screen sizes)

**Recommended implementation order:** Tier 1 → Tier 2 → Tier 3 → Tier 4 → Tier 5
