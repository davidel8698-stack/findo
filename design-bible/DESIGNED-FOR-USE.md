# Designed for Use - Design Bible

> **"Create Usable Interfaces for Applications and the Web"**
> — Lukas Mathis, UX Designer & Developer

---

## About This Document

This is the **complete UX process reference** for FINDO, covering the full design lifecycle from research to testing.
Use this as your guide for how to design products, not just what makes them usable.

**Author:** Lukas Mathis (ignore the code)
**Focus:** Practical, process-oriented UX design
**Scope:** Research → Design → Prototyping → Testing → Iteration

---

## Table of Contents

1. [UX Design Philosophy](#ux-design-philosophy)
2. [Research Methods](#research-methods)
3. [Understanding Users](#understanding-users)
4. [Information Architecture](#information-architecture)
5. [Interaction Design Principles](#interaction-design-principles)
6. [Visual Design Fundamentals](#visual-design-fundamentals)
7. [Prototyping](#prototyping)
8. [Usability Testing](#usability-testing)
9. [Writing for Interfaces](#writing-for-interfaces)
10. [Common Patterns & Anti-Patterns](#common-patterns--anti-patterns)
11. [The Design Process](#the-design-process)

---

## UX Design Philosophy

### What is User Experience Design?

> **"User experience design is the process of designing products that are useful, easy to use, and delightful."**

UX is not just about:
- Making things pretty (that's visual design)
- Writing code (that's development)
- Organizing content (that's information architecture)

UX **integrates all of these** to create products people actually want to use.

### The UX Design Mindset

```
┌─────────────────────────────────────────────────────────────┐
│              THE UX DESIGNER'S MINDSET                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. YOU ARE NOT THE USER                                    │
│     Your assumptions are probably wrong. Test them.          │
│                                                             │
│  2. DESIGN IS COMMUNICATION                                 │
│     The interface speaks to users. What is it saying?        │
│                                                             │
│  3. DETAILS MATTER                                          │
│     Small friction points compound into frustration.         │
│                                                             │
│  4. SIMPLICITY IS HARD                                      │
│     Easy to understand ≠ easy to design.                     │
│                                                             │
│  5. ITERATE CONSTANTLY                                      │
│     First design is never final. Plan for change.            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### The Three Pillars of UX

**1. Useful** - Does it solve a real problem?
**2. Usable** - Can people figure out how to use it?
**3. Desirable** - Do people want to use it?

All three must be present. A useful but unusable product fails. A usable but useless product fails.

---

## Research Methods

### Why Research?

> **"Time spent on research is time saved on redesign."**

Without research, you're designing based on assumptions. Assumptions are usually wrong.

### Quantitative vs Qualitative

**Quantitative (What):**
- Analytics
- A/B tests
- Surveys with closed questions
- Task completion rates

**Qualitative (Why):**
- User interviews
- Observation
- Open-ended surveys
- Contextual inquiry

You need both. Quantitative tells you WHAT is happening. Qualitative tells you WHY.

### Research Methods Toolkit

#### 1. User Interviews

**Purpose:** Understand goals, frustrations, context

**Process:**
1. Prepare open-ended questions
2. Record (with permission)
3. Listen more than you talk
4. Ask "why" repeatedly
5. Synthesize patterns

**Good Questions:**
- "Walk me through how you currently do ___"
- "What's the hardest part about ___?"
- "What would make this easier?"
- "Tell me about the last time you ___"

**Bad Questions:**
- "Would you use a feature that ___?" (hypothetical)
- "Do you like this design?" (leading)
- Yes/No questions (not enough depth)

#### 2. Contextual Inquiry

**Purpose:** See how users work in their natural environment

**Process:**
1. Go to the user's location
2. Observe them doing their work
3. Ask questions as they work
4. Note workarounds, pain points
5. Document the environment

**Why It Works:**
- People do things they don't remember
- Environment affects behavior
- Workarounds reveal unmet needs

#### 3. Surveys

**Purpose:** Gather data from many users

**Best Practices:**
- Keep short (5-10 minutes max)
- Start with easy questions
- One question per screen (mobile)
- Mix question types
- Always include "other" option
- Test before sending

**Question Types:**
- Likert scale (1-5 agreement)
- Multiple choice
- Ranking
- Open-ended (use sparingly)
- NPS (Net Promoter Score)

#### 4. Competitive Analysis

**Purpose:** Learn from others' solutions

**Analyze:**
- Direct competitors
- Indirect competitors (different industry, same problem)
- Best-in-class products (for patterns)

**Document:**
- Features offered
- Information architecture
- Interaction patterns
- Strengths and weaknesses
- Opportunities

#### 5. Analytics Review

**Purpose:** Understand actual behavior

**Key Metrics:**
- Task completion rates
- Error rates
- Time on task
- Drop-off points
- Search queries
- Device/browser usage

---

## Understanding Users

### Personas

> **"Personas help teams make decisions by keeping a specific user in mind."**

#### Persona Components

```
┌─────────────────────────────────────────────────────────────┐
│  PERSONA TEMPLATE                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  NAME & PHOTO                                               │
│  "Marketing Mary"  [Photo]                                  │
│                                                             │
│  DEMOGRAPHICS                                               │
│  Age: 34 | Role: Marketing Manager | Tech comfort: Medium   │
│                                                             │
│  GOALS                                                      │
│  - Create reports quickly                                   │
│  - Prove marketing ROI to leadership                        │
│  - Stay on top of campaign performance                      │
│                                                             │
│  FRUSTRATIONS                                               │
│  - Current tools require manual data exports                │
│  - Reports take too long to create                          │
│  - Data is scattered across platforms                       │
│                                                             │
│  BEHAVIORS                                                  │
│  - Checks dashboards first thing every morning              │
│  - Creates weekly reports for leadership                    │
│  - Uses mobile for quick checks                             │
│                                                             │
│  QUOTE                                                      │
│  "I spend more time gathering data than analyzing it."      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Persona Best Practices

**Do:**
- Base on real research
- Keep focused (3-5 key personas)
- Include behaviors, not just demographics
- Update as you learn more

**Don't:**
- Make them up without research
- Include irrelevant details
- Create too many
- Treat as final truth

### User Journey Maps

**Purpose:** Visualize the complete experience over time

#### Journey Map Components

1. **Phases** - Steps in the process
2. **Actions** - What users do
3. **Thoughts** - What users think
4. **Emotions** - How users feel
5. **Pain Points** - Friction moments
6. **Opportunities** - Improvement areas

```
┌───────────────────────────────────────────────────────────────────┐
│  JOURNEY MAP: New User Signup                                      │
├──────────┬──────────┬──────────┬──────────┬──────────┬────────────┤
│  Phase   │ Discover │ Evaluate │ Sign Up  │ Onboard  │ First Use  │
├──────────┼──────────┼──────────┼──────────┼──────────┼────────────┤
│ Actions  │ Google   │ Read     │ Create   │ Set up   │ Complete   │
│          │ search   │ pricing  │ account  │ profile  │ first task │
├──────────┼──────────┼──────────┼──────────┼──────────┼────────────┤
│ Thoughts │"Can this │"Is it    │"This is  │"So many  │"Finally!"  │
│          │ help me?"│ worth it?"│ easy"    │ fields"  │            │
├──────────┼──────────┼──────────┼──────────┼──────────┼────────────┤
│ Emotion  │   😐     │    🤔    │    😊    │    😤    │    😄      │
├──────────┼──────────┼──────────┼──────────┼──────────┼────────────┤
│ Pain Pts │ Hard to  │ Pricing  │          │ Too many │ Feature    │
│          │ compare  │ unclear  │          │ steps    │ hard find  │
├──────────┼──────────┼──────────┼──────────┼──────────┼────────────┤
│ Opps     │ SEO,     │ Clear    │          │ Progress │ Better     │
│          │ content  │ pricing  │          │ indicator│ onboarding │
└──────────┴──────────┴──────────┴──────────┴──────────┴────────────┘
```

### Jobs To Be Done (JTBD)

> **"People don't want a quarter-inch drill. They want a quarter-inch hole."**

**Format:**
"When ___ [situation], I want to ___ [motivation], so I can ___ [expected outcome]."

**Examples:**
- "When I'm commuting, I want to learn something useful, so I can feel productive."
- "When I finish a project, I want to easily share results, so I can impress stakeholders."

---

## Information Architecture

### What is IA?

Information Architecture is the structure of information - how content is organized, labeled, and navigated.

### Card Sorting

**Purpose:** Understand how users categorize information

**Open Card Sort:**
- Users create their own categories
- Good for: New products, major restructures

**Closed Card Sort:**
- Users sort into predefined categories
- Good for: Validating existing structure

**Tools:** OptimalSort, Trello, physical cards

### Navigation Structures

```
┌─────────────────────────────────────────────────────────────┐
│  NAVIGATION STRUCTURES                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  HIERARCHICAL (Tree)                                        │
│  Home → Category → Subcategory → Item                       │
│  Best for: Large sites with clear categories                │
│                                                             │
│  FLAT                                                       │
│  Home → Page A, Page B, Page C, Page D                      │
│  Best for: Small sites, simple apps                         │
│                                                             │
│  HUB & SPOKE                                                │
│  Home ↔ Feature A                                           │
│  Home ↔ Feature B                                           │
│  Best for: Apps with distinct modes                         │
│                                                             │
│  MATRIX                                                     │
│  Multiple paths to same content                             │
│  Best for: Content that fits multiple categories            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Labeling

**Rules for Labels:**
1. Use user language (not internal jargon)
2. Be specific (not "Resources")
3. Be consistent (same word = same meaning)
4. Front-load important words
5. Test with real users

**Common Label Problems:**
- Too vague: "Solutions" (solutions to what?)
- Too similar: "Help" vs "Support" vs "Resources"
- Internal jargon: "Knowledge Base" (users say "Help")

---

## Interaction Design Principles

### Affordances

> **"An affordance is a clue about how an object should be used."**

**Examples:**
- Buttons look raised = push them
- Text fields have borders = type in them
- Links are blue and underlined = click them

**Problem:** Digital affordances are learned, not natural. Follow conventions.

### Feedback

Every action needs a response:

```
┌─────────────────────────────────────────────────────────────┐
│  FEEDBACK HIERARCHY                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Immediate (< 100ms)                                        │
│  ├─ Button state change                                     │
│  ├─ Hover effects                                           │
│  └─ Click animation                                         │
│                                                             │
│  Short delay (100ms - 1s)                                   │
│  ├─ Loading spinner                                         │
│  └─ Progress indicator                                      │
│                                                             │
│  Long operation (> 1s)                                      │
│  ├─ Progress bar with estimate                              │
│  ├─ Status messages                                         │
│  └─ Allow cancel                                            │
│                                                             │
│  Completion                                                 │
│  ├─ Success message                                         │
│  ├─ Error with recovery path                                │
│  └─ Next step suggestion                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Constraints

Limit what users can do to prevent errors:

**Physical constraints:** Button is disabled until form is valid
**Semantic constraints:** Date picker prevents invalid dates
**Cultural constraints:** Red = error (Western cultures)
**Logical constraints:** Can't delete while editing

### Mapping

Controls should relate spatially to their effects:

**Good:** Volume slider goes up = volume increases
**Bad:** Left arrow scrolls right

### Consistency

**Internal consistency:** Same action = same result throughout app
**External consistency:** Follow platform conventions

---

## Visual Design Fundamentals

### Hierarchy

Guide users' eyes to what matters:

**Tools for Hierarchy:**
1. **Size** - Larger = more important
2. **Color** - Contrast draws attention
3. **Position** - Top-left is seen first (LTR languages)
4. **Whitespace** - Isolation creates focus
5. **Typography** - Weight, style, size

### Alignment

> **"When items are aligned, they feel organized and professional."**

**Rules:**
- Align everything to something
- Use a grid system
- Minimize alignment points
- Left-align body text

### Proximity

> **"Items that are related should be close together."**

**Apply to:**
- Labels and inputs
- Buttons and their descriptions
- Related content sections

### Contrast

Create visual interest and guide attention:

**Contrast through:**
- Color (light/dark)
- Size (large/small)
- Weight (bold/light)
- Style (serif/sans-serif)

### Color

**Color Roles:**
- **Primary:** Brand color, main actions
- **Secondary:** Supporting elements
- **Neutral:** Text, backgrounds
- **Semantic:** Success (green), Error (red), Warning (yellow)

**Accessibility:**
- Don't rely on color alone
- Maintain 4.5:1 contrast for text
- Test with colorblind simulators

### Typography

**Type Scale Example:**
```
H1: 32px / 40px line-height
H2: 24px / 32px line-height
H3: 20px / 28px line-height
Body: 16px / 24px line-height
Small: 14px / 20px line-height
```

**Typography Rules:**
- 45-75 characters per line (optimal)
- Line height 1.4-1.6 for body text
- Limit to 2 font families
- Create clear hierarchy

---

## Prototyping

### Prototype Fidelity

```
┌─────────────────────────────────────────────────────────────┐
│  PROTOTYPE FIDELITY LEVELS                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  LOW FIDELITY (Sketches, Paper)                             │
│  ├─ Speed: Very fast                                        │
│  ├─ Cost: Very low                                          │
│  ├─ Best for: Early exploration, many ideas                 │
│  └─ Tests: Information architecture, flow                   │
│                                                             │
│  MEDIUM FIDELITY (Wireframes)                               │
│  ├─ Speed: Fast                                             │
│  ├─ Cost: Low                                               │
│  ├─ Best for: Structure, layout, content                    │
│  └─ Tests: Usability, navigation                            │
│                                                             │
│  HIGH FIDELITY (Visual mockups)                             │
│  ├─ Speed: Slow                                             │
│  ├─ Cost: Higher                                            │
│  ├─ Best for: Final validation, stakeholder buy-in          │
│  └─ Tests: Visual design, polish, details                   │
│                                                             │
│  INTERACTIVE (Coded prototypes)                             │
│  ├─ Speed: Slowest                                          │
│  ├─ Cost: Highest                                           │
│  ├─ Best for: Complex interactions, animations              │
│  └─ Tests: Full experience                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### When to Use Each

**Sketches:** Brainstorming, exploring many options quickly
**Wireframes:** Testing structure and flow
**Mockups:** Validating visual design, getting approval
**Interactive:** Testing complex interactions

### Prototyping Tools

- **Sketches:** Paper, whiteboard
- **Wireframes:** Balsamiq, Whimsical, Figma
- **Mockups:** Figma, Sketch, Adobe XD
- **Interactive:** Figma, Framer, code

### Prototype Testing Tips

1. **Explain it's a prototype** - Not final, rough edges expected
2. **Set realistic expectations** - Some things won't work
3. **Focus on the questions** - Test specific hypotheses
4. **Don't defend** - Listen and take notes
5. **Iterate quickly** - Fix obvious issues between tests

---

## Usability Testing

### Test Types

**Moderated (In-person or remote):**
- Facilitator guides session
- Can ask follow-up questions
- More depth, more effort

**Unmoderated (Remote):**
- Users complete tasks alone
- Recorded for later review
- Faster, cheaper, less depth

### The 5-Second Test

**Purpose:** Test first impressions

**Process:**
1. Show design for 5 seconds
2. Hide it
3. Ask: "What was this page about?"
4. Ask: "What stood out to you?"

**Use for:** Headlines, value propositions, visual hierarchy

### Task-Based Testing

**Structure:**
1. Welcome and intro (2 min)
2. Background questions (3 min)
3. Tasks (30 min)
4. Follow-up questions (10 min)
5. Thank you (5 min)

**Task Writing:**
- Use scenarios, not instructions
- Don't use words from the UI
- One goal per task
- Order from easy to hard

**Example Tasks:**
- Bad: "Click the Contact link in the navigation"
- Good: "You have a question about pricing. How would you get in touch?"

### What to Observe

- Where they click first
- Where they hesitate
- What they say out loud
- Facial expressions
- Whether they complete the task
- How long it takes
- Errors made

### Analyzing Results

**Quantitative:**
- Task success rate
- Time on task
- Error rate
- SUS score (System Usability Scale)

**Qualitative:**
- Patterns in behavior
- Common pain points
- Surprising findings
- User quotes

---

## Writing for Interfaces

### Microcopy

> **"The words in your interface are the conversation you have with users."**

#### Button Labels

**Be specific:**
- Bad: "Submit"
- Good: "Create Account"
- Better: "Start Free Trial"

**Use verbs:**
- Bad: "Confirmation"
- Good: "Confirm Order"

#### Error Messages

**Formula:** What happened + Why + How to fix

**Example:**
- Bad: "Error"
- Good: "Email address is invalid. Please enter a valid email (e.g., name@example.com)."

#### Empty States

Don't leave users with blank screens:
- Explain what will appear here
- Guide them to take action
- Use illustrations to add personality

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    [Illustration]                           │
│                                                             │
│              No projects yet                                │
│                                                             │
│     Create your first project to get started.               │
│                                                             │
│            [ Create Project ]                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Voice and Tone

**Voice:** Consistent personality (who you are)
**Tone:** Adjusts to context (how you say it)

**Voice example (FINDO):**
- Helpful, not pushy
- Clear, not clever
- Confident, not arrogant
- Warm, not casual

**Tone adjusts:**
- Error: Apologetic, solution-focused
- Success: Celebratory, brief
- Onboarding: Encouraging, patient
- Help: Empathetic, thorough

---

## Common Patterns & Anti-Patterns

### Good Patterns

**Progressive Disclosure:**
Show basics first, details on demand
- Expandable sections
- Tooltips for advanced options
- "Show more" links

**Inline Editing:**
Edit content without separate edit mode
- Click to edit
- Instant save
- Clear feedback

**Skeleton Screens:**
Show layout while loading
- Better than spinner alone
- Sets expectations
- Feels faster

**Undo Instead of Confirm:**
Let users undo rather than confirming every action
- Faster workflow
- Less friction
- Forgiveness over prevention

### Anti-Patterns to Avoid

**Mystery Meat Navigation:**
Icons without labels
- Users must hover to understand
- Increases cognitive load
- Use labels with icons

**Confirm Shaming:**
"No thanks, I don't want to save money"
- Manipulative
- Damages trust
- Use neutral language

**Infinite Scroll Without Progress:**
No sense of how much content exists
- Provide progress indicator
- Allow jumping to sections
- Show total count

**Modal Overload:**
Popups blocking content constantly
- Use sparingly for critical actions only
- Consider inline alternatives
- Always provide clear close

**Hidden Navigation:**
Hamburger menus hiding important items
- Test if users find features
- Show most important items
- Use bottom navigation on mobile

---

## The Design Process

### The Double Diamond

```
┌─────────────────────────────────────────────────────────────┐
│                 THE DOUBLE DIAMOND                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│         DISCOVER          DEFINE         DEVELOP      DELIVER│
│         (Diverge)        (Converge)     (Diverge)   (Converge)│
│                                                             │
│              \              /             \            /     │
│               \            /               \          /      │
│                \          /                 \        /       │
│                 \        /                   \      /        │
│                  \      /                     \    /         │
│                   \    /                       \  /          │
│                    \  /                         \/           │
│                     \/                                       │
│                                                             │
│         Research        Problem         Ideas        Solution│
│         Insights        Statement       Prototypes   Launch  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Phase 1: Discover

**Goal:** Understand the problem space

**Activities:**
- User research
- Stakeholder interviews
- Competitive analysis
- Analytics review

**Output:** Research insights

### Phase 2: Define

**Goal:** Focus on the right problem

**Activities:**
- Synthesize research
- Create personas
- Map user journeys
- Define problem statement

**Output:** Clear problem definition

### Phase 3: Develop

**Goal:** Explore solutions

**Activities:**
- Ideation workshops
- Sketching
- Prototyping
- User testing

**Output:** Validated solutions

### Phase 4: Deliver

**Goal:** Implement and launch

**Activities:**
- High-fidelity design
- Design handoff
- Development support
- Quality assurance

**Output:** Shipped product

### Iteration is Key

The process is not linear. Expect to:
- Go back when you learn new things
- Test and revise multiple times
- Refine based on real usage
- Continue improving after launch

---

## FINDO Application Checklist

### Research Phase
- [ ] Conducted user interviews (5+ users)
- [ ] Completed competitive analysis
- [ ] Reviewed analytics data
- [ ] Created/updated personas
- [ ] Mapped user journey

### Design Phase
- [ ] Created wireframes
- [ ] Tested information architecture
- [ ] Validated with users (3+ tests)
- [ ] Applied design principles
- [ ] Wrote microcopy

### Before Development
- [ ] High-fidelity mockups complete
- [ ] All states documented (loading, empty, error)
- [ ] Interactions specified
- [ ] Accessibility requirements noted
- [ ] Edge cases addressed

### After Launch
- [ ] Analytics tracking verified
- [ ] User feedback mechanism in place
- [ ] Usability issues logged
- [ ] Improvement backlog maintained

---

## Recommended Reading

- **"Designed for Use"** - The full book (required)
- **"About Face"** - Alan Cooper (comprehensive interaction design)
- **"The Design of Everyday Things"** - Don Norman (foundational)
- **"Lean UX"** - Jeff Gothelf (agile UX process)
- **"Just Enough Research"** - Erika Hall (research methods)

---

*This document complements the main Design Bible (MAKING-WEBSITES-WIN.md) with process and methodology guidance.*
*Last updated: 2026-01-25*
