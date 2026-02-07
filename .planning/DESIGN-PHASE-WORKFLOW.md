# Design Phase Workflow for GSD

> **MANDATORY:** This workflow MUST be followed for ALL design-related phases.
> Design phases include: UI components, visual sections, hero elements, animations, layout changes.

---

## Overview

This document defines how GSD handles design work to ensure Linear-quality output.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     DESIGN PHASE WORKFLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. REFERENCE      Read LINEAR-BLUEPRINT.md + View relevant screenshots     │
│        ↓                                                                    │
│  2. PLAN           Create detailed visual specs with exact values           │
│        ↓                                                                    │
│  3. IMPLEMENT      Build component/section following Blueprint specs        │
│        ↓                                                                    │
│  4. CAPTURE        Run npm run visual:capture                               │
│        ↓                                                                    │
│  5. ANALYZE        Compare against Linear screenshots + Blueprint criteria  │
│        ↓                                                                    │
│  6. ITERATE        Fix issues, re-capture, until quality matches            │
│        ↓                                                                    │
│  7. VERIFY         User visual approval required                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Required Resources

### 1. Design Bible
- **PRIMARY:** `design-bible/LINEAR-BLUEPRINT.md` - All design specifications
- **SECONDARY:** `design-bible/INDEX.md` - Conversion and UX principles

### 2. Reference Screenshots
- **Location:** `Screenshots of the linear website/`
- **Files:** 13 screenshots with descriptive names (01-13)
- **Usage:** Compare our output to these references

### 3. Visual Capture Tool
- **Command:** `npm run visual:capture` (from website/ folder)
- **Output:** `website/.visual-verification/`
- **Purpose:** Screenshots of our website for analysis

### 4. Verification Protocol
- **Document:** `.planning/VISUAL-VERIFICATION-PROTOCOL.md`
- **Checklist:** `.planning/VISUAL-ANALYSIS-CHECKLIST.md`

---

## Step-by-Step Workflow

### Step 1: Reference (Before ANY Code)

**Actions:**
1. Read `design-bible/LINEAR-BLUEPRINT.md` (mandatory)
2. Identify relevant Linear screenshots for the task
3. Extract exact specs: colors, spacing, typography, animations

**Example:**
```
Task: Build Hero floating UI panels

Relevant screenshots:
- 01-hero-floating-ui-panels.png (main reference)
- 06-project-glass-cards.png (glassmorphism style)

Extract from Blueprint:
- Glass: background rgba(255,255,255,0.05), blur 20px
- Cards: border-radius 16px, padding 32px
- Animation: Hover 200ms, translateY(-4px)
- Shadows: 0 20px 60px rgba(0,0,0,0.3)
```

### Step 2: Plan (Exact Specifications)

**CRITICAL:** Plans for design phases MUST include:

```markdown
## Visual Specifications

### Dimensions
- Width: [exact px or responsive rule]
- Height: [exact px or responsive rule]
- Padding: [exact px]
- Margin: [exact px]

### Colors
- Background: [exact hex/rgba]
- Border: [exact hex/rgba + width]
- Text: [exact hex]

### Typography
- Font: [family]
- Size: [exact px]
- Weight: [exact number]
- Line-height: [exact value]

### Effects
- Shadow: [exact CSS value]
- Blur: [exact px]
- Animation: [duration + easing]

### Reference Screenshot
- File: [filename from Linear screenshots]
- What to match: [specific elements]
```

**BAD Plan Example (too vague):**
```
- Add glassmorphism cards
- Make it look like Linear
```

**GOOD Plan Example (specific):**
```
- Cards with background: rgba(255,255,255,0.05)
- backdrop-filter: blur(20px)
- border: 1px solid rgba(255,255,255,0.08)
- border-radius: 16px
- padding: 32px
- hover: translateY(-4px), shadow 0 20px 40px rgba(0,0,0,0.2)
- transition: 200ms cubic-bezier(0.16, 1, 0.3, 1)
```

### Step 3: Implement

Follow the exact specifications from Step 2. No creative interpretation.

### Step 4: Visual Capture

```bash
cd website
npm run dev  # In one terminal

# In another terminal:
npm run visual:capture
```

**Output:**
- `website/.visual-verification/desktop-*.png`
- `website/.visual-verification/mobile-*.png`
- `website/.visual-verification/report.json`

### Step 5: Analyze (Compare to Linear)

**Claude MUST:**

1. **Read the captured screenshots** using Read tool
2. **Read relevant Linear screenshots** for comparison
3. **Check against Blueprint criteria:**

```markdown
## Visual Analysis

### Comparison to Linear Reference
- [ ] Overall layout matches reference screenshot
- [ ] Glassmorphism effect is identical (blur level, transparency)
- [ ] Spacing matches Blueprint specs
- [ ] Typography matches Blueprint specs
- [ ] Colors match Blueprint specs
- [ ] Hover states work correctly
- [ ] Animation timing is correct (200ms)

### Issues Found
1. [Issue description]
   - Expected: [from Blueprint/screenshot]
   - Actual: [what appears in our capture]
   - Fix: [what to change]

### Comparison Screenshots
- Our output: [.visual-verification/filename.png]
- Linear reference: [Screenshots of the linear website/filename.png]
```

### Step 6: Iterate

If issues found:
1. Document the issue
2. Apply fix
3. Re-run visual:capture
4. Re-analyze
5. **Max 3 iterations** - if still failing, escalate to user

### Step 7: Verify (User Approval)

**Design phases are NOT complete until:**
- [ ] User has seen screenshots
- [ ] User explicitly approves visual quality
- [ ] No unresolved visual issues

---

## Quality Criteria (from LINEAR-BLUEPRINT.md)

### Must Match Linear

| Criterion | Specification |
|-----------|---------------|
| Background | `#08090A` or similar dark |
| Glassmorphism | blur 20px, rgba(255,255,255,0.05) |
| Border-radius | 8px buttons, 12-16px cards |
| Shadows | Subtle, deep (not harsh) |
| Spacing | 4px base, 8px multiples |
| Hover | 200ms, translateY(-2px to -4px) |
| Typography | Inter, dramatic hierarchy |

### Common Failures (Avoid These)

| Failure | Problem | Solution |
|---------|---------|----------|
| Too small | Components don't have visual impact | Match Linear's generous sizing |
| Wrong position | Element not in hero/expected location | Check page structure |
| No shimmer | Missing signature effect | Add shimmer animation |
| Basic styling | Doesn't match Linear quality | Follow exact Blueprint specs |
| Harsh shadows | Looks amateur | Use soft, deep shadows |

---

## Quick Reference Commands

```bash
# Start dev server
cd website && npm run dev

# Capture screenshots
npm run visual:capture

# Capture from Vercel preview
npm run visual:capture -- --url=https://preview-url.vercel.app
```

---

## Integration with GSD

### For gsd-planner

When planning a design phase:
1. **MUST** reference `design-bible/LINEAR-BLUEPRINT.md`
2. **MUST** specify exact visual specs in plan
3. **MUST** list relevant Linear reference screenshots

### For gsd-executor

When executing a design phase:
1. **MUST** run `visual:capture` after implementation
2. **MUST** analyze screenshots against Linear references
3. **MUST** iterate until quality matches

### For gsd-verifier

When verifying a design phase:
1. **MUST** compare captured screenshots to Linear references
2. **MUST** check all Blueprint criteria
3. **MUST NOT** mark complete without user visual approval

---

## File Locations Summary

| Resource | Path |
|----------|------|
| Design Blueprint | `design-bible/LINEAR-BLUEPRINT.md` |
| Linear Screenshots | `Screenshots of the linear website/*.png` |
| Visual Capture Tool | `website/scripts/visual-capture.ts` |
| Captured Screenshots | `website/.visual-verification/` |
| Verification Protocol | `.planning/VISUAL-VERIFICATION-PROTOCOL.md` |
| Analysis Checklist | `.planning/VISUAL-ANALYSIS-CHECKLIST.md` |
| This Workflow | `.planning/DESIGN-PHASE-WORKFLOW.md` |

---

*This workflow ensures GSD produces Linear-quality design output.*
*No design phase ships without matching the Blueprint specifications.*

*Created: 2026-02-06*
