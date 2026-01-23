# Training Module Design System

## 🎨 Color Palette

### Primary Colors
- **Primary Green**: `#387d22` - Main brand color
- **Primary Gradient**: `from-green-600 to-emerald-600`
- **Hover State**: `hover:from-green-700 hover:to-emerald-700`

### Secondary Colors
- **Emerald**: `#10b981` - Secondary accents
- **Teal**: `#14b8a6` - Additional accents

### Status Colors
- **Success**: `bg-green-100 text-green-600` or `bg-gradient-to-br from-green-50 to-emerald-50`
- **Info**: `bg-blue-100 text-blue-600` or `bg-gradient-to-br from-blue-50 to-cyan-50`
- **Warning**: `bg-yellow-100 text-yellow-600`
- **Error**: `bg-red-100 text-red-600`

### Neutral Colors
- **Dark Gray**: `text-gray-900` - Text
- **Medium Gray**: `text-gray-600` - Secondary text
- **Light Gray**: `text-gray-400` - Tertiary text
- **Background**: `bg-gray-50` or `bg-gray-100`

---

## 🎯 Component Styling

### Buttons
```tsx
// Primary Action
className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"

// Secondary Action
className="border-2 border-gray-300 text-gray-700 font-bold px-6 py-3 rounded-lg hover:border-gray-400 transition-all"

// Danger Action
className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition-all"
```

### Cards
```tsx
className="bg-white rounded-xl border border-gray-200 p-6 shadow-soft hover:shadow-md transition-all"
```

### Inputs & Selects
```tsx
className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 hover:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
```

### Headers
```tsx
className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
```

### Badges
```tsx
// Category Badge
className="text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full border border-green-200"

// Status Badge  
className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-sm font-bold rounded-full"
```

---

## 📐 Spacing System

- **xs**: `p-2` or `gap-2`
- **sm**: `p-3` or `gap-3`
- **md**: `p-4` or `gap-4`
- **lg**: `p-6` or `gap-6`
- **xl**: `p-8` or `gap-8`

---

## 🔤 Typography

### Headings
- **H1**: `text-4xl font-bold`
- **H2**: `text-3xl font-bold`
- **H3**: `text-2xl font-bold`
- **H4**: `text-xl font-bold`

### Body Text
- **Regular**: `text-gray-900 font-medium`
- **Secondary**: `text-gray-600 font-medium`
- **Small**: `text-sm font-semibold text-gray-600`
- **Extra Small**: `text-xs font-bold text-gray-600 uppercase tracking-wide`

---

## 🌟 Shadow System

```css
/* Soft Shadow */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

/* Medium Shadow */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);

/* Large Shadow */
box-shadow: 0 0 30px rgba(14, 165, 233, 0.15);
```

**In Tailwind:**
- `shadow-soft` - Subtle shadow
- `shadow-md` - Medium shadow
- `shadow-lg` - Large shadow
- `hover:shadow-lg` - Hover effect

---

## 📦 Border Radius

- **Small**: `rounded-lg` (8px)
- **Medium**: `rounded-xl` (12px)
- **Large**: `rounded-2xl` (16px)
- **Pill**: `rounded-full`

---

## 🎬 Transitions & Animations

### Standard Transition
```tsx
className="transition-all"
className="transition-colors"
className="transition-opacity"
```

### Hover Effects
```tsx
// Border Color Change
hover:border-green-300

// Background Change
hover:bg-green-50

// Text Color Change
hover:text-green-600

// Shadow Change
hover:shadow-lg

// Combined
hover:border-green-300 hover:bg-green-50 hover:shadow-md
```

---

## 🎨 Gradient Patterns

### Background Gradients
```tsx
// Green Gradient
className="bg-gradient-to-r from-green-600 to-emerald-600"

// Light Background Gradient
className="bg-gradient-to-br from-green-50 to-emerald-50"

// Page Background
className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
```

### Text Gradients
```tsx
className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
```

---

## 🔍 Select Component Styling

```tsx
<Select
  label="Category"
  value={value}
  onChange={handleChange}
>
  <option value="">Select a category</option>
  <option value="tech">Technology</option>
</Select>
```

**Style Classes:**
```tsx
className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm
           focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
```

---

## 📱 Responsive Breakpoints

- **sm**: 640px
- **md**: 768px  
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

**Usage:**
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

---

## ✨ Icon Usage

All icons use emoji for consistency and quick visual recognition:

- 📚 Courses
- 🎓 Education/Training
- 💡 Ideas/Info
- ✓ Success/Check
- ⚠ Warning
- 🚀 Publish/Launch
- 📋 Forms/Details
- 📁 Categories
- 📌 Subcategories
- 📊 Analytics/Stats
- 🎯 Goals/Targets

---

## 🎯 Component Examples

### Beautiful Card
```tsx
<div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-green-200 group">
  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
    Card Title
  </h3>
  <p className="text-sm text-gray-600">Card content</p>
</div>
```

### Form Group
```tsx
<div className="space-y-6">
  <div>
    <label className="block text-sm font-bold text-gray-900 mb-2">
      Field Label
    </label>
    <input
      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 hover:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
      placeholder="Enter value"
    />
  </div>
</div>
```

### Gradient Button
```tsx
<button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg">
  <Icon size={20} />
  Button Text
</button>
```

---

## 🎓 Usage Guidelines

1. **Always use gradients** for primary actions
2. **Use Select component** for dropdowns
3. **Add hover effects** for interactivity
4. **Maintain consistent spacing** throughout
5. **Use emoji icons** for visual interest
6. **Apply shadows** for depth
7. **Use green theme** as primary color
8. **Test on mobile** devices

---

## 📊 Design Tokens Summary

| Token | Value | Usage |
|-------|-------|-------|
| Primary Green | #387d22 | Buttons, links, accents |
| Primary Light | #10b981 | Hover states, backgrounds |
| Text Dark | #111827 | Headlines, body text |
| Text Light | #6b7280 | Secondary text |
| Background | #f9fafb | Page background |
| Border | #e5e7eb | Card borders |
| Shadow Soft | 0 4px 12px rgba(0,0,0,0.05) | Cards, buttons |

---

**All pages follow this design system consistently for a cohesive, professional appearance.**
