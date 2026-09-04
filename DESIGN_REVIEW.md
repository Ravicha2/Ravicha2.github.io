# Portfolio Design Review

## Verdict

The portfolio is clean, credible, and technically disciplined. Geist typography, the zinc/blue palette, accessibility work, route transitions, and case-study structure are all good foundations.

The current weakness is positioning: it feels more like polished engineering documentation than a portfolio for someone who designs highly agentic systems. It communicates **organized software engineer**, but not yet **systems thinker who designs reasoning, coordination, recovery, and verification loops**.

> Make the interface feel computational without making it noisy.

## Priority fixes

| Priority | Fix | Outcome |
|---|---|---|
| P0 | Rework the hero around a systems thesis | The agentic point of view is clear within seconds. |
| P0 | Simplify homepage project cards | The homepage feels curated rather than dashboard-like. |
| P1 | Add one execution-trace visual motif | The portfolio gets a memorable identity without generic AI effects. |
| P1 | Make motion communicate state | P1 | Makeface feels instant, not animated for its own sake. |
| P1 | Separate canvas, content, and evidence | Borders regain meaning and visual hierarchy improves. |
| P2 | Refine a few secondary labels | The voice becomes distinctive without becoming performative. |

## 1. Hero direction

### Change the thesis

Use the job title as supporting context, not the main idea:

```text
I design systems that reason, coordinate, and recover.

Applied AI and backend systems engineer building reliable
agent workflows, GraphRAG systems, and distributed data engines.
```

Add a compact status row:

```text
SYSTEM STATUS   ● available for difficult problems
CURRENT MODE    building agentic infrastructure
```

Keep this stable or manually maintained. Do not fake telemetry, latency, token counts, or production status.

### Layout

Use two columns on desktop:

- Left: thesis, one short paragraph, primary CTA, secondary links.
- Right: a small architecture trace.
- Mobile: stack the trace below the actions.

Use three quiet proof words below the copy: `REASONING`, `COORDINATION`, `RECOVERY`.

## 2. Signature generative visual

Use one reusable **execution trace** rather than particles, Matrix rain, neon gradients, or a decorative 3D AI object:

```text
problem
  ↓
planner ──→ tools
  ↓          ↓
memory ──→ verifier
  ↓
reliable result
```

### Treatment

- Hairline zinc lines; blue only for active path, active node, or verified result.
- Rectangular or minimally rounded nodes; avoid excessive pills.
- Geist Mono for labels.
- One deliberate transition on initial load or hover.
- Animate one path at a time.
- Disable animation under `prefers-reduced-motion`.

It should look like a precise system artifact: legible, restrained, and slightly alive.

## 3. Homepage project cards

The current cards show too much at once: title, role, summary, highlights, metrics, tags, case-study link, and external links. Keep that completeness on the project detail page.

Homepage cards should show only:

1. Project name.
2. One-line problem statement.
3. One proof metric or outcome.
4. One primary action.

```text
SHEPHERD
Agent orchestration infrastructure

Built a reliable execution layer for multi-step agent workflows.

↓ 3 failure modes handled automatically
Open system trace →
```

On hover/focus, only shift the border, activate one blue line/node, move the arrow 2–4px, and optionally fade in the trace over 180–240ms. Do not tilt, bounce, or dramatically scale cards.

## 4. Motion rules

| Interaction | Recommendation |
|---|---|
| Route change | 150–200ms fade/position shift |
| Card to case study | Shared-element transition |
| Hover/focus | Border, arrow, or one indicator changes |
| Execution trace | One deliberate path transition |
| Button press | Minimal opacity/position response |
| List entry | Optional subtle stagger on page entry |

Every animation must explain a relationship or state change. Avoid looping backgrounds, springy easing, and simultaneous page/card animation. Keep the current reduced-motion fallback.

## 5. Hierarchy

Use three visual layers:

### Canvas

Quiet and mostly empty. This creates confidence and space.

### Primary content

Hero copy, headings, and narrative content should usually sit directly on the canvas.

### Evidence modules

Reserve borders and panels for real system boundaries: metrics, architecture traces, code excerpts, timeline entries, and project evidence.

Do not put every heading, CTA, and paragraph inside a card. A border should imply a meaningful boundary.

## 6. Vocabulary

Keep the main navigation conventional. Change only a few secondary labels:

| Current | Alternative |
|---|---|
| Key Highlights | Observed behavior |
| Career Snapshot | System context |
| View all projects | Inspect project archive |
| View full experience | Trace the timeline |
| Read Case Study | Open system trace |
| Current Role | Active deployment |
| Education | Formation |

Do not rename everything. If every label sounds like a terminal, the design becomes performative.

## 7. Tokens

Preserve Geist Sans, Geist Mono, zinc neutrals, blue as the sole accent, hairline borders, strong focus states, and small radii.

Adjust the system by reserving blue for active state, proof, links, and verified outcomes; reducing visible tags on the homepage; avoiding heavy shadows; preferring `rounded-md`/`rounded-lg` over pills; and keeping hero/narrative line length around 60–72 characters.

## 8. Avoid

- Particle fields, Matrix rain, neon-green AI styling
- Decorative terminal windows, excessive gradients, or glows
- Large abstract 3D objects and continuously moving backgrounds
- Fake telemetry or badges for every technology
- Excessive rounded cards, competing accent colors, and hover animation everywhere

These patterns signal “AI-themed website,” not engineering depth.

## 9. Implementation sequence

### Pass 1: positioning

1. Rewrite the hero around reasoning, coordination, and recovery.
2. Add the status row.
3. Make the work/project action primary.
4. Reduce the hero to one clear paragraph.

### Pass 2: density

1. Simplify homepage project cards.
2. Keep one proof metric per card.
3. Move secondary metadata to detail pages.
4. Give each project a problem statement, not only a technology description.

### Pass 3: interaction

1. Build a reusable `ExecutionTrace` component.
2. Use it in the hero and optionally project cards.
3. Define active, complete, and failed/recovered states.
4. Add one short transition and reduced-motion fallback.

### Pass 4: polish

1. Remove unnecessary enclosing cards.
2. Standardize spacing and all focus/hover states.
3. Test mobile wrapping and keyboard navigation.
4. Verify the design still works with animation disabled.

## Final standard

The finished portfolio should feel **quiet, precise, alive, agentic, and clean**.

> This person understands how intelligent systems behave under uncertainty and knows how to make that behavior reliable.
