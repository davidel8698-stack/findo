# Centering Patterns Guide

> Comprehensive guide for proper element centering in the Findo website.
> Claude must follow these patterns when writing or reviewing UI code.

---

## ⚠️ CRITICAL: Tailwind 4 Container Fix

**Tailwind 4's `container` class does NOT auto-center by default!**

This MUST be in `globals.css`:

```css
@layer utilities {
  .container {
    margin-inline: auto;
  }
}
```

Without this fix, ALL content using `container` will be left/right aligned instead of centered.

### How to Diagnose
If you see systematic right-shift (RTL) or left-shift (LTR) across ALL sections:
1. Check `globals.css` for container centering
2. Verify `margin-inline: auto` is applied to `.container`
3. This is a **framework-level issue**, not individual component issue

---

## The Golden Rule

**Every element with a max-width constraint MUST have `mx-auto` for centering.**

```tsx
// WRONG - will be edge-aligned
<div className="max-w-md">content</div>

// CORRECT - properly centered
<div className="max-w-md mx-auto">content</div>
```

---

## Section Wrapper Pattern

### Standard Section Structure

```tsx
{/* In page.tsx */}
<section className="py-16 md:py-24 bg-muted/30">
  <div className="container">
    <ComponentName />
  </div>
</section>
```

### Component Internal Structure

Components should NOT include their own section/container wrappers:

```tsx
// WRONG - double wrapping
export function MyComponent() {
  return (
    <section className="py-16">
      <div className="container">
        <Content />
      </div>
    </section>
  );
}

// CORRECT - let page.tsx control layout
export function MyComponent({ className }) {
  return (
    <div className={cn("w-full", className)}>
      <Content />
    </div>
  );
}
```

### Exception: Self-contained Sections

Components that are called directly in page.tsx WITHOUT wrapper can have their own section:

```tsx
{/* page.tsx - no wrapper */}
<ROICalculator />
<PricingSection />
<FAQSection />
```

These components CAN include their own `<section>` and `container`.

---

## Centering Patterns by Element Type

### 1. Full-width Content with Max-width

```tsx
// For centered content blocks
<div className="max-w-4xl mx-auto">
  <Content />
</div>

// Common max-widths:
// max-w-sm  (384px) - Forms, compact cards
// max-w-md  (448px) - Cards, single columns
// max-w-lg  (512px) - Medium content
// max-w-xl  (576px) - Wide content
// max-w-2xl (672px) - Text blocks
// max-w-4xl (896px) - Wide layouts
// max-w-5xl (1024px) - Very wide layouts
```

### 2. Grid Content

```tsx
// Centered grid with max-width
<div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
  {items.map(item => <Item />)}
</div>
```

### 3. Form Elements

```tsx
// Forms MUST have mx-auto when constrained
<form className="max-w-sm mx-auto">
  <Input />
  <Button className="w-full" />
</form>
```

### 4. Cards

```tsx
// Standalone cards
<div className="max-w-lg mx-auto bg-card rounded-xl p-6">
  <CardContent />
</div>
```

### 5. Tables/Comparison

```tsx
// Scrollable tables with max-width
<div className="overflow-x-auto max-w-4xl mx-auto">
  <table className="w-full min-w-[600px]">
    {/* content */}
  </table>
</div>
```

---

## Flex Centering

### Horizontal Centering

```tsx
// Center a single element
<div className="flex justify-center">
  <Element />
</div>

// IMPORTANT: If child has w-full, it won't be centered!
// The child needs its own max-width + mx-auto
```

### Vertical Centering

```tsx
<div className="flex items-center min-h-screen">
  <Content />
</div>
```

### Flex with Max-width Children

```tsx
// Parent centers the wrapper
<div className="flex justify-center">
  {/* Child with w-full expands to parent, needs inner centering */}
  <div className="w-full">
    {/* Inner content needs its own centering */}
    <form className="max-w-sm mx-auto">
      {/* ... */}
    </form>
  </div>
</div>
```

---

## Common Anti-Patterns

### 1. Missing mx-auto

```tsx
// BAD
<div className="max-w-md">content</div>

// GOOD
<div className="max-w-md mx-auto">content</div>
```

### 2. Double Max-width

```tsx
// BAD - confusing, harder to maintain
<div className="max-w-xl mx-auto">
  <div className="max-w-lg mx-auto">
    content
  </div>
</div>

// GOOD - single constraint
<div className="max-w-lg mx-auto">
  content
</div>
```

### 3. Double Section Wrappers

```tsx
// BAD - page.tsx
<section className="py-16">
  <div className="container">
    <Component /> {/* Component also has <section> */}
  </div>
</section>

// GOOD - Component returns <div>, not <section>
```

### 4. Assuming Parent Centering

```tsx
// BAD assumption
<div className="flex justify-center">
  <div className="w-full max-w-md">  {/* w-full breaks centering! */}
    content
  </div>
</div>

// GOOD - let max-width control width
<div className="flex justify-center">
  <div className="max-w-md w-full">  {/* Order matters visually but not functionally */}
    content
  </div>
</div>
// OR better:
<div className="w-full">
  <div className="max-w-md mx-auto">
    content
  </div>
</div>
```

---

## RTL Considerations

In RTL layouts:
- `mx-auto` works correctly (centers horizontally)
- `justify-start` = right side in RTL
- `justify-end` = left side in RTL
- Use logical properties (`ms-`, `me-`, `ps-`, `pe-`) instead of `ml-`, `mr-`

---

## Visual Balance vs Technical Centering

**Important distinction:**
- **Technical centering**: Element is mathematically centered using CSS
- **Visual balance**: Content APPEARS balanced relative to screen center

### Key Insight
Content doesn't HAVE to be technically centered if the layout is intentionally asymmetric.
BUT content MUST be visually BALANCED relative to the screen center.

### Example: Two-Column Layouts

```tsx
// 50/50 grid can still be visually unbalanced if one column has much less content
<div className="grid lg:grid-cols-2">
  <div>{/* Narrow phone mockup ~200px */}</div>
  <div>{/* Wide text content ~500px */}</div>
</div>
```

**Solution: Bound the grid itself for visual balance**

```tsx
// Add max-width + mx-auto to the GRID for visual balance
<div className="grid lg:grid-cols-2 max-w-6xl mx-auto">
  <div>{/* Content */}</div>
  <div>{/* Content */}</div>
</div>
```

This ensures the combined 2-column layout is centered as a unit.

---

## Checklist for New Components

Before shipping any component:

- [ ] Does it have max-width? → Add `mx-auto`
- [ ] Is it wrapped in page.tsx section? → Don't add own section
- [ ] Does it have a form? → Form has `mx-auto`
- [ ] Is there a grid? → Grid has `max-w-*` + `mx-auto`
- [ ] Any constrained element? → All have `mx-auto`

---

## Quick Reference

| Element Type | Pattern |
|-------------|---------|
| Section content | `max-w-4xl mx-auto` |
| Forms | `max-w-sm mx-auto` |
| Cards | `max-w-lg mx-auto` |
| Tables | `overflow-x-auto max-w-4xl mx-auto` |
| Grid | `grid ... max-w-4xl mx-auto` |
| Text blocks | `max-w-2xl mx-auto` |

---

*Version: 2.0*
*Created: 2026-02-02*
*Based on centering audit of entire page*
*v2.0: Added Tailwind 4 container fix, visual balance vs technical centering*
