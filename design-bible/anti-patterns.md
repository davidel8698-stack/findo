# Anti-Patterns: What NOT to Do

> "It's hard to write clearly because schools teach how to sound smart, not how to be understood."
> — Making Websites Win

> "If something requires a large investment of time—or looks like it will—it's less likely to be used."
> — Don't Make Me Think

---

## Overview

This document lists **what to avoid** based on three books:
- Making Websites Win (conversion killers)
- Don't Make Me Think (usability sins)
- Designed for Use (UX process mistakes)

Before any design decision, check this list.

---

## The Cardinal Sins

### 1. Meek Tweaking
**What it is:** Making small, random changes hoping something sticks.
- Changing button colors
- Moving elements around randomly
- "Testing" font sizes
- A/B testing without hypothesis

**Why it's bad:** No diagnosis = no understanding = wasted effort.

**What to do instead:** Use DiPS (Diagnose → Problem → Solution).

---

### 2. Skipping Diagnosis
**What it is:** Jumping straight to solutions.
- "I know what's wrong"
- "Let's just redesign it"
- "Competitors do it this way"

**Why it's bad:** You're guessing, not knowing.

**What to do instead:** Run at least 3 diagnosis techniques first.

---

### 3. The "Official Style"
**What it is:** Writing that sounds intelligent but is hard to understand.

**Examples:**
- ❌ "We leverage cutting-edge technology to facilitate seamless integrations"
- ✅ "Our software connects to your tools in one click"

- ❌ "Utilize our platform's robust capabilities"
- ✅ "Use our powerful features"

- ❌ "We held an investigation into the matter"
- ✅ "We investigated"

**Why it's bad:** "Teachers may like intelligent-sounding text, but readers prefer text that's easy to understand."

---

### 4. Curse of Knowledge
**What it is:** Assuming visitors know what you know.
- Using internal jargon
- Skipping explanations because "it's obvious"
- Not testing with newcomers

**Why it's bad:** You can't imagine seeing the site for the first time.

**What to do instead:** Design for a "moron in a hurry."

---

### 5. Surprise Navigation
**What it is:** Labels that only make sense after you click.
- Product names in navigation (when names aren't self-explanatory)
- Internal codenames visible to users
- Creative menu labels that don't describe content

**Examples:**
- ❌ "Discover" (discover what?)
- ✅ "Features"

- ❌ "Explorer" (our internal product name)
- ✅ "Lead Recovery"

- ❌ "Resources" (too vague)
- ✅ "Help Center" or "Guides"

---

### 6. Feature Dumping
**What it is:** Listing features without benefits.

**Example:**
- ❌ "256GB storage, AI-powered, Cloud sync"
- ✅ "Never lose another lead. Our AI automatically recovers contacts you thought were gone, syncing everywhere you work."

**The test:** For each feature, ask "So what?" until you reach an emotional benefit.

---

### 7. Fake Urgency
**What it is:** Manufacturing urgency that isn't real.
- Countdown timers that reset
- "Only 3 left" when there's unlimited supply
- "Price goes up tomorrow" (and it doesn't)

**Why it's bad:** Destroys trust. People figure it out.

**What to do instead:** Use genuine urgency or skip it entirely.

---

### 8. Hidden Guarantees
**What it is:** Burying the guarantee in the footer.

**Why it's bad:** "Guarantees don't increase refunds nearly as much as they increase sales."

**What to do instead:** Make guarantee prominent near CTA.

---

### 9. Multiple CTAs
**What it is:** Asking visitors to do several things at once.
- "Sign up" AND "Learn more" AND "Watch demo" AND "Contact us"

**Why it's bad:** Confusion = no action.

**What to do instead:** ONE primary action per page.

---

### 10. Stock Photo Syndrome
**What it is:** Using generic stock photos instead of real images.
- Handshake photos
- Diverse team looking at laptop
- Woman laughing at salad

**Why it's bad:** Destroys authenticity and trust.

**What to do instead:** Real photos of real team, real product, real customers.

---

## Writing Anti-Patterns

### Long Sentences
- ❌ "Our platform, which has been developed over the course of many years by our experienced team of engineers and designers who have backgrounds in the industry's leading companies, provides you with all the tools you need to manage your business efficiently." (48 words)
- ✅ "Our platform gives you every tool to manage your business. Built by experts from the industry's best companies." (18 words)

### Nominalizations
- ❌ "We conducted an investigation" → ✅ "We investigated"
- ❌ "We made an improvement" → ✅ "We improved"
- ❌ "We held a meeting" → ✅ "We met"
- ❌ "We carried out a test" → ✅ "We tested"

### Passive Voice
- ❌ "Leads are recovered by our system"
- ✅ "Our system recovers your leads"

### Abstract Language
- ❌ "Leverage synergies to optimize outcomes"
- ✅ "Use what you have to get better results"

### Weasel Words
- ❌ "Up to 50% improvement" (could be 0%)
- ✅ "Average 35% improvement"

- ❌ "Starting at $9/month" (but most pay more)
- ✅ "Most businesses choose our $29/month plan"

---

## Design Anti-Patterns

### Form Friction
- Too many fields
- Required fields that shouldn't be required
- No inline validation
- Error messages that don't explain the error
- Placeholder text as the only label

### Navigation Confusion
- Hamburger menu on desktop (when there's room for full nav)
- No clear way back to homepage
- Inconsistent navigation between pages
- Dead ends (pages with no next step)

### Visual Noise
- Animations that distract from content
- Background videos that slow loading
- Carousels that auto-advance
- Popups that appear too quickly

### Mobile Neglect
- Tiny tap targets (must be 44px minimum)
- Text too small to read
- Horizontal scrolling required
- Features that only work on desktop
- Important actions outside thumb zone

---

## Usability Anti-Patterns (Don't Make Me Think)

### 11. Mystery Meat Navigation
**What it is:** Icons or images without text labels.

**Examples:**
- ❌ Icons-only toolbar (hover to understand)
- ✅ Icons with text labels

**Why it's bad:** Users must guess what things do.

---

### 12. Making Users Think
**What it is:** Anything that requires unnecessary mental effort.

**Examples:**
- ❌ "Where should I begin?"
- ❌ "Can I click on this?"
- ❌ "What does this mean?"
- ❌ "Is this a button?"

**Why it's bad:** Every question mark adds cognitive load. Too many and users leave.

---

### 13. Designing for Reading (Not Scanning)
**What it is:** Long paragraphs, no visual hierarchy.

**Users don't read, they scan.** Design for:
- ✅ Short paragraphs
- ✅ Bullet lists
- ✅ Bold keywords
- ✅ Clear headings

---

### 14. Violating Conventions
**What it is:** Being "creative" with standard patterns.

**Examples:**
- ❌ Logo that doesn't link to home
- ❌ Search not in top-right area
- ❌ Links that don't look like links
- ❌ Non-standard shopping cart icon

**Krug's rule:** "Innovate only when it provides clear value."

---

### 15. Failing the Trunk Test
**What it is:** Users can't answer basic questions on any page.

**Every page must answer:**
1. What site is this?
2. What page am I on?
3. What are the major sections?
4. Where am I in the scheme of things?
5. How can I search?

---

### 16. Instructions That Won't Be Read
**What it is:** Adding instructions instead of making things obvious.

**Example:**
- ❌ "To search, enter your terms in the box below and click Search"
- ✅ [Search box with placeholder: "Search products..."]

**Krug's rule:** "If you have to explain it, redesign it."

---

### 17. Happy Talk
**What it is:** Introductory text that adds no value.

**Example:**
- ❌ "Welcome to our website! We're so glad you're here. At Company X, we believe in..."
- ✅ [Delete entirely and start with value]

---

### 18. Draining the Reservoir of Goodwill
**What it is:** Actions that frustrate users.

**Goodwill killers:**
- Hiding information (prices, contact info)
- Punishing users for not doing things your way
- Asking for information you don't need
- Fake urgency, manipulative patterns
- Making it hard to contact a human
- Not being transparent about what happens next

---

## UX Process Anti-Patterns (Designed for Use)

### 19. Designing Without Research
**What it is:** Skipping user research and relying on assumptions.

**Why it's bad:** You are not the user. Your assumptions are probably wrong.

**Rule:** Always validate with real users before building.

---

### 20. Personas From Imagination
**What it is:** Creating personas based on assumptions, not research.

**Fictional persona red flags:**
- No research to back it up
- Irrelevant details ("likes yoga")
- Too many personas (more than 5)
- Never updated

---

### 21. Testing Too Late
**What it is:** Only testing after development is complete.

**Why it's bad:** Expensive to fix. Changes are "already built."

**Rule:** Test early (sketches, wireframes) and often.

---

### 22. Modal Overload
**What it is:** Popups blocking content constantly.

**Examples:**
- Email capture popup on first visit
- Cookie banner + newsletter + chat widget
- Modal for every confirmation

**Rule:** Use modals sparingly for critical actions only.

---

### 23. Infinite Scroll Without Context
**What it is:** No sense of how much content exists or where you are.

**Problems:**
- Can't find previously seen items
- No sense of progress
- Footer unreachable

**Solutions:**
- Provide progress indicator
- Allow jumping to sections
- Show total count

---

### 24. Confirm Shaming
**What it is:** Manipulative language on decline buttons.

**Example:**
- ❌ "No thanks, I don't want to save money"
- ✅ "No thanks"

**Why it's bad:** Manipulative, damages trust, users resent it.

---

### 25. Feature Bloat
**What it is:** Adding features without removing complexity.

**Signs:**
- "More options" everywhere
- Settings no one uses
- Features added by request without validation

**Rule:** Every feature has a cost. Add only what's validated.

---

## Trust Anti-Patterns

### Fake Testimonials
- Generic names ("John D.")
- No photos
- No specifics
- Too perfect ("It changed my life!")

**What real testimonials have:**
- Full name and photo
- Role and company
- Specific results
- What nearly stopped them

### Missing Contact Info
- No phone number
- No physical address
- "Contact us" form only
- No response time expectation

### Overpromising
- "Guaranteed results" without specifics
- "Best in the industry" without proof
- "Revolutionary" everything

---

## Offer Anti-Patterns

### Price Hiding
- "Contact us for pricing"
- Pricing only after sign-up
- Complex pricing calculator required

**Why it's bad:** Visitors assume the worst.

### Confusing Tiers
- Too many options (5+ tiers)
- Unclear differences between tiers
- No recommended option

### No Trial
- Requiring payment before trying
- Trial with too many limitations
- Credit card required for trial

---

## The Ultimate Anti-Pattern: Assumptions

**Never assume:**
- ❌ "Our visitors understand this"
- ❌ "The design is intuitive"
- ❌ "The copy is clear"
- ❌ "People will scroll down"
- ❌ "Everyone knows our brand"
- ❌ "The price is reasonable"

**Always verify with:**
- User tests
- Surveys
- Session recordings
- Analytics data

---

## Quick Reference: Red Flags

If you see any of these, stop and reconsider:

| Red Flag | Question to Ask |
|----------|-----------------|
| "Let's just redesign it" | Did we diagnose first? |
| "I think visitors will..." | What does the data say? |
| "It looks good" | But does it convert? |
| "Competitors do it this way" | Did they test it? Do we know it works? |
| "Let's add another CTA" | What's the ONE goal? |
| "We need more content" | Is the current content even being read? |
| "Let's test button colors" | Is that really the conversion blocker? |
| Long sentences in copy | Does this pass Hemingway? |
| Internal jargon | Would a newcomer understand? |

---

## The Golden Rule

> "Your visitors appear to be stupid. It's a compelling illusion. But look at it another way:
> 1. Our users desired something.
> 2. We created a website to satisfy that desire.
> 3. And our users still can't get what they desire.
> Now who's stupid?"

---

## Quick Reference: All Red Flags

| Category | Red Flag | Source |
|----------|----------|--------|
| Process | "Let's just redesign it" | Making Websites Win |
| Process | "I know what users want" | Designed for Use |
| Usability | "Users will figure it out" | Don't Make Me Think |
| Usability | "Let's add instructions" | Don't Make Me Think |
| Copy | Long sentences (15+ words) | Making Websites Win |
| Copy | Internal jargon | All three books |
| Design | Multiple CTAs | Making Websites Win |
| Design | Mystery meat navigation | Don't Make Me Think |
| Trust | Fake urgency | Making Websites Win |
| Trust | Confirm shaming | Designed for Use |

---

*This document combines anti-patterns from:*
*- "Making Websites Win" (conversion killers)*
*- "Don't Make Me Think" (usability sins)*
*- "Designed for Use" (UX process mistakes)*

*Review before making any design or copy decisions.*
*When in doubt, diagnose first.*
