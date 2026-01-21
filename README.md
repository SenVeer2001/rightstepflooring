# FSM Pro - Field Service Management Admin Panel

A modern, full-featured Field Service Management (FSM) platform built with React, TypeScript, and Tailwind CSS. Designed to be a competitive alternative to Workiz with advanced features for service businesses.

> **Status**: ✅ Production Ready | **Version**: 1.0.0 | **Last Updated**: January 10, 2026

---

## 📚 Documentation Quick Links

| Document | Purpose |
|----------|---------|
| **README.md** | You are here - Main overview |
| **[FEATURES.md](./FEATURES.md)** | 📋 Detailed feature guide & usage |
| **[BUILD_SUMMARY.md](./BUILD_SUMMARY.md)** | 🎯 Complete build summary & next steps |
| **[FILE_INVENTORY.md](./FILE_INVENTORY.md)** | 📁 All files created & structure |
| **[VERIFICATION.md](./VERIFICATION.md)** | ✅ Testing checklist for all features |

---

## 🚀 Features Implemented

### ✅ Authentication & Security
- **Login Page** - Beautiful, responsive authentication interface
- **Auth Context** - Global authentication state management
- **Protected Routes** - Automatic redirection to login for unauthenticated users
- **Session Management** - Persistent login with localStorage
- **Demo Credentials** - Easy testing (email: `admin@fsm.com`, password: `demo123`)

### ✅ Admin Dashboard
- **9 Core Modules** - Dashboard, Jobs, Dispatch, Customers, Technicians, Invoices, Reports, Automation, Settings
- **Real-time Statistics** - Jobs today, revenue, team activity
- **KPI Cards** - Revenue, technician utilization, job trends
- **Recent Activity Feed** - Live team activity tracking

### ✅ Advanced Job Management
- **Job Modal Form** - Create/edit jobs with comprehensive form validation
- **Form Validation** - Client-side validation with error messages
- **Status Tracking** - Pending → Assigned → In Progress → Completed → Invoiced
- **Priority Levels** - Low, Medium, High, Urgent
- **Custom Fields** - Title, customer, technician, date, time, location, description, duration
- **Job Table** - Full CRUD with filters, search, and export

### ✅ Drag-and-Drop Dispatch Board
- **Native HTML5 Drag-Drop** - Drag jobs between technician columns
- **Technician Assignment** - Real-time job reassignment
- **Unassigned Jobs Queue** - Manage jobs waiting for assignment
- **Job Details** - Time, location, phone, status displayed on cards
- **Visual Status Indicators** - Green (Active), Blue (Scheduled)
- **Job Count Tracking** - Per-technician job load visibility

### ✅ GPS & Location Tracking
- **GPS Map View** - Visual map display of technician locations (coordinates)
- **Real-time Positioning** - Latitude/longitude tracking for all jobs
- **Navigate Button** - Quick access to navigation for each job
- **Location-based Data** - Jobs organized by service location
- **Map Legend** - Active vs. Scheduled job differentiation

### ✅ Mobile Responsiveness
- **Fully Responsive Design** - Works seamlessly on mobile, tablet, desktop
- **Responsive Breakpoints** - Tailwind's md:, lg:, sm: utilities throughout
- **Mobile Navigation** - Hidden elements on small screens, menu optimization
- **Touch-friendly** - Larger tap targets, optimized spacing
- **Adaptive Layout** - Grid columns adjust per screen size
- **Mobile Tables** - Horizontal scroll with hidden columns on small screens

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3
- **Routing**: React Router v6
- **Icons**: Lucide React (400+ icons)
- **Charts**: Recharts (data visualization)

## 🚀 Getting Started

### Installation
```bash
npm install --legacy-peer-deps
```

### Development
```bash
npm run dev
```
Access at `http://localhost:5173`

### Build
```bash
npm run build
```

## 🔐 Login Credentials

- **Email**: admin@fsm.com
- **Password**: demo123

## 📁 Project Structure

```
workiz/
├── src/
│   ├── app/
│   │   ├── dashboard/    ← KPI dashboard with charts
│   │   ├── jobs/         ← Job CRUD with modal
│   │   ├── dispatch/     ← Drag-drop dispatch board + GPS
│   │   ├── customers/    ← CRM module
│   │   ├── technicians/  ← Team management
│   │   ├── invoices/     ← Billing system
│   │   ├── reports/      ← Analytics
│   │   ├── automation/   ← Workflow rules
│   │   ├── settings/     ← Configuration
│   │   └── login/        ← Authentication
│   ├── components/
│   │   ├── layout/
│   │   ├── JobModal.tsx     ← Advanced form
│   │   └── ProtectedRoute.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   └── routes/AppRoutes.tsx
├── docs/
│   ├── FEATURES.md         ← Feature guide
│   ├── BUILD_SUMMARY.md    ← Build summary
│   └── VERIFICATION.md     ← Testing checklist
```

## 🎯 Key Features Summary

| Feature | Status | Location |
|---------|--------|----------|
| Login/Auth | ✅ Complete | `/login` |
| Dashboard | ✅ Complete | `/` |
| Jobs CRUD | ✅ Complete | `/jobs` |
| Job Modal | ✅ Complete | Jobs page |
| Dispatch Board | ✅ Complete | `/dispatch` |
| Drag-Drop | ✅ Complete | Dispatch page |
| GPS Tracking | ✅ Complete | Dispatch page |
| Mobile Design | ✅ Complete | All pages |
| Customers | ✅ Complete | `/customers` |
| Invoices | ✅ Complete | `/invoices` |
| Reports | ✅ Complete | `/reports` |
| Automation | ✅ Complete | `/automation` |

---

**Built with ❤️ using React + Tailwind CSS**

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
