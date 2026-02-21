# LaunchPilot

The guided launch checklist for indie developers. Go from "I built a thing" to paying customers — 32 tasks across 4 phases.

## What is LaunchPilot?

Most devs can build a product but have no idea how to launch it. LaunchPilot gives you a step-by-step checklist with AI-powered copy generation, opinionated tool picks, and proven templates for every launch channel.

### Key Features
- **32 guided tasks** across 4 phases: Pre-Launch, Launch Week, First 30 Days, Scaling
- **AI-personalized copy** — generates headlines, emails, and social posts based on YOUR app details
- **Opinionated tool picks** — one recommendation per category, not 20 options
- **Copy-paste templates** — ready-to-use text for Product Hunt, Indie Hackers, Hacker News, Twitter, email
- **Developer-native language** — no marketing jargon

### Pricing
- **Free**: Phase 1 (5 tasks) + 40 AI generations/month
- **Launcher** ($29 one-time): All 32 tasks + templates + unlimited AI
- **Pro** ($9/month): Launcher + monthly new strategies + priority support

## Tech Stack
- Vue 3 + Vite + Tailwind CSS v4
- Pinia (state management)
- Supabase (auth + database)
- Netlify Functions (serverless)
- Claude AI API (copy generation)
- Stripe (payments — planned)

## Getting Started

```bash
git clone https://github.com/dizid/shipkit.git
cd shipkit
npm install
npm run dev
```

App runs on `http://localhost:3000`. Uses `@netlify/vite-plugin` to emulate Netlify Functions locally.

## Project Structure

```
src/
  components/
    Auth/           # Sign in, sign up, password reset
    Dashboard/      # Task dashboard + task detail workbench
    LandingPage/    # 10 section components (hero, pricing, FAQ, etc.)
    Onboarding/     # Project setup wizard
    Pricing/        # Standalone pricing page
    Settings/       # Project settings
    shared/         # ErrorBoundary
  composables/      # useTaskFormData, useSaveState, useSeo, useUtm, useAnalytics
  services/         # aiGeneration, taskDataService, projectService
  stores/           # authStore, projectStore
  tasks/            # 32 task definitions across 4 phase files
  utils/            # Supabase client, logger, retry
netlify/functions/  # claude-proxy (AI API + quota enforcement)
docs/               # Marketing copy, social content
public/             # Logo, favicon, OG images
```

## Documentation

- [CLAUDE.md](CLAUDE.md) — Project guide, code style, design system, deployment info
- [docs/landing-page-copy.md](docs/landing-page-copy.md) — Landing page copy
- [docs/social-content.md](docs/social-content.md) — Launch tweets, IH post, PH copy, Show HN
- [competitor-research-report.md](competitor-research-report.md) — Market analysis
