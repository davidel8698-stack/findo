# Don't Make Me Think - Design Bible

> **"A Common Sense Approach to Web Usability"**
> — Steve Krug, Usability Consultant

---

## About This Document

This is the **usability reference** for FINDO, based on Steve Krug's classic usability guide.
Every interface decision must follow these principles to ensure users can navigate effortlessly.

**Author:** Steve Krug (Advanced Common Sense)
**First Published:** 2000 | **Revised:** 2014 (3rd Edition)
**Impact:** The most-read book on web usability ever written

---

## Table of Contents

1. [The First Law of Usability](#the-first-law-of-usability)
2. [How We Really Use the Web](#how-we-really-use-the-web)
3. [Billboard Design 101](#billboard-design-101)
4. [Why Users Like Mindless Choices](#why-users-like-mindless-choices)
5. [Omit Needless Words](#omit-needless-words)
6. [Navigation Design](#navigation-design)
7. [The Home Page](#the-home-page)
8. [Usability Testing](#usability-testing)
9. [Mobile Usability](#mobile-usability)
10. [Accessibility](#accessibility)
11. [Key Principles Summary](#key-principles-summary)

---

## The First Law of Usability

### Don't Make Me Think

> **"If something requires a large investment of time—or looks like it will—it's less likely to be used."**

#### What "Thinking" Means
When users encounter a page, they shouldn't have to think about:
- "Where am I?"
- "Where should I begin?"
- "Where did they put ___?"
- "What are the most important things on this page?"
- "Why did they call it that?"
- "Is that a button or just a graphic?"
- "Can I click on this?"

#### The Goal
Make pages **self-evident** - obvious at a glance.

If you can't make it self-evident, make it **self-explanatory** - users can figure it out with minimal effort.

```
┌─────────────────────────────────────────────────────────────┐
│              HIERARCHY OF OBVIOUSNESS                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   SELF-EVIDENT  →  Best. No thought required.               │
│        ↓                                                    │
│   SELF-EXPLANATORY  →  Good. Requires brief thought.        │
│        ↓                                                    │
│   REQUIRES EXPLANATION  →  Bad. Needs documentation.        │
│        ↓                                                    │
│   IMPOSSIBLE TO FIGURE OUT  →  Fatal. Users will leave.     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Why It Matters
Every question mark adds to cognitive load. Too many, and users:
- Get frustrated
- Leave your site
- Blame themselves (and never return)
- Tell others about their bad experience

---

## How We Really Use the Web

### Fact 1: We Don't Read Pages. We Scan Them.

Users don't read word-by-word. They scan for:
- Words and phrases that catch their eye
- Things that match what they're looking for
- Things that look clickable

**Why?**
- We're usually in a hurry
- We know we don't need to read everything
- We're good at scanning (practice from newspapers, magazines)

#### Implications
- Make important content **visually prominent**
- Use **headings** that describe content
- Use **bulleted lists** instead of paragraphs
- **Highlight key terms**
- Keep paragraphs short

---

### Fact 2: We Don't Make Optimal Choices. We Satisfice.

Users don't look for the best option. They choose the **first reasonable option** (satisficing = satisfy + suffice).

**Why?**
- We're always in a hurry
- There's no penalty for wrong guessing (we can use Back button)
- Weighing options isn't worth the effort
- Guessing is more fun

#### Implications
- Make sure the right option is **obviously** the right one
- Don't rely on users reading instructions
- Make recovery from mistakes easy

---

### Fact 3: We Don't Figure Out How Things Work. We Muddle Through.

Users don't read manuals. They muddle through, even if their approach is inefficient.

**Why?**
- It's not important to us to understand how things work
- If we find something that works, we stick with it
- We rarely go back to find a better way

#### Implications
- Design for muddling through
- Make the right path obvious
- Don't assume users will discover features

---

## Billboard Design 101

### Design for Scanning, Not Reading

Think of each page as a billboard that users pass at 60 mph.

#### The 5 Rules of Billboard Design

**Rule 1: Create a Clear Visual Hierarchy**

```
┌─────────────────────────────────────────────────────────────┐
│  VISUAL HIERARCHY PRINCIPLES                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. The more important something is, the more prominent     │
│                                                             │
│  2. Things that are related logically are related visually  │
│                                                             │
│  3. Things are "nested" visually to show what's part of what│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Rule 2: Use Conventions**
- Users spend most of their time on OTHER sites
- Follow standard patterns they already know
- Example: Logo top-left, links to home. Search box top-right.

> **"Innovate when it provides clear value. Use conventions everywhere else."**

**Rule 3: Break Pages into Clearly Defined Areas**
- Users should instantly see: "This is where I find ___"
- Use visual borders, backgrounds, whitespace
- Clear sections with clear purposes

**Rule 4: Make It Obvious What's Clickable**
- Buttons should look like buttons
- Links should look like links (underlined, different color)
- Avoid "mystery meat navigation" (images with no text)

**Rule 5: Minimize Noise**
- Two kinds of noise:
  - **Shouting:** Everything trying to get attention
  - **Disorganization:** Random placement, no alignment
- When in doubt, remove

---

## Why Users Like Mindless Choices

### Hick's Law
The time to make a decision increases with the number and complexity of choices.

### The Rule of Three Clicks is Wrong

The old "three clicks to anywhere" rule misses the point.

> **What matters is not the NUMBER of clicks, but how HARD each click is.**

**Good:** 3 mindless, unambiguous clicks
**Bad:** 1 click that requires careful thought

### Make Choices Mindless

For each decision point:
- Make the options clear
- Provide just enough information to choose
- Reduce the number of options when possible

#### Example: Good vs Bad Navigation

**Bad (requires thought):**
```
Products | Solutions | Resources | Insights
```
("What's the difference between Solutions and Products?")

**Good (mindless):**
```
Shop | Learn | Help | About
```
(Instantly understandable)

---

## Omit Needless Words

### Vigorous Writing is Concise

> **"Get rid of half the words on each page, then get rid of half of what's left."**

#### Three Benefits of Reducing Words

1. **Reduces noise** - Less to scan through
2. **Makes useful content more prominent** - Stands out better
3. **Makes pages shorter** - Less scrolling needed

#### What to Cut

**Happy talk** - Introductions that say nothing
```
Bad:  "Welcome to our website! We're so glad you're here."
Good: [Delete entirely]
```

**Instructions** - Users don't read them anyway
```
Bad:  "To search, enter your search terms in the box below and click Search."
Good: [Search box with placeholder text]
```

**Marketing fluff** - Empty claims
```
Bad:  "World-class solutions for today's enterprise"
Good: "500+ companies use our inventory system"
```

---

## Navigation Design

### Navigation Serves 4 Functions

1. **Tells us where we are**
2. **Tells us how to get where we want to go**
3. **Tells us what's here (site overview)**
4. **Tells us how to use the site**

### The Trunk Test

At any page, users should be able to answer:
- What site is this? (Site ID)
- What page am I on? (Page name)
- What are the major sections? (Sections)
- What are my options at this level? (Local navigation)
- Where am I in the scheme of things? (Breadcrumbs)
- How can I search? (Search)

```
┌─────────────────────────────────────────────────────────────┐
│  TRUNK TEST ELEMENTS                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Site ID]          [Utility Nav]        [Search]          │
│                                                             │
│  [Primary Navigation Tabs/Menu]                             │
│                                                             │
│  [Breadcrumbs: Home > Section > Subsection > Current]       │
│                                                             │
│  [Page Name - Clearly Visible H1]                           │
│                                                             │
│  [Local Navigation] | [Page Content]                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Navigation Conventions

**Persistent Navigation (on every page):**
- Site ID (logo)
- Primary navigation
- Utilities (Account, Help, Cart)
- Search

**Breadcrumbs:**
- Use > as separator
- Boldface the last item (current page)
- Make them small (secondary)
- Start with "Home" or site name

### The "You Are Here" Indicator

Users need to know where they are. Mark the current section/page:
- Highlighted tab
- Different color
- Bold text
- Arrow or pointer

---

## The Home Page

### The Home Page Has to Accomplish a Lot

```
┌─────────────────────────────────────────────────────────────┐
│  HOME PAGE RESPONSIBILITIES                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Site identity and mission - Who are you? What do you do?│
│  2. Site hierarchy - What can I find here?                  │
│  3. Search - Where's the search?                            │
│  4. Teaser - What's new? What's featured?                   │
│  5. Deals - What are you promoting?                         │
│  6. Shortcuts - Most popular content/tools                  │
│  7. Registration - Sign up prompt                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### The Tagline

Every site needs a tagline - a phrase that summarizes the whole site.

**Good Taglines:**
- Clear, informative, just long enough
- Convey differentiation
- Not generic marketing speak

**Examples:**
- "Organize the world's information" (Google's mission)
- "Earth's biggest selection" (Amazon)
- "The front page of the internet" (Reddit)

**Bad Taglines:**
- "Solutions for a changing world"
- "Your partner in success"
- "Innovation meets excellence"

### The Welcome Blurb

Brief description that answers: "What is this? What can I do here?"

**Keep it:**
- Short (under 25 words)
- Scannable
- Specific, not generic

---

## Usability Testing

### The Big Secret

> **"Testing one user is 100% better than testing none."**

### Why You Should Test

- **All sites have problems** - You can't see them because you're too close
- **Most problems are easy to find** - They're obvious to anyone who isn't the designer
- **Testing provides specific problems to fix** - Not opinions, but observations

### How to Test (Krug's Method)

**The Setup:**
- 1 facilitator
- 1 user
- Screen recording software
- 30-60 minutes per session

**The Process:**
1. **Welcome** (4 minutes) - Make them comfortable
2. **Questions about user** (2 minutes) - Background info
3. **Home page tour** (3 minutes) - What do they think this site is about?
4. **Tasks** (35 minutes) - Ask them to accomplish specific tasks
5. **Probing** (5 minutes) - Follow up on things observed
6. **Wrap-up** (5 minutes) - Anything else? Thank them.

### Testing Principles

**Test early and often:**
- Day of research = Weeks of arguing saved
- Test when you have something to test (even wireframes)

**Test with 3-4 users:**
- First 3 users find most problems
- More users = diminishing returns
- Better to test 3 users, fix problems, test 3 more

**Think-aloud protocol:**
- Ask users to say what they're thinking
- "What are you looking at? What are you going to do?"
- Don't ask "Do you like it?" Ask "Can you find ___?"

### Common Findings

Most tests reveal:
- Users don't see things that seem obvious
- Labels don't mean what you think they mean
- Users interpret things differently than expected
- Features users need are hidden
- Things that seem important to you aren't to users

---

## Mobile Usability

### Mobile is Different

> **"On mobile, it's all about speed."**

**Constraints:**
- Smaller screen
- Harder to type
- Often on the go
- Distracting environment
- Slower connections

### Mobile Design Principles

**1. Allow for Fat Fingers**
- Touch targets minimum 44x44 pixels
- Adequate spacing between targets
- Primary actions in thumb zone

**2. Don't Hide Key Content**
- Hamburger menus hide navigation
- Important features need to be visible
- Test whether users find hidden features

**3. Keep Forms Minimal**
- Each field = friction
- Use appropriate keyboard (email, phone, etc.)
- Auto-fill where possible
- Save progress

**4. Prioritize Speed**
- Every second counts
- Optimize images
- Lazy load below-fold content
- Show content progressively

### The Thumb Zone

```
┌─────────────────────────────────────────────────────────────┐
│                    MOBILE THUMB ZONES                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    ┌─────────────────────────┐                              │
│    │  HARD      │    HARD    │                              │
│    │  TO REACH  │  TO REACH  │                              │
│    ├────────────┼────────────┤                              │
│    │            │            │                              │
│    │   OK       │    OK      │                              │
│    │            │            │                              │
│    ├────────────┼────────────┤                              │
│    │    EASY    │   EASY     │                              │
│    │  ★ PRIMARY │  ACTIONS ★ │                              │
│    └────────────┴────────────┘                              │
│                                                             │
│    Put important actions in the EASY zone (bottom half)     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Accessibility

### Why Accessibility Matters

> **"Making sites accessible makes them more usable for everyone."**

**The Facts:**
- 15-20% of population has some disability
- Many disabilities are temporary or situational
- Accessible sites often have better SEO
- It's the law in many jurisdictions

### The 4 Accessibility Principles

**1. Add Text Equivalents**
- Alt text for images
- Captions for video
- Transcripts for audio

**2. Make All Functionality Keyboard-Accessible**
- Tab navigation works
- Skip links for navigation
- Focus indicators visible

**3. Create Sufficient Contrast**
- 4.5:1 for normal text
- 3:1 for large text
- Check with contrast tools

**4. Don't Rely on Color Alone**
- Use icons + color
- Use patterns + color
- Ensure information is accessible without color

### Screen Reader Considerations

- **Heading hierarchy matters** - H1, H2, H3 in order
- **Link text must make sense alone** - Not "click here"
- **Forms need labels** - Associated with inputs
- **Images need context** - Descriptive alt text

---

## Key Principles Summary

### Krug's First Law
> **"Don't make me think."**

### Krug's Second Law
> **"It doesn't matter how many times I have to click, as long as each click is a mindless, unambiguous choice."**

### Krug's Third Law
> **"Get rid of half the words on each page, then get rid of half of what's left."**

### The Reservoir of Goodwill

Every user arrives with a reservoir of goodwill toward your site.

**Things that diminish goodwill:**
- Hiding information (prices, contact info)
- Punishing for not doing things your way
- Asking for information you don't need
- Fake urgency, manipulative patterns
- Amateur-looking site
- Not being transparent

**Things that increase goodwill:**
- Knowing the main things people want and making them easy
- Telling people what they want to know (shipping, returns)
- Saving steps where possible
- Putting effort into the experience
- Knowing when to apologize
- Making it easy to recover from errors

---

## FINDO Application Checklist

### Before Every Design Review

**Scannability:**
- [ ] Visual hierarchy is clear
- [ ] Important items are prominent
- [ ] Pages have clear sections
- [ ] Headings describe content
- [ ] Lists used instead of paragraphs

**Obviousness:**
- [ ] What's clickable is obvious
- [ ] Navigation is conventional
- [ ] Forms have clear labels
- [ ] Current location is indicated
- [ ] No ambiguous options

**Words:**
- [ ] Cut word count by 50%
- [ ] No happy talk or fluff
- [ ] Instructions removed or minimized
- [ ] Action labels are clear
- [ ] Headings are descriptive

**Navigation:**
- [ ] Site ID always visible
- [ ] Primary nav on every page
- [ ] Search available
- [ ] Breadcrumbs present
- [ ] "You are here" indicator

**Mobile:**
- [ ] Touch targets 44px minimum
- [ ] Important actions in thumb zone
- [ ] Forms minimal
- [ ] Content loads quickly
- [ ] Key features visible (not hidden in menus)

**Testing:**
- [ ] Tested with 3+ users
- [ ] Think-aloud protocol used
- [ ] Major problems identified
- [ ] Issues prioritized and fixed

---

## Recommended Reading

- **"Don't Make Me Think, Revisited"** - The full book (required)
- **"Rocket Surgery Made Easy"** - Krug's usability testing guide
- **"100 Things Every Designer Needs to Know About People"** - Susan Weinschenk
- **"The Design of Everyday Things"** - Don Norman

---

*This document complements the main Design Bible (MAKING-WEBSITES-WIN.md) with usability-specific guidance.*
*Last updated: 2026-01-25*
