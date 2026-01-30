# Customer & Job Detail Page - Implementation Guide

## Overview
This implementation provides a clean, tabbed interface for viewing and managing customer and job details. The structure mirrors the Leads component design while maintaining consistency across the application.

## File Structure

```
src/components/customerPages/
├── CustomerAndJobModel.tsx          (Main component - Routes & State)
├── CustomerJobHeader.tsx            (Header with back button)
├── CustomerJobTabs.tsx              (Tab navigation component)
├── DetailsTab.tsx                   (Customer details section)
├── ItemsTab.tsx                     (Job items/line items)
├── PaymentsTab.tsx                  (Payment history)
├── EstimatesTab.tsx                 (Estimates management)
├── AttachmentsTab.tsx               (File attachments)
├── TasksTab.tsx                     (Tasks & checklist)
└── EquipmentTab.tsx                 (Equipment management)
```

## Tabs Available

| Tab | Purpose | Features |
|-----|---------|----------|
| **Details** | Customer information | Name, email, phone, address, company |
| **Items** | Job line items | Add/edit/delete items, subtotal calculation |
| **Payments** | Payment tracking | Payment history with status |
| **Estimates** | Quote management | Create, send, and track estimates |
| **Attachments** | File management | Upload/delete files (drag & drop supported) |
| **Tasks** | Project tasks | Add tasks, mark complete, assign users |
| **Equipment** | Equipment tracking | Manage equipment used in jobs |

## Usage

### Basic Setup
```tsx
import CustomerAndJobModel from './CustomerAndJobModel'

// In your routes
<Route path="/customers/:customerId" element={<CustomerAndJobModel />} />
```

### Tab Management
- Tabs are managed in `CustomerAndJobModel.tsx` with the `activeTab` state
- Each tab component is conditionally rendered based on `activeTab`
- Click any tab to navigate to that section

### Styling & Theme
- Uses Tailwind CSS for consistent styling
- Primary color from CSS variables (--primary-color)
- Follows the same design pattern as the Leads component
- Responsive design (works on mobile and desktop)

## Component Props

### CustomerJobHeader
```tsx
interface CustomerJobHeaderProps {
  customerName: string
  customerId: string
  jobNumber?: string
  clientPhone?: string
}
```

### Tab Components
Each tab component accepts optional props for data and callbacks:
```tsx
// Example: ItemsTab
interface ItemsTabProps {
  items?: Item[]
  onAddItem?: () => void
  onEditItem?: (id: number) => void
  onDeleteItem?: (id: number) => void
}
```

## Features

### ✅ Details Tab
- Display customer information
- Edit mode toggle
- Address formatting

### ✅ Items Tab
- Add/remove items
- Quantity and pricing
- Automatic subtotal calculation
- Edit items inline

### ✅ Payments Tab
- View payment history
- Filter by status (completed, pending, failed)
- Add new payments

### ✅ Estimates Tab
- Create new estimates
- Download estimates as PDF
- Track estimate status
- Delete estimates

### ✅ Attachments Tab
- Drag & drop file upload
- File type display
- Upload date tracking
- Delete attachments
- Supports images, documents, and videos

### ✅ Tasks Tab
- Add/complete/delete tasks
- Task assignments
- Due dates
- Task descriptions
- Visual completion indicator

### ✅ Equipment Tab
- Track equipment used
- Serial number management
- Equipment status (available, in-use, maintenance)
- Edit/delete equipment

## Extending the Components

### Adding a New Tab
1. Create a new component in `customerPages/` folder
2. Add the tab key to `CustomerJobTabKey` type
3. Add the tab to the `tabs` array in `CustomerJobTabs.tsx`
4. Add conditional rendering in `CustomerAndJobModel.tsx`

### Connecting to API
Replace mock data in each component with API calls:
```tsx
const [data, setData] = useState([])

useEffect(() => {
  fetchData(customerId).then(setData)
}, [customerId])
```

## Styling Notes
- All components use consistent spacing and colors
- Hover effects on buttons and table rows
- Status badges with appropriate color coding
- Mobile-responsive tables with overflow handling
- Empty states for better UX

## Navigation
- Back button returns to previous page
- Click any tab to navigate within the page
- Customer name is clickable to navigate to customer page

## Next Steps
1. Connect to actual API endpoints
2. Add form validation for edit modes
3. Implement file upload handling
4. Add search/filter functionality
5. Integrate with your backend services
