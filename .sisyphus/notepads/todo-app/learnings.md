# Learnings - Todo App

## Conventions & Patterns

_Will be populated as implementation progresses_

---

## Task 1: Monorepo Root Structure

**Date:** 2026-03-29

**Implemented:**
- Created workspace-based monorepo with `package.json` workspaces array
- Configured `tsconfig.base.json` with strict TypeScript settings (strict: true, ES2022, ESNext module)
- Set up `vercel.json` with monorepo routing: /api/* → backend, /* → frontend
- Created empty `frontend/` and `backend/` directories

**Patterns:**
- Used `"private": true` at root to prevent accidental publication
- Set Node.js engine requirement to >=18.0.0 for modern features
- Configured TypeScript with strict mode + additional safety flags (noUnusedLocals, noImplicitReturns)
- Vercel monorepo pattern: separate builds per workspace, route-based delegation

**Key Config Values:**
- TypeScript target: ES2022
- Module resolution: bundler (supports modern tooling)
- Workspaces: ["frontend", "backend"]

**Verification:**
- Both directories exist and are empty
- Workspaces array correctly defined
- Strict mode enabled in TypeScript base config

## Design System Configuration (Task 5)

### Stellar Observer Design Tokens

**Color Palette (52 colors)**
- Primary: #ccc6b4 (warm beige)
- Secondary: #bdc2ff (soft blue)
- Tertiary: #d8bbf4 (lavender)
- Background: #111417 (deep space dark)
- Surface hierarchy: surface-container-lowest (#0c0e12) to surface-container-highest (#323539)
- Text: on-surface (#e1e2e7), on-surface-variant (#c7c5ce)
- Error: #ffb4ab

**Typography**
- headline: Manrope (wght: 400, 700, 800)
- body: Inter (wght: 400, 500, 600)
- label: Space Grotesk (wght: 300, 500, 700)

**Custom Effects**
- star-glow: box-shadow with 20px blur, 2px spread, primary color at 40% opacity
- nebula-bg: radial gradient with deep blue (#1b247f) at 15% opacity

**Icon System**
- Material Symbols Outlined
- Default settings: FILL 0, wght 400, GRAD 0, opsz 24

**Implementation Notes**
- Used Tailwind CSS extend to preserve default utilities
- All colors use kebab-case naming matching Material Design conventions
- Font families include fallback to sans-serif
- Custom utilities added via @layer for star-glow and nebula-bg
- Body element uses @apply for bg-background, text-on-background, font-body

**File Structure**
- tailwind.config.js: Design tokens, colors, fonts, effects
- index.html: Google Fonts imports in <head>
- index.css: Tailwind directives, base styles, custom utilities

## Task 2: Backend Express + TypeScript Setup

**Date:** 2026-03-29

**Implemented:**
- Express 4.18.2 with TypeScript 5.3.3
- CORS middleware for cross-origin requests
- dotenv for environment variable management
- Mongoose 8.0.0 for MongoDB ODM (ready for Task 6)
- ts-node-dev for hot reload during development
- Jest 29.7.0 + ts-jest + mongodb-memory-server for testing
- Supertest 6.3.3 for HTTP API testing

**Script Configurations:**
- `dev`: Uses ts-node-dev with --respawn and --transpile-only for fast reloads
- `build`: Standard tsc compilation to dist/ directory
- `start`: Runs compiled JavaScript from dist/
- `test`: Jest with --passWithNoTests flag (tests will be added in later tasks)

**Patterns:**
- TypeScript strict mode enabled via tsconfig.base.json
- CommonJS modules for Node.js backend (not ESNext like frontend)
- Module resolution: "node" (backend) vs "bundler" (frontend)
- Express app exported as default for testing with supertest
- PORT configurable via environment variable (default 3000)
- Health check endpoint at /health for deployment monitoring
- Source maps and declaration maps enabled for debugging

**Testing Setup:**
- Jest configured with ts-jest preset
- Test files pattern: **/*.test.ts
- mongodb-memory-server ready for integration tests (Task 6+)
- Coverage collection from src/**/*.ts (excluding test files)

**Key Differences from Frontend:**
- Backend uses Jest, frontend uses Vitest
- Backend uses CommonJS, frontend uses ESNext
- Backend targets Node.js, frontend targets browser

