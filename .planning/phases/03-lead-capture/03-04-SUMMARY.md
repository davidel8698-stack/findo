---
phase: 03-lead-capture
plan: 04
subsystem: lead-capture-chatbot
tags: [state-machine, ai, intent-extraction, anthropic, hebrew]
requires:
  - 03-01 (lead schema foundation)
provides:
  - Conversation state machine
  - AI intent extraction with Claude Haiku 4.5
  - Lead info merging logic
affects:
  - 03-05 (lead capture worker integration)
  - 03-06 (owner notifications)
tech-stack:
  added:
    - "@anthropic-ai/sdk@^0.71.2"
  patterns:
    - Object-based state machine (no library)
    - Claude structured JSON outputs via prompt engineering
key-files:
  created:
    - src/services/lead-capture/chatbot.ts
    - src/services/lead-capture/intent.ts
  modified:
    - package.json
    - src/services/lead-capture/index.ts
decisions:
  - id: state-machine-approach
    choice: Simple object-based state machine
    rationale: XState overkill for linear chatbot flow
  - id: ai-model-choice
    choice: Claude Haiku 4.5 (claude-haiku-4-5-20250929)
    rationale: Cost-effective, good Hebrew support, structured outputs
metrics:
  duration: 4.5 min
  completed: 2026-01-27
---

# Phase 03 Plan 04: Chatbot State Machine and AI Intent Summary

**One-liner:** Object-based conversation state machine with Claude Haiku 4.5 AI intent extraction for Hebrew WhatsApp messages.

## What Was Done

### Task 1: Install Anthropic SDK (2b9c9ff)
- Added `@anthropic-ai/sdk@^0.71.2` for Claude API access
- Per RESEARCH.md: Use Claude Haiku 4.5 for cost-effective Hebrew intent extraction

### Task 2: Create Conversation State Machine (0ffef24)
- Created `src/services/lead-capture/chatbot.ts`
- Implemented `ConversationState` type covering full chatbot flow:
  - `awaiting_response` -> `awaiting_name` -> `awaiting_need` -> `awaiting_preference` -> `completed`
  - Plus `unresponsive` for timeout after reminders
- Implemented smart `getNextState()` that:
  - Determines next state based on what info is still missing
  - Allows jumping states when AI extracts multiple fields from one message
  - Handles terminal states (completed, unresponsive)
- Implemented `transition()` for event-based transitions (reminders, timeout)
- Added helper functions: `isTerminalState()`, `shouldSendResponse()`

### Task 3: Create AI Intent Extraction (18b0622)
- Created `src/services/lead-capture/intent.ts`
- Implemented `extractLeadInfo()` using Claude Haiku 4.5:
  - System prompt guides extraction of name, need, contactPreference
  - Handles Hebrew script and transliterated names (ani dani -> dani)
  - Returns confidence level (high/medium/low) for extraction quality
  - Robust JSON parsing handles markdown code blocks
  - Graceful error handling returns empty info on failure
- Implemented `mergeLeadInfo()` for accumulating info across messages
- Updated barrel file to export all lead-capture modules

## Key Implementation Decisions

### State Machine Design
Per RESEARCH.md, chose simple object-based state machine over XState:
- Linear chatbot flow doesn't need complex state library
- `getNextState()` enables smart state jumping based on collected info
- Much simpler to understand and maintain

### AI Intent Extraction
- Claude Haiku 4.5 chosen for cost-effectiveness (~$2-5/month at 10K extractions)
- Prompt engineered for:
  - Generous extraction (partial info is useful)
  - Hebrew and transliterated name handling
  - Context-aware extraction using conversation history
- No Zod schema validation at runtime - relies on prompt for JSON structure
  - Simpler approach, handles edge cases via try/catch

## Files Changed

| File | Change | Purpose |
|------|--------|---------|
| package.json | +1 dep | Add Anthropic SDK |
| src/services/lead-capture/chatbot.ts | Created | State machine |
| src/services/lead-capture/intent.ts | Created | AI extraction |
| src/services/lead-capture/index.ts | Modified | Export new modules |

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

- [x] `pnpm tsc --noEmit` passes
- [x] `@anthropic-ai/sdk` in package.json dependencies
- [x] State machine exports: ConversationState, getNextState, transition, isTerminalState, shouldSendResponse
- [x] Intent extraction exports: extractLeadInfo, LeadInfo, mergeLeadInfo
- [x] Barrel file exports all modules

## Dependencies for Next Plans

**Requires before use:**
- `ANTHROPIC_API_KEY` environment variable must be set

**Ready for:**
- Plan 03-05: Lead capture worker integration (uses state machine + intent extraction)
- Plan 03-06: Owner notifications (uses extracted lead info)

## Next Phase Readiness

No blockers. All success criteria met:
- State machine transitions correctly based on collected info
- AI extraction handles Hebrew and transliterated inputs
- Multiple fields can be extracted from single message
- Confidence level indicates extraction quality
- All exports available from src/services/lead-capture
