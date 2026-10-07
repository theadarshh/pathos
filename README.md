# PathOS

**EXPLORE WHAT'S NEXT.**

PathOS is a career intelligence platform designed to help people understand where they currently stand in their careers, discover realistic career directions, identify the gaps between their current state and their desired destination, and build a clear path forward.

A career is rarely a straight line.

People often know where they are. Sometimes they know where they want to go. The difficult part is understanding the path between the two.

PathOS is being built to bridge that gap.

Instead of simply answering:

> "What career should I choose?"

PathOS aims to eventually answer:

> **"Where am I now, where can I realistically go, why does that path fit me, what am I missing, and what should I do next?"**

---

# The Vision

The long-term goal of PathOS is to become a **personal career operating system**.

PathOS is being developed as a system that can progressively understand a person's:

- Current role
- Professional experience
- Technical skills
- Transferable skills
- Strengths
- Weaknesses
- Interests
- Career goals
- Projects
- Learning history
- Career constraints
- Progress over time

and transform that information into a continuously evolving career journey.

The long-term journey is:

```text
                         USER
                           │
                           ▼
                 UNDERSTAND THE PERSON
                           │
                           ▼
                  CURRENT CAREER STATE
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
          Skills       Experience        Goals
            │              │              │
            └──────────────┼──────────────┘
                           ▼
                  CAREER INTELLIGENCE
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
      Career Paths       Evidence      Constraints
            │              │              │
            └──────────────┼──────────────┘
                           ▼
                   PATH RECOMMENDATION
                           │
                           ▼
                    SKILL GAP ANALYSIS
                           │
                           ▼
                    LEARNING DIRECTION
                           │
                           ▼
                    PROJECT BUILDING
                           │
                           ▼
                    CAREER ROADMAP
                           │
                           ▼
                    PROGRESS TRACKING
                           │
                           ▼
                      REASSESSMENT
                           │
                           ▼
                    PATH ADAPTATION
                           │
                           ▼
                    AI CAREER AGENT
```

---

# Current Status

**V1** was a frontend-only prototype: React/Vite, with the profile and all
scoring logic running client-side and persisted to `localStorage`. V1 is
preserved exactly as it was, tagged [`v1.0.0`](../../releases/tag/v1.0.0),
and untouched on `main`.

**V2.0 (Foundation)** — the current branch, `v2-foundation` — turns that
into a real full-stack app:

```text
React/Vite frontend  →  REST API  →  Spring Boot modular monolith  →  PostgreSQL
```

Scope of V2.0 is deliberately narrow: user accounts, JWT authentication,
and profile persistence — nothing more. The career-matching, AI
conversation, skill-graph and roadmap-intelligence features described in
the vision above are **not** part of this phase; they're staged for later
(V2.1+) and are not implemented yet.

### How V1 → V2 migration works right now

- The 14 V1 screens/components are untouched — no UI redesign.
- `src/hooks/useLocalStorage.js` (V1) still exists and is still what backs
  `src/hooks/useProfileSync.js` (V2) as the **local cache / offline
  fallback**. localStorage is never silently treated as if it were the
  backend.
- When no one is signed in, the app behaves exactly like V1: everything is
  local-only, and the UI's sync badge reads "Offline (local only)".
- When signed in (see `src/components/Navigation/Navigation.jsx`'s
  "Sign in to sync" control in the sidebar), the Spring Boot API becomes
  the source of truth: on login, the backend's profile replaces whatever
  was in `localStorage`; every subsequent profile change is pushed to the
  API, and the UI shows one of four honest states — **Saving…**, **Saved**,
  **Failed to save**, or **Offline (local only)** — reflecting what the
  backend actually confirmed, never an assumed success.
- There is no account migration tool yet: a profile built anonymously in
  V1/offline mode is not automatically uploaded on sign-up. That's a
  reasonable V2.1+ enhancement, not part of this foundation.

### Running it locally

**Frontend**
```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 24/24 — V1's scoring-logic tests, unaffected by V2 work
npm run build
```

**Backend** — see [`backend/README.md`](backend/README.md) for full setup
(PostgreSQL, environment variables, Flyway, running, and known limitations
in this environment).

```bash
cp .env.example .env     # fill in real local values; never commit this file
cd backend
./mvnw spring-boot:run   # http://localhost:8080
```
