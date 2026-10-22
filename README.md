# WIX1001 Mathematics for Computing 1 — Active-Recall & Spaced-Repetition Trainer

A complete, offline-first, 100% frontend-only web application engineered for mastering **WIX1001 Mathematics for Computing 1** at **Universiti Malaya**.

Built around **Chessable-style strict active recall** (mandatory **3 consecutive exact repetitions** with instant mistake diff feedback and zero-tolerance streak reset) paired with a **5-Box Leitner Spaced-Repetition System** running entirely in the browser.

---

## Key Features & Architecture

### Strict 100% Client-Side Offline Architecture
- **Zero Backend / Zero Cloud / Zero Accounts / Zero API Keys:** Everything runs locally in your browser via **React 18 + TypeScript + Vite + Tailwind CSS**.
- **Bundled Mathematical Typography:** Uses local **KaTeX** CSS & WOFF2 font assets with zero external CDN requests after initial load.
- **Offline PWA Support:** Configured via `vite-plugin-pwa` with automatic service-worker asset precaching.
- **Synthesized Web Audio API Feedback:** Generates crisp harmonic feedback locally for individual streak hits (`1/3`, `2/3`), full mastery (`3/3`), and mistake resets (`0/3`) — toggleable at any time.
- **Defensive Browser Persistence:** Persists progress, daily streaks, custom decks, and settings to `localStorage` with schema migration, field sanitization, corrupted-JSON recovery, and automatic in-memory fallback if storage is blocked.

### Learning & Spaced-Repetition Mechanics
1. **Phase 1 — Study the Answer:** Displays week/topic metadata, KaTeX-rendered question, complete expected answer, accepted notation variants, and a step-by-step worked derivation until **Start Drill** is clicked.
2. **Phase 2 — Three Consecutive Exact Repetitions (`0 / 3 → 3 / 3`):** Hides the target answer, enables the cursor-preserving **Mathematical Symbol Toolbar** (including a `2×2` Matrix Quick Builder, undo/redo history, `\command + Tab` shortcuts, and real-time KaTeX preview of your input), and requires **3 consecutive exact answers**.
3. **Phase 3 — Strict Mistake Reset:** Any incorrect submission triggers an un-skippable comparison modal highlighting exact character differences between your submitted answer and the expected answer, plays a synthesized reset tone, and resets the streak to `0 / 3`.
4. **Phase 4 — Leitner 5-Box Spaced Repetition:**
   - **Box 1:** 1 day
   - **Box 2:** 3 days
   - **Box 3:** 7 days
   - **Box 4:** 14 days
   - **Box 5:** 30 days
   - Failing any scheduled review demotes the card to **Box 1** and locks it out of the review queue until a fresh **3-consecutive-correct remediation drill** is completed.

### Complete 14-Week WIX1001 Curriculum (141 Unique Flashcards)
- **Week 1:** Foundation Review & Number Systems ($\mathbb{N} = \{1, 2, 3, \dots\}$, $\mathbb{W} = \{0, 1, 2, \dots\}$, $\mathbb{Z}, \mathbb{Q}, \mathbb{R}, \mathbb{C}$, slope, linear systems, quadratics & discriminant)
- **Week 2:** Set Definitions, Notation, Cardinality, Power Sets ($|P(A)| = 2^{|A|}$), Set Operations & 3-Set Cartesian Products
- **Week 3:** Set Problem Solving & Principle of Inclusion-Exclusion (2-set, 3-set, Venn regions, survey translation)
- **Week 4:** Propositional Logic (connectives, truth tables, contrapositive, tautologies, contradictions, contingencies)
- **Week 5:** Predicate Logic & Formal Proofs ($\forall, \exists$, De Morgan's & absorption laws, direct, contraposition, contradiction, parity, divisibility, counterexamples)
- **Week 6:** Functions (domain/codomain/range, injective, surjective, bijective, composition, inverse existence & calculation)
- **Week 7:** **Test 1 Assessment & Milestone Drill** (Weeks 1–6 mixed synthesis + 20% Test 1 planning banner)
- **Week 8:** Relations (Cartesian subsets, reflexive, symmetric, antisymmetric, transitive, equivalence classes, $0$-$1$ matrices $M_R$)
- **Mid-Semester Break Consolidation:** Dynamic non-duplicating filters over Weeks 1–8 (missed cards, overdue reviews, Box 1 cards, mixed revision)
- **Week 9:** Matrices (dimensions, algebra, conformability, multiplication, $I_n$, invertibility $\det(A) \neq 0$, solving $AX = B \implies X = A^{-1}B$)
- **Week 10:** Counting Principles (sum & product rules, $n!$, $P(n,r)$ vs $C(n,r)$, Pigeonhole Principle, Binomial Theorem)
- **Week 11:** Graph Theory ($G=(V,E)$, degrees, Handshaking Lemma, Eulerian edge traversals vs Hamiltonian vertex traversals, adjacency & incidence matrices)
- **Week 12:** Trees (connected acyclic graphs, $|E| = |V|-1$, rooted/binary trees, preorder/inorder/postorder traversals, spanning trees & MST)
- **Week 13:** **Test 2 Assessment & Milestone Drill** (Weeks 8–12 mixed synthesis + 20% Test 2 planning banner)
- **Week 14:** **Final Examination Master Revision** (cross-topic capstone synthesis + dynamic cumulative queues across all Weeks 1–14)

---

## Getting Started Locally

### Prerequisites
- **Node.js** `>= 18.0` and **npm** `>= 9.0`

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Run Automated Unit Tests
Runs Vitest tests verifying all 141 curriculum cards, answer normalization, superscript/symbol handling, diff generation, strict 3-streak resets, Leitner Box 1–5 intervals, failed-review remediation locks, storage corruption recovery, schema migration, and JSON import validation:
```bash
npm test
```

### 4. Production Static Build & Local Preview
```bash
npm run build
npm run preview
```
The compiled static site is emitted into `dist/`.

---

## Deploying to Static Hosting

Because the app uses relative asset paths (`base: './'`), offline PWA precaching, hash-synchronized client routing (`#/...`), plus static rewrite rules (`public/_redirects` and `vercel.json`), `dist/` deploys cleanly to any static host with zero server configuration:

- **GitHub Pages:** Upload/deploy the `dist/` folder via `actions/deploy-pages` or `gh-pages -d dist`. Works on both root custom domains and `/<repo-name>/` project URLs.
- **Netlify:** Connect repository with Build command `npm run build` and Publish directory `dist`. (`public/_redirects` is included automatically.)
- **Vercel:** Import project as a **Vite** static site (`npm run build` → `dist`, `vercel.json` included).
- **Cloudflare Pages / Surge / Render Static:** Build command `npm run build`, output directory `dist`.

---

## Project Structure

```text
src/
├── components/
│   ├── AnswerInput.tsx      # Cursor-preserving math textarea, Undo/Redo, live KaTeX preview
│   ├── Dashboard.tsx        # Real-time KPIs, milestone readiness, upcoming reviews, course weights
│   ├── DrillCard.tsx        # 4-phase Chessable active-recall & Leitner review engine
│   ├── ImportExport.tsx     # Browser JSON export, validated import preview, merge/replace, schema
│   ├── KaTeXText.tsx        # Safe inline & display KaTeX math renderer
│   ├── MathToolbar.tsx      # Categorized math symbol buttons + interactive 2×2 Matrix Builder
│   ├── MistakeModal.tsx     # Un-skippable error diff comparison & 0/3 streak reset banner
│   ├── ProgressChart.tsx    # 14-week column chart, Leitner box chart, 12-week activity calendar
│   ├── Sidebar.tsx          # Collapsible desktop / mobile drawer navigation with live week stats
│   └── WeekProgress.tsx     # Searchable & filterable weekly flashcard browser
├── data/
│   ├── curriculum.ts        # Syllabus metadata, assessment planning weights, consolidation config
│   ├── cardsPart1.ts        # Weeks 1–7 complete flashcards
│   ├── cardsPart2.ts        # Weeks 8–14 complete flashcards
│   └── cardDefinitions.ts   # Combined deck exports & helpers
├── hooks/
│   ├── useLocalStorage.ts   # Typed reactive storage hook
│   ├── useProgress.tsx      # Single source of truth state provider
│   └── useSpacedRepetition.ts # Real-time SRS queues, metrics & streaks
├── pages/
│   ├── AllCoursesPage.tsx
│   ├── DashboardPage.tsx
│   ├── SettingsPage.tsx
│   ├── StatisticsPage.tsx
│   ├── StudyPage.tsx
│   └── WeekPage.tsx
├── services/
│   ├── answerNormalizer.ts  # Deterministic math alias & whitespace normalizer + LCS diff
│   ├── audioService.ts      # Web Audio API sound synthesis
│   ├── importExportService.ts # Pure JSON export, validation, duplicate detection & merge/replace
│   ├── reviewScheduler.ts   # Leitner 5-box scheduler & streak state transitions
│   └── storageService.ts    # Defensive LocalStorage wrapper, migration & corruption recovery
├── types/
│   └── index.ts
└── __tests__/
    ├── learningMechanics.test.ts
    └── uiIntegration.test.tsx
```

## Netlify Deployment

A pre-configured [`netlify.toml`](./netlify.toml) is included at the repository root:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** `22`
- **SPA fallback & PWA cache headers:** Pre-configured for client-side navigation, instant service-worker revalidation, and immutable hashed asset caching.

