# LaunchPilot Monetization Plan

## Implementation Status (as of 2026-02-21)

| Component | Status | File |
|-----------|--------|------|
| Stripe products in dashboard | Not started | Stripe Dashboard |
| Database migration (app column) | Not started | Supabase SQL |
| stripe-checkout.cjs | Not started | `netlify/functions/` |
| stripe-webhook.cjs | Not started | `netlify/functions/` |
| stripe-portal.cjs | Not started | `netlify/functions/` |
| claude-proxy.cjs app filter | Not started | `netlify/functions/claude-proxy.cjs` |
| subscriptionStore.js | Not started | `src/stores/` |
| PricingPage.vue | Done | `src/components/Pricing/PricingPage.vue` |
| PricingSection.vue (landing page) | Done | `src/components/LandingPage/PricingSection.vue` |
| UpgradePrompt.vue | Not started | `src/components/Pricing/` |
| QuotaDisplay.vue | Not started | `src/components/Pricing/` |
| QuotaExceededModal.vue | Not started | `src/components/Pricing/` |
| Task locking in Dashboard | Not started | `src/components/Dashboard/` |
| AI quota check in aiGeneration | Not started | `src/services/aiGeneration.js` |

## Context

LaunchPilot has 32 tasks across 4 phases with tier gating already defined in the task schema (free/launcher/pro), but **0% monetization is implemented** -- no Stripe code, no payment UI, no subscription tracking. This plan takes LaunchPilot from zero to full Stripe integration.

**Key decision:** Use **Stripe Checkout Sessions** (redirect to Stripe-hosted page) instead of embedded Payment Elements. This handles both one-time payments (Launcher $29) and subscriptions (Pro $9/mo) with zero Stripe.js frontend code.

---

## Stripe Products (Manual -- Dashboard Setup)

Create in Stripe Dashboard (test mode first):

| Product | Price | Mode | Metadata |
|---------|-------|------|----------|
| LaunchPilot Launcher | $29 one-time | `payment` | `tier: launcher` |
| LaunchPilot Pro | $9/month | `subscription` | `tier: pro` |

Env vars to add:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_STRIPE_LAUNCHER_PRICE_ID=price_...
VITE_STRIPE_PRO_PRICE_ID=price_...
```

---

## Team Agent Assignment

### Agent 1: Backend (Netlify Functions + DB)

**1. Database migration** -- Add `app` column to shared Supabase tables (shared instance with LaunchPilot):
- `subscriptions` table: add `app TEXT`, `stripe_price_id TEXT`, `purchase_type TEXT` columns
- `ai_usage` table: add `app TEXT` column
- RLS policies filtering by `app = 'shipkit'`
- If tables don't exist, create them with full schema

**2. `netlify/functions/stripe-checkout.cjs`** (NEW)
- Verify auth, accept `priceId`
- Determine mode: `payment` (Launcher) or `subscription` (Pro)
- Get/create Stripe customer (lookup by `user_id + app='shipkit'`)
- Create Checkout Session, return `{ url }`
- Reference: `/home/marc/DEV/sales/netlify/functions/stripe-create-subscription.cjs`

**3. `netlify/functions/stripe-webhook.cjs`** (NEW)
- Handle events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- For `checkout.session.completed`: upsert subscription with correct tier based on payment mode
- Tier downgrade logic: Pro cancel -> check for prior Launcher purchase -> downgrade to `launcher` not `free`
- Reference: `/home/marc/DEV/sales/netlify/functions/stripe-webhook.cjs`

**4. `netlify/functions/stripe-portal.cjs`** (NEW)
- Create Billing Portal session for Pro subscribers
- Reference: `/home/marc/DEV/sales/netlify/functions/stripe-portal-session.cjs`

**5. Update `netlify/functions/claude-proxy.cjs`** (EXISTING)
- Add `app = 'shipkit'` filter to subscription lookup (line ~168) and ai_usage count (line ~161)
- Add `app: 'shipkit'` to ai_usage insert (line ~37)

**6. Update `netlify/functions/utils/auth.cjs`** -- Add LaunchPilot domain to CORS origins

### Agent 2: Frontend (Store + UI Components)

**1. `src/stores/subscriptionStore.js`** (NEW)
- State: `subscription`, `aiUsage`, `isLoading`
- Computed: `tier`, `effectiveTier`, `isFree/isLauncher/isPro`, `canAccessTask(taskTier)`, `canGenerateAI`
- Methods: `fetchSubscription()`, `fetchAIUsage()`, `createCheckoutSession(priceId)`, `createPortalSession()`
- Query Supabase with `app = 'shipkit'` filter
- Reference: `/home/marc/DEV/sales/src/stores/quotaStore.js` (simplified, no domain model layer)

**2. `src/components/Pricing/PricingPage.vue`** (NEW)
- Three-column pricing comparison (Free / Launcher / Pro)
- Cyberpunk design: cyan/yellow/magenta borders per tier
- "MOST POPULAR" badge on Launcher
- CTA buttons call `subscriptionStore.createCheckoutSession()`
- Adapts based on user's current tier

**3. `src/components/Pricing/UpgradePrompt.vue`** (NEW)
- Inline component for locked tasks
- Lock icon + tier-specific CTA + value prop bullets
- Props: `requiredTier`

**4. `src/components/Pricing/QuotaDisplay.vue`** (NEW)
- Progress bar showing AI generation usage
- Color changes: cyan (<80%), yellow (80-95%), magenta (>95%)

**5. `src/components/Pricing/QuotaExceededModal.vue`** (NEW)
- Modal when AI quota hit, upgrade CTA
- Reference: `/home/marc/DEV/sales/src/components/QuotaExceededModal.vue`

**6. Add `/pricing` route** to `src/router/index.js`

**7. Update `src/components/Settings/ProjectSettings.vue`**
- Wire hardcoded `currentTier = 'free'` (line 53) to subscription store
- Add "Manage Billing" button (Stripe portal) for Pro users

### Agent 3: Integration (Wire Everything Together)

**1. Task locking in `src/components/Dashboard/DashboardContainer.vue`**
- Import subscriptionStore, check `canAccessTask(task.tier)`
- Locked tasks: dim overlay + lock icon + click shows UpgradePrompt

**2. Tier gate in `src/components/Dashboard/TaskDetailView.vue`**
- Show UpgradePrompt instead of full content for locked tasks
- Still show title/description as teaser

**3. AI quota check in `src/services/aiGeneration.js`**
- Check `subscriptionStore.canGenerateAI` before API call
- Throw specific error -> QuotaExceededModal

**4. Checkout success handling**
- Dashboard detects `?checkout=success` query param
- Force-refreshes subscription store

**5. Pricing section on `src/components/LandingPage.vue`**
- Add link or inline pricing preview

---

## Execution Order

```
Phase 1 (Backend):  DB migration -> Stripe functions -> Update claude-proxy
Phase 2 (Frontend): subscriptionStore -> PricingPage -> UpgradePrompt -> Quota components
Phase 3 (Integration): Task locking -> AI gating -> Checkout flow -> Landing page
```

Phases 1 and 2 can run **in parallel**. Phase 3 depends on both completing.

---

## Verification

1. **Stripe CLI local testing:** `stripe listen --forward-to localhost:3000/.netlify/functions/stripe-webhook`
2. **Test card:** `4242 4242 4242 4242`
3. **Scenarios to verify:**
   - Free user buys Launcher -> tasks 6-22 unlock
   - Free user buys Pro -> all 32 tasks unlock
   - Launcher user upgrades to Pro -> tasks 23-32 unlock
   - Pro user cancels -> stays Pro until period end -> downgrades to Launcher (if purchased) or Free
   - Free user hits AI quota (40 generations) -> QuotaExceededModal
   - Page refresh after payment -> subscription persists

---

## Key Reference Files

| Purpose | LaunchPilot Path | LaunchPilot Reference |
|---------|-------------|----------------------|
| Task schema + tier gating | `src/tasks/schema.js` | -- |
| Task registry | `src/tasks/index.js` | -- |
| Auth store | `src/stores/authStore.js` | -- |
| Project store | `src/stores/projectStore.js` | -- |
| AI generation | `src/services/aiGeneration.js` | -- |
| Claude proxy (quota) | `netlify/functions/claude-proxy.cjs` | -- |
| Dashboard | `src/components/Dashboard/DashboardContainer.vue` | -- |
| Task detail | `src/components/Dashboard/TaskDetailView.vue` | -- |
| Settings (billing) | `src/components/Settings/ProjectSettings.vue` | -- |
| Stripe webhook | -- (to create) | `/home/marc/DEV/sales/netlify/functions/stripe-webhook.cjs` |
| Stripe checkout | -- (to create) | `/home/marc/DEV/sales/netlify/functions/stripe-create-subscription.cjs` |
| Stripe portal | -- (to create) | `/home/marc/DEV/sales/netlify/functions/stripe-portal-session.cjs` |
| Quota store | -- (to create) | `/home/marc/DEV/sales/src/stores/quotaStore.js` |
| Quota modal | -- (to create) | `/home/marc/DEV/sales/src/components/QuotaExceededModal.vue` |

## DB Schema (Supabase Migration SQL)

```sql
-- Add app column to shared tables
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS app TEXT DEFAULT 'launchpilot';
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS purchase_type TEXT DEFAULT 'subscription'
  CHECK (purchase_type IN ('one_time', 'subscription'));
ALTER TABLE public.ai_usage ADD COLUMN IF NOT EXISTS app TEXT DEFAULT 'launchpilot';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_app_user ON public.subscriptions (app, user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_app_user ON public.ai_usage (app, user_id);

-- RLS
CREATE POLICY "shipkit_users_read_own_subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id AND app = 'shipkit');
```

If tables don't exist yet, create full schema (see plan agent output for complete CREATE TABLE statements).
