# ShipKit - Project Guide

The guided launch checklist for indie developers. Helps devs go from "I built a thing" to paying customers — 32 tasks across 4 phases.

## Tech Stack
- Vue 3 + Vite + Tailwind CSS v4
- Pinia stores
- Supabase (auth + DB — shared with LaunchPilot, same instance)
- Netlify Functions (serverless)
- Claude AI API (via claude-proxy.cjs)
- Stripe (subscriptions + one-time payments)

## Dev Setup
Run `npm run dev` — uses `@netlify/vite-plugin` to emulate Netlify Functions inside Vite.
App runs on port 3000. Do NOT use `netlify dev`.

## Key Directories
- `src/tasks/` - Single task registry (schema + 4 phase files)
- `src/components/` - Vue components by domain
- `src/stores/` - Pinia stores (auth, project, quota, onboarding, milestone)
- `src/services/` - API services (aiGeneration, taskDataService, stripeService)
- `src/composables/` - Vue composables (useTaskFormData, useSaveState)
- `netlify/functions/` - Serverless functions (claude-proxy, stripe-*)

## Architecture: ONE Task System
All 32 tasks defined in `src/tasks/`:
- `schema.js` - Task type definition + helper functions
- `phase1-prelaunch.js` - Tasks 1-5 (FREE tier)
- `phase2-launch.js` - Tasks 6-12 ($29 Launcher tier)
- `phase3-growth.js` - Tasks 13-22 ($29 Launcher tier)
- `phase4-scaling.js` - Tasks 23-32 ($9/mo Pro tier)
- `index.js` - Single registry, exports everything

## Pricing Tiers
- **Free**: Phase 1 (Tasks 1-5) + limited AI advice
- **Launcher** ($29 one-time): All 32 tasks + templates + unlimited AI
- **Pro** ($9/month): Launcher + monthly new strategies + priority support

## Code Style
- Variables/functions: camelCase
- Components: PascalCase
- Files: kebab-case (except Vue components)
- Use `<script setup>` in Vue components
- Developer-native language — no marketing jargon

## Design System
- Cyberpunk neon aesthetic (dark mode only)
- Colors: Cyan (#00d9ff), Magenta (#c9004f), Yellow (#ffbe0b)
- Fonts: Unbounded (display), Space Grotesk (body), JetBrains Mono (code)
- Border-radius: 0 everywhere (sharp edges)
- Single CSS file: `src/assets/main.css`

## Preferences
- Act like a senior developer
- Write complete, working code — no mocks, stubs, or TODOs
- Keep functions small and focused
- Simple solutions over clever ones
- Mobile-first responsive design

## Origin
Cherry-picked proven patterns from LaunchPilot (`/home/marc/DEV/sales`).
Reference it for: Supabase schema, Stripe webhook patterns, auth flow details.
