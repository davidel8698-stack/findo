# Premium Pre-Rendered 3D Phone Mockups

**Project:** Findo v2.0 Visual Excellence
**Focus:** Pre-rendered 3D phone mockups with realistic shadows, reflections, and depth
**Researched:** 2026-02-03
**Overall confidence:** HIGH

## Executive Summary

Pre-rendered 3D phone mockups offer premium visual quality without the performance overhead of real-time 3D. For a "$10M funded startup" aesthetic, the workflow involves: (1) creating or acquiring high-quality 3D renders using tools like Rotato or Blender, (2) exporting as optimized AVIF/WebP images, (3) implementing realistic CSS shadows using multi-layer techniques, and (4) adding subtle parallax effects with lightweight libraries.

**Recommended approach:** Use Rotato for fast, premium results (easiest), or Blender for full creative control (advanced). Export at 4K, optimize to AVIF with WebP fallback, implement layered CSS shadows, and add subtle parallax with simple-parallax-js.

## Tool Recommendations

### Option 1: Rotato (RECOMMENDED for Speed & Quality)

**What it is:** Desktop app for creating premium 3D device mockups with professional lighting, reflections, and animations.

**Why choose this:**
- Fastest path to premium results (5 minutes from import to export)
- Ships with 50+ professionally modeled devices
- 100% customizable lighting, reflections, shadows, and backgrounds
- Exports 4K images and 60fps video
- No 3D modeling experience required

**Pricing:** Paid tool (check current pricing at rotato.app)

**Workflow:**

1. **Import your screen design**
   - Drag and drop PNG/video of your activity feed UI
   - Rotato automatically fits it to device screen

2. **Choose device model**
   - Select iPhone 15 Pro (or latest model)
   - Choose color (Space Black for premium dark aesthetic)

3. **Customize lighting & reflections**
   - Enable reflections: Use "Office" or "Studio" preset for professional look
   - Adjust shadow intensity: Medium-high for depth
   - Background: Dark gradient or solid dark color for drama
   - Camera angle: Slight 3/4 perspective (not straight-on)

4. **Fine-tune camera**
   - Rotate device 15-25 degrees on Y-axis (slight perspective)
   - Position slightly off-center for dynamic composition
   - Add subtle tilt if desired (5-10 degrees)

5. **Export settings**
   - Format: PNG (for transparency) or HEVC with alpha
   - Resolution: 4K (3840x2160) or 2x your hero section size
   - Include shadow in render (not CSS shadow on top)

**Export recommendation:**
```
Resolution: 2400x3000px (portrait phone mockup)
Format: PNG with transparency
Quality: Maximum
```

**Sources:**
- [Rotato Features](https://rotato.app/features)
- [Rotato Quick Start](https://rotato.app/help/quick-start)

### Option 2: Device Frames (Browser-Based Alternative)

**What it is:** Free online 3D mockup generator with good quality, no download required.

**Why choose this:**
- Completely free
- No software installation
- Studio-quality 4K renders
- Depth of field, lighting, and environment controls

**Workflow:**

1. Visit deviceframes.com
2. Select device type (iPhone/Android)
3. Upload your screen design
4. Customize:
   - Lighting: Adjust brightness and direction
   - Environment: Choose background (dark gradient recommended)
   - Camera: Set angle and perspective
5. Export as PNG (4K resolution)

**Limitations:**
- Less control than Rotato
- No animation export
- Fewer device models

**Sources:**
- [Device Frames](https://deviceframes.com/)

### Option 3: Blender (For Complete Creative Control)

**What it is:** Professional open-source 3D software for custom phone mockup creation.

**Why choose this:**
- 100% free and open-source
- Complete control over every aspect
- Can create unique compositions (multiple phones, custom angles, etc.)
- Best for custom lighting scenarios (dark mode with specific reflections)

**Why NOT choose this:**
- Steep learning curve (hours to days for first mockup)
- Time-intensive workflow
- Requires 3D modeling/rendering knowledge

**Workflow:**

1. **Acquire 3D phone model**
   - Free sources: BlenderKit, TurboSquid, CGTrader
   - Search for "iPhone 15 Pro Blender model" or "Samsung Galaxy S23"
   - Download .blend file

2. **Import and setup scene**
   - Open model in Blender
   - Replace phone screen with your UI design:
     - Create material for screen
     - Use your UI screenshot as emission texture
     - Adjust emission strength (1.5-2.0 for bright screen)

3. **Setup lighting (Cycles engine)**
   - Use HDRI environment lighting for realistic reflections
     - Recommended: Studio HDRI or Office HDRI
     - Rotation: Adjust to get nice reflections on phone edges
   - Add key light: Area light, 45-degree angle, soft shadows
   - Add rim light: Subtle backlight for edge definition

4. **Camera setup**
   - Focal length: 85-135mm (portrait lens feel, less distortion)
   - Position: Slight 3/4 angle, not perfectly centered
   - Depth of field: Subtle (F-stop 4.0-5.6) to focus on phone

5. **Render settings (Cycles)**
   - Render engine: Cycles (NOT Eevee for photorealism)
   - Device: GPU Compute (if available)
   - Samples: 512-1024 for high quality
   - Resolution: 2400x3000px (or 2x final display size)
   - Enable denoising: Intel Open Image Denoise
   - Film: Enable Transparent (if you want no background)

6. **Shadow settings**
   - Render shadows directly in 3D (don't rely only on CSS)
   - Use contact shadows: Close to phone, sharp and dark
   - Use ambient shadow: Further from phone, soft and diffuse
   - Shadow plane: Place plane under phone, catch shadows

7. **Export**
   - Format: PNG with 16-bit color depth
   - Color space: sRGB
   - Compression: Low (for maximum quality)

**Time investment:** 2-4 hours for first mockup, 30-60 minutes once proficient.

**Free 3D model sources:**
- [BlenderKit](https://www.blenderkit.com/?query=category_subtree%3Aphone+order%3A_score+is_free%3Atrue)
- [TurboSquid](https://www.turbosquid.com/Search/3D-Models/free/phone/blend)
- [CGTrader](https://www.cgtrader.com/3d-models/smartphone)

**Blender lighting resources:**
- [Mastering Product Lighting in Blender](https://vagon.io/blog/mastering-product-lighting-in-blender-techniques-for-stunning-3d-renders)
- [7 Ways to Achieve Realistic Lighting](https://blendergrid.com/articles/realistic-lighting-in-blender)

### Decision Matrix

| Criteria | Rotato | Device Frames | Blender |
|----------|--------|---------------|---------|
| **Quality** | Excellent | Very Good | Excellent |
| **Speed** | 5 minutes | 10 minutes | 2-4 hours |
| **Cost** | Paid | Free | Free |
| **Learning curve** | Minimal | Minimal | Steep |
| **Customization** | High | Medium | Complete |
| **Animation support** | Yes (60fps) | No | Yes (advanced) |
| **Best for** | Fast premium results | Quick free mockups | Unique compositions |

**Recommendation:** Start with Rotato for speed and quality. Use Device Frames if budget is limited. Only use Blender if you need completely custom compositions or already have 3D skills.

## Image Asset Specifications

### Export Resolution

**Target display size:** Assume hero section is 600px wide on desktop, phone mockup takes ~50% = 300px.

**Export at 2-3x for retina displays:**
- Minimum: 1200x1500px (2x)
- Recommended: 1800x2250px (3x)
- Maximum: 2400x3000px (4x for future-proofing)

**Why oversized?**
- Retina displays require 2x pixel density
- Allows parallax scaling without quality loss
- Future-proofs for larger screens

### Image Format Strategy

**Multi-format approach (RECOMMENDED):**

Use Next.js `<Image>` component with automatic format optimization, or serve multiple formats via `<picture>` element.

```jsx
// Next.js approach (automatic optimization)
import Image from 'next/image'

<Image
  src="/mockups/phone-hero.png"
  alt="Findo activity feed on iPhone"
  width={1800}
  height={2250}
  preload={true}  // Critical for LCP
  quality={90}    // Slightly reduce for smaller file size
/>
```

Next.js automatically generates AVIF and WebP variants.

**Manual multi-format approach:**

```html
<picture>
  <!-- AVIF: 50% smaller than JPEG, best quality -->
  <source srcset="/mockups/phone-hero.avif" type="image/avif">

  <!-- WebP: 25-34% smaller than JPEG, universal support -->
  <source srcset="/mockups/phone-hero.webp" type="image/webp">

  <!-- PNG fallback: For older browsers -->
  <img src="/mockups/phone-hero.png" alt="Findo activity feed on iPhone">
</picture>
```

### Format Comparison

| Format | Compression | Quality | Browser Support (2026) | Use Case |
|--------|-------------|---------|------------------------|----------|
| **AVIF** | 50% smaller than JPEG | Excellent | All modern browsers | Best quality/size ratio |
| **WebP** | 25-34% smaller than JPEG | Very good | Universal | Broad compatibility |
| **PNG** | Larger files | Lossless | Universal | Fallback, transparency |

### Optimization Checklist

- [ ] Export from 3D tool at 2400x3000px (or 2x display size minimum)
- [ ] Convert to AVIF (primary format)
- [ ] Convert to WebP (fallback)
- [ ] Keep PNG source (final fallback)
- [ ] Use Next.js Image component with `preload={true}` for hero image
- [ ] Test LCP score (target: <2.5s)
- [ ] Compress AVIF/WebP to 85-90% quality (marginal visual loss, significant size reduction)

**Compression tools:**
- Next.js built-in optimization (automatic)
- Squoosh.app (manual, web-based)
- ImageOptim (Mac desktop app)
- TinyPNG (supports WebP)

**Sources:**
- [AVIF vs WebP: Which Image Format Reigns Supreme in 2026?](https://elementor.com/blog/webp-vs-avif/)
- [Next.js Image Component Documentation](https://nextjs.org/docs/app/api-reference/components/image)

## Shadow & Depth Implementation

### The Problem with Single-Layer Shadows

Standard CSS shadow:
```css
/* BAD: Flat, unrealistic, "washed out" look */
.phone-mockup {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
```

This creates a blurry grey halo that doesn't mimic real-world lighting.

### Multi-Layer Shadow Technique (RECOMMENDED)

**Concept:** Layer multiple shadows with different characteristics to simulate:
1. **Contact shadow** - Sharp, dark, close to object
2. **Directional shadow** - Medium blur, defines light source
3. **Ambient shadow** - Large blur, very soft, simulates ambient occlusion

**Implementation:**

```css
.phone-mockup {
  /* Layer 1: Contact shadow (sharp, dark, close) */
  box-shadow:
    0px 2px 4px rgba(0, 0, 0, 0.2),

    /* Layer 2: Directional shadow (medium) */
    0px 8px 16px rgba(0, 0, 0, 0.15),

    /* Layer 3: Ambient shadow (large, soft) */
    0px 24px 48px rgba(0, 0, 0, 0.1),

    /* Layer 4: Extended ambient (very soft) */
    0px 48px 96px rgba(0, 0, 0, 0.05);
}
```

**Visual explanation:**
- First value: X offset (horizontal)
- Second value: Y offset (vertical, simulates overhead light)
- Third value: Blur radius
- Fourth value: Color & opacity

### Color-Matched Shadows for Dark Mode

**Standard approach (grey shadows):**
```css
/* Works okay, but looks washed out */
.phone-mockup {
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.3);
}
```

**Color-matched approach (better):**
```css
:root {
  --bg-color: hsl(220, 20%, 8%);  /* Dark blue-grey background */
  --shadow-color: hsl(220, 15%, 4%);  /* Slightly darker, same hue */
}

.phone-mockup {
  box-shadow:
    0px 2px 4px var(--shadow-color),
    0px 8px 16px var(--shadow-color),
    0px 24px 48px var(--shadow-color),
    0px 48px 96px hsl(220, 10%, 2%);  /* Even darker for outermost */
}
```

**Why this works:** Matching hue prevents the "muddy grey" look. Shadows feel integrated with the background.

### Elevation System (Design Tokens)

Create reusable shadow tokens for consistent depth hierarchy:

```css
:root {
  /* Shadow color based on background */
  --shadow-color: hsl(220, 15%, 4%);

  /* Elevation levels */
  --shadow-sm:
    0px 1px 2px var(--shadow-color),
    0px 2px 4px var(--shadow-color);

  --shadow-md:
    0px 2px 4px var(--shadow-color),
    0px 8px 16px var(--shadow-color),
    0px 16px 32px var(--shadow-color);

  --shadow-lg:
    0px 4px 8px var(--shadow-color),
    0px 16px 32px var(--shadow-color),
    0px 32px 64px var(--shadow-color);

  /* Hero phone mockup (extra dramatic) */
  --shadow-xl:
    0px 2px 4px rgba(0, 0, 0, 0.2),
    0px 8px 16px rgba(0, 0, 0, 0.15),
    0px 24px 48px rgba(0, 0, 0, 0.1),
    0px 48px 96px rgba(0, 0, 0, 0.05);
}

.phone-mockup {
  box-shadow: var(--shadow-xl);
}
```

### Consistent Light Direction

**Rule:** Maintain the same light direction across all shadows on the page.

If your hero phone has light from top-right:
```css
.phone-mockup {
  /* Light from top-right: positive X, negative Y */
  box-shadow:
    4px -2px 8px rgba(0, 0, 0, 0.15),
    16px -8px 32px rgba(0, 0, 0, 0.1);
}
```

All other elements should match:
```css
.feature-card {
  /* Same direction: positive X, negative Y */
  box-shadow:
    2px -1px 4px rgba(0, 0, 0, 0.1),
    8px -4px 16px rgba(0, 0, 0, 0.05);
}
```

### Dark Mode Specific Considerations

1. **Reduce shadow opacity** - Dark backgrounds need subtler shadows
2. **Increase shadow spread** - Larger, softer shadows work better
3. **Use rim lighting** - Add subtle highlight on opposite side of shadow

```css
/* Dark mode enhancement */
.phone-mockup {
  /* Shadows */
  box-shadow: var(--shadow-xl);

  /* Rim light on opposite side (optional) */
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}
```

**Copy-paste ready CSS for dark mode hero phone:**

```css
.hero-phone-mockup {
  /* Multi-layer shadow for depth */
  box-shadow:
    0px 2px 4px rgba(0, 0, 0, 0.25),      /* Contact shadow */
    0px 8px 16px rgba(0, 0, 0, 0.2),      /* Directional shadow */
    0px 24px 48px rgba(0, 0, 0, 0.15),    /* Ambient shadow */
    0px 48px 96px rgba(0, 0, 0, 0.1);     /* Extended ambient */

  /* Optional: Subtle rim light for extra dimension */
  border-left: 1px solid rgba(255, 255, 255, 0.08);

  /* Smooth any pixelation */
  image-rendering: crisp-edges;
  image-rendering: -webkit-optimize-contrast;
}
```

**Sources:**
- [Designing Beautiful Shadows in CSS](https://www.joshwcomeau.com/css/designing-shadows/)

## Parallax Implementation

### Why Parallax for Static 3D Images?

Adding subtle motion to pre-rendered 3D mockups creates:
- **Depth perception** - Different layers move at different speeds
- **Premium feel** - Sophisticated animation without heavy 3D libraries
- **Engagement** - Subtle interactivity draws attention

**Key principle:** Keep it subtle. Excessive parallax feels gimmicky.

### Option 1: simple-parallax-js (RECOMMENDED)

**Why this library:**
- Lightweight (< 5KB)
- Works directly with `<img>` tags and Next.js `<Image>`
- Hardware-accelerated (CSS 3D transforms)
- No dependencies
- React support built-in

**Installation:**

```bash
npm install simple-parallax-js
```

**Basic React implementation:**

```jsx
'use client'

import SimpleParallax from "simple-parallax-js";
import Image from 'next/image';

export function HeroPhone() {
  return (
    <SimpleParallax scale={1.3} delay={0.6}>
      <Image
        src="/mockups/phone-hero.png"
        alt="Findo activity feed on iPhone"
        width={1800}
        height={2250}
        preload={true}
        quality={90}
        className="hero-phone-mockup"
      />
    </SimpleParallax>
  );
}
```

**Configuration:**

```jsx
<SimpleParallax
  scale={1.3}        // How much to scale (1.3 = 30% larger)
  delay={0.6}        // Delay before animation (seconds)
  orientation="down" // Direction: up/down/left/right
  overflow={true}    // Allow image to overflow container
>
```

**Performance consideration:** Higher `scale` values = more visible parallax BUT lower perceived image quality (image is scaled up). Compensate by using larger source images.

**Example:** If displaying at 300px wide with `scale={1.5}`, export source at 450px (300 * 1.5).

**Sources:**
- [simpleParallax.js](https://simpleparallax.com/)

### Option 2: Mouse/Tilt Parallax with react-next-parallax

**Effect:** Phone tilts/moves slightly based on mouse position (or device orientation).

**Installation:**

```bash
npm install react-next-parallax
```

**Implementation:**

```jsx
'use client'

import { Parallax } from 'react-next-parallax';
import Image from 'next/image';

export function HeroPhone() {
  return (
    <Parallax>
      <Image
        src="/mockups/phone-hero.png"
        alt="Findo activity feed"
        width={1800}
        height={2250}
        preload={true}
        data-parallax-offset="8"  // Movement intensity (px)
      />
    </Parallax>
  );
}
```

**Multi-layer setup (advanced):**

If you export phone mockup as separate layers (phone body, screen content, shadows):

```jsx
<Parallax>
  <div className="relative">
    {/* Background shadow (slowest movement) */}
    <Image
      src="/mockups/shadow.png"
      data-parallax-offset="3"
      className="absolute"
    />

    {/* Phone body (medium movement) */}
    <Image
      src="/mockups/phone-body.png"
      data-parallax-offset="8"
      className="relative z-10"
    />

    {/* Screen content (fastest movement) */}
    <Image
      src="/mockups/screen-content.png"
      data-parallax-offset="12"
      className="absolute z-20"
    />
  </div>
</Parallax>
```

**When to use this:** Only if you want interactive tilt effect. For most hero sections, scroll parallax (Option 1) is sufficient and less distracting.

**Sources:**
- [react-next-parallax](https://www.npmjs.com/package/react-next-parallax)

### Option 3: GSAP + ScrollTrigger (Advanced)

**Use case:** Complex scroll-based animations with precise control.

**Why NOT to use this (for simple parallax):**
- Larger bundle size (~50KB minified)
- More complex setup
- Overkill for basic parallax

**When TO use this:**
- You're already using GSAP for other animations
- You need complex scroll-triggered sequences
- You want zoom parallax or other advanced effects

**Example:**

```jsx
'use client'

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export function HeroPhone() {
  const phoneRef = useRef(null);

  useEffect(() => {
    gsap.to(phoneRef.current, {
      y: -100,  // Move up 100px on scroll
      ease: "none",
      scrollTrigger: {
        trigger: phoneRef.current,
        start: "top center",
        end: "bottom top",
        scrub: 1,  // Smooth scrubbing
      }
    });
  }, []);

  return (
    <div ref={phoneRef}>
      <Image
        src="/mockups/phone-hero.png"
        alt="Findo activity feed"
        width={1800}
        height={2250}
        preload={true}
      />
    </div>
  );
}
```

**Sources:**
- [Create Simplified Parallax Effects Using Next.js + GSAP](https://medium.com/codex/create-simplified-parallax-effects-using-next-js-gsap-in-10-mins-82d4d60cd15f)

### Parallax Decision Matrix

| Library | Bundle Size | Complexity | Effect | Best For |
|---------|-------------|------------|--------|----------|
| simple-parallax-js | ~5KB | Low | Scroll-based movement | Most hero sections |
| react-next-parallax | ~10KB | Low | Mouse tilt | Interactive sections |
| GSAP ScrollTrigger | ~50KB | High | Complex sequences | Advanced animations |

**Recommendation:** Use simple-parallax-js for hero phone mockup. It's lightweight, effective, and requires minimal code.

### Subtle Motion Guidelines

**DO:**
- Keep parallax movement under 100px
- Use easing/delays for smooth feel
- Test on mobile (reduce intensity if needed)
- Apply to hero section only (not every phone mockup)

**DON'T:**
- Apply parallax to every element (overwhelming)
- Use extreme scale values (>1.5)
- Combine with other motion effects on same element
- Forget to test on low-end devices

## Performance Optimization

### LCP (Largest Contentful Paint) Considerations

**The problem:** Your hero phone mockup is likely the LCP element. If it loads slowly, it tanks your Core Web Vitals score.

**Target:** LCP < 2.5 seconds (Google's threshold)

### Next.js Image Optimization

**Critical props for hero phone mockup:**

```jsx
import Image from 'next/image'

<Image
  src="/mockups/phone-hero.png"
  alt="Findo activity feed on iPhone"
  width={1800}
  height={2250}

  // CRITICAL: Preload the hero image
  preload={true}

  // Optional: Reduce quality slightly for smaller file
  quality={90}  // Default is 75, 90 is good balance

  // Specify priority loading (alternative to preload)
  loading="eager"

  // Improve perceived performance
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
/>
```

**Why `preload={true}`:**
- In Next.js 16+, this replaces deprecated `priority` prop
- Tells browser to load image immediately in `<head>`
- Critical for above-the-fold images
- Can improve LCP by 500ms-1000ms

**Why `quality={90}`:**
- Default 75 can be too aggressive for hero images
- 90 maintains visual quality while reducing file size by 20-30%
- Imperceptible quality loss for most images

### Image Format Strategy for Performance

**Best practice:** Serve AVIF first, fallback to WebP, then PNG.

Next.js does this automatically when using `<Image>` component. Manual approach:

```html
<picture>
  <!-- AVIF: 50% smaller, best for LCP -->
  <source srcset="/mockups/phone-hero.avif" type="image/avif">

  <!-- WebP: 30% smaller, universal support -->
  <source srcset="/mockups/phone-hero.webp" type="image/webp">

  <!-- PNG: Fallback -->
  <img
    src="/mockups/phone-hero.png"
    alt="Findo activity feed on iPhone"
    width="1800"
    height="2250"
    fetchpriority="high"
  />
</picture>
```

**Performance impact:**
- AVIF: 200-500ms faster LCP vs PNG (due to 50% smaller file size)
- WebP: 100-300ms faster LCP vs PNG

### Responsive Image Sizes

Serve different image sizes for different viewports:

```jsx
<Image
  src="/mockups/phone-hero.png"
  alt="Findo activity feed"
  width={1800}
  height={2250}
  preload={true}

  // Define responsive sizes
  sizes="(max-width: 640px) 300px,
         (max-width: 1024px) 400px,
         600px"
/>
```

Next.js automatically generates multiple image sizes and serves the optimal one per device.

**Impact:** Mobile devices don't download desktop-sized images, saving 50-70% bandwidth.

### Lazy Loading Other Mockups

**Rule:** Only preload the hero mockup. Lazy load everything else.

```jsx
// Hero mockup - PRELOAD
<Image
  src="/mockups/phone-hero.png"
  preload={true}
  {...props}
/>

// Feature section mockups - LAZY
<Image
  src="/mockups/phone-feature.png"
  loading="lazy"  // Default behavior
  {...props}
/>
```

### Performance Checklist

- [ ] Export mockup at 2x display size (not larger)
- [ ] Convert to AVIF + WebP (50% size reduction)
- [ ] Use `preload={true}` on hero mockup only
- [ ] Set `quality={90}` for hero mockup
- [ ] Configure responsive `sizes` for mobile/desktop
- [ ] Lazy load all non-hero mockups
- [ ] Test LCP with Lighthouse or WebPageTest
- [ ] Consider inline critical CSS for shadows (avoid layout shift)
- [ ] Minimize parallax library bundle (use simple-parallax-js)
- [ ] Test on 3G connection (Chrome DevTools throttling)

### Performance Targets

| Metric | Target | Impact |
|--------|--------|--------|
| LCP | < 2.5s | Core Web Vitals, SEO |
| Image file size | < 200KB (AVIF) | Load speed |
| Total JavaScript | < 100KB (with parallax) | Interactivity |
| Layout shift | CLS < 0.1 | User experience |

**Tools for testing:**
- Chrome DevTools Lighthouse
- PageSpeed Insights
- WebPageTest.org
- Vercel Analytics (if using Vercel)

## Dark Theme Lighting for 3D Mockups

### The Challenge

Dark backgrounds require different lighting approaches than light backgrounds:
- Shadows are less visible (dark on dark)
- Reflections become more important
- Edge definition is critical
- Contrast must be carefully managed

### Lighting Strategy for Dark Mode

**1. Rim Lighting (Most Important)**

Add a subtle highlight on the opposite side of your main shadow:

```css
.phone-mockup {
  /* Main shadow (right side) */
  box-shadow:
    0px 24px 48px rgba(0, 0, 0, 0.3),
    0px 48px 96px rgba(0, 0, 0, 0.2);

  /* Rim light (left side) */
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}
```

**Why this works:** Creates edge definition that separates phone from background.

**2. Screen Glow Effect**

Simulate the phone screen illuminating its surroundings:

```css
.phone-mockup {
  /* Main shadows */
  box-shadow:
    0px 24px 48px rgba(0, 0, 0, 0.3),
    0px 48px 96px rgba(0, 0, 0, 0.2);

  /* Screen glow (add as additional shadow) */
  filter: drop-shadow(0 0 40px rgba(59, 130, 246, 0.15));
}
```

Adjust glow color based on your app's primary color. For Findo (blue accent), use blue-tinted glow.

**3. Reflections in 3D Tool**

When rendering in Rotato or Blender:
- Enable reflections (80-100% intensity)
- Use dark environment HDRI (office or studio at night)
- Ensure phone edges catch light (rotate device to find sweet spot)
- Make screen brighter than surroundings (emission 1.5-2.0 in Blender)

**4. Background Gradient**

Use subtle radial gradient to create spotlight effect:

```css
.hero-section {
  background: radial-gradient(
    circle at 60% 40%,
    hsl(220, 15%, 12%),  /* Lighter center */
    hsl(220, 20%, 8%)    /* Darker edges */
  );
}
```

This creates depth and directs focus to phone mockup.

### Color Temperature Considerations

**Cool lighting (recommended for tech products):**
```css
:root {
  --bg-dark: hsl(220, 20%, 8%);      /* Cool blue-grey */
  --shadow: hsl(220, 25%, 4%);       /* Darker blue-grey */
  --rim-light: hsl(200, 80%, 50%);   /* Bright blue rim */
}
```

**Warm lighting (alternative for friendly feel):**
```css
:root {
  --bg-dark: hsl(30, 15%, 8%);       /* Warm brown-grey */
  --shadow: hsl(30, 20%, 4%);        /* Darker brown-grey */
  --rim-light: hsl(40, 90%, 60%);    /* Warm yellow rim */
}
```

### Complete Dark Mode CSS Example

```css
/* Dark mode hero section */
.hero-section {
  /* Radial gradient for depth */
  background: radial-gradient(
    circle at 60% 40%,
    hsl(220, 15%, 12%),
    hsl(220, 20%, 8%)
  );

  /* Optional: Add noise texture for premium feel */
  background-image:
    radial-gradient(circle at 60% 40%, hsl(220, 15%, 12%), hsl(220, 20%, 8%)),
    url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+...');
}

/* Phone mockup with complete dark mode lighting */
.phone-mockup {
  /* Multi-layer shadows (darker, softer) */
  box-shadow:
    0px 2px 4px rgba(0, 0, 0, 0.25),
    0px 8px 16px rgba(0, 0, 0, 0.2),
    0px 24px 48px rgba(0, 0, 0, 0.15),
    0px 48px 96px rgba(0, 0, 0, 0.1);

  /* Rim lighting for edge definition */
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  border-top: 1px solid rgba(255, 255, 255, 0.04);

  /* Screen glow (subtle) */
  filter: drop-shadow(0 0 40px rgba(59, 130, 246, 0.12));

  /* Image quality */
  image-rendering: -webkit-optimize-contrast;
}

/* Hover state: Enhance lighting */
.phone-mockup:hover {
  /* Slightly brighter rim light */
  border-left-color: rgba(255, 255, 255, 0.12);

  /* More prominent screen glow */
  filter: drop-shadow(0 0 50px rgba(59, 130, 246, 0.18));

  /* Smooth transition */
  transition: all 0.3s ease;
}
```

### Testing Dark Mode Lighting

**Checklist:**
- [ ] Phone edges are clearly defined (not bleeding into background)
- [ ] Shadows are visible but not muddy
- [ ] Screen content is bright and readable
- [ ] Reflections add realism without being distracting
- [ ] Overall contrast feels premium, not flat
- [ ] Works on both OLED (pure black) and LCD (dark grey) displays

**Test on multiple displays:**
- MacBook Pro (bright LCD)
- External monitor (typical LCD)
- iPhone/Android (OLED with pure black)
- Low-brightness settings (evening use)

## Workflow Summary

### Quick Start (Rotato + Next.js)

**Step 1: Create mockup in Rotato (5 minutes)**
1. Drag your UI screenshot onto iPhone 15 Pro model
2. Set camera angle: 20-degree Y-axis rotation
3. Enable reflections: Studio preset
4. Background: Dark gradient
5. Export: 2400x3000px PNG

**Step 2: Optimize image (2 minutes)**
```bash
# Using Next.js automatic optimization (easiest)
# Just place PNG in /public/mockups/

# Or manually convert:
# Use Squoosh.app to create AVIF + WebP versions
```

**Step 3: Implement in Next.js (5 minutes)**
```jsx
'use client'

import Image from 'next/image'
import SimpleParallax from "simple-parallax-js"

export function HeroPhone() {
  return (
    <div className="hero-phone-container">
      <SimpleParallax scale={1.3} delay={0.6}>
        <Image
          src="/mockups/phone-hero.png"
          alt="Findo activity feed on iPhone"
          width={1800}
          height={2250}
          preload={true}
          quality={90}
          className="phone-mockup"
        />
      </SimpleParallax>
    </div>
  )
}
```

**Step 4: Add CSS shadows (3 minutes)**
```css
.phone-mockup {
  box-shadow:
    0px 2px 4px rgba(0, 0, 0, 0.25),
    0px 8px 16px rgba(0, 0, 0, 0.2),
    0px 24px 48px rgba(0, 0, 0, 0.15),
    0px 48px 96px rgba(0, 0, 0, 0.1);

  border-left: 1px solid rgba(255, 255, 255, 0.08);
  filter: drop-shadow(0 0 40px rgba(59, 130, 246, 0.12));
}
```

**Total time: 15 minutes from start to production**

### Advanced Workflow (Blender + Custom Composition)

**For custom compositions or unique angles:**

1. Acquire 3D phone model (BlenderKit, TurboSquid)
2. Setup Blender scene with Cycles renderer
3. Replace phone screen with UI design (emission material)
4. Setup HDRI lighting + key light + rim light
5. Render at 2400x3000px with transparent background
6. Export and follow Next.js steps above

**Total time: 2-4 hours first mockup, 30-60 minutes after learning curve**

## Sources

### Tool Documentation
- [Rotato Mockup Generator](https://rotato.app/)
- [Device Frames](https://deviceframes.com/)
- [Morflax Things](https://things.morflax.com/)
- [BlenderKit Free Models](https://www.blenderkit.com/?query=category_subtree%3Aphone+order%3A_score+is_free%3Atrue)
- [TurboSquid Free Blender Phone Models](https://www.turbosquid.com/Search/3D-Models/free/phone/blend)

### Technical Resources
- [Next.js Image Component Documentation](https://nextjs.org/docs/app/api-reference/components/image)
- [AVIF vs WebP: Which Image Format Reigns Supreme in 2026?](https://elementor.com/blog/webp-vs-avif/)
- [Designing Beautiful Shadows in CSS](https://www.joshwcomeau.com/css/designing-shadows/)
- [simpleParallax.js Documentation](https://simpleparallax.com/)
- [react-next-parallax npm Package](https://www.npmjs.com/package/react-next-parallax)

### Tutorials
- [Mastering Product Lighting in Blender](https://vagon.io/blog/mastering-product-lighting-in-blender-techniques-for-stunning-3d-renders)
- [7 Ways to Achieve Realistic Lighting in Blender](https://blendergrid.com/articles/realistic-lighting-in-blender)
- [The Best Render Settings for Blender](https://vagon.io/blog/the-best-render-settings-for-blender)
- [Create Simplified Parallax Effects Using Next.js + GSAP](https://medium.com/codex/create-simplified-parallax-effects-using-next-js-gsap-in-10-mins-82d4d60cd15f)

### Performance Optimization
- [Next.js Image Optimization](https://www.debugbear.com/blog/nextjs-image-optimization)
- [Mastering AVIF 2026 - Advanced Compression Guide](https://tinyimage.online/blog/mastering-avif-2026-guide/)
- [Image Optimization in 2025: WebP/AVIF, srcset, and Preload](https://aibudwp.com/image-optimization-in-2025-webp-avif-srcset-and-preload/)

## Confidence Assessment

| Area | Confidence | Rationale |
|------|------------|-----------|
| **Tool recommendations** | HIGH | Verified with official documentation (Rotato, Device Frames) and widely-used alternatives |
| **Image optimization** | HIGH | Next.js official docs + AVIF/WebP verified with multiple 2026 sources |
| **CSS shadow techniques** | HIGH | Based on authoritative Josh W. Comeau article, widely referenced |
| **Parallax implementation** | HIGH | Verified library documentation (simple-parallax-js) and React integration |
| **LCP optimization** | HIGH | Next.js 16 official documentation on preload/priority props |
| **Dark mode lighting** | MEDIUM | General best practices + Rotato/Blender capabilities, less direct source verification |
| **Blender workflow** | MEDIUM | Based on multiple tutorial sources, not personally verified |

## Next Steps

After implementing this research:

1. **Create first mockup** - Use Rotato for speed (recommended) or Device Frames (free alternative)
2. **Export & optimize** - Convert to AVIF/WebP using Next.js automatic optimization
3. **Implement in hero** - Add Next.js Image with `preload={true}` and multi-layer CSS shadows
4. **Add parallax** - Install simple-parallax-js and wrap hero phone
5. **Test performance** - Run Lighthouse, ensure LCP < 2.5s
6. **Iterate lighting** - Adjust CSS shadows and rim lighting for dark mode
7. **Create variants** - Duplicate workflow for other sections (features, testimonials)

**Quality gate passed when:**
- [ ] Hero phone mockup looks premium ($10M startup quality)
- [ ] Realistic shadows with multiple layers
- [ ] Subtle parallax adds depth without distraction
- [ ] LCP < 2.5s on 4G connection
- [ ] Dark mode lighting creates clear edge definition
- [ ] Image exports at 2-3x display size (retina-ready)
- [ ] AVIF/WebP formats served with PNG fallback
