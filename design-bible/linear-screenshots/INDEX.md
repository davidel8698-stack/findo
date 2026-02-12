# Linear.app Screenshots Reference

> **Location:** `design-bible/linear-screenshots/`
> **Date Captured:** February 2026
> **Purpose:** Design reference for FINDO project — Linear-quality UI inspiration

---

## Screenshot Index

| # | Filename | Section | Description |
|---|----------|---------|-------------|
| 00 | `00-full-page.png` | Full Page | Complete homepage overview |
| 01 | `01-hero-section.png` | Hero | Main hero with headline, CTA, and app preview |
| 02 | `02-customers-logos.png` | Social Proof | Customer logos carousel (Vercel, Retool, etc.) |
| 03 | `03-made-for-modern-teams.png` | Value Prop | "Made for modern product teams" tabs section |
| 04 | `04-ai-section.png` | AI Features | AI-assisted product development intro |
| 05 | `05-ai-triage-section.png` | AI Features | AI Triage with agent assignment UI |
| 06 | `06-triage-intelligence.png` | AI Features | Triage Intelligence suggestions panel |
| 07 | `07-product-direction.png` | Planning | "Set the product direction" section with roadmap |
| 08 | `08-project-overview.png` | Planning | Project overview card with properties/milestones |
| 09 | `09-collaborative-docs.png` | Planning | Collaborative documents feature |
| 10 | `10-feature-cards.png` | Planning | Initiatives, Cross-team, Milestones, Insights cards |
| 11 | `11-issue-tracking.png` | Build | "Issue tracking you'll enjoy using" section |
| 12 | `12-cycles-triage.png` | Build | Cycles and Triage management UI |
| 13 | `13-insights-section.png` | Build | Linear Insights analytics dashboard |
| 14 | `14-workflows-cards.png` | Integrations | Workflow cards (Customer Requests, Git, Mobile, etc.) |
| 15 | `15-under-the-hood.png` | Technical | Security badges (SOC 2, GDPR, HIPAA) |
| 16 | `16-cta-section.png` | CTA + Footer | Final CTA "Plan the present. Build the future." + Footer |

---

## Design Patterns to Study

### 1. Hero Section (01)
- Gradient text animation
- Dual CTA pattern (primary + secondary with badge)
- Floating app preview with glassmorphism

### 2. Card Design (03, 10, 14)
- Elevated surface pattern (`#17171a` background)
- 1px border with low opacity white
- Multi-layer shadows
- Light reflection line at top edge
- Noise texture overlay

### 3. AI/Feature Sections (04-06)
- Dark gradient backgrounds
- Interactive demo mockups
- Suggestion/recommendation UI patterns

### 4. Planning Features (07-10)
- Timeline/roadmap visualization
- Project status indicators
- Milestone progress bars
- Collaborative editing indicators

### 5. Typography
- Font: Inter / SF Pro
- Headline: Large, bold, tight letter-spacing
- Body: Muted gray (`rgba(255,255,255,0.6)`)
- Accents: Brand purple/blue highlights

### 6. Color Palette
```css
--bg-base: #08090a;
--bg-surface: #17171a;
--border: rgba(255, 255, 255, 0.05);
--text-primary: rgba(255, 255, 255, 0.95);
--text-secondary: rgba(255, 255, 255, 0.6);
--accent-purple: #5e6ad2;
```

---

## How to Use This Reference

1. **For new sections:** Browse screenshots to find similar patterns
2. **For component design:** Study card structures in 03, 10, 14
3. **For animations:** Reference hero section patterns
4. **For typography:** Match hierarchy from any text-heavy screenshot
5. **For color consistency:** Use the palette above

---

## Related Files

- [LINEAR-BLUEPRINT.md](../LINEAR-BLUEPRINT.md) — Detailed design specification
- [DESIGN-CERTIFICATION-TEST.md](../DESIGN-CERTIFICATION-TEST.md) — Quality checklist

---

*This folder serves as the primary visual reference for achieving Linear-quality design in the FINDO project.*
