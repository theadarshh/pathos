# PathOS

**EXPLORE WHAT'S NEXT.**

PathOS is an AI-powered career intelligence platform being built to help people understand where they are in their careers, discover realistic career paths, identify the gaps between their current state and their goals, and build a clear path forward.

Instead of asking only:

> "What career should I choose?"

PathOS is designed to answer the larger question:

> **"Where am I now, where can I realistically go, what is stopping me, and what should I do next?"**

PathOS combines structured career intelligence, skill-gap analysis, personalized roadmaps, project guidance, progress tracking, and eventually an AI career agent that can have an ongoing conversation with the user and continuously adapt their career plan.

---

# Product Vision

Career decisions are rarely simple.

A person's education, experience, skills, interests, strengths, weaknesses, goals, constraints, projects, and learning history all influence what career paths are realistically available to them.

PathOS aims to bring these factors together into one system.

```text
                         PATHOS
                           │
                  Understand the person
                           │
                           ▼
                  CURRENT CAREER STATE
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
       Skills          Experience         Goals
          │                │                │
          └────────────────┼────────────────┘
                           ▼
                  CAREER INTELLIGENCE
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
      Career Paths      Evidence          Constraints
          │                │                │
          └────────────────┼────────────────┘
                           ▼
                  PATH RECOMMENDATION
                           │
                           ▼
                    SKILL GAP ANALYSIS
                           │
                           ▼
                  PERSONALIZED ROADMAP
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
            Learn        Build        Apply
              │            │            │
              └────────────┼────────────┘
                           ▼
                    PROGRESS TRACKING
                           │
                           ▼
                    REASSESS & ADAPT
                           │
                           └──────────────► AI CAREER AGENT

The long-term goal is to make PathOS a personal career operating system rather than a one-time career assessment.
What PathOS Should Eventually Become
The final product is intended to provide an end-to-end career journey:
Discover
   ↓
Understand Current State
   ↓
Explore Career Options
   ↓
Evaluate Fit
   ↓
Choose a Direction
   ↓
Understand Skill Gaps
   ↓
Learn
   ↓
Build Projects
   ↓
Demonstrate Skills
   ↓
Prepare for Opportunities
   ↓
Apply
   ↓
Track Progress
   ↓
Reassess
   ↓
Adapt the Path

PathOS should not simply provide a career recommendation and leave the user alone.
It should continuously answer:
- Where am I?
- What am I good at?
- What am I missing?
- Which careers are realistic for me?
- Why is a particular path recommended?
- What should I learn next?
- What should I build?
- How long could the transition realistically take?
- What evidence do I have that I am ready?
- What should I do this week?
- Am I progressing?
- Has my target career changed?
- Should my roadmap change?
Current Version — V1
The current version is the foundation of the PathOS product.
V1 focuses on creating the career-intelligence experience and establishing the underlying concepts that will later power the AI system.
It currently runs entirely client-side using deterministic logic and static career reference data.
There is no external AI API or proprietary runtime required.
V1 Features
Cinematic Career Experience
An immersive interface designed around the idea that a career is a connected landscape rather than a single linear path.
The hero introduces the PathOS concept through an animated career-node network.
Guided Career Onboarding
A four-step onboarding flow collects:
- Current role
- Experience
- Skills
- Career goal
Users can select and deselect skills, move backward and forward, and edit their profile later.
Career DNA
A personalized snapshot showing:
- Career readiness
- Current strengths
- Emerging strengths
- Opportunity areas
- Career direction
The calculations are derived from the user's profile.
Career Universe
An interactive visualization of possible career paths.
Current reference paths include areas such as:
- Software Development
- Cloud Engineering
- DevOps
- SRE
- Platform Engineering
- AI Engineering
- Data Engineering
- Security Engineering
The visualization connects the user's current state to potential paths and uses match scoring to represent relevance.
Career Path Detail
Users can inspect an individual career path and move directly into the corresponding skill-gap analysis.
Skill Gap Intelligence
PathOS compares the user's current skills with the requirements represented by the selected career path.
Skills are organized into categories and displayed using completion states such as:
- COMPLETE
- RECOMMENDED
- LATER
Learn Next
A transition layer between the user's current role and target career.
Skills are represented as:
- KNOWN
- NEXT
- LATER
- TARGET
This helps answer:
"What should I learn next?"

rather than presenting an overwhelming list of technologies.
Compare Career Paths
Users can compare up to three career paths and understand their relative alignment and complexity.
The current implementation deliberately avoids fabricating salary, employment, or market claims.
90-Day Career Journey
A goal-specific roadmap organized into:
FOUNDATION
    ↓
BUILD
    ↓
PROVE

The roadmap adapts to skills the user already knows and focuses the journey on the remaining gaps.
What-If Simulator
Users can explore hypothetical skill additions and see how those changes affect career-path relevance without modifying their saved profile.
Project Builder
PathOS generates a portfolio project concept based on:
- Target career
- Current skills
- Skill gaps
- Project difficulty
- Architecture
- Demonstrated skills
- Milestones
The goal is to connect learning with tangible evidence.
PathOS Intelligence
V1 contains a deterministic local intelligence layer.
It currently:
- interprets selected career-related keywords
- considers the user's profile
- identifies a relevant target path
- identifies a relevant skill
- provides a structured recommendation
- highlights the relevant path in Career Universe
- highlights the relevant skill in Skill Gap
This is intentionally not presented as a real AI model yet.
Command Palette
Ctrl+K / Cmd+K provides fast navigation between major PathOS views and actions.
Persistent Profile
The current profile is persisted locally using localStorage.
Users can:
- continue after refreshing
- edit their profile
- restart the experience
The Future AI Career Agent
One of the central goals of PathOS is to evolve the current deterministic intelligence layer into a genuine AI career agent.
The agent should not simply be a chatbot placed on top of the existing UI.
It should understand the user's structured career state and use that information to reason about career decisions.
A future interaction could look like:
User:
"I'm not sure whether I should continue with Java backend
development or move into DevOps."

PathOS:
"Before I recommend a direction, I want to understand
what you actually enjoy doing."

        ↓

AI asks targeted questions

        ↓

Profile becomes richer

        ↓

PathOS evaluates evidence

        ↓

Career paths are scored

        ↓

Skill gaps are identified

        ↓

Transition difficulty is estimated

        ↓

PathOS explains the recommendation

        ↓

User chooses a direction

        ↓

PathOS builds a personalized roadmap

The agent should be capable of asking follow-up questions, challenging assumptions, identifying missing information, and adapting its recommendation as the user's answers change.
AI + Career Intelligence Architecture
The long-term architecture is expected to separate AI reasoning from structured career intelligence.
                         USER
                           │
                           ▼
                 ┌──────────────────┐
                 │ AI CAREER AGENT  │
                 └────────┬─────────┘
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
        Conversation   Reasoning     Guidance
             │            │            │
             └────────────┼────────────┘
                          ▼
                PATHOS INTELLIGENCE
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
   Career Graph       Skill Graph       Evidence
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
                  CAREER SCORING
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
    Fit Score         Skill Gap        Transition Effort
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
                 PERSONAL ROADMAP
                          │
                          ▼
                  PROGRESS ENGINE
                          │
                          └──────► AI AGENT

The AI should explain recommendations, while structured data and deterministic systems provide the underlying career intelligence wherever possible.
This separation is important for:
- consistency
- explainability
- testability
- cost control
- maintainability
- reducing hallucinated recommendations
- improving recommendation accuracy
Career Recommendation Philosophy
PathOS should not make career recommendations based purely on an LLM's opinion.
A future recommendation should consider multiple dimensions, such as:
Current Skills
+
Experience
+
Evidence
+
Career Interests
+
User Goals
+
Transferable Skills
+
Required Skills
+
Skill Gaps
+
Transition Difficulty
+
Learning Effort
+
Career Constraints

A future recommendation could therefore look like:
DATA ENGINEER
78% Compatibility

WHY
+ Strong SQL foundation
+ Backend development experience
+ Database experience
+ API development experience

GAPS
- Python
- Data pipelines
- Spark
- Cloud data services

TRANSITION
Moderate

ESTIMATED PREPARATION
4–6 months

CONFIDENCE
High

The important part is not the number itself.
The important part is that PathOS can explain:
Why this recommendation exists and what evidence supports it.

Long-Term Product Capabilities
The product is intended to expand beyond career exploration into a complete career development system.
Career Discovery
- Career exploration
- Career comparison
- Career compatibility
- Alternative career paths
- Transition paths
- Transferable skills
Career Assessment
- Current-state analysis
- Skills assessment
- Experience analysis
- Project evidence
- Strength analysis
- Weakness analysis
- Goal discovery
- Constraint discovery
Skill Intelligence
- Skill taxonomy
- Skill relationships
- Skill prerequisites
- Skill proficiency
- Skill gaps
- Transferable skills
- Emerging skills
Learning Intelligence
- What to learn
- Why to learn it
- Learning sequence
- Recommended resources
- Practice activities
- Projects
- Portfolio evidence
Career Roadmaps
- 30-day plans
- 60-day plans
- 90-day plans
- Long-term transition plans
- Weekly actions
- Milestones
- Progress tracking
Portfolio & Evidence
- Project recommendations
- Project architecture
- Project milestones
- Skill demonstration
- Portfolio quality
- Resume evidence
- Interview preparation
Career Progress
- Progress tracking
- Skill completion
- Project completion
- Readiness changes
- Goal changes
- Roadmap adaptation
- Reassessment
AI Career Agent
Eventually the agent should be able to:
- interview the user
- ask follow-up questions
- understand context
- explain career options
- challenge unrealistic assumptions
- identify missing information
- recommend realistic paths
- generate personalized learning plans
- adapt roadmaps
- track progress
- reassess the user
- communicate proactively
- continuously guide the user
Product Roadmap
PathOS is being developed incrementally.
V1 — Career Intelligence Foundation
Current
- Career Universe
- Career DNA
- Skill Gap
- Learn Next
- Career comparison
- Roadmaps
- What-If analysis
- Project Builder
- Deterministic PathOS Intelligence
- Persistent profile
- Command Palette
V1.5 — Career Intelligence Platform
Planned areas include:
- richer career taxonomy
- structured skill ontology
- role requirements
- evidence-based scoring
- richer career profiles
- user accounts
- saved career paths
- progress tracking
- improved career comparisons
- improved roadmap generation
- better career data
V2 — AI Career Advisor
Planned capabilities:
- conversational onboarding
- AI-powered career interview
- dynamic follow-up questions
- profile extraction
- contextual reasoning
- personalized explanations
- adaptive career recommendations
- conversational skill-gap analysis
V2.5 — Career Intelligence Engine
Planned capabilities:
- career graph
- skill graph
- role-to-skill relationships
- evidence model
- career compatibility engine
- transition difficulty
- recommendation confidence
- external career and labor-market data
- explainable scoring
V3 — Personal Career Agent
Long-term direction:
Understand
    ↓
Recommend
    ↓
Plan
    ↓
Teach
    ↓
Build
    ↓
Track
    ↓
Reassess
    ↓
Adapt

The goal is a persistent AI career companion that grows with the user instead of providing a one-time assessment.
Technology Direction
Current
- React 18
- Vite 5
- JavaScript
- Plain CSS
- Canvas
- SVG
- localStorage
- Deterministic client-side logic
The current implementation deliberately keeps dependencies minimal.
Future
As PathOS evolves, the architecture is expected to introduce:
- Backend services
- Persistent database
- Authentication
- User profiles
- Career and skill knowledge models
- AI model integration
- Retrieval / knowledge systems
- Recommendation services
- Progress tracking
- External career data
- Secure API infrastructure
- Observability and analytics
The exact technology choices will be made based on the requirements of each phase rather than prematurely introducing infrastructure.
Project Structure
pathos/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    │
    ├── components/
    │   ├── Hero/
    │   ├── Onboarding/
    │   ├── BuildingSequence/
    │   ├── CareerIdentity/
    │   ├── CareerUniverse/
    │   ├── SkillGap/
    │   ├── LearnNext/
    │   ├── ComparePaths/
    │   ├── Roadmap/
    │   ├── WhatIfSimulator/
    │   ├── ProjectBuilder/
    │   ├── CareerCoach/
    │   ├── CommandPalette/
    │   └── Navigation/
    │
    ├── data/
    │   ├── careerPaths.js
    │   ├── demoProfile.js
    │   ├── roadmap.js
    │   ├── roles.js
    │   └── skills.js
    │
    ├── utils/
    │   ├── scoring.js
    │   ├── skillGap.js
    │   ├── roadmap.js
    │   ├── projectBuilder.js
    │   └── careerCoach.js
    │
    ├── hooks/
    │   └── useLocalStorage.js
    │
    └── styles/
        └── globals.css

The current architecture separates:
- UI components
- reference data
- business logic
- persistence
- design system
This separation provides the foundation for replacing the current deterministic intelligence with a future backend and AI layer without rewriting the entire product.
Local Development
Clone the repository:
git clone https://github.com/theadarshh/pathos.git
cd pathos

Install dependencies:
npm install

Start development:
npm run dev

Open:
http://localhost:5173

Windows
cd /d D:\Projects\2\pathos
npm install
npm run dev

Testing
npm test

The current test suite directly exercises the deterministic career intelligence logic, including:
- career scoring
- skill-gap calculations
- roadmap generation
- PathOS Intelligence
Current V1 baseline:
24 passed
0 failed

Production Build
npm run build

The production build is generated in:
dist/

Preview locally:
npm run preview

Deployment
PathOS V1 is a static Vite + React application.
It can be deployed to platforms such as:
- Vercel
- Netlify
- Render Static Sites
- other static hosting providers
For V1:
Build command:
npm run build

Output directory:
dist

The current version does not require a backend or environment variables.
Future AI and persistent-user functionality will introduce backend infrastructure and secure environment configuration.
Current Limitations
PathOS V1 is intentionally a foundation rather than the final product.
Deterministic Intelligence
PathOS Intelligence currently uses deterministic keyword-based logic rather than a large language model.
It does not yet conduct genuine conversational career interviews.
Static Career Data
The current career paths and skills are reference data maintained in the application.
They are not yet connected to a continuously updated labor-market database.
No Persistent Backend
V1 uses browser localStorage.
There are currently no:
- user accounts
- cloud profiles
- backend APIs
- database
- cross-device synchronization
No Real AI Agent Yet
The AI career-agent architecture described above is part of the future product direction.
It is not represented as an implemented capability in V1.
Browser QA
The current release has been validated through:
- automated logic tests
- production build verification
- extracted-copy verification
- static source inspection
A comprehensive automated browser end-to-end test suite is not currently included.
Design Principles
PathOS is being developed around several principles.
1. Explainability
Users should understand why PathOS recommends something.
2. Evidence Over Guesswork
Career recommendations should increasingly be grounded in user evidence and structured career data.
3. Personalization
The system should adapt to the individual rather than providing generic career advice.
4. Actionability
Every recommendation should lead toward a concrete next action.
5. Progressive Intelligence
The system should become more intelligent as more information about the user becomes available.
6. Human Control
AI should guide and challenge the user, not make irreversible career decisions for them.
7. Continuous Adaptation
A career roadmap should not be static.
As the user learns, builds, gains experience, or changes goals, PathOS should update the recommended path.
Status
Current release: V1 — Career Intelligence Foundation
PathOS is actively evolving from a deterministic career exploration experience into a full AI-powered career intelligence platform.
The current release establishes the product experience and core career-intelligence concepts.
The long-term objective is much larger:
Build a system that can understand a person's career state, discover realistic opportunities, explain the path between where they are and where they want to go, and continuously guide them through that journey.

License
This project is currently under active development.
License and contribution guidelines will be defined as the platform matures.

### One change I'd make to the actual product direction

I would **not** call the future system simply an "AI Career Advisor."

The stronger positioning is:

> **PathOS — Personal Career Intelligence**

with the AI agent as one component of the system.

That distinction matters. A chatbot can answer career questions. **PathOS should understand a career state.**

Your README should therefore make this progression obvious:

**V1:** deterministic career intelligence  
→ **V1.5:** structured career knowledge  
→ **V2:** conversational AI  
→ **V2.5:** evidence-based career intelligence engine  
→ **V3:** persistent personal career agent

That gives us a very strong technical/product story while remaining completely honest about what exists today.
