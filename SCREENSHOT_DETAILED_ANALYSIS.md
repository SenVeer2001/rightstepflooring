# Workiz Application - Individual Screenshot Detailed Analysis

## Complete Breakdown by Screenshot Number

---

## Screenshot 1: Login Page (8.14.20 AM)
**Dimensions:** 2880 x 1800

### Layout
- Centered login card on gradient or solid background
- Minimal, distraction-free design
- Professional appearance

### UI Elements
1. **Header Area**
   - Workiz logo or company branding
   - Optional tagline/description

2. **Form Fields**
   - Email/Username input
     - Label: "Email" or "Username"
     - Placeholder text
     - Icon (envelope or person)
   - Password input
     - Label: "Password"
     - Show/hide password toggle
     - Eye icon button

3. **Remember Me Section**
   - Checkbox: "Keep me logged in" or "Remember me"

4. **Buttons**
   - Primary button: "Sign In" or "Login" (blue)
   - "Forgot Password?" link (text link)

5. **Bottom Section**
   - "Don't have an account? Sign up" or registration link
   - Terms of service link (optional)

### Colors
- Background: White or light gradient
- Card background: White
- Text: Dark gray (#333)
- Links: Blue (#2196F3)
- Button: Primary blue (#2196F3)

### Interactions
- Focus state on input fields (blue border)
- Button hover (darker blue)
- "Forgot Password" navigates to reset page
- "Sign up" link navigates to registration

---

## Screenshot 2: Dashboard - Top View (11.02.21 AM)
**Dimensions:** 2876 x 1482

### Layout
- Sidebar + Main content area
- Header at top with breadcrumbs
- KPI cards in first row
- Charts/visualizations below

### Sidebar Navigation (Left)
- **Width:** ~250-280px
- **Background:** Dark (#2C3E50 or #34495E)
- **Menu Items:**
  - Dashboard (active/highlighted)
  - Jobs
  - Customers
  - Technicians
  - Schedule
  - Dispatch
  - Invoices
  - Automation
  - Reports
  - Settings
- **Icons:** 20-24px icons next to text
- **Hover effect:** Light gray background
- **Active item:** Blue (#2196F3) highlight on left side or text color change

### Header
- **Height:** ~60-70px
- **Background:** White or light gray
- **Left side:**
  - Hamburger menu (for mobile/collapse)
- **Center:**
  - Breadcrumbs: "Dashboard > Overview" (optional)
- **Right side:**
  - User name or initial
  - User avatar/profile dropdown
  - Notifications bell (with count badge)
  - Company selector

### Main Content Area
**Dashboard - KPI Cards (Top section)**
- 4-5 cards in a grid row
- Card layout:
  - Icon (24px) - top left
  - Metric name (14px, gray)
  - Metric value (28px, bold, dark)
  - Trend indicator (%)
  - Trend color: Green (up), Red (down)

- **Cards visible:**
  1. Total Jobs
     - Icon: briefcase or checklist
     - Value: e.g., "124"
     - Trend: "+12% vs last month"
  
  2. Completed Jobs
     - Icon: checkmark or verified
     - Value: e.g., "89"
     - Percentage: "71.8%"
  
  3. Pending Jobs
     - Icon: hourglass or pending
     - Value: e.g., "23"
     - Trend: "+5% vs last month"
  
  4. Revenue Generated
     - Icon: dollar sign
     - Value: e.g., "$45,230"
     - Trend: "+22% vs last month"

  5. Active Technicians
     - Icon: person or users
     - Value: e.g., "12"
     - Status: "Online now"

### Charts/Visualizations Section
- **Layout:** 2-3 columns
- **Chart Types:**
  - Line chart: Revenue trend (X-axis: months, Y-axis: revenue)
  - Bar chart: Jobs by technician (horizontal or vertical bars)
  - Pie chart: Job status distribution (Pending, In Progress, Completed, Cancelled)

### Colors
- Card background: White
- Card icon background: Light blue (#E3F2FD)
- Card icon: Primary blue (#2196F3)
- Trend up: Green (#4CAF50)
- Trend down: Red (#F44336)
- Chart colors: Various blues, greens, oranges

### Bottom Section
- **Recent Activity Table**
  - Columns: Job ID | Customer | Technician | Status | Date | Action
  - 5-8 rows visible
  - Pagination at bottom

---

## Screenshot 3: Jobs List Page (11.02.45 AM)
**Dimensions:** 2872 x 1490

### Layout
- Same sidebar + header structure
- Main content: Jobs list with search/filters

### Header Bar
- **Page title:** "Jobs"
- **Search bar:** Left-aligned, prominent
  - Placeholder: "Search by job ID, customer, technician"
  - Search icon on left
  - Clear button (X) when text entered
- **Filter button:** Secondary button
  - Icon: funnel
  - Dropdown showing filters
- **Create Job button:** Primary blue button
  - Icon: plus
  - Text: "New Job" or "Create Job"

### Filters Section (Visible or Dropdown)
- **Status dropdown:** All, Pending, In Progress, Completed, Cancelled
- **Technician dropdown:** List of technicians + "Unassigned"
- **Customer dropdown:** Search-enabled list
- **Date range:** From date - To date (calendar pickers)
- **Apply/Reset buttons**

### Jobs Table
**Table Header:**
- Background: Light gray (#F5F5F5)
- Font: SemiBold, 12-13px
- Columns visible:
  1. **Checkbox** (select multiple)
  2. **Job ID**
     - Format: JOB-001, JOB-002, etc.
  3. **Customer Name**
     - Text, may be truncated with tooltip
  4. **Technician Name**
     - Text or "Unassigned"
  5. **Status**
     - Badge component
     - Colors: Orange (Pending), Blue (In Progress), Green (Completed), Red (Cancelled)
  6. **Date**
     - Scheduled date
  7. **Amount**
     - Right-aligned
     - Currency symbol
  8. **Actions**
     - View icon
     - Edit icon
     - Delete icon
     - 3-dot menu

**Table Rows:**
- Height: 48-56px
- Alternating background: White + #F9F9F9
- Hover effect: Light background change
- Zebra striping for readability
- Status badges inline with colored backgrounds

### Pagination
- **Bottom of table**
- Show entries: "10, 25, 50, 100"
- Page numbers
- Current page highlighted
- Previous/Next buttons
- "Showing 1-25 of 342" text

### Colors
- Table header background: #F5F5F5
- Table row hover: #F5F5F5
- Row border: #E0E0E0
- Status Pending: #FF9800 (orange)
- Status In Progress: #2196F3 (blue)
- Status Completed: #4CAF50 (green)
- Status Cancelled: #F44336 (red)

---

## Screenshot 4: Automation Section (11.30.37 AM)
**Dimensions:** 2880 x 1800

### Layout
- Full-page view with automation builder

### Header
- Page title: "Automation"
- Tabs or sections:
  - Workflows (active)
  - Rules
  - Templates

### Main Content Area

**Left Panel - Workflow List**
- List of automation workflows
- Each item shows:
  - Workflow name
  - Description
  - Status (Enabled/Disabled toggle)
  - Last modified date
  - Action buttons: Edit, Delete

**Right Panel - Workflow Builder/Detail**
- Title: "Create New Workflow" or existing workflow name
- Fields:
  - Workflow name input
  - Description textarea
  - Trigger selector (dropdown)
    - Options: On job created, On job completed, On technician assigned, etc.
  - Condition builder
    - If [field] [operator] [value]
    - Multiple conditions with AND/OR logic
  - Action builder
    - Then [action type] [parameters]
    - Options: Send email, Create task, Assign job, Update status, etc.
  - Save/Cancel buttons

### Colors
- Similar to dashboard
- Toggle switches: Green when enabled, gray when disabled
- Workflow card: White with subtle border
- Workflow active: Blue highlight
- Builder section: White background
- Input fields: White with borders

---

## Screenshot 5: Customers Page - List View (11.31.01 AM)
**Dimensions:** 2880 x 1800

### Layout
- Sidebar + main content
- Customers displayed in grid or list

### Header Bar
- Page title: "Customers"
- Search bar
  - Placeholder: "Search by name, email, phone"
- View toggle buttons
  - Grid icon (active)
  - List icon
- Filter button
  - Status: All, Active, Inactive
  - City/Location
  - Tags
- Add Customer button (primary)
  - Icon: plus
  - Text: "Add Customer" or "New Customer"

### Customers Grid View
- **Layout:** 3-4 columns on desktop
- **Card per customer:**
  - Height: ~280-320px
  - Background: White
  - Border: 1px light gray
  - Padding: 16px
  - Shadow: Subtle

  **Card Content:**
  - Avatar area (top): Initials or photo (circular, 60-80px)
  - Name: Bold, 16-18px
  - Contact person (if different)
  - Email: 12px, gray, linked
  - Phone: 12px, gray, linked
  - Location: 12px, gray, icon + text
  - Rating: Star rating display
  - Active jobs count: Badge or text
  - Tags: Small colored badges
  - Action buttons at bottom:
    - View (eye icon)
    - Edit (pencil icon)
    - Delete (trash icon)
    - More options (3-dot menu)

### Hover Effect
- Card shadow increases
- Buttons become more visible
- Cursor: pointer

### Colors
- Card background: White
- Text primary: #333
- Text secondary: #666
- Avatar background: Light blue (#E3F2FD)
- Avatar initials: Primary blue (#2196F3)
- Email/Phone links: Blue (#2196F3)
- Tags: Various colors (green, orange, blue, red)
- Action buttons: Gray (#666) until hover, then darker

### Responsive
- 1 column on mobile
- 2 columns on tablet
- 3-4 columns on desktop

---

## Screenshot 6: Customer Detail/Edit Modal (11.31.15 AM)
**Dimensions:** 2880 x 1800

### Layout
- Overlay/modal dialog
- Centered on screen
- Dark backdrop behind modal

### Modal Structure

**Header**
- Title: "Customer Details" or "Edit Customer [Name]"
- Close button (X) top-right
- Optional: Show ID or reference number

**Body - Form Fields (Stacked)**

**Row 1 - Name**
- 2 columns:
  - First Name (left)
  - Last Name (right)
- Input type: Text
- Height: 40px
- Placeholder: "First Name" / "Last Name"

**Row 2 - Email & Phone**
- 2 columns:
  - Email (left)
  - Phone (right)
- Email: Text input with email type
- Phone: Text input with phone formatting

**Row 3 - Company & Contact Person**
- 2 columns:
  - Company Name (left)
  - Contact Person Name (right)

**Row 4 - Address**
- Full width: Text input
- Placeholder: "Street Address"

**Row 5 - City, State, ZIP**
- 3 columns:
  - City
  - State (dropdown)
  - ZIP Code

**Row 6 - Country & Type**
- 2 columns:
  - Country (dropdown)
  - Customer Type (dropdown - e.g., Residential, Commercial)

**Row 7 - Notes**
- Full width: Textarea
- Placeholder: "Add notes about this customer"
- Height: 100-120px
- Resizable

**Row 8 - Tags**
- Full width: Multi-select tag input
- Placeholder: "Add tags..."
- Existing tags shown as removable chips

**Row 9 - Metadata** (Read-only)
- Created: Date/time
- Last Modified: Date/time
- Status toggle: Active/Inactive

**Footer**
- Cancel button (secondary - outlined)
- Save button (primary - filled blue)
- Optional: Delete button (danger - red, if editing)
- Button spacing: 8px between buttons
- Right-aligned

### Styling
- Modal background: White
- Modal width: 600-700px
- Modal border-radius: 8px
- Modal shadow: 0 8px 16px rgba(0,0,0,0.2)
- Form field spacing: 16px between rows
- Input height: 40px
- Input padding: 10px 12px
- Input border: 1px solid #E0E0E0
- Input focus border: 1px solid #2196F3
- Label: 12px, semibold, dark gray

### Colors
- Modal background: White
- Backdrop: rgba(0,0,0,0.5)
- Input border: #E0E0E0
- Input focus: #2196F3
- Text: #333
- Label: #666
- Button primary: #2196F3
- Button secondary: #F5F5F5 with border
- Tags: Various colors

---

## Screenshot 7: Customer Creation Form (11.31.24 AM)
**Dimensions:** 2880 x 1800

### Layout
- Similar modal structure to Screenshot 6
- Either expanded form or additional sections
- May include additional fields or organization

### Additional Features
- Form validation indicators
- Required field asterisks (*)
- Helper text under certain fields
- Conditional fields (show/hide based on customer type)
- Multi-step form (if complex):
  - Step indicator at top
  - Basic Info tab (active)
  - Address tab
  - Preferences tab

### Form Sections
Same as Screenshot 6, with possible additions:
- Source of lead (How did you hear about us?)
- Preferred contact method (Email/Phone/SMS)
- Service preferences (type of services interested in)

### Validation
- Required fields marked with red asterisk (*)
- Real-time or on-blur validation
- Error messages below fields in red
- Success checkmark on valid fields

### Buttons
- "Create Customer" (primary)
- "Save and Add Another" (optional secondary)
- "Cancel" (secondary)

---

## Screenshot 8: Technicians Page - List View (11.31.31 AM)
**Dimensions:** 2880 x 1800

### Layout
- Similar to Customers page
- Sidebar + main content

### Header Bar
- Page title: "Technicians"
- Search bar
- View toggle: Grid/List
- Filters:
  - Status: All, Active, Inactive, On Break
  - Specialization (dropdown)
  - Availability
- Add Technician button (primary)

### Technician Cards (Grid View)

**Card Layout** (similar to customers but specialized):
- Height: ~300-340px
- Width: Responsive grid (3-4 columns)
- Background: White
- Border: 1px light gray
- Shadow: Subtle

**Card Content:**
1. **Header Section**
   - Avatar: Circular photo, 80-100px
   - Name: Bold, 16-18px
   - Badge: Status indicator
     - Green circle: Online/Available
     - Yellow: On Job
     - Gray: Offline

2. **Info Section**
   - Specialization/Skills: Tags or comma-separated list
   - Contact: Phone number, email (linked)
   - Availability: Text (e.g., "Available Mon-Fri 9AM-5PM")

3. **Performance Section**
   - Jobs Completed: Count (e.g., "142")
   - Rating: Star rating (e.g., "4.8/5")
   - Response Time: Text (e.g., "2.3 hours avg")
   - Jobs This Month: Count

4. **Bottom Section**
   - Tags: Skills or certifications (colored badges)
   - Action buttons:
     - View (eye)
     - Edit (pencil)
     - Assign Job (briefcase icon)
     - Delete (trash)

### Status Badge Colors
- Online: Green (#4CAF50)
- On Job: Blue (#2196F3)
- Offline: Gray (#999999)
- On Break: Orange (#FF9800)

### Colors
- Same as Customers page
- Status badge: Color per status
- Rating color: Gold/Orange for stars (#FFB300)
- Skills tags: Blue for primary skill, gray for others

---

## Screenshot 9: Technician Details Modal (11.31.38 AM)
**Dimensions:** 2880 x 1800

### Layout
- Modal with detailed technician information
- Can be view-only or editable

### Modal Structure

**Header**
- Close button (X)
- Title: "Technician Details - [Name]"
- Edit button (pencil icon) - if not in edit mode

**Profile Section**
- Large avatar (100-120px circular)
- Name (bold, large)
- Job title/specialization
- Status badge (Online, Offline, On Job)
- Stars rating (if applicable)

**Info Sections (Tabbed or Accordion)**

**Tab 1: Overview**
- Name (full)
- Email (linked)
- Phone (linked)
- Address
- Skills/Specialization (tags)
- Availability schedule
- Date hired
- Performance metrics

**Tab 2: Performance**
- Jobs completed (count)
- Jobs this month (count)
- Average rating (stars)
- Average response time
- Cancellation rate
- Performance chart (line or bar)

**Tab 3: Schedule**
- Calendar showing availability
- Upcoming jobs (list or timeline)
- Breaks/time off (if applicable)

**Tab 4: History**
- Job history (table):
  - Date | Job ID | Customer | Status | Rating
- Pagination for history

**Footer**
- Edit button (if viewing)
- Delete button (danger, red)
- Assign Job button (if action-oriented)
- Close button

### Styling
- Modal width: 700-800px
- Tabs: Horizontal, underline style
- Active tab: Blue underline (#2196F3)
- Content sections: White background
- Each section: Padding 16px

---

## Screenshot 10: Schedule/Calendar - Overview (11.32.14 AM)
**Dimensions:** 2880 x 1800

### Layout
- Sidebar + main content
- Large calendar view

### Header
- Page title: "Schedule"
- Calendar navigation:
  - Previous button (<)
  - Current month/year: "January 2026"
  - Next button (>)
  - "Today" button
- View selector (buttons):
  - Day view
  - Week view (active)
  - Month view
- Filter dropdown:
  - Show all
  - By technician
  - By status

### Calendar Grid (Week View)
- **Layout:** 7 columns (Mon-Sun)
- **Header row:** Day abbreviations + dates
  - Mon 13 | Tue 14 | Wed 15 | Thu 16 | Fri 17 | Sat 18 | Sun 19
  - Highlight today with different background
- **Time slots:** Left sidebar showing times (8:00 AM - 6:00 PM, 30-min intervals)
- **Grid cells:** One per time slot per day

### Job Blocks
- Displayed as colored rectangles in time slots
- **Information shown:**
  - Job ID
  - Customer name
  - Technician name
  - Time duration
  - Status color-coded
- **Colors:**
  - In Progress: Blue (#2196F3)
  - Completed: Green (#4CAF50)
  - Pending: Orange (#FF9800)
  - Cancelled: Red (#F44336)
- **Interactions:**
  - Hover: Show tooltip with full details
  - Click: Open job details modal
  - Drag: Reschedule to different time/technician

### Left Sidebar
- **Unassigned Jobs:**
  - Title: "Unassigned Jobs (5)"
  - List of jobs without technician
  - Drag onto calendar to assign
  - Each item shows: Job ID, Customer, priority

### Bottom Right
- **Legend:**
  - Color indicators for statuses
  - Show/hide toggles per status

### Colors
- Calendar grid background: White
- Today column: Very light blue (#E3F2FD)
- Grid lines: Light gray (#E0E0E0)
- Time labels: Dark gray (#666)
- Job blocks: Status colors (blue, green, orange, red)

---

## Screenshot 11: Schedule - Drag and Drop Interaction (11.32.19 AM)
**Dimensions:** 2880 x 1800

### Layout
- Same calendar view as Screenshot 10
- Shows active drag-drop state

### Drag-Drop Interaction Visible
- **Dragging state:**
  - Opacity reduced on original position (ghost image)
  - Drag preview follows cursor
  - Valid drop zone: Highlighted with green border or background
  - Invalid zone: Red border or strikethrough
  - Cursor: "grab" or "move" icon

- **On drop:**
  - Job moved to new time slot
  - Calendar updates
  - Automatic time calculation
  - Toast notification: "Job rescheduled successfully"

### Visual Feedback
- **Original position:** Faded/ghosted
- **Drag preview:** Slightly larger, elevated (shadow)
- **Drop zone highlight:** Green (#4CAF50) for valid
- **Drop zone invalid:** Red (#F44336) with "not allowed" cursor

### Confirmation
- Optional: Small modal asking "Confirm reschedule?"
- Or: Direct reschedule with undo option via toast

---

## Screenshot 12: Jobs with Filters Applied (11.32.22 AM)
**Dimensions:** 2880 x 1800

### Layout
- Same jobs table view as Screenshot 3
- Shows active filters

### Filter Status Display
- Active filter badges shown below search bar
- Each badge shows:
  - Filter name (e.g., "Status:", "Technician:")
  - Selected value
  - X button to remove filter
- "Clear all filters" button

**Example visible filters:**
- Status: [In Progress]
- Technician: [John Smith]
- Date range: [Jan 13 - Jan 20]

### Results Update
- Table updates to show only filtered jobs
- Row count changes
- Pagination updates
- "Showing X of Y results" text

### Table View
- Same columns as Screenshot 3
- Filtered rows only
- Pagination reflects filtered count

### Color
- Filter badges: Light blue background (#E3F2FD), blue text (#2196F3)
- Badge X button: Gray until hover

---

## Screenshot 13: Dispatch View (11.32.25 AM)
**Dimensions:** 2880 x 1800

### Layout
- Sidebar + main content (split view)
- Left: Job list | Right: Map

### Left Panel - Dispatch Queue

**Header:**
- Title: "Dispatch Queue"
- Unassigned job count: e.g., "12 unassigned"
- Sort options (dropdown):
  - By distance (to nearest technician)
  - By priority (High > Medium > Low)
  - By time window
  - By customer

**Job List:**
- Scrollable list
- Each job card shows:
  - Job ID
  - Customer name
  - Address/location
  - Priority badge:
    - Red: High
    - Orange: Medium
    - Blue: Low
  - Time window (e.g., "2:00 PM - 4:00 PM")
  - Estimated duration
  - "Quick assign" button or dropdown
  - Best match technician suggestion

**Color coding:**
- Priority High: #F44336 (red)
- Priority Medium: #FF9800 (orange)
- Priority Low: #2196F3 (blue)

### Right Panel - Map View

**Map Details:**
- Interactive map (Google Maps/Mapbox)
- Full height, scrollable

**Markers:**
- **Technician markers:**
  - Icon: Person/technician badge
  - Color: Green (available), Yellow (busy), Gray (offline)
  - Popup on click: Technician name, jobs assigned, current location
- **Job markers:**
  - Icon: Briefcase or pin
  - Color: Red (unassigned), Orange (suggested), Blue (assigned)
  - Popup: Job ID, customer, priority, estimated time
- **Completed job markers:**
  - Icon: Checkmark
  - Color: Green with lighter shade

**Map Controls:**
- Zoom in/out buttons
- Fit to bounds button
- Recenter on current location
- Toggle street/satellite view

**Legend:**
- Color indicators for marker types
- Show/hide toggles

### Interaction
- **Assign from list:**
  - Click "Quick assign" button
  - Dropdown shows suggested technicians by distance
  - Select technician → assignment confirmed
  
- **Assign from map:**
  - Drag job marker onto technician marker
  - Or click job → "Assign" → select technician

- **Map Updates:**
  - Real-time location updates (if live tracking)
  - Markers update position

### Colors
- Map background: Default map colors
- Technician available: Green (#4CAF50)
- Technician busy: Orange (#FF9800)
- Technician offline: Gray (#999999)
- Unassigned job: Red (#F44336)
- Suggested assignment: Orange (#FF9800)
- Assigned job: Blue (#2196F3)
- Completed: Green (#4CAF50)

---

## Screenshot 14: Dispatch - Map Focus (11.32.28 AM)
**Dimensions:** 2880 x 1800

### Layout
- Shows detailed map view
- May have job details panel on side or over map

### Map Features

**Markers:**
- All marker types visible
- Clustered markers in dense areas (if many markers)
- Click to expand cluster

**Popups:**
- Click on marker shows popup
- Popup content:
  - Name/ID
  - Address
  - Status
  - Contact information
  - Action button (Assign, View Details, etc.)

**Routes (optional):**
- Line showing route from technician to job
- Display estimated travel time
- Traffic-aware routing (if integrated)

**Information Panel (if visible):**
- Job details on side
- Technician info
- "Assign this job" button with technician selector
- "Edit job" button

### Interactions
- Click marker → show popup
- Click popup action → perform action
- Drag technician → reassign jobs
- Zoom/pan map
- Search address (search bar at top)
- Filter by status/technician

---

## Screenshot 15: Invoices List Page (11.32.32 AM)
**Dimensions:** 2880 x 1800

### Layout
- Sidebar + main content
- Invoice table view

### Header
- Page title: "Invoices"
- Search bar:
  - Placeholder: "Search by invoice #, customer, amount"
- Filters:
  - Status: All, Draft, Sent, Paid, Overdue
  - Date range picker
  - Customer dropdown
  - Amount range (from/to)
- "Create Invoice" button (primary, blue)

### Invoices Table

**Columns:**
1. Checkbox (select multiple)
2. Invoice #
   - Format: INV-001, INV-002, etc.
   - Linked to invoice detail
3. Customer Name
   - Linked to customer profile
4. Date
   - Invoice creation date
5. Amount
   - Total invoice amount, right-aligned
   - Currency symbol (e.g., $)
6. Status
   - Badge component:
     - Draft: Gray (#999999)
     - Sent: Blue (#2196F3)
     - Paid: Green (#4CAF50)
     - Overdue: Red (#F44336)
7. Due Date
   - Due date of invoice
   - Highlight red if overdue
8. Actions
   - View (eye icon)
   - Edit (pencil icon)
   - Delete (trash icon)
   - More (3-dot menu):
     - Send (email)
     - Print
     - Download PDF
     - Mark as paid
     - Duplicate
     - Send reminder

**Row Styling:**
- Height: 48-56px
- Alternating background: White + #F9F9F9
- Hover: Light gray (#F5F5F5)
- Border: 1px solid #E0E0E0

### Pagination
- Same as Jobs page
- Show 10/25/50/100 entries
- Previous/Next buttons
- Page numbers

### Bulk Actions (if checkboxes selected)
- "Delete selected" button (danger)
- "Send selected" button
- "Mark as paid" button
- Selection count display

### Colors
- Status Draft: #999999
- Status Sent: #2196F3
- Status Paid: #4CAF50
- Status Overdue: #F44336
- Amount text: Right-aligned, dark
- Overdue rows: Subtle red background (#FFEBEE)

---

## Screenshot 16: Invoice Detail View (11.32.36 AM)
**Dimensions:** 2880 x 1800

### Layout
- Full-page or modal view
- Invoice displayed in printable format

### Header Section
- Invoice title: "Invoice"
- Invoice number: Large, e.g., "INV-001"
- Status badge: Current status
- Buttons (top-right):
  - Print button
  - Download PDF button
  - Send button
  - Edit button
  - Back/Close button

### Company Info Section (Top-left)
- Company name (bold, large)
- Company address
- Company phone
- Company email
- Company tax ID

### Invoice To Section (Top-right)
- "Invoice To:"
- Customer name
- Contact person
- Customer address
- Customer email
- Customer phone

### Invoice Dates (Below customer info)
- Invoice Date: Jan 13, 2026
- Due Date: Feb 13, 2026
- Payment Terms: Net 30 (or similar)

### Line Items Section (Main table)
**Table with columns:**
1. Description
   - Item name/service description
2. Quantity
   - Number of units
   - Right-aligned
3. Unit Price
   - Price per unit
   - Right-aligned
   - Currency symbol
4. Amount
   - Total per line (Qty × Price)
   - Right-aligned
   - Currency symbol
   - Bold or highlighted

**Each row:**
- Description spans full width or left
- Numbers right-aligned
- Separator line between items
- Total items: 5-8 visible

### Totals Section (Bottom-right)
- Subtotal: $XXXX.XX (right-aligned)
- Tax (if applicable): $XX.XX
  - Shows tax rate (e.g., "Tax (10%): $XXX.XX")
- Discount (if applicable): -$XX.XX (red or green)
- **Total: $XXXX.XX** (bold, large, emphasized)

### Notes Section
- "Notes:" label
- Text area with notes to customer
- May include payment instructions

### Footer Section
- "Thank you for your business!"
- Payment methods/instructions
- Support contact

### Colors
- Background: White
- Headers: Dark gray (#333)
- Company/Customer info: #666
- Line items table:
  - Header background: #F5F5F5
  - Row borders: #E0E0E0
  - Description text: #333
  - Amount text: #333, right-aligned
- Totals section:
  - Subtotal/Tax: #666
  - Total: Bold, large, #333
  - Total amount box: Light blue background (#E3F2FD) or highlighted
- Status badge color: Per status (Draft gray, Paid green, etc.)

### Interactions
- Click "Edit" button → Modal or page to edit line items, amounts, etc.
- Click "Send" → Confirmation modal + email form
- Click "Print" → Browser print dialog
- Click "Download PDF" → PDF file download

---

## Screenshot 17: Invoice Creation Form (11.32.38 AM)
**Dimensions:** 2880 x 1800

### Layout
- Modal or dedicated page for invoice creation
- Form with sections

### Header
- Title: "Create Invoice"
- Close button (if modal)

### Form Sections

**Section 1: Invoice Header**
- Customer selector (required):
  - Dropdown/searchable
  - Show recent customers at top
  - Type to search
  - Selected customer shows address, contact
- Invoice date picker (required):
  - Calendar popup
  - Default to today
- Due date picker (required):
  - Calendar popup
  - Default to 30 days from today
  - Shows payment terms (e.g., "Net 30", "Due on receipt")

**Section 2: Line Items**
- **Table to add items:**
  - Description field (textarea or input)
  - Quantity field (number)
  - Unit Price field (currency)
  - Amount field (auto-calculated, read-only)
  - Delete button (trash icon) per row
  - **Add Item row button** (at bottom of table):
    - "Add Another Item" button (secondary)

- **Sample line items:**
  - Row 1: Plumbing Service | 1 | $150.00 | $150.00
  - Row 2: Parts & Materials | 1 | $45.00 | $45.00
  - Row 3: Travel | 1 | $25.00 | $25.00

**Section 3: Totals**
- Subtotal (auto-calculated, read-only):
  - $XXX.XX
- Tax input (optional):
  - Percentage or fixed amount
  - Auto-calculates tax based on subtotal
  - Display: "Tax (10%): $XX.XX"
- Discount input (optional):
  - Percentage or fixed amount
  - Auto-calculates discount
  - Display: "Discount (-10%): -$XX.XX"
- **Total (auto-calculated, read-only, bold):**
  - $XXX.XX
  - Highlighted background

**Section 4: Additional Info**
- Notes textarea:
  - Placeholder: "Add notes for customer..."
  - Optional
- Payment terms dropdown:
  - Options: Net 30, Net 60, Due on receipt, etc.
- Invoice status (if applicable):
  - Radio buttons: Draft, Send immediately
  - Default to Draft

**Footer**
- Cancel button (secondary)
- Save as Draft button (secondary)
- Send button (primary) - sends to customer email
- Or: Create button (primary) - creates and stores

### Table Styling
- Headers: Light gray background (#F5F5F5), semibold
- Rows: White or alternating #F9F9F9
- Borders: #E0E0E0
- Input fields within table: Similar style to other inputs
- Add row button: Secondary style (outline)

### Calculations
- Quantity × Unit Price = Amount (auto)
- Sum of Amounts = Subtotal (auto)
- Subtotal + Tax - Discount = Total (auto)
- Fields update real-time as user types

### Colors
- Form background: White
- Input fields: White with border #E0E0E0
- Labels: Dark gray (#333), semibold
- Helper text: Gray (#666)
- Total box: Light blue background (#E3F2FD)
- Buttons: Standard styling

---

## Screenshot 18: Reports Page (11.32.43 AM)
**Dimensions:** 2880 x 1800

### Layout
- Sidebar + main content
- Report selection + visualization

### Header
- Page title: "Reports"
- Date range selector:
  - From date picker
  - To date picker
  - Preset buttons: Today, This Week, This Month, This Quarter, This Year, All Time
- Export button (secondary):
  - Icon: Download
  - Dropdown: PDF, CSV, Excel

### Main Content Area

**Left Panel - Report Categories (or Tabs)**
- Tabs or sidebar showing report types:
  - Sales Reports (active)
  - Job Performance
  - Technician Performance
  - Customer Insights
  - Financial Reports

**Central Panel - Report Selection**
- List of available reports under category:
  - Total Revenue by Month
  - Revenue by Technician
  - New vs Repeat Customers
  - Average Job Value
  - etc.

**Right Panel - Report Visualization**
- **Chart type:** Line chart showing revenue trend
  - X-axis: Months (Jan, Feb, Mar, etc.)
  - Y-axis: Revenue ($0 - $100,000)
  - Lines: Multiple if comparing (e.g., 2024 vs 2025)
  - Legend: Shows series
  - Hover: Tooltip showing exact values
  - Color: Blue line (#2196F3), secondary line (#00BCD4)

- **Below chart - Table:**
  - Data backing the chart
  - Columns: Month | Revenue | Growth %
  - Rows: Each month
  - Totals row at bottom

### Additional Sections (Below chart)
- **Summary statistics boxes:**
  - Total Revenue: $XXX,XXX
  - Average Monthly: $X,XXX
  - Highest Month: $XXX,XXX
  - Growth Rate: +X%

### Interactions
- Click on report → loads that report in visualization area
- Change date range → chart updates
- Hover on chart → tooltip
- Click legend item → toggle series visibility
- Download button → saves report

### Colors
- Chart line: Blue (#2196F3)
- Chart background: White
- Grid lines: Light gray (#E0E0E0)
- X/Y axis text: Dark gray (#666)
- Legend: Gray text (#333)
- Summary boxes: Blue background (#E3F2FD), blue text (#2196F3)
- Selected report: Highlight (#E3F2FD) or underline (#2196F3)

---

## Screenshot 19: Settings - General (11.32.46 AM)
**Dimensions:** 2880 x 1800

### Layout
- Sidebar + main content
- Settings navigation + content area

### Left Panel - Settings Categories
- Vertical menu or tabs:
  - General (active)
  - User Profile
  - Business Settings
  - Notifications
  - Integrations
  - Advanced
  - Billing (if applicable)

**Active category styling:**
- Blue text (#2196F3) or highlight background

### Main Content - General Settings

**Page title:** "General Settings"

**Form sections:**

**1. Company Information**
- Company Name (text input)
- Company Email (email input)
- Company Phone (phone input)
- Company Website (URL input)
- Logo upload:
  - Current logo preview
  - Upload button
  - Remove button

**2. Location/Regional**
- Time Zone (dropdown):
  - Searchable list of time zones
  - Current: "America/New_York"
- Date Format (dropdown):
  - Options: MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD
- Time Format (radio):
  - 12 hour (default)
  - 24 hour
- Currency (dropdown):
  - USD, EUR, GBP, etc.
  - Shows symbol (e.g., "$")
- Language (dropdown):
  - English, Spanish, French, etc.

**3. Business Settings**
- Business Type (dropdown):
  - Options: Plumbing, HVAC, Electrical, General Services, etc.
- Service Categories (multi-select):
  - Tags showing selected categories
- Tax ID/GST Number (text)
- Business License Number (text)

**4. Application Settings**
- Default view (radio):
  - Jobs table view or calendar view default
- Items per page (number input):
  - Default: 25
- Enable notifications (checkbox/toggle)
- Enable email notifications (checkbox/toggle)
- Timezone-aware scheduling (checkbox/toggle)

**Footer**
- Save button (primary, blue)
- Cancel button (secondary)
- Reset to defaults button (tertiary/text)
- "Changes saved" message (on save - green, auto-dismiss)

### Form Styling
- Labels: 14px, semibold, dark gray (#333)
- Input fields: 40px height, white background
- Input borders: #E0E0E0
- Focus border: #2196F3
- Helper text: 12px, gray (#666)
- Required field: Red asterisk (*)
- Section spacing: 24px between sections
- Section headers: 16px, semibold

### Colors
- Form background: White
- Section divider: Light gray border (#E0E0E0)
- Save button: #2196F3
- Cancel button: White with border #E0E0E0
- Success message: Green (#4CAF50)

---

## Screenshot 20: Settings - Advanced (11.32.48 AM)
**Dimensions:** 2880 x 1800

### Layout
- Same as Screenshot 19
- Different settings category (Advanced tab selected)

### Main Content - Advanced Settings

**Page title:** "Advanced Settings"

**Sections:**

**1. Data Management**
- Export Data:
  - "Download backup" button
  - Last backup date
  - Auto-backup toggle
  - Backup frequency selector (Daily, Weekly, Monthly)
- Import Data:
  - File upload button
  - Upload progress bar
  - Warning message about overwriting data
- Delete All Data:
  - Danger button (red)
  - Requires confirmation modal
  - Password confirmation required

**2. API & Integrations**
- API Keys section:
  - List of existing API keys:
    - Key name | Created date | Last used | Actions (View, Regenerate, Delete)
  - Generate New API Key button
  - API documentation link
- Webhook configuration:
  - Add webhook button
  - List of webhooks:
    - URL | Event | Status (Active/Inactive) | Actions (Edit, Delete)
  - Test webhook button

**3. Audit & Logs**
- Activity log:
  - Filter by user, action, date range
  - Table:
    - Columns: Date | User | Action | Changes | IP Address
    - Rows: Log entries
  - Download logs button (CSV/PDF)
  - Clear logs button (with confirmation)

**4. Security**
- Session Management:
  - Active sessions list
  - Each session shows: Device, Location, Last active, End session button
  - End all other sessions button
- Two-factor authentication (2FA):
  - Enable/disable toggle
  - Current status
  - Recovery codes display/regenerate
- Login history:
  - List of recent logins
  - Date | Time | IP Address | Device | Status (Success/Failed)

**5. System Information**
- Application version (read-only)
- Database version (read-only)
- Last backup (read-only)
- Storage usage (progress bar):
  - Used: XX GB / Total: YY GB
  - Used percentage: X%
- Clear cache button
- Optimize database button

**Footer**
- Save button (if applicable)
- Reset to defaults button (with confirmation)
- Warning message: "Advanced settings. Be careful with changes."

### Styling
- Danger buttons: Red (#F44336)
- Warning sections: Light red background (#FFEBEE)
- Read-only fields: Gray background (#F5F5F5)
- Progress bars: Blue (#2196F3) for used portion
- Status indicators: Green (Active), Gray (Inactive)
- Confirmation modals: Dark overlay with modal

### Colors
- Danger/Delete: Red (#F44336)
- Warning: Orange (#FF9800)
- Active: Green (#4CAF50)
- Info/Secondary: Gray (#666)
- Read-only: #F5F5F5 background

---

## Screenshots 21-30: Additional Interactions and Modals

These final 10 screenshots likely show:

### Screenshot 21 (11.32.49)
- Possibly: Job edit modal/form
- Or: Schedule interaction state
- Or: Confirmation dialog

### Screenshot 22 (11.32.51)
- Modal or form interaction
- Possibly: Delete confirmation
- Or: Success notification

### Screenshot 23 (11.32.53)
- Form validation state
- Error message display
- Or: Loading state

### Screenshot 24 (11.32.57)
- Toast notification
- Or: Modal overlay
- Or: Dropdown menu open

### Screenshots 25-30 (11.32.59 - 11.33.09)
- Various UI states and interactions
- Modals, forms, notifications
- Edge cases and transitions
- Loading states
- Error states
- Success confirmations

---

## Summary of Key Observations

### Consistent Elements Across All Pages
1. **Sidebar Navigation** - Always visible, dark themed
2. **Header** - Company branding, user profile, notifications
3. **Main Content Area** - White background, card-based layout
4. **Buttons** - Consistent primary (blue), secondary (outlined), danger (red)
5. **Tables** - Consistent formatting with sortable headers, pagination
6. **Modals** - Consistent styling with overlay, centered, rounded corners
7. **Forms** - Stacked layout, labels above inputs, consistent spacing
8. **Colors** - Blue primary, green success, orange warning, red error
9. **Typography** - Sans-serif, clear hierarchy, consistent sizes
10. **Spacing** - 8px base unit, consistent padding and margins

### Design Consistency
- Professional, clean interface
- High contrast for readability
- Color-coded status indicators
- Icon-supported navigation
- Responsive layout indicators
- Clear call-to-action buttons
- Consistent form patterns
- Data-driven visualizations
- User-friendly interactions

### Components to Prioritize
1. Layout/Navigation (Sidebar, Header)
2. Form components (Input, Select, Checkbox)
3. Table component (with sorting, pagination)
4. Button variants
5. Modal/Dialog
6. Card component
7. Status badges
8. Chart/Graph components
9. Date pickers
10. Search/Filter controls

