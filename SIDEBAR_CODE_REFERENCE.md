# Collapsible Sidebar - Code Reference

## Quick Implementation Summary

### 1. State Management (Sidebar.tsx)
```tsx
const [isExpanded, setIsExpanded] = useState(false)

// Mouse handlers
onMouseEnter={() => setIsExpanded(true)}
onMouseLeave={() => setIsExpanded(false)}
```

### 2. Width Animation
```tsx
<aside
  style={{
    width: isExpanded ? "240px" : "70px",
  }}
  className="transition-all duration-300 ease-in-out"
>
```

### 3. Text Label Opacity (Applied to all text elements)
```tsx
<span
  style={{
    opacity: isExpanded ? 1 : 0,
    width: isExpanded ? "auto" : "0",
    pointerEvents: isExpanded ? "auto" : "none",
  }}
  className="transition-all duration-300"
>
  {label}
</span>
```

### 4. Icon Behavior
```tsx
<item.icon size={20} className="flex-shrink-0" />
{/* Always visible, never hidden */}
```

### 5. Tooltips (on Collapsed Items)
```tsx
title={!isExpanded ? item.name : undefined}
```

---

## CSS Additions (index.css)

```css
/* Collapsed state */
aside {
  width: 70px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover to expand (desktop only) */
@media (min-width: 769px) {
  aside:hover {
    width: 240px;
  }
}

/* Mobile: always collapsed */
@media (max-width: 768px) {
  aside {
    width: 70px !important;
  }
  
  aside a span,
  aside button span {
    display: none !important;
  }
}
```

---

## Layout Structure

### Collapsed State (70px)
```
┌─────────────────────┐
│ 🎭 Menu Icon        │ ← Always visible
├─────────────────────┤
│ 🏠                  │ ← Icons only
│ 👥                  │
│ 📄                  │
│ 💳                  │
│   ...               │
├─────────────────────┤
│ 🚪                  │ ← Logout icon
└─────────────────────┘
```

### Expanded State (240px)
```
┌──────────────────────────────────┐
│ 🎭 Menu  🏠 Right Step Flooring   │
├──────────────────────────────────┤
│ 🏠 Dashboard                     │
│ 👥 Leads                         │
│ 📄 Estimates                     │
│ 💳 Invoices                      │
│ 👤 Customers                     │
│ ☎️  CRM Calls                     │
│                                  │
│ 📅 Jobs                          │
│ ✅ Schedule                       │
│ 📍 Map View                      │
│ 📊 Product                       │
│ 💰 Payout                        │
│                                  │
│ 👔 Staff(Internal)               │
│                                  │
│ 📈 Report                        │
├──────────────────────────────────┤
│ 🚪 Logout                        │
└──────────────────────────────────┘
```

---

## Key Values

| Property | Value |
|----------|-------|
| **Collapsed Width** | 70px |
| **Expanded Width** | 240px |
| **Animation Duration** | 300ms |
| **Easing Function** | cubic-bezier(0.4, 0, 0.2, 1) |
| **Icon Size** | 20px (lucide-react) |
| **Gap Between Icon & Text** | gap-4 (1rem) |
| **Padding (X)** | px-3 (0.75rem) |
| **Padding (Y)** | py-3 (0.75rem) |

---

## Animation Flow

1. **Mouse Enter**
   ```
   Width: 70px → 240px (300ms)
   Opacity: 0 → 1 (300ms, staggered)
   ```

2. **Mouse Leave**
   ```
   Width: 240px → 70px (300ms)
   Opacity: 1 → 0 (300ms)
   ```

---

## Component Files Modified

### 1. src/components/layout/Sidebar.tsx
**Changes:**
- Added `useState` hook for `isExpanded` state
- Added `onMouseEnter` and `onMouseLeave` handlers
- Updated `width` from fixed `260px` to dynamic `70px/240px`
- Added inline `style` for opacity transitions
- Added `title` attributes for tooltips
- Added `flex-shrink-0` to icons
- Updated spacing and padding values

### 2. src/components/layout/AdminLayout.tsx
**Changes:**
- Removed `isSidebarOpen` state (no longer needed)
- Removed mobile overlay logic
- Simplified sidebar wrapper from fixed/absolute to always visible
- Removed mobile toggle functionality (desktop hover handles expansion)

### 3. src/index.css
**Added:**
```css
/* Collapsible Sidebar Styles */
aside { width: 70px; }
aside { transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
@media (min-width: 769px) { aside:hover { width: 240px; } }
@media (max-width: 768px) { aside { width: 70px !important; } }
```

---

## Responsive Behavior

| Screen Size | Behavior | Width |
|-------------|----------|-------|
| Desktop | Expands on hover | 70px → 240px |
| Tablet | Always collapsed | 70px (fixed) |
| Mobile | Always collapsed | 70px (fixed) |

---

## Utilities Used

- **React**: `useState` for state management
- **React Router**: `NavLink` for routing (unchanged)
- **Lucide React**: Icons (unchanged)
- **Tailwind CSS**: Utility classes
  - `transition-all duration-300 ease-in-out`
  - `flex-shrink-0` (prevents icon shrinking)
  - `overflow-hidden` (clips text on width transition)
  - `whitespace-nowrap` (prevents line breaks)
  - `pointer-events-none/auto` (via style prop)

---

## Browser Devtools Tips

### Inspect Animation
```javascript
// Chrome DevTools > Elements > Sidebar
// Check Computed tab for:
// - width: 70px or 240px
// - opacity: 0 or 1
// - transition: width 0.3s cubic-bezier(...)
```

### Test Mobile View
```
F12 > Toggle Device Toolbar (Ctrl+Shift+M)
Max-width: 768px tests mobile behavior
```

### Performance Check
```javascript
// Chrome DevTools > Performance
// Record 3 seconds of hovering over sidebar
// Check for: Paint, Composite, Layout
```

---

## Common Modifications

### 1. Change Collapse Width
**In Sidebar.tsx:**
```tsx
width: isExpanded ? "240px" : "80px"  // Changed 70px to 80px
```

### 2. Change Expand Width
**In Sidebar.tsx:**
```tsx
width: isExpanded ? "280px" : "70px"  // Changed 240px to 280px
```

### 3. Faster Animation
**In index.css:**
```css
transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);  /* 0.3s → 0.2s */
```

### 4. Slower Animation
**In index.css:**
```css
transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);  /* 0.3s → 0.5s */
```

### 5. Different Easing
```css
/* Linear */
transition: width 0.3s linear;

/* Smooth */
transition: width 0.3s ease-in-out;

/* Bounce (requires keyframes) */
transition: width 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## Troubleshooting

### Problem: Text still visible when collapsed
**Check:**
1. `opacity: 0` applied to span
2. `pointerEvents: none` set
3. Media query for mobile hiding text

### Problem: Sidebar not expanding
**Check:**
1. Mouse events firing (check console)
2. `isExpanded` state updating
3. Width style prop correctly applied

### Problem: Jank/Choppy animation
**Check:**
1. GPU acceleration enabled (chrome://gpu)
2. Use `transform` or `opacity` (not layout properties)
3. Reduce number of elements being animated

### Problem: Layout shifts
**Check:**
1. Icons have `flex-shrink-0`
2. Padding/margin consistent
3. Fixed widths on collapsed state

---

## Testing Scenarios

### ✅ Must Pass
- [ ] Sidebar collapses on page load
- [ ] Sidebar expands on mouse hover
- [ ] Sidebar collapses on mouse leave
- [ ] Text fades smoothly (no popping)
- [ ] Icons stay centered
- [ ] All navigation links work
- [ ] Active link styling works
- [ ] Logout button works
- [ ] Mobile view stays collapsed
- [ ] No layout shift
- [ ] Tooltips appear on hover (collapsed)

### 🎨 Visual Polish
- [ ] Easing feels natural
- [ ] Duration feels right (300ms)
- [ ] No flickering
- [ ] Smooth opacity transitions
- [ ] Icon alignment consistent

### ♿ Accessibility
- [ ] Keyboard navigation works
- [ ] Tab order correct
- [ ] Tooltips accessible
- [ ] Color contrast maintained
- [ ] Focus states visible

---

## Performance Notes

- **Paint**: Only on width/opacity change (minimal)
- **Composite**: Smooth 60fps on modern browsers
- **Layout**: Minimal reflow (fixed dimensions)
- **JavaScript**: Event handlers only on hover (efficient)

---

## Migration Path (If Needed)

To revert to fixed width:
1. Remove `useState` hook
2. Remove mouse event handlers
3. Change width from `style` to fixed class
4. Revert AdminLayout changes
5. Remove CSS media queries

---

## Additional Resources

- [Tailwind CSS Transitions](https://tailwindcss.com/docs/transition-property)
- [CSS Easing Functions](https://easings.net/)
- [React Hooks Documentation](https://react.dev/reference/react/useState)
- [Web Performance Best Practices](https://web.dev/performance/)

