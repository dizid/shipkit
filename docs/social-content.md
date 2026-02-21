# ShipKit — Social Media Launch Content

All social content for launch day. Platform-native formats, developer voice throughout.

---

## Launch Tweet Thread (5 tweets)

---

**Tweet 1 — Announcement** (under 280 chars)

Launching ShipKit today.

32 tasks. 4 phases. Goes from "I built a thing" to paying customers.

AI generates personalized copy for every launch channel — not generic, trained on YOUR app details.

Free to start. $29 to unlock everything.

shipkit.dev

---

**Tweet 2 — The Problem** (under 280 chars)

You can build a SaaS in a weekend.

But then what?

- You post on Twitter. Crickets.
- You submit to Product Hunt. 5 upvotes.
- You spend 3 hours reading "how to get users" guides.

The problem isn't your product. It's that you have no launch process.

---

**Tweet 3 — What ShipKit Does** (under 280 chars)

ShipKit is a checklist, not a course.

Each task = what to do + why it matters + which tool to use + AI-generated copy specific to your app.

No decision fatigue. No passive watching.

Just: open task, read instructions, do the thing, check the box.

---

**Tweet 4 — Pricing Hook** (under 280 chars)

ShipFast costs $199+ and helps you build faster.

ShipKit costs $29 (once) and helps you launch.

Different problems.

If you already have an app and zero users — ShipKit is the next thing you need.

---

**Tweet 5 — CTA** (under 280 chars)

If you've ever shipped something and heard nothing back, this is for you.

shipkit.dev — free to start, $29 for everything.

#buildinpublic #indiehackers #SaaS #indiedev

---

## Indie Hackers Launch Post

**Title (under 80 chars):**
ShipKit — a 32-task checklist that takes devs from built to paying customers

**Body (~300 words):**

---

I've watched a lot of developers — including myself — ship something decent and then just... stall. The app works. The code is clean. And nobody cares.

Not because the product is bad. Because launching is a completely different skill set from building, and most developers have never had to learn it.

I built ShipKit to fix that.

**What it is:** A 32-task sequential checklist across 4 phases — Pre-Launch, Launch Week, First 30 Days, and Scaling. Each task includes exact instructions, a tool recommendation (one, not twenty), and an AI that generates personalized copy for your specific app.

**The AI part is worth explaining.** It's not "use ChatGPT to write your Product Hunt description." You fill in details about your app once — problem it solves, target audience, unique angle — and every copy task uses that context. The output is specific to what you built. It actually sounds like your product.

**Why I built it:** I kept seeing the same pattern. Developers who could ship code in their sleep were paralyzed when it came to writing a Product Hunt post or figuring out what to do in week 2 after launch. The knowledge exists — it's scattered across a thousand blog posts, YouTube videos, and Twitter threads. ShipKit packages it into an actionable system.

**Current state:** Launched today. Phase 1 is free (5 tasks). Launcher tier ($29 one-time) unlocks all 32 tasks and unlimited AI generations. Pro ($9/month) adds monthly new strategies and priority support.

**Questions for the community:**
- What's the biggest thing you got wrong on your first launch?
- Is the one-time pricing model the right call, or would you expect a subscription?
- What channels actually moved the needle for you in the first 30 days?

Honest feedback appreciated. shipkit.dev

---

## Product Hunt

**Tagline (under 60 chars):**
The 32-task launch checklist for developers <!-- 49 chars -->

**Description (~250 words):**

---

ShipKit is a guided launch system for indie developers — 32 sequential tasks across 4 phases that take you from "I built a thing" to your first paying customers.

Most developers can ship an app in a weekend. Getting users is the hard part — and it's a completely different skill set. ShipKit bridges that gap without requiring you to become a marketer.

**What makes it different:**

**AI-personalized copy:** You describe your app once. ShipKit uses that context to generate Product Hunt posts, Indie Hackers write-ups, cold emails, and social content specific to what you built — not generic templates.

**Opinionated tool picks:** Every task that requires a tool includes exactly one recommendation. No comparison matrices, no affiliate rabbit holes. Just: use this tool, here's how to set it up, move on.

**A checklist, not a course:** Courses are passive. ShipKit is active. You read the task, do the thing, check the box. The output is your launch — not your knowledge.

**Pricing:**
- Free: Phase 1 (5 foundation tasks)
- Launcher: $29 one-time — all 32 tasks, unlimited AI generations, lifetime access
- Pro: $9/month — everything in Launcher plus monthly new strategies and priority support

If you've ever shipped something and heard nothing back, this is for you.

---

**Maker's First Comment (~200 words):**

---

Hey PH — I'm the maker.

Built ShipKit because I kept running into the same problem: developers who could build great products had no idea what to do after shipping. Not from lack of trying — they'd Google it, watch YouTube, read the IH forums — but there was no structured system that told you what to do in what order.

The 32 tasks are sequenced intentionally. Phase 1 builds the foundation before you launch. Phase 2 is launch week itself — the submissions, the posts, the outreach. Phase 3 is the first 30 days of figuring out what's working. Phase 4 is doubling down on distribution.

The AI piece took the most iteration. Generic prompts produce generic copy. The current approach collects your app's specific details upfront and threads that context through every copy task. It's still AI, but it sounds like it's writing about your product.

Free tier is real — 5 tasks, no credit card, no trial timer.

Happy to answer anything — stack, how the AI works, why I picked certain tools over others, anything. Genuine feedback on what's missing or broken is the most useful thing you can leave in the comments.

---

## Show HN

**Title (under 80 chars):**
Show HN: ShipKit — a 32-task launch checklist for developers with zero users <!-- 77 chars -->

**First Comment (~150 words, technical focus):**

---

Hi HN,

ShipKit is a guided launch checklist — 32 tasks across 4 phases covering everything from landing page setup to scaling distribution. Target audience is indie developers who have a working product and no idea what to do next.

**Stack:** Vue 3 + Vite + Tailwind CSS v4 + Pinia + Supabase (auth + DB) + Netlify Functions + Stripe. The AI copy generation runs through a Netlify Function that proxies to Claude, which lets me keep the API key server-side and rate-limit by user tier without a separate backend.

**Interesting decision:** Rather than a generic AI prompt per task, I collect app context upfront (problem, audience, differentiator) and inject it into every copy generation. The output quality difference is significant.

**Current state:** Launched today. Free tier covers Phase 1. $29 one-time for everything.

Curious what's broken or missing from your perspective. Happy to go into any of the technical decisions.

---
