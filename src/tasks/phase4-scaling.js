/**
 * Phase 4: Scaling Tasks (PRO tier)
 *
 * 10 tasks for when you've validated product-market fit and are ready to
 * build scalable, repeatable growth systems. Each task here assumes you
 * have at least 50 paying customers and a clear retention signal.
 *
 * @type {import('./schema.js').TaskDefinition[]}
 */

export const phase4Tasks = [
  // ─────────────────────────────────────────────────────────────────────────
  // Task 23: Paid Acquisition Basics
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase4-23',
    phase: 4,
    phaseLabel: 'Scaling',
    tier: 'pro',
    title: 'Paid Acquisition Basics',
    description:
      'Paid ads amplify what\'s already working — they don\'t fix a broken funnel. Set up a small-budget test on 1 channel, measure CAC, and scale only what\'s profitable.',
    timeEstimate: '4-6 hours',
    icon: '💸',
    category: 'Growth',

    steps: [
      {
        title: 'Calculate your max CAC before spending anything',
        description: 'You need to know how much you can afford to spend acquiring one customer before you run any ads. Formula: LTV (average revenue per customer × average customer lifespan) × 0.33. That\'s your max CAC.',
        subtasks: [
          { title: 'Calculate average LTV from your customer data', description: 'Average monthly revenue per customer × average months before churn.' },
          { title: 'Set your max CAC budget at 33% of LTV', description: 'This ensures a 3:1 LTV:CAC ratio — standard healthy benchmark for early-stage SaaS.' },
          { title: 'Define your minimum ROAS (return on ad spend) target', description: 'For most indie SaaS: if you\'re spending $1 on ads, you need $3 in revenue generated within 90 days.' }
        ]
      },
      {
        title: 'Choose one channel for your first paid test',
        description: 'Don\'t split your budget across multiple channels. Pick one, test for 30 days, analyze, then decide. Google Search (targeting your exact keywords) or Reddit Ads (targeting specific subreddits) are best starting points for developer tools.',
        subtasks: [
          { title: 'Choose: Google Search Ads, Reddit Ads, or X Ads', description: 'Google Search: highest intent, higher cost. Reddit: lower cost, highly targeted by community. X Ads: good for developer tools with B2C users.' },
          { title: 'Set a monthly test budget ($300-$500 is enough to get data)', description: 'Enough to get 30-50 clicks and see if conversion rate is viable.' },
          { title: 'Create 3 ad variations to A/B test', description: 'Different headlines. Same landing page. See which message resonates.' }
        ]
      },
      {
        title: 'Set up conversion tracking before running any ads',
        description: 'Without conversion tracking, you\'re flying blind. Add the ad platform\'s pixel to your thank-you/confirmation page so you know which ad → which signup → which purchase.',
        subtasks: [
          { title: 'Install the conversion tracking pixel on your signup confirmation page', description: 'Google Tag Manager makes this straightforward for any platform.' },
          { title: 'Verify conversions are being recorded in the ad platform', description: 'Run a test signup and confirm it shows as a conversion in Google Ads or your platform.' }
        ]
      },
      {
        title: 'Run for 30 days, then evaluate',
        description: 'Let the test run for a full 30 days before drawing conclusions. After 30 days: calculate actual CAC (spend ÷ paying customers from ads). If actual CAC < max CAC, scale. If not, kill the channel and test a different one.',
        subtasks: [
          { title: 'Log weekly: spend, clicks, signups, paying customers from ads', description: 'Maintain a simple ad tracking spreadsheet.' },
          { title: 'At day 30: calculate CAC and compare to your max CAC', description: 'If profitable: increase budget by 50%. If break-even: optimize copy and landing page. If unprofitable: kill and try next channel.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are a paid acquisition specialist for bootstrapped SaaS products.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. A CAC/LTV calculation worksheet with example numbers for a SaaS like {app_name}
2. 3 Google Search ad headline + description variations (headline: 30 chars, description: 90 chars)
3. A 30-day paid ads testing framework with weekly review questions
4. A landing page checklist for maximizing paid ad conversion rates`,
      temperature: 0.65,
      maxTokens: 1000
    },

    templates: [
      {
        title: 'Ad performance tracking spreadsheet',
        content: `WEEK | SPEND | CLICKS | CTR | SIGNUPS | PAYING CUSTOMERS | CAC | NOTES

Targets:
- Max CAC: $[X] (33% of LTV)
- Target CTR: ≥ 2% (Google) / ≥ 0.5% (display)
- Target signup rate from ad traffic: ≥ [X]%

Decision rules:
- If CAC < max CAC after 30 days: increase budget 50%
- If CAC = max CAC: optimize landing page and copy
- If CAC > max CAC by >50%: kill channel`
      }
    ],

    tools: [
      { name: 'Google Ads', url: 'https://ads.google.com', freeDetails: 'No minimum spend. Start with $10/day. Smart campaigns available for beginners.' },
      { name: 'Reddit Ads', url: 'https://ads.reddit.com', freeDetails: '$5/day minimum. Target specific subreddits. Lower competition than Google for developer tools.' }
    ],

    doneCriteria: [
      'Max CAC calculated and documented',
      'One paid channel selected and account created',
      'Conversion tracking installed and verified',
      '3 ad variations created',
      '30-day test budget set and campaigns running',
      'Weekly tracking spreadsheet maintained'
    ],

    commonMistakes: [
      'Running paid ads before you have product-market fit. Ads amplify signal, not create it. If your organic conversion rate is < 2%, fix the funnel first.',
      'Spreading budget across 3 channels. You won\'t get statistically meaningful data from any of them. Pick one and commit for 30 days.',
      'Sending paid traffic to your homepage. Create a dedicated landing page for each ad campaign with one specific CTA.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 24: Email Marketing Automation
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase4-24',
    phase: 4,
    phaseLabel: 'Scaling',
    tier: 'pro',
    title: 'Email Marketing Automation',
    description:
      'Build behavior-triggered email sequences that activate free users, upgrade trial users, and prevent churn — without manual work for every new subscriber.',
    timeEstimate: '5-8 hours',
    icon: '⚙️',
    category: 'Retention',

    steps: [
      {
        title: 'Map your email automation triggers',
        description: 'Behavior-based emails (triggered by what a user does or doesn\'t do) outperform scheduled broadcasts by 3-5x in open rates. Define the 5 key user behaviors that should trigger an email.',
        subtasks: [
          { title: 'Trigger 1: User signs up but doesn\'t activate in 24 hours', description: 'Send a "did you get lost?" email with the one specific action they need to take.' },
          { title: 'Trigger 2: User completes onboarding (aha moment)', description: 'Send a "you\'re set up" email with 3 power-user tips and a soft upgrade mention.' },
          { title: 'Trigger 3: Trial user approaching expiry without upgrading', description: 'Send a "your trial ends in 3 days" email with a time-limited upgrade offer.' },
          { title: 'Trigger 4: Active user goes inactive for 7 days', description: 'Send a re-engagement email with a specific reason to come back (new feature, reminder of value).' },
          { title: 'Trigger 5: User downgrade or cancellation signal', description: 'Send a "before you go" email with a win-back offer.' }
        ]
      },
      {
        title: 'Write and set up the 5 trigger emails',
        description: 'Each trigger email has one job and one CTA. Keep them short (under 150 words), personal in tone, and sent from your personal email address (not a no-reply alias).',
        subtasks: [
          { title: 'Write all 5 trigger emails', description: 'Subject line + body for each. Personal tone, one CTA each.' },
          { title: 'Configure triggers in your email tool or via webhook', description: 'Loops and ConvertKit both support behavior triggers via API. Connect to PostHog events for sophisticated targeting.' }
        ]
      },
      {
        title: 'Track email automation performance',
        description: 'Your automated emails should perform better than your broadcast emails. Set benchmarks: activation email ≥ 40% open rate, trial expiry email ≥ 30% open rate, re-engagement ≥ 20% open rate.',
        subtasks: [
          { title: 'Set open rate and click rate targets for each automation', description: 'If below target after 30 days, test a new subject line or CTA.' },
          { title: 'Review automation performance monthly', description: 'Monthly 30-minute review: which automations are converting, which are not.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are an email automation specialist for SaaS products targeting developers.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Write all 5 behavior-triggered emails:
1. 24-hour non-activation follow-up
2. Onboarding completion / aha moment email
3. Trial expiry warning (3 days before)
4. 7-day re-engagement email
5. Cancellation win-back email

For each: subject line + body (under 150 words each). Personal, developer-native tone.`,
      temperature: 0.72,
      maxTokens: 1400
    },

    templates: [
      {
        title: '24-hour non-activation email',
        content: `Subject: Did something go wrong?

Hey [name],

You signed up for [App name] yesterday but I don't see you've [done the core action] yet.

If something's broken or confusing, reply and I'll fix it personally.

If you just haven't had time: here's the one thing to do first → [link to first action]

Takes under 5 minutes.

— [Your name]`
      }
    ],

    tools: [
      { name: 'Loops.so', url: 'https://loops.so', freeDetails: 'Built for SaaS automation. Transactional + marketing in one. Connect to PostHog/Segment for behavior triggers.' },
      { name: 'Customer.io', url: 'https://customer.io', freeDetails: 'Free trial. Industry standard for behavior-triggered SaaS emails. Powerful but more setup required.' }
    ],

    doneCriteria: [
      '5 trigger conditions defined',
      'All 5 trigger emails written',
      'Automations configured in email tool',
      'Triggers tested with test accounts',
      'Performance benchmarks set and monitored'
    ],

    commonMistakes: [
      'Building complex automations before your simple launch sequence is working. Get the 5 basic triggers running before branching into complex conditional logic.',
      'Sending automated emails from a no-reply address. Every trigger email should be sendable and replyable from your personal address.',
      'Not testing the triggers. Sign up with a test account and go through every trigger condition to verify the emails fire correctly.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 25: Affiliate Program Setup
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase4-25',
    phase: 4,
    phaseLabel: 'Scaling',
    tier: 'pro',
    title: 'Affiliate Program Setup',
    description:
      'A well-structured affiliate program turns content creators and community members in your space into a paid sales force. Set up the program, recruit 10 affiliates, and track performance.',
    timeEstimate: '4-6 hours',
    icon: '🔄',
    category: 'Growth',

    steps: [
      {
        title: 'Define your affiliate commission structure',
        description: 'Standard for SaaS: 20-30% recurring commission for the lifetime of the customer. This is generous enough to motivate affiliates and sustainable at scale because your customer LTV supports it.',
        subtasks: [
          { title: 'Set commission rate (20-30% recurring recommended)', description: 'Higher rates attract better affiliates. Recurring is better than one-time for affiliate motivation.' },
          { title: 'Define cookie window (60-90 days recommended)', description: 'Longer cookie windows are fairer to affiliates and result in more conversions.' },
          { title: 'Define minimum payout threshold', description: '$50 minimum is standard. Prevents micro-payout overhead.' }
        ]
      },
      {
        title: 'Set up affiliate tracking software',
        description: 'Rewardful is the standard for Stripe-based SaaS: it integrates directly with Stripe, tracks commissions automatically, and manages payouts. No custom code needed for the basic setup.',
        subtasks: [
          { title: 'Create a Rewardful account and connect to Stripe', description: 'rewardful.com — paid but handles all tracking and payouts. LemonSqueezy has built-in affiliates if you use that.' },
          { title: 'Create your affiliate landing page', description: 'URL: yourdomain.com/affiliates. Include: commission structure, who it\'s for, how to apply, sample materials.' },
          { title: 'Add affiliate program link to your footer and pricing page', description: 'Affiliates need to be able to find your program.' }
        ]
      },
      {
        title: 'Recruit your first 10 affiliates',
        description: 'Your best affiliates are: people who already use and like your product, content creators who write about your problem space, and other indie developers with an audience that matches yours.',
        subtasks: [
          { title: 'Email your top 10 most engaged users and invite them to be affiliates', description: 'Personal invitation beats a generic sign-up form. These people already believe in your product.' },
          { title: 'Reach out to 3-5 content creators who write about your topic', description: 'YouTube creators, newsletter writers, bloggers. A personal pitch works better than a form.' },
          { title: 'Create a promo kit for affiliates (copy templates, images, product walkthrough)', description: 'Make it easy for affiliates to promote by giving them everything they need.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are an affiliate program manager for SaaS products.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. An affiliate program landing page (headline, commission structure, who should apply, CTA)
2. An affiliate recruitment email for existing happy users (subject + body, 150 words)
3. An affiliate promo kit outline (what assets to include)
4. A 90-day affiliate program launch plan`,
      temperature: 0.68,
      maxTokens: 1000
    },

    templates: [
      {
        title: 'Affiliate recruitment email',
        content: `Subject: Want to earn [X]% commission on [App name]?

Hey [name],

You've been a [App name] user for [X] months — and I wanted to offer you something first.

I'm launching an affiliate program: you earn [X]% recurring commission for every customer you refer. Forever, as long as they stay subscribed.

With [App name] at $[price]/month, that's $[commission] per active customer per month.

You don't need a big audience. If you write about [topic], speak at meetups, or just have a community of people dealing with [problem], this is for you.

Apply here: [affiliate link]

Any questions? Just reply.

— [Your name]`
      }
    ],

    tools: [
      { name: 'Rewardful', url: 'https://rewardful.com', freeDetails: '$49/month. Stripe integration, automatic tracking and payouts, affiliate dashboard. Standard for indie SaaS.' },
      { name: 'Lemon Squeezy', url: 'https://lemonsqueezy.com', freeDetails: 'Built-in affiliate program if you use LS for payments. Commission tracking included.' }
    ],

    doneCriteria: [
      'Commission structure defined',
      'Affiliate tracking software set up',
      'Affiliate program landing page live',
      '10 personal affiliate invitations sent',
      'Promo kit created and shared with recruited affiliates'
    ],

    commonMistakes: [
      'Setting commissions too low (under 15%). Affiliates have many products to promote. Under 20% recurring means your program gets deprioritized.',
      'Not providing promo materials. Affiliates who have to create their own assets from scratch will promote something else instead.',
      'Recruiting affiliates with the wrong audience. 1 affiliate with an audience of 500 who have the exact problem outperforms 10 affiliates with 5,000 people who don\'t.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 26: Cold Outreach (Ethical)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase4-26',
    phase: 4,
    phaseLabel: 'Scaling',
    tier: 'pro',
    title: 'Cold Outreach (Ethical)',
    description:
      'Targeted, personalized cold outreach to 20-30 highly qualified prospects — not mass blasts. One sentence of genuine personalization outperforms 500 templated emails.',
    timeEstimate: '4-6 hours',
    icon: '📬',
    category: 'Outreach',

    steps: [
      {
        title: 'Build a highly targeted prospect list',
        description: 'Don\'t spray and pray. Build a list of 20-30 people who have publicly demonstrated they have the exact problem you solve. Twitter/X search, community posts, LinkedIn activity — find people who are actively struggling with your problem right now.',
        subtasks: [
          { title: 'Search X/Twitter for people complaining about your problem', description: 'Search: "[problem keywords] frustrating" or "does anyone else have this issue with [X]?"' },
          { title: 'Search relevant subreddits for people asking for help with your problem', description: 'Someone asking "how do I [problem]?" is a warm prospect.' },
          { title: 'Build a list of 20 people with name, contact, and the specific problem signal you found', description: 'You will personalize each outreach based on this signal.' }
        ]
      },
      {
        title: 'Write genuinely personalized messages',
        description: 'Each message must reference something specific about them: a tweet they wrote, a question they asked, a post they made. No merge tag personalization. Real, human personalization. This takes time — budget 5 minutes per message.',
        subtasks: [
          { title: 'Write one personalized opening sentence per prospect', description: '"I saw your post in r/SaaS about [specific thing]. I\'m building [App name] to solve exactly that." This one sentence is the whole game.' },
          { title: 'Keep the pitch to 3 sentences max', description: 'What you built, why it\'s relevant to them specifically, a clear low-friction ask (free trial, feedback session, 10-minute call).' }
        ]
      },
      {
        title: 'Send and track responses',
        description: 'Send all 20 in one batch. Track opens and responses. Reply to every response within 24 hours. One follow-up after 5 days if no response. Never a third message.',
        subtasks: [
          { title: 'Send all 20 messages over 2 days', description: 'Don\'t send 20 in one hour — it looks like a blast. Space them out.' },
          { title: 'Track in a simple spreadsheet: contact, sent date, opened, replied, outcome', description: 'Track your response rate. Target: 20-40% response rate on truly personalized outreach.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are a B2B sales specialist who focuses on ethical, personalized cold outreach for indie SaaS products.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. A 3-sentence cold email template with [PERSONALIZATION] markers (not just name — real personalization)
2. A Twitter/X DM template (under 100 characters for the hook)
3. A LinkedIn message template (note request + 1 message)
4. 5 search queries to find qualified prospects on X and Reddit
5. A follow-up email template (sent after 5 days, no response)`,
      temperature: 0.7,
      maxTokens: 1000
    },

    templates: [
      {
        title: 'Cold email template',
        content: `Subject: [PERSONALIZATION: reference their specific post/tweet/question]

Hey [name],

[PERSONALIZATION: one sentence referencing the exact thing they posted/tweeted/asked that shows you actually read it.]

I built [App name] to solve exactly that — [one sentence description that directly addresses their stated problem].

Would you be open to trying it free for 2 weeks? Happy to walk you through it in 10 minutes if that's useful.

— [Your name]
[App URL]`
      }
    ],

    tools: [
      { name: 'Hunter.io', url: 'https://hunter.io', freeDetails: 'Free plan: 25 email searches/month. Find professional email addresses for outreach.' },
      { name: 'Apollo.io', url: 'https://apollo.io', freeDetails: 'Free plan: 50 email credits/month. B2B contact data and basic outreach sequences.' }
    ],

    doneCriteria: [
      '20-30 qualified prospects identified (with specific problem signals)',
      'Personalized messages written for all 20 (minimum 1 unique sentence per message)',
      'All messages sent and tracked',
      'Follow-ups sent to non-responders after 5 days',
      'Response rate measured (target: ≥ 20%)'
    ],

    commonMistakes: [
      'Sending generic messages. "I saw you work in [industry] and thought you might be interested in [product]" is spam. Reference something specific and real.',
      'Leading with your product instead of their problem. "I built [app]" is a bad opener. "I saw your post about struggling with [exact problem]" is a good opener.',
      'Sending a third follow-up. Two messages is the ethical limit for cold outreach. A third message damages your reputation.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 27: Video Marketing & Demos
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase4-27',
    phase: 4,
    phaseLabel: 'Scaling',
    tier: 'pro',
    title: 'Video Marketing & Demos',
    description:
      'A 3-5 minute product demo video and 2-3 short-form videos can drive significant discovery traffic. Video builds trust faster than text and converts at higher rates on landing pages.',
    timeEstimate: '5-8 hours',
    icon: '🎬',
    category: 'Growth',

    steps: [
      {
        title: 'Record a 3-5 minute product demo',
        description: 'Your demo video should show — not tell — what the product does. Script it so you never have to say "um". Show the core workflow from sign-up to first value in real time. No slides, no talking head. Just the product.',
        subtasks: [
          { title: 'Write a script: problem → product → outcome (3 minutes)', description: 'Script every word. Record it 3 times and use the best take. Scripted demos outperform improvised ones.' },
          { title: 'Record with Loom or OBS (Loom is easier, OBS has no limits)', description: 'Screen recording + optional webcam. Good mic is more important than good camera.' },
          { title: 'Embed on your landing page as the primary hero element', description: 'Video on landing pages increases conversions 20-80%. Test with and without.' }
        ]
      },
      {
        title: 'Create 3 short-form videos for social',
        description: 'Clip the demo into 3 short videos: one showing the "aha moment", one solving a specific common problem, one showing a before/after. Post these to X, LinkedIn, and if applicable YouTube Shorts.',
        subtasks: [
          { title: 'Edit the demo into 3 clips (under 90 seconds each)', description: 'Use Descript or CapCut. Add captions — most social video is watched without sound.' },
          { title: 'Post one clip per week for 3 weeks', description: 'Space them out to maximize impressions. Don\'t post all 3 at once.' }
        ]
      },
      {
        title: 'Create a YouTube channel (if your audience is there)',
        description: 'YouTube is the second-largest search engine. If your target user searches YouTube for tutorials related to your problem space, a YouTube channel can drive significant organic traffic over 3-6 months.',
        subtasks: [
          { title: 'Create a YouTube channel with consistent branding', description: 'Name, banner, channel description. Link to your landing page in every video description.' },
          { title: 'Upload your demo and optimize for search', description: 'Title: "[Problem] — how to solve it with [App name]". Tags: relevant keywords. Description: full transcript.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are a video marketing specialist for developer tools.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. A word-for-word demo video script (3 minutes, structured as: problem → demo → outcome)
2. Titles and descriptions for 3 short-form social videos clipped from the demo
3. A YouTube video title + description optimized for search
4. A before/after script for a 60-second testimonial-style video`,
      temperature: 0.72,
      maxTokens: 1100
    },

    templates: [
      {
        title: 'Demo video script',
        content: `[0:00-0:20] HOOK — Start with the problem
"If you've ever [experienced specific problem], you know how frustrating it is when [specific pain point]. I built [App name] to fix that. Let me show you how."

[0:20-0:40] SETUP — Navigate to the product
"Here's [App name]. [Brief orientation of the UI.] I'm going to show you how to [core workflow] in under 3 minutes."

[0:40-2:30] DEMO — The actual workflow
[Walk through the core workflow. Narrate what you're doing and why it matters. Show real data if possible.]

[2:30-2:50] OUTCOME — Show the result
"So in [X minutes], we went from [starting state] to [end state]. That's [App name]."

[2:50-3:00] CTA
"Try it free for [X] days at [URL]."`
      }
    ],

    tools: [
      { name: 'Loom', url: 'https://loom.com', freeDetails: 'Free: unlimited videos up to 5 minutes. Perfect for product demos. Built-in trimming and sharing.' },
      { name: 'Descript', url: 'https://descript.com', freeDetails: 'Free plan: 1 hour of transcription/month. Edit video by editing the transcript. Easiest way to cut demo into short clips.' }
    ],

    doneCriteria: [
      '3-5 minute demo video recorded and uploaded',
      'Demo embedded on landing page',
      '3 short-form clips created and scheduled',
      'YouTube channel created (if applicable)',
      'Video performance tracked in analytics'
    ],

    commonMistakes: [
      'Recording without a script. Improvised demos are full of "um", "and then", and missed features. Write the script, memorize it, then record.',
      'Making the demo too long. 3-5 minutes is the maximum for a product demo that\'s watched to completion. Edit ruthlessly.',
      'Not adding captions. 85% of social video is watched muted. Without captions, you lose most of your audience.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 28: Competitive Positioning
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase4-28',
    phase: 4,
    phaseLabel: 'Scaling',
    tier: 'pro',
    title: 'Competitive Positioning',
    description:
      'Define clearly why your product is the best choice for your specific user versus the alternatives. Clear positioning reduces churn and improves conversion from informed buyers.',
    timeEstimate: '3-5 hours',
    icon: '🏆',
    category: 'Strategy',

    steps: [
      {
        title: 'Map the competitive landscape',
        description: 'List every alternative your target user might choose instead of you: direct competitors (same product category), adjacent tools (different approach, same job to be done), and the status quo (spreadsheets, manual processes, doing nothing).',
        subtasks: [
          { title: 'List 3-5 direct competitors', description: 'Products that do roughly the same thing for roughly the same user.' },
          { title: 'List 2-3 adjacent alternatives (including the status quo)', description: 'DIY workarounds, adjacent tools, and "I\'ll figure it out myself" — your real competition is often the status quo.' },
          { title: 'Document what each alternative does better than you', description: 'Be honest. This is your weakness list.' }
        ]
      },
      {
        title: 'Define your positioning statement',
        description: 'A positioning statement answers: for whom, what problem, what solution, versus what alternative, with what key differentiator. Write one, then use it to update your landing page, ads, and sales conversations.',
        subtasks: [
          { title: 'Write your positioning statement using the template', description: '"For [specific user], who [has this specific problem], [App name] is the [category] that [key differentiator], unlike [alternative] which [weakness]."' },
          { title: 'Update your landing page headline to reflect the positioning', description: 'The positioning statement should be visible (in some form) above the fold.' }
        ]
      },
      {
        title: 'Create a comparison page',
        description: 'A "[App name] vs. [Competitor]" page ranks on Google for people who are already comparing tools (high intent). Be fair — acknowledge where competitors are stronger. Dishonest comparisons damage trust.',
        subtasks: [
          { title: 'Create /vs/[competitor-name] pages for your top 2 competitors', description: 'Table comparison with real features. Note where the competitor beats you — this builds trust.' },
          { title: 'Optimize each page for "[App name] vs [Competitor]" keyword', description: 'Include the keyword in the page title, H1, and first paragraph.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are a product positioning strategist.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. A positioning statement using the April Dunford framework
2. A competitive landscape map with 5 alternatives and their key differentiators
3. A comparison table (features and pricing) for {app_name} vs. 2 likely competitors
4. A "/vs/competitor" page outline for the top competitor`,
      temperature: 0.65,
      maxTokens: 1100
    },

    templates: [
      {
        title: 'Positioning statement',
        content: `For [specific user type] who [has this specific problem],
[App name] is the [category: tool/platform/checklist/etc.]
that [primary differentiator/key benefit].

Unlike [main alternative],
[App name] [specific thing you do better or differently]
because [reason you're able to do this].`
      }
    ],

    tools: [
      { name: 'G2', url: 'https://g2.com', freeDetails: 'Free listing. Read your competitors\' 1-star reviews to understand what users hate about them — those are your positioning opportunities.' }
    ],

    doneCriteria: [
      'Competitive landscape documented (5+ alternatives)',
      'Positioning statement written',
      'Landing page updated to reflect positioning',
      '/vs/ comparison pages created for top 2 competitors'
    ],

    commonMistakes: [
      'Dishonest comparison pages. If a competitor beats you on a feature, say so. Users will find out anyway and an honest comparison builds more trust than a biased one.',
      'Positioning against the wrong competitor. Position against the alternative your users actually consider, not the one you wish they were choosing between.',
      'Never revisiting positioning. As your product evolves, your positioning should evolve too. Review every quarter.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 29: Pricing Optimization
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase4-29',
    phase: 4,
    phaseLabel: 'Scaling',
    tier: 'pro',
    title: 'Pricing Optimization',
    description:
      'After 50+ customers, you have enough data to run real pricing experiments. Optimizing pricing is often the highest-leverage revenue lever available to a solo developer.',
    timeEstimate: '3-5 hours',
    icon: '📈',
    category: 'Strategy',

    steps: [
      {
        title: 'Audit your current pricing against your customer data',
        description: 'Pull data: what plans do customers choose, what\'s your trial-to-paid conversion rate, where do people drop off in the purchase flow, how does churn vary by plan. This data tells you where to experiment.',
        subtasks: [
          { title: 'Calculate trial-to-paid conversion rate by traffic source', description: 'Organic, PH, direct, referral — which sources send users who convert best?' },
          { title: 'Calculate churn rate by plan', description: 'Higher-priced plans often have lower churn. Data may support raising prices.' }
        ]
      },
      {
        title: 'Run a price sensitivity test',
        description: 'Show different prices to new visitors on your pricing page (using feature flags or A/B testing) and measure conversion rate at each price point. Even a $5-$10 increase that maintains conversion rate is significant MRR growth.',
        subtasks: [
          { title: 'Use PostHog or a similar tool to A/B test pricing page', description: 'Two variants: current price and 20% higher price. Run for 30 days.' },
          { title: 'Measure: trial signups, trial-to-paid conversion, MRR per cohort', description: 'If higher price cohort converts at ≥ 80% of the rate of the lower price, raise the price.' }
        ]
      },
      {
        title: 'Add or refine your pricing tiers',
        description: 'If you have a single plan, consider adding a higher-tier "power user" plan (2-3x the price) with additional limits or features. 20-30% of your customers will upgrade to a higher tier if the value is clearly defined.',
        subtasks: [
          { title: 'Identify your power users (highest usage, longest tenure)', description: 'What are they using that basic users aren\'t? That\'s your higher tier value.' },
          { title: 'Design a higher tier with meaningful limits or features', description: 'Seat limits, API access, priority support, and advanced features are common higher-tier differentiators.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are a SaaS pricing consultant.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. A pricing audit checklist (metrics to check before any price changes)
2. A 3-tier pricing structure recommendation with feature differentiation
3. A price sensitivity survey (5 questions to send to users)
4. A pricing page copywriting guide (what to emphasize at each price point)`,
      temperature: 0.65,
      maxTokens: 1000
    },

    templates: [
      {
        title: 'Price sensitivity survey',
        content: `Subject: Quick question about [App name] pricing

Hi [name],

Quick 2-minute survey — I'm reviewing our pricing and want customer input.

1. At what monthly price would [App name] start to feel expensive? $___
2. At what monthly price would [App name] feel like a bargain? $___
3. What would make a $[higher price] plan worth it to you? [open text]
4. Which feature is most valuable to you? [list your top 3 features]
5. Which feature do you almost never use? [list your features]

Reply directly to this email with your answers — I read every response.

— [Your name]`
      }
    ],

    tools: [
      { name: 'ProfitWell', url: 'https://profitwell.com', freeDetails: 'Free: connects to Stripe and shows MRR, churn, LTV, and cohort data. Essential for pricing decisions.' }
    ],

    doneCriteria: [
      'Current pricing audited with data (conversion rate, churn by plan)',
      'Price sensitivity survey sent to 20+ customers',
      'A/B test running on pricing page (if enough traffic)',
      'Higher-tier plan designed (if applicable)',
      'Pricing changes implemented based on data'
    ],

    commonMistakes: [
      'Changing pricing based on gut feel. Pricing decisions without data are guesses. Run the survey and A/B test first.',
      'Grandfathering every customer forever. When you raise prices, it\'s reasonable to grandfather existing customers at their current rate for 6-12 months, then move them to the new price.',
      'Underpricing because of imposter syndrome. Charge what your product is worth, not what feels comfortable. If users pay without hesitation, your price is too low.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 30: Community Building
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase4-30',
    phase: 4,
    phaseLabel: 'Scaling',
    tier: 'pro',
    title: 'Community Building',
    description:
      'A product community (Discord, Slack, or Circle) turns your best users into a self-reinforcing network. Community members churn less, refer more, and provide ongoing product feedback.',
    timeEstimate: '4-6 hours',
    icon: '🏘️',
    category: 'Retention',

    steps: [
      {
        title: 'Decide if a community is right for your stage',
        description: 'A community needs a minimum viable activity level to feel alive. If you have fewer than 100 users, a community will feel empty and do more harm than good. Build the community when you have users who want to talk to each other, not just to you.',
        subtasks: [
          { title: 'Check: do users already try to connect with each other?', description: 'If users are tagging each other in your posts, DMing each other, or asking for a place to connect — that\'s the signal to build a community.' },
          { title: 'Choose your platform: Discord (best for real-time), Circle (best for async), or Slack', description: 'Discord is free and developer-friendly. Circle is $99/month but has better content organization.' }
        ]
      },
      {
        title: 'Set up the community structure',
        description: 'Start with 3-5 channels maximum. More channels kill engagement because conversation gets fragmented. Common channels: #introductions, #general, #feature-requests, #show-your-work, #help.',
        subtasks: [
          { title: 'Create the community and set up channels', description: 'Keep it to 5 channels max at launch. Add more only when channels get too noisy.' },
          { title: 'Write a welcome message and community norms', description: 'Clear norms reduce moderation burden. Post in #general and pin it.' },
          { title: 'Invite your top 20 users personally', description: 'The founding member cohort sets the tone. Invite people you know will engage, not just everyone.' }
        ]
      },
      {
        title: 'Seed activity and establish a weekly rhythm',
        description: 'An empty community drives people away. Post something every day for the first 2 weeks. Then establish a weekly rhythm: Monday motivation (tip or resource), Thursday product update, Friday wins/feedback roundup.',
        subtasks: [
          { title: 'Prepare 14 days of opening posts before launching', description: 'Questions, tips, polls, behind-the-scenes posts. Have them ready so you don\'t face a blank screen each morning.' },
          { title: 'Establish a weekly content schedule', description: 'Consistency creates habit. Members who expect something on Thursday will show up on Thursday.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are a community manager for a SaaS product community.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. A community structure recommendation (channels, rules, onboarding flow)
2. 14 days of community posts to seed engagement (questions, polls, tips, discussions)
3. A community welcome message (pinned in #general)
4. A weekly content calendar template (4 recurring post types)`,
      temperature: 0.72,
      maxTokens: 1100
    },

    templates: [
      {
        title: 'Community welcome message',
        content: `Welcome to the [App name] community 👋

This is the place for [target user type] to:
→ Get help with [App name]
→ Share what you're building
→ Give feedback on new features
→ Connect with other [target users]

**Channels:**
#introductions — tell us who you are
#general — questions, discussions, anything goes
#feature-requests — what you want built next
#show-your-work — share your wins
#help — technical questions

**One rule:** Be helpful. If someone asks a question you know the answer to, answer it.

Start here → introduce yourself in #introductions.

— [Your name], founder of [App name]`
      }
    ],

    tools: [
      { name: 'Discord', url: 'https://discord.com', freeDetails: 'Free forever. Developer-friendly, good for real-time chat. Best choice for developer tool communities.' },
      { name: 'Circle', url: 'https://circle.so', freeDetails: 'Free trial. $99/month after. Better for async, content-heavy communities. Integrates with email.' }
    ],

    doneCriteria: [
      'Community platform chosen and set up',
      '5 channels created (no more)',
      'Welcome message and community norms posted',
      'Top 20 users personally invited',
      '14 days of posts prepared',
      'Weekly content schedule established'
    ],

    commonMistakes: [
      'Launching a community too early. 50+ active users is the minimum. A community with 10 members feels empty and nobody comes back.',
      'Too many channels at launch. 10 channels with 5 members each = 0 activity in each channel. Start with 4-5 and let activity dictate when to add more.',
      'Not seeding activity yourself. You must post every day for the first month. Communities don\'t become self-sustaining without a period of founder-driven energy.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 31: Automation & Systems
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase4-31',
    phase: 4,
    phaseLabel: 'Scaling',
    tier: 'pro',
    title: 'Automation & Systems',
    description:
      'Document and automate the recurring work that consumes your time. Your goal as a solo developer is to work on the business, not in it — systems make that possible.',
    timeEstimate: '4-6 hours',
    icon: '🤖',
    category: 'Operations',

    steps: [
      {
        title: 'Audit your recurring tasks',
        description: 'List everything you do manually more than once: support responses, weekly review, social posting, changelog updates, billing management. Each recurring task is an automation opportunity.',
        subtasks: [
          { title: 'Log everything you do for 1 week in a simple text file', description: 'Every task, every context switch. You\'ll see patterns emerge.' },
          { title: 'Identify the 5 tasks that take the most time and happen most often', description: 'These are your automation priorities.' }
        ]
      },
      {
        title: 'Set up Zapier or Make automations for the top 3 time-wasters',
        description: 'Common automations: new signup → add to email list, new paying customer → DM thank-you on X, support ticket → create Notion task, new feedback form response → Slack notification. Each takes 15-30 minutes to set up and saves hours per month.',
        subtasks: [
          { title: 'Map out the trigger → action for each automation', description: 'Trigger: "new Stripe payment." Action: "add to ConvertKit paid subscribers list and send DM."' },
          { title: 'Build the top 3 automations in Zapier or Make', description: 'Start simple. Test each automation with real data before turning it on.' }
        ]
      },
      {
        title: 'Document your standard operating procedures',
        description: 'Write a 1-page SOP for each recurring task that can\'t be automated. This lets you outsource tasks to a VA later, and forces you to think systematically about how you do things.',
        subtasks: [
          { title: 'Write SOPs for: weekly review, support response, content publishing, release process', description: 'Each SOP: what triggers it, steps 1-N, how to know it\'s done.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are an operations specialist who helps solo founders systematize their work.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. A list of 10 common automation opportunities for a solo SaaS founder managing {app_name}
2. Step-by-step setup instructions for the top 3 automations (using Zapier or Make)
3. A SOP template for the weekly business review
4. A decision framework for "automate vs. delegate vs. eliminate"`,
      temperature: 0.65,
      maxTokens: 1000
    },

    templates: [
      {
        title: 'SOP template',
        content: `# SOP: [Task Name]

**Trigger:** [What causes this task to need doing]
**Frequency:** [Daily / Weekly / Per new user / etc.]
**Time required:** [X minutes]
**Owner:** [You / VA / Automated]

**Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Done when:** [How you know the task is complete]

**Notes:** [Edge cases, exceptions, or things to watch out for]`
      }
    ],

    tools: [
      { name: 'Zapier', url: 'https://zapier.com', freeDetails: 'Free: 5 zaps, 100 tasks/month. Enough for your most important automations. Connects 5,000+ apps.' },
      { name: 'Make (formerly Integromat)', url: 'https://make.com', freeDetails: 'Free: 1,000 operations/month. More powerful than Zapier for complex workflows. Steeper learning curve.' }
    ],

    doneCriteria: [
      '5 recurring tasks identified as automation candidates',
      '3 automations built and tested in Zapier or Make',
      'SOPs written for 4 recurring tasks',
      'Weekly time saved by automations measured'
    ],

    commonMistakes: [
      'Automating before understanding the process. Automate a task you understand completely. Automating a poorly understood process just makes the mess happen faster.',
      'Over-automating customer touchpoints. Automate the backend work. Keep customer communications human, especially at this stage.',
      'Not testing automations before they go live. A broken automation that sends 500 duplicate emails to customers is worse than no automation.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 32: Quarterly Review
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase4-32',
    phase: 4,
    phaseLabel: 'Scaling',
    tier: 'pro',
    title: 'Quarterly Review',
    description:
      'A 90-day business review puts your trajectory in perspective, forces strategic thinking, and gives you the data to make your next quarter more effective than your last.',
    timeEstimate: '4-6 hours',
    icon: '🗓️',
    category: 'Strategy',

    steps: [
      {
        title: 'Compile 90-day metrics',
        description: 'Pull 3 months of data from every source. You\'re looking for trends, not just snapshots. Is MRR growing month-over-month? Is churn trending up or down? Are CAC and LTV moving in the right direction?',
        subtasks: [
          { title: 'Pull revenue metrics: MRR, ARR, growth rate, churn rate, LTV', description: 'Use ProfitWell (connected to Stripe) or calculate manually from Stripe data.' },
          { title: 'Pull acquisition metrics: total signups, conversion rate, CAC by channel', description: 'Which channels improved? Which declined? Which new channels did you try?' },
          { title: 'Pull product metrics: activation rate, day-30 retention, feature usage', description: 'Are users getting more or less value from the product over time?' }
        ]
      },
      {
        title: 'Review your quarter-ago goals',
        description: 'Pull the 3 goals you set 90 days ago. Did you hit them? If not, why not? This is not about blame — it\'s about calibration. Understanding why you missed goals is more valuable than the goals themselves.',
        subtasks: [
          { title: 'Score each goal: hit, partial, missed', description: 'For missed goals: was it a bad goal (wrong metric), a bad plan (right metric, wrong strategy), or bad execution (right plan, not done)?' },
          { title: 'Identify the one decision that had the biggest positive impact this quarter', description: 'Double down on that decision pattern next quarter.' }
        ]
      },
      {
        title: 'Write your next-quarter plan',
        description: 'Set 3 goals for the next 90 days. Each goal should be: specific, measurable, and achievable based on your trajectory. Don\'t set aspirational goals — set goals you can hit with focused execution.',
        subtasks: [
          { title: 'Set 3 quarter goals with measurable targets and milestones', description: 'e.g., "Reach $5K MRR by June 30" with weekly milestones to track progress.' },
          { title: 'Identify the 3 highest-leverage activities to achieve those goals', description: 'What are the three things, if done consistently, that will make the biggest difference? Focus there.' },
          { title: 'Write and publish a quarterly retrospective', description: 'Honest, metrics-based. IH and X reward transparent reporting.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are a startup advisor helping an indie developer do their quarterly business review.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. A quarterly review template with all key metrics to collect and analyze
2. A goal-setting framework for the next quarter (3 goals, milestones, key activities)
3. A quarterly retrospective post template for Indie Hackers (honest, metrics-based)
4. A list of the 10 most important questions to answer in a quarterly review`,
      temperature: 0.65,
      maxTokens: 1000
    },

    templates: [
      {
        title: 'Quarterly retrospective post',
        content: `[App name] — Q[N] [Year] Review

**Revenue:**
- Starting MRR: $[X]
- Ending MRR: $[X]
- Growth: [X]%
- Churn: [X]%
- Paying customers: [X]

**Acquisition:**
- New signups: [X]
- Best channel: [channel] ([X] signups)
- CAC: $[X]
- Trial-to-paid: [X]%

**Product:**
- Features shipped: [X]
- Activation rate: [X]%
- Day-30 retention: [X]%

**Q[N] goals vs. results:**
- Goal 1: [X] → Result: [X] ✓/✗
- Goal 2: [X] → Result: [X] ✓/✗
- Goal 3: [X] → Result: [X] ✓/✗

**Biggest win:** [honest answer]
**Biggest mistake:** [honest answer]
**One thing I'd do differently:** [honest answer]

**Q[N+1] goals:**
1. [Goal with measurable target]
2. [Goal with measurable target]
3. [Goal with measurable target]`
      }
    ],

    tools: [
      { name: 'ProfitWell', url: 'https://profitwell.com', freeDetails: 'Free: connects to Stripe, shows MRR growth, churn, LTV cohorts, and expansion revenue. Essential for quarterly reviews.' }
    ],

    doneCriteria: [
      '90-day metrics compiled across all sources',
      'Previous quarter goals reviewed and scored',
      'Learnings documented from missed goals',
      'Next quarter goals written with measurable targets and weekly milestones',
      'Quarterly retrospective published on Indie Hackers'
    ],

    commonMistakes: [
      'Doing this review monthly instead of quarterly. Monthly is too frequent for meaningful trends. Quarterly gives you enough data to see real patterns.',
      'Setting goals without milestones. A quarterly goal without weekly milestones is just a wish. Break every goal into 12-13 weekly progress checks.',
      'Not publishing the retrospective. Accountability is a growth lever. Publishing forces you to be honest about numbers and attracts users who identify with your journey.'
    ]
  }
]
