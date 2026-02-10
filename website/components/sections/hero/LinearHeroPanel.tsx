/**
 * LinearHeroPanel - 3D Perspective Hero Panel
 *
 * Exact reproduction of Linear.app hero panel with RTL Hebrew layout.
 * Features:
 * - RTL-optimized 3D transforms (panel tilts toward right)
 * - 4-gradient CSS mask for edge fading
 * - Elevated panels structure (sidebar as base, content floats above)
 * - Noise texture overlay for premium feel
 * - Light reflection effects on elevated surfaces
 * - ANIMATED: Live scenario showing FINDO in action
 */

"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import styles from "./LinearHeroPanel.module.css";

/* ─────────────────────────────────────────────────────────────────
 * ANIMATION STATE & CONTEXT - Simple Sequential Queue
 * Guaranteed continuous activity - always at least one item typing
 * ───────────────────────────────────────────────────────────────── */

// Module types for FINDO
type ModuleType = "leads" | "reviews" | "content" | "seo";

// Step in an activity (for typing animation)
interface ActivityStep {
  text: string;
}

// Each item has its own lifecycle with independent timing
interface ItemLifecycle {
  startTime: number;      // When item started (relative to cycle)
  duration: number;       // How long this item takes
  typedChars: number;     // Current typed characters
  currentStep: number;    // Current step in the process
  isComplete: boolean;    // Whether item finished
}

// Parallel processing state - tracks multiple active items with individual durations
interface ParallelItemState {
  itemIndex: number;      // Which item (0-5)
  startTime: number;      // When this item started
  duration: number;       // Individual duration for this item (varies!)
  typedChars: number;     // Current typed characters
  currentStep: number;    // Current step in the process
  isComplete: boolean;    // Whether item finished
}

interface AnimationState {
  activeSlots: ParallelItemState[];  // 2 parallel slots for concurrent work
  completedItems: Set<number>;       // Items completed in current cycle
  seed: number;                      // For random selection
}

// Context value type - kept for component compatibility
interface AnimationContextValue {
  activeItems: Set<number>;
  itemLifecycles: Map<number, ItemLifecycle>;
  completedInCycle: Set<number>;
}

const AnimationContext = createContext<AnimationContextValue>({
  activeItems: new Set(),
  itemLifecycles: new Map(),
  completedInCycle: new Set(),
});

// Timing configuration - Authentic parallel processing
const ITEM_DURATION_BASE = 4000;  // Base duration
const ITEM_DURATION_VAR = 2000;   // Variance: 4-6 seconds per item (random feel)
const TYPING_SPEED = 30;          // 30ms per character
const TOTAL_ITEMS = 6;            // 6 items total
const PARALLEL_SLOTS = 2;         // 2 items running in parallel

/* ─────────────────────────────────────────────────────────────────
 * SPARKLINE GRAPH PRESETS - 5 unique positive-trend configurations
 * Each array has 12 points representing a sparkline graph
 * All graphs show upward/positive trends (required by design)
 * ───────────────────────────────────────────────────────────────── */
const GRAPH_PRESETS = [
  // Graph 1: Rise → significant drop → strong recovery → correction → peak
  [28, 35, 42, 34, 41, 52, 48, 58, 54, 63, 70, 68],

  // Graph 2: Surge → crash → rebuild → break new highs
  [32, 45, 38, 29, 36, 44, 51, 46, 55, 62, 58, 72],

  // Graph 3: Slow start → breakout → drop → stronger rise
  [25, 28, 38, 50, 42, 48, 41, 55, 63, 58, 68, 75],

  // Graph 4: Grinding up - uneven progress, stubborn climb
  [32, 38, 35, 44, 40, 43, 52, 48, 56, 64, 59, 73],

  // Graph 5: Mountain journey - clear peaks and valleys with upward trend
  [35, 28, 42, 38, 52, 45, 58, 52, 65, 60, 72, 80],
];

const GRAPH_CYCLE_INTERVAL = 4000; // 4 seconds per graph

/* ─────────────────────────────────────────────────────────────────
 * SPARKLINE PATH GENERATOR - Used by both Desktop and Mobile views
 * ───────────────────────────────────────────────────────────────── */
function generateSparklinePath(points: number[], width: number, height: number) {
  const paddingX = 8;
  const paddingY = 5;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;
  const spacing = graphWidth / (points.length - 1);

  // Normalize points to fit in viewBox
  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const range = maxVal - minVal || 1;

  const normalizedPoints = points.map(p =>
    paddingY + graphHeight - ((p - minVal) / range) * graphHeight
  );

  let path = `M${paddingX},${normalizedPoints[0]}`;

  for (let i = 1; i < normalizedPoints.length; i++) {
    const x = paddingX + i * spacing;
    const y = normalizedPoints[i];
    const prevX = paddingX + (i - 1) * spacing;
    const cpX = (prevX + x) / 2;
    path += ` Q${cpX},${normalizedPoints[i-1]} ${x},${y}`;
  }
  return { path, lastY: normalizedPoints[normalizedPoints.length - 1], lastX: paddingX + (normalizedPoints.length - 1) * spacing };
}

// Seeded random for deterministic but varied selection
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

// Get random non-adjacent item that's not in use or recently used
function getRandomAvailableItem(
  usedItems: Set<number>,
  currentItems: number[],
  seed: number
): number {
  const available: number[] = [];

  for (let i = 0; i < TOTAL_ITEMS; i++) {
    // Skip if already in use
    if (usedItems.has(i)) continue;

    // Avoid adjacent items for more natural look
    const isAdjacentToCurrent = currentItems.some(
      curr => Math.abs(curr - i) === 1 || (curr === 0 && i === 5) || (curr === 5 && i === 0)
    );

    // Prefer non-adjacent, but allow if no other options
    if (!isAdjacentToCurrent) {
      available.unshift(i); // Prioritize non-adjacent
    } else {
      available.push(i);
    }
  }

  if (available.length === 0) return seed % TOTAL_ITEMS;

  // Pick from available using seeded random
  const idx = Math.floor(seededRandom(seed) * Math.min(3, available.length));
  return available[idx];
}

// Random duration for each item (makes timing feel authentic)
function getRandomDuration(seed: number): number {
  return ITEM_DURATION_BASE + seededRandom(seed * 1.5) * ITEM_DURATION_VAR;
}

interface LinearHeroPanelProps {
  className?: string;
}

export function LinearHeroPanel({ className }: LinearHeroPanelProps) {
  // Track if component has mounted (for hydration-safe randomization)
  const [isMounted, setIsMounted] = useState(false);

  // Parallel processing - 2 items active at once with random, non-adjacent selection
  // Initial state is DETERMINISTIC (same on server and client) to avoid hydration mismatch
  const [animationState, setAnimationState] = useState<AnimationState>({
    activeSlots: [
      {
        itemIndex: 0,  // Fixed initial: item 0
        startTime: 0,  // Will be set on mount
        duration: 5000,
        typedChars: 0,
        currentStep: 0,
        isComplete: false
      },
      {
        itemIndex: 3,  // Fixed initial: item 3 (non-adjacent to 0)
        startTime: 0,  // Will be set on mount
        duration: 4500,
        typedChars: 0,
        currentStep: 0,
        isComplete: false
      },
    ],
    completedItems: new Set<number>(),
    seed: 12345,  // Fixed seed, will be randomized on mount
  });

  // Initialize with real timestamps after mount (client-side only)
  useEffect(() => {
    const now = Date.now();
    const initialSeed = now;

    // Randomize the initial state after mount
    const firstItem = Math.floor(seededRandom(initialSeed) * TOTAL_ITEMS);
    const secondItem = (firstItem + 3) % TOTAL_ITEMS;

    setAnimationState({
      activeSlots: [
        {
          itemIndex: firstItem,
          startTime: now,
          duration: getRandomDuration(initialSeed),
          typedChars: 0,
          currentStep: 0,
          isComplete: false
        },
        {
          itemIndex: secondItem,
          startTime: now + 800 + seededRandom(initialSeed + 1) * 1200,
          duration: getRandomDuration(initialSeed + 2),
          typedChars: 0,
          currentStep: 0,
          isComplete: false
        },
      ],
      completedItems: new Set<number>(),
      seed: initialSeed + 3,
    });

    setIsMounted(true);
  }, []);

  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // ═══ SHARED SPARKLINE STATE - Used by both Activity Feed (mobile) and Detail Panel ═══
  // Cycles through 5 predefined graph presets in infinite loop
  const [currentGraphIndex, setCurrentGraphIndex] = useState(0);
  const graphPoints = GRAPH_PRESETS[currentGraphIndex];

  // Cycle through 5 graph presets - infinite loop
  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentGraphIndex(prev => (prev + 1) % GRAPH_PRESETS.length);
    }, GRAPH_CYCLE_INTERVAL);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  // Parallel animation loop - authentic random processing
  // Only runs after mount to avoid hydration issues
  useEffect(() => {
    if (prefersReducedMotion || !isMounted) return;

    let lastTypingUpdate = 0;
    let animationId: number;

    const animate = (timestamp: number) => {
      const now = Date.now();

      setAnimationState((prev) => {
        // Update typing (throttled to TYPING_SPEED)
        const shouldUpdateTyping = timestamp - lastTypingUpdate >= TYPING_SPEED;
        if (shouldUpdateTyping) {
          lastTypingUpdate = timestamp;
        }

        let stateChanged = false;
        let newSeed = prev.seed;

        const newSlots = prev.activeSlots.map((slot) => {
          const elapsed = now - slot.startTime;
          const item = ACTIVITY_ITEMS[slot.itemIndex];

          // Item hasn't started yet (staggered start)
          if (elapsed < 0) return slot;

          // Check if item is done (uses individual duration!)
          if (elapsed >= slot.duration && !slot.isComplete) {
            stateChanged = true;
            return { ...slot, isComplete: true };
          }

          // Update typing if throttle allows
          if (shouldUpdateTyping && !slot.isComplete) {
            const currentStepText = item.steps[slot.currentStep]?.text || "";

            if (slot.typedChars < currentStepText.length) {
              stateChanged = true;
              return { ...slot, typedChars: slot.typedChars + 1 };
            } else if (slot.currentStep < item.steps.length - 1) {
              stateChanged = true;
              return { ...slot, currentStep: slot.currentStep + 1, typedChars: 0 };
            }
          }

          return slot;
        });

        // Check for completed items and replace with random non-adjacent items
        const newCompleted = new Set(prev.completedItems);
        const finalSlots = newSlots.map((slot) => {
          if (slot.isComplete) {
            // Mark as completed
            newCompleted.add(slot.itemIndex);

            // If all items completed, reset cycle
            if (newCompleted.size >= TOTAL_ITEMS) {
              newCompleted.clear();
            }

            // Get current active items (excluding this completed one)
            const otherActiveItems = newSlots
              .filter(s => s.itemIndex !== slot.itemIndex && !s.isComplete)
              .map(s => s.itemIndex);

            // Pick random non-adjacent item
            const newItemIndex = getRandomAvailableItem(
              newCompleted,
              otherActiveItems,
              newSeed
            );
            newSeed++;

            stateChanged = true;

            return {
              itemIndex: newItemIndex,
              startTime: now + seededRandom(newSeed++) * 300, // Small random delay 0-300ms
              duration: getRandomDuration(newSeed++),
              typedChars: 0,
              currentStep: 0,
              isComplete: false,
            };
          }
          return slot;
        });

        if (stateChanged) {
          return {
            activeSlots: finalSlots,
            completedItems: newCompleted,
            seed: newSeed,
          };
        }
        return prev;
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [prefersReducedMotion, isMounted]);

  // Convert parallel state to context format for component compatibility
  const activeItems = new Set(animationState.activeSlots.map(s => s.itemIndex));
  const itemLifecycles = new Map<number, ItemLifecycle>();
  animationState.activeSlots.forEach(slot => {
    itemLifecycles.set(slot.itemIndex, {
      startTime: slot.startTime,
      duration: slot.duration,
      typedChars: slot.typedChars,
      currentStep: slot.currentStep,
      isComplete: slot.isComplete,
    });
  });

  const contextValue: AnimationContextValue = {
    activeItems,
    itemLifecycles,
    completedInCycle: animationState.completedItems,
  };

  return (
    <AnimationContext.Provider value={contextValue}>
      <div
        className={cn(styles.heroWrapper, className)}
        aria-hidden="true" // Decorative element
        data-hero-panel
      >
        <div className={styles.heroPanel}>
          <div className={styles.appFrame}>
            {/* ═══ SIDEBAR (Right in RTL) ═══ */}
            <Sidebar />

            {/* ═══ ELEVATED PANELS (Inbox + Detail + RBar) ═══ */}
            <div className={styles.elevatedPanels}>
              <AnimatedActivityFeed graphPoints={graphPoints} />
              <AnimatedDetailPanel graphPoints={graphPoints} />
              <RightBar />
            </div>
          </div>
        </div>
      </div>
    </AnimationContext.Provider>
  );
}

// Hook to access animation state
function useAnimationState() {
  return useContext(AnimationContext);
}

/* ─────────────────────────────────────────────────────────────────
 * SIDEBAR COMPONENT - FINDO Branding
 * ───────────────────────────────────────────────────────────────── */
function Sidebar() {
  return (
    <div className={styles.sidebar}>
      {/* Window Chrome */}
      <div className={styles.windowChrome}>
        <div className={styles.windowDot} />
        <div className={styles.windowDot} />
        <div className={styles.windowDot} />
      </div>

      {/* Navigation Toolbar */}
      <div className={styles.navToolbar}>
        <div className={styles.navBtn}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </div>
        <div className={styles.navBtn}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 3L5 8l5 5" />
          </svg>
        </div>
        <div className={styles.navBtn}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="5.5" />
            <path d="M8 4.5v4l2.5 1.5" />
          </svg>
        </div>
        <div className={styles.navSpacer} />
        <div className={styles.navBtn}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5L14 14" />
          </svg>
        </div>
        <div className={cn(styles.navBtn, styles.navBtnHighlight)}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 12l1.4-3.2L11.5 2.7a1 1 0 011.4 0l.4.4a1 1 0 010 1.4L7.2 10.6 4 12z" />
          </svg>
        </div>
      </div>

      {/* FINDO Logo */}
      <div className={styles.sidebarLogo}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="url(#findo-logo-gradient)" />
          <path d="M8 12h8M12 8v8" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <linearGradient id="findo-logo-gradient" x1="4" y1="4" x2="20" y2="20">
              <stop stopColor="#4aba4b" />
              <stop offset="1" stopColor="#388839" />
            </linearGradient>
          </defs>
        </svg>
        <span className={styles.logoText}>Findo</span>
        <span className={styles.logoChevron}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <path d="M2.5 4L5 6.5 7.5 4" />
          </svg>
        </span>
      </div>

      {/* Premium Connection Bridge: FINDO → Google Business */}
      <div className={styles.connectionBridge}>
        {/* Findo Node */}
        <div className={styles.bridgeNode}>
          <div className={styles.bridgeNodeInner}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8" fill="url(#bridge-findo-grad)" />
              <path d="M9 12h6M12 9v6" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
              <defs>
                <linearGradient id="bridge-findo-grad" x1="4" y1="4" x2="20" y2="20">
                  <stop stopColor="#4aba4b" />
                  <stop offset="1" stopColor="#388839" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className={styles.bridgeLabel}>Findo</span>
        </div>

        {/* Animated Connection Line - Bi-Directional */}
        <div className={styles.bridgeLine}>
          <div className={styles.bridgeLineFill} />
          <div className={styles.bridgePulse} />
          <div className={styles.bridgePulseReverse} />
        </div>

        {/* Google Node */}
        <div className={styles.bridgeNode}>
          <div className={styles.bridgeNodeInner}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          <span className={styles.bridgeLabel}>Google</span>
        </div>
      </div>

      {/* FINDO Modules - All active with LED indicators */}
      <div className={styles.sidebarSection}>מודולים פעילים</div>
      <SidebarItem active icon="leads" label="לכידת לידים" indicator="active" />
      <SidebarItem active icon="reviews" label="ניהול ביקורות" indicator="active" />
      <SidebarItem active icon="content" label="תוכן אוטומטי" indicator="active" />
      <SidebarItem active icon="optimize" label="אופטימיזציה" indicator="active" />

      <div className={styles.sidebarSection}>סטטיסטיקות</div>
      <SidebarItem icon="chart" label="פניות החודש" badge="+23%" badgeColor="green" />
      <SidebarItem icon="star" label="ביקורות" badge="4.8" />
      <SidebarItem icon="views" label="חשיפות" />

      <div className={styles.sidebarSection}>הגדרות</div>
      <SidebarItem icon="settings" label="העדפות" />
      <SidebarItem icon="bell" label="התראות" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * SIDEBAR ITEM
 * ───────────────────────────────────────────────────────────────── */
interface SidebarItemProps {
  icon?: string;
  label: string;
  active?: boolean;
  badge?: string;
  badgeColor?: "green" | "default";
  boxColor?: string;
  arrow?: boolean;
  nested?: boolean;
  indicator?: "active" | "idle" | "processing"; // Premium LED indicator
}

function SidebarItem({ icon, label, active, badge, badgeColor, boxColor, arrow, nested, indicator }: SidebarItemProps) {
  const iconMap: Record<string, React.ReactNode> = {
    // Original Linear icons
    inbox: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M2.5 4.5h11v7a1 1 0 01-1 1h-9a1 1 0 01-1-1v-7z" />
        <path d="M2.5 4.5L5 8.5h6l2.5-4" />
      </svg>
    ),
    tasks: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="8" cy="8" r="5.5" />
        <path d="M5.5 8l1.8 1.8L10.5 6" />
      </svg>
    ),
    initiatives: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M8 2l5.2 3v6L8 14l-5.2-3V5z" />
        <circle cx="8" cy="8" r="2" />
      </svg>
    ),
    projects: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="2" y="2" width="5" height="5" rx="1.2" />
        <rect x="9" y="2" width="5" height="5" rx="1.2" />
        <rect x="2" y="9" width="5" height="5" rx="1.2" />
        <rect x="9" y="9" width="5" height="5" rx="1.2" />
      </svg>
    ),
    views: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M2 4h12M2 8h8M2 12h10" />
      </svg>
    ),
    teams: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="5.5" cy="5.5" r="2.5" />
        <circle cx="10.5" cy="5.5" r="2.5" />
        <path d="M1.5 13c0-2.2 1.8-4 4-4s4 1.8 4 4M7 13c0-2.2 1.8-4 4-4s4 1.8 4 4" />
      </svg>
    ),
    "projects-alt": (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M3.5 2.5h9a1 1 0 011 1v9a1 1 0 01-1 1h-9a1 1 0 01-1-1v-9a1 1 0 011-1z" />
      </svg>
    ),
    docs: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M4 2.5v11M4 2.5h5.5a2.5 2.5 0 010 5H4" />
      </svg>
    ),
    circle: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="8" cy="8" r="5.5" />
      </svg>
    ),
    box: boxColor ? (
      <div className={styles.sidebarBox} style={{ background: boxColor }} />
    ) : null,
    // FINDO-specific icons
    leads: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M8 2v5M5 4l3 3 3-3" />
        <rect x="3" y="8" width="10" height="6" rx="1" />
      </svg>
    ),
    reviews: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5l3.5-.5z" />
      </svg>
    ),
    content: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="2" y="2" width="12" height="12" rx="2" />
        <path d="M5 6h6M5 8h4M5 10h5" />
      </svg>
    ),
    optimize: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="8" cy="8" r="5.5" />
        <path d="M8 4v4l3 2" />
        <path d="M12 4l1.5-1.5M4 4L2.5 2.5" />
      </svg>
    ),
    chart: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M2 14V8l3-2 3 4 3-6 3 2v8" />
      </svg>
    ),
    star: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5l3.5-.5z" />
      </svg>
    ),
    settings: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="8" cy="8" r="2" />
        <path d="M8 2v2M8 12v2M2 8h2M12 8h2M3.8 3.8l1.4 1.4M10.8 10.8l1.4 1.4M3.8 12.2l1.4-1.4M10.8 5.2l1.4-1.4" />
      </svg>
    ),
    bell: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M8 2a4 4 0 014 4v3l1.5 2H2.5L4 9V6a4 4 0 014-4z" />
        <path d="M6 13a2 2 0 004 0" />
      </svg>
    ),
  };

  return (
    <div className={cn(
      styles.sidebarItem,
      active && styles.active,
      nested && styles.sidebarItemNested
    )}>
      {icon && iconMap[icon]}
      {label}
      {/* Premium LED indicator instead of text badge */}
      {indicator && (
        <span className={cn(
          styles.statusLed,
          indicator === "active" && styles.statusLedActive,
          indicator === "processing" && styles.statusLedProcessing,
          indicator === "idle" && styles.statusLedIdle
        )} />
      )}
      {/* Legacy badge support */}
      {badge && !indicator && (
        <span className={badgeColor === "green" ? styles.sidebarBadgeGreen : styles.sidebarBadge}>
          {badge}
        </span>
      )}
      {arrow && <span className={styles.sidebarArrow}>◂</span>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * RIGHT BAR
 * ───────────────────────────────────────────────────────────────── */
function RightBar() {
  return (
    <div className={styles.rightBar}>
      <div className={styles.rightBarBtn}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="8" cy="8" r="5.5" />
          <path d="M5.5 8h5M8 5.5v5" />
        </svg>
      </div>
      <div className={styles.rightBarBtn}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M6 4l5 4-5 4" />
        </svg>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * MIXED ACTIVITY FEED - Shows all modules working together
 * Demonstrates FINDO managing everything simultaneously
 * ───────────────────────────────────────────────────────────────── */

// Activity items with detailed step-by-step actions for typing animation
// Each step clearly explains WHAT the AI is doing and WHY
const ACTIVITY_ITEMS = [
  {
    module: "leads" as ModuleType,
    title: "לכידת ליד חדש",
    steps: [
      { text: "זיהוי שיחה נכנסת → בדיקת מספר מתקשר" },
      { text: "שליפת נתוני מתקשר: 054-XXX-7842" },
      { text: "בדיקת CRM → ליד לא קיים, יוצר חדש" },
      { text: "שמירת ליד + תיוג 'פנייה טלפונית'" },
      { text: "הוספה למשימות מעקב אוטומטי" },
    ],
    finalText: "054-XXX-7842 נשמר + מעקב הוגדר",
    status: "success" as const,
  },
  {
    module: "reviews" as ModuleType,
    title: "תגובה לביקורת Google",
    steps: [
      { text: "ביקורת חדשה מדוד כ. (5 כוכבים)" },
      { text: "ניתוח טון: חיובי, מזכיר שירות מהיר" },
      { text: "יצירת תגובה מותאמת → תודה + הזמנה לחזור" },
      { text: "שליחת תגובה בשם העסק..." },
    ],
    finalText: "תגובה אישית נשלחה לדוד כ.",
    status: "star-full" as const,
  },
  {
    module: "content" as ModuleType,
    title: "יצירת פוסט שבועי",
    steps: [
      { text: "הגיע זמן הפוסט השבועי → בחירת נושא" },
      { text: "יצירת תוכן: 'טיפ השבוע לבעלי עסקים'" },
      { text: "חישוב שעה אופטימלית → 10:30 (פעילות גבוהה)" },
      { text: "פרסום ב-Google Business Profile..." },
    ],
    finalText: "פוסט פורסם · צפי: 850 צפיות",
    status: "content" as const,
  },
  {
    module: "leads" as ModuleType,
    title: "מעקב אחרי ליד קר",
    steps: [
      { text: "ליד מלפני 3 ימים לא חזר → הפעלת מעקב" },
      { text: "היסטוריה: פנייה אחת, לא נענתה" },
      { text: "הכנת SMS: 'היי, רצינו לוודא שקיבלת הכל...'" },
      { text: "שליחה ל-052-XXX-1234..." },
    ],
    finalText: "SMS מעקב נשלח ל-052-XXX-1234",
    status: "success" as const,
  },
  {
    module: "reviews" as ModuleType,
    title: "בקשת ביקורת מלקוח",
    steps: [
      { text: "מיכאל כ. סיים שירות לפני שעה → לקוח מרוצה" },
      { text: "הכנת הודעת WhatsApp אישית..." },
      { text: "הוספת קישור ישיר לכתיבת ביקורת" },
      { text: "שליחת בקשה ידידותית..." },
    ],
    finalText: "בקשת ביקורת נשלחה למיכאל כ.",
    status: "whatsapp" as const,
  },
  {
    module: "seo" as ModuleType,
    title: "אופטימיזציית פרופיל",
    steps: [
      { text: "סריקת מילות מפתח פופולריות באזור..." },
      { text: "ניתוח 3 מתחרים: חסרות מילים 'שירות מהיר'" },
      { text: "עדכון תיאור העסק + מילות מפתח חדשות" },
      { text: "שמירת שינויים ב-Google Business..." },
    ],
    finalText: "SEO שודרג · +3 מילות מפתח",
    status: "optimize" as const,
  },
];

// Module icons for the status bar
const MODULE_CONFIG: Record<ModuleType, { label: string; icon: string }> = {
  leads: { label: "לידים", icon: "leads" },
  reviews: { label: "ביקורות", icon: "reviews" },
  content: { label: "תוכן", icon: "content" },
  seo: { label: "SEO", icon: "optimize" },
};

interface ActivityFeedProps {
  graphPoints: number[];
}

function AnimatedActivityFeed({ graphPoints }: ActivityFeedProps) {
  const { activeItems, itemLifecycles, completedInCycle } = useAnimationState();

  // Generate path for mobile sparkline (smaller: 180x40)
  const mobileGraphData = generateSparklinePath(graphPoints, 180, 40);

  // Get display text for an item based on its typing state
  const getDisplayText = (index: number) => {
    const item = ACTIVITY_ITEMS[index];
    const lifecycle = itemLifecycles.get(index);

    if (!lifecycle || !item) return item?.finalText || "";

    if (lifecycle.isComplete) {
      return item.finalText;
    }

    const currentStep = item.steps[lifecycle.currentStep];
    if (!currentStep) return item.finalText;

    return currentStep.text.slice(0, lifecycle.typedChars);
  };

  const isItemActive = (index: number) => activeItems.has(index);
  const isItemComplete = (index: number) => completedInCycle.has(index);
  const isItemProcessing = (index: number) => {
    const lifecycle = itemLifecycles.get(index);
    return lifecycle && !lifecycle.isComplete && activeItems.has(index);
  };

  return (
    <div className={cn(styles.inboxPanel, styles.activityFeedWrapper)}>
      {/* Header with AI Badge */}
      <div className={styles.inboxHeader}>
        ניהול Google Business
        <div className={styles.headerBadges}>
          {/* AI Active Badge */}
          <span className={styles.aiBadge}>
            <span className={styles.aiDot} />
            AI פעיל
          </span>
          {/* Live Indicator */}
          <span className={styles.liveIndicator}>
            <span className={styles.liveDot} />
            {activeItems.size} פעיל
          </span>
        </div>
      </div>

      {/* Module Status Bar - Shows all 4 modules active */}
      <div className={styles.moduleStatusBar}>
        {(Object.keys(MODULE_CONFIG) as ModuleType[]).map((moduleKey) => (
          <div key={moduleKey} className={styles.moduleStatus}>
            <ModuleIcon type={moduleKey} />
            <span className={styles.moduleLabel}>{MODULE_CONFIG[moduleKey].label}</span>
            <span className={styles.statusDotGreen} />
          </div>
        ))}
      </div>

      {/* ═══ MOBILE-ONLY SPARKLINE ROW ═══ */}
      <div className={styles.mobileSparklineRow}>
        <div className={styles.mobileSparklineHeader}>
          <span>פעילות 24 שעות</span>
          <span className={styles.sparklineTrend}>
            <span className={styles.trendUp}>↑</span> 12%
          </span>
        </div>
        <svg className={styles.mobileSparkline} viewBox="0 0 180 40" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="mobileSparklineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(56, 136, 57, 0.35)" />
              <stop offset="100%" stopColor="rgba(56, 136, 57, 0.02)" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          <line x1="8" y1="10" x2="172" y2="10" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1="8" y1="20" x2="172" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1="8" y1="30" x2="172" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          {/* Area fill */}
          <path
            d={`${mobileGraphData.path} L${mobileGraphData.lastX},38 L8,38 Z`}
            fill="url(#mobileSparklineGrad)"
            className={styles.sparklineArea}
          />
          {/* Line */}
          <path
            d={mobileGraphData.path}
            fill="none"
            stroke="rgba(56, 136, 57, 0.8)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.sparklineLine}
          />
          {/* Live point */}
          <circle
            cx={mobileGraphData.lastX}
            cy={mobileGraphData.lastY}
            r="4"
            fill="rgba(56, 136, 57, 1)"
            className={styles.livePoint}
          />
          <circle
            cx={mobileGraphData.lastX}
            cy={mobileGraphData.lastY}
            r="8"
            fill="none"
            stroke="rgba(56, 136, 57, 0.4)"
            strokeWidth="1.5"
            className={styles.glowRing}
          />
        </svg>
      </div>

      {/* Activity Items - AI Processing Style */}
      {ACTIVITY_ITEMS.map((item, index) => {
        const isActive = isItemActive(index);
        const isComplete = isItemComplete(index);
        const lifecycle = itemLifecycles.get(index);
        const displayText = getDisplayText(index);
        const stepInfo = lifecycle && !lifecycle.isComplete
          ? `${lifecycle.currentStep + 1}/${item.steps.length}`
          : null;

        return (
          <div
            key={`activity-${index}`}
            className={cn(
              styles.activityRow,
              isActive && styles.activityRowActive,
              isActive && !isComplete && styles.activityRowProcessing
            )}
          >
            {/* Left: AI Status Indicator */}
            <div className={styles.activityStatus}>
              {isActive && !isComplete ? (
                <div className={styles.aiProcessingIndicator}>
                  <div className={styles.loadingRing} />
                  {stepInfo && (
                    <span className={styles.stepCounter}>{stepInfo}</span>
                  )}
                </div>
              ) : (
                <div className={styles.checkCircle}>
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6.5 11.5L3 8l1-1 2.5 2.5 5-5 1 1z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Center: Title + AI Thinking Text */}
            <div className={styles.activityContent}>
              <div className={styles.activityTitleRow}>
                <span className={styles.activityTitle}>{item.title}</span>
                {isActive && !isComplete && (
                  <span className={styles.aiThinkingBadge}>
                    <span className={styles.aiThinkingDot} />
                    חושב
                  </span>
                )}
              </div>
              <div className={styles.activitySubtitle}>
                {isActive && !isComplete && (
                  <span className={styles.thinkingPrefix}>→ </span>
                )}
                <span className={styles.typingText}>
                  {displayText}
                </span>
                {isActive && !isComplete && (
                  <span className={styles.typingCursor}>|</span>
                )}
              </div>
            </div>

            {/* Right: Module Icon with pulse when active */}
            <div className={cn(
              styles.moduleTypeIcon,
              isActive && !isComplete && styles.processing
            )} data-module={item.module}>
              <ModuleIcon type={item.module} />
            </div>
          </div>
        );
      })}

      {/* Summary Banner */}
      <div className={styles.summaryBanner}>
        <div className={styles.summaryStats}>
          <span className={styles.statHighlight}>47</span>
          <span className={styles.statLabelSmall}>פעולות היום</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryStats}>
          <span className={styles.statHighlight}>23</span>
          <span className={styles.statLabelSmall}>פניות החודש</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryMessage}>בלי שנגעת</div>
      </div>
    </div>
  );
}

/* Module Icon Component - Small icons for module indicators */
function ModuleIcon({ type }: { type: ModuleType }) {
  const icons: Record<ModuleType, React.ReactNode> = {
    leads: (
      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 2v5M5 4l3 3 3-3" />
        <rect x="3" y="8" width="10" height="6" rx="1" />
      </svg>
    ),
    reviews: (
      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5l3.5-.5z" />
      </svg>
    ),
    content: (
      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="12" height="12" rx="2" />
        <path d="M5 6h6M5 8h4M5 10h5" />
      </svg>
    ),
    seo: (
      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="5" />
        <path d="M8 4v4l3 2" />
      </svg>
    ),
  };

  return <>{icons[type]}</>;
}

/* Status Icon Component - Subtle premium style */
function StatusIcon({ status }: { status: string }) {
  const icons: Record<string, React.ReactNode> = {
    // Incoming call - Subtle amber
    incoming: (
      <svg className={cn(styles.statusIcon, styles.statusIconPulse)} width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" fill="rgba(255,255,255,0.05)" />
        <path d="M5 6.5c0-.83.67-1.5 1.5-1.5h3c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5h-3c-.83 0-1.5-.67-1.5-1.5v-4z" stroke="rgba(251,191,36,0.6)" strokeWidth="1.2" />
        <path d="M8 3v1.5M8 11.5V13" stroke="rgba(251,191,36,0.6)" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    // Lead captured - Subtle green
    lead: (
      <svg className={styles.statusIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" fill="rgba(255,255,255,0.05)" />
        <path d="M5 8l2 2 4-4" stroke="rgba(56,136,57,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    // Success - Subtle green checkmark
    success: (
      <svg className={styles.statusIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" fill="rgba(255,255,255,0.05)" />
        <path d="M5 8l2 2 4-4" stroke="rgba(56,136,57,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    // WhatsApp - Subtle brand green
    whatsapp: (
      <svg className={styles.statusIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" fill="rgba(255,255,255,0.05)" />
        <path d="M8 3a5 5 0 00-4.3 7.5L3 13l2.5-.7A5 5 0 108 3z" fill="rgba(37,211,102,0.5)" />
        <path d="M6.5 6c.2 0 .3.1.4.3l.4 1c0 .1 0 .2-.1.3l-.3.4c.2.4.5.8.9 1.1l.5-.3c.1-.1.2-.1.3 0l1 .5c.1.1.2.2.1.4-.1.3-.4.6-.8.6-1.2 0-2.7-1.5-3-3 0-.4.2-.7.6-.8z" fill="rgba(255,255,255,0.7)" />
      </svg>
    ),
    // Star rating - Subtle gold
    "star-full": (
      <svg className={styles.statusIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" fill="rgba(255,255,255,0.05)" />
        <path d="M8 4l1 2.5h2.5l-2 1.8.8 2.7L8 9.5 5.7 11l.8-2.7-2-1.8H7L8 4z" fill="rgba(250,204,21,0.6)" />
      </svg>
    ),
    // Content - Subtle neutral
    content: (
      <svg className={styles.statusIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" fill="rgba(255,255,255,0.05)" />
        <rect x="5" y="5" width="6" height="6" rx="1" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
        <path d="M6.5 7h3M6.5 9h2" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
    // Optimize - Subtle neutral
    optimize: (
      <svg className={cn(styles.statusIcon, styles.statusIconSpin)} width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" fill="rgba(255,255,255,0.05)" />
        <path d="M8 4v2M8 10v2M4 8h2M10 8h2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="8" cy="8" r="2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
      </svg>
    ),
  };

  return icons[status] || null;
}

/* ─────────────────────────────────────────────────────────────────
 * ANIMATED DETAIL PANEL - Premium Data-Rich Dashboard v3
 * Shows live status, dynamic sparklines, and activity log
 * ───────────────────────────────────────────────────────────────── */

// Rotating AI insights
const AI_INSIGHTS = [
  "85% מהלידים מגיעים בין 10:00-14:00",
  "הביקורות החיוביות עלו ב-23% החודש",
  "הפוסטים בימי שלישי מקבלים הכי הרבה צפיות",
  "זמן תגובה ממוצע: 2.3 דקות",
];

interface DetailPanelProps {
  graphPoints: number[];
}

function AnimatedDetailPanel({ graphPoints }: DetailPanelProps) {
  const { activeItems, completedInCycle, itemLifecycles } = useAnimationState();
  const activeCount = activeItems.size;
  const completedCount = completedInCycle.size;

  const [insightIndex, setInsightIndex] = useState(0);
  const [todayActions, setTodayActions] = useState(47);

  // Rotate insights
  useEffect(() => {
    const interval = setInterval(() => {
      setInsightIndex(prev => (prev + 1) % AI_INSIGHTS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Increment actions counter occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setTodayActions(prev => prev + 1);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Use shared sparkline path generator
  const graphData = generateSparklinePath(graphPoints, 200, 60);

  // Get current active item info
  const activeItem = Array.from(activeItems).find(idx => {
    const lc = itemLifecycles.get(idx);
    return lc && !lc.isComplete;
  });
  const currentActivity = activeItem !== undefined ? ACTIVITY_ITEMS[activeItem] : null;

  return (
    <div className={styles.detailPanel}>
      {/* Header with Live Processing Status */}
      <div className={styles.detailHeader}>
        <div className={styles.liveStatus}>
          <span className={styles.liveStatusDot} />
          <span className={styles.liveStatusText}>
            {activeCount === 0 ? "מחכה לפעולה" :
             activeCount === 1 ? "מעבד פעולה אחת" :
             `מעבד ${activeCount} פעולות`}
          </span>
        </div>
        <div className={styles.aiStatusBadge}>
          <span className={styles.aiBadgeDot} />
          AI פעיל
        </div>
      </div>

      {/* Main heading with counter */}
      <div className={styles.headingSection}>
        <h3 className={styles.detailHeading}>FINDO עובד בשבילך</h3>
        <div className={styles.completedCounter}>
          <span className={styles.counterNumber}>{completedCount}</span>
          <span className={styles.counterLabel}>הושלמו</span>
        </div>
      </div>

      {/* Current Activity Display */}
      {currentActivity && (
        <div className={styles.currentActivityCard}>
          <div className={styles.currentActivityHeader}>
            <div className={styles.loadingRing} />
            <span className={styles.currentActivityLabel}>עכשיו מעבד</span>
          </div>
          <div className={styles.currentActivityTitle}>{currentActivity.title}</div>
        </div>
      )}

      {/* Premium Graph Card - Better proportions */}
      <div className={styles.sparklineCard}>
        <div className={styles.sparklineHeader}>
          <span className={styles.sparklineTitle}>פעילות ב-24 שעות</span>
          <span className={styles.sparklineTrend}>
            <span className={styles.trendUp}>↑</span> 12%
          </span>
        </div>
        <svg className={styles.sparkline} viewBox="0 0 200 60" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="sparklineGradV4" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(56, 136, 57, 0.35)" />
              <stop offset="100%" stopColor="rgba(56, 136, 57, 0.02)" />
            </linearGradient>
          </defs>
          {/* Grid lines for premium feel */}
          <line x1="8" y1="15" x2="192" y2="15" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1="8" y1="30" x2="192" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1="8" y1="45" x2="192" y2="45" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          {/* Animated area fill */}
          <path
            d={`${graphData.path} L${graphData.lastX},58 L8,58 Z`}
            fill="url(#sparklineGradV4)"
            className={styles.sparklineArea}
          />
          {/* Animated line */}
          <path
            d={graphData.path}
            fill="none"
            stroke="rgba(56, 136, 57, 0.8)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.sparklineLine}
          />
          {/* Live point with glow */}
          <circle
            cx={graphData.lastX}
            cy={graphData.lastY}
            r="5"
            fill="rgba(56, 136, 57, 1)"
            className={styles.livePoint}
          />
          <circle
            cx={graphData.lastX}
            cy={graphData.lastY}
            r="10"
            fill="none"
            stroke="rgba(56, 136, 57, 0.4)"
            strokeWidth="2"
            className={styles.glowRing}
          />
        </svg>
      </div>

      {/* Stats Grid - 2x2 compact */}
      <div className={styles.statsGridCompact}>
        <div className={styles.statCardMain}>
          <div className={styles.statCardIconLarge}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 2v5M5 4l3 3 3-3" />
              <rect x="3" y="8" width="10" height="6" rx="1" />
            </svg>
          </div>
          <div className={styles.statCardContent}>
            <div className={styles.statCardValueLarge}>23</div>
            <div className={styles.statCardLabelLarge}>לידים החודש</div>
          </div>
          <div className={styles.statCardBadge}>
            <span className={styles.trendUp}>↑</span> +5
          </div>
        </div>

        <div className={styles.statCardRow}>
          <div className={styles.statCardSmall}>
            <span className={styles.statValueSmall}>4.8</span>
            <span className={styles.statLabelSmall}>דירוג</span>
          </div>
          <div className={styles.statCardSmall}>
            <span className={styles.statValueSmall}>{todayActions}</span>
            <span className={styles.statLabelSmall}>היום</span>
          </div>
          <div className={styles.statCardSmall}>
            <span className={styles.statValueSmall}>+31%</span>
            <span className={styles.statLabelSmall}>חשיפות</span>
          </div>
        </div>
      </div>

      {/* AI Insights - Rotating */}
      <div className={styles.insightCardEnhanced}>
        <div className={styles.insightHeader}>
          <span className={styles.insightBulb}>💡</span>
          <span className={styles.insightLabelEnhanced}>תובנת AI</span>
        </div>
        <p className={styles.insightTextEnhanced}>
          {AI_INSIGHTS[insightIndex]}
        </p>
      </div>

      {/* Live Activity Log - Scrolling feed */}
      <div className={styles.activityLog}>
        <div className={styles.activityLogHeader}>
          <span>פעולות אחרונות</span>
          <span className={styles.activityLogLive}>LIVE</span>
        </div>
        <div className={styles.activityLogItems}>
          <div className={styles.logItem}>
            <span className={styles.logDot} data-status="success" />
            <span className={styles.logText}>ליד נשמר - 054-XXX-7842</span>
            <span className={styles.logTime}>עכשיו</span>
          </div>
          <div className={styles.logItem}>
            <span className={styles.logDot} data-status="success" />
            <span className={styles.logText}>תגובה לביקורת נשלחה</span>
            <span className={styles.logTime}>לפני 2 דק׳</span>
          </div>
          <div className={styles.logItem}>
            <span className={styles.logDot} data-status="success" />
            <span className={styles.logText}>פוסט פורסם בהצלחה</span>
            <span className={styles.logTime}>לפני 8 דק׳</span>
          </div>
          <div className={styles.logItem}>
            <span className={styles.logDot} data-status="success" />
            <span className={styles.logText}>SMS תזכורת נשלח</span>
            <span className={styles.logTime}>לפני 15 דק׳</span>
          </div>
        </div>
      </div>
    </div>
  );
}

