/**
 * Phase 1: Pre-Launch Tasks (FREE tier)
 *
 * 5 tasks covering the foundation every indie developer needs before
 * they announce anything publicly. These unlock for all users.
 *
 * @type {import('./schema.js').TaskDefinition[]}
 */

export const phase1Tasks = [
  // ─────────────────────────────────────────────────────────────────────────
  // Task 1: Landing Page That Converts
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase1-1',
    phase: 1,
    phaseLabel: 'Pre-Launch',
    tier: 'free',
    title: 'Landing Page That Converts',
    description:
      'Build a focused landing page that explains what your app does in one sentence and gets visitors to sign up or buy. This is the single most important asset before you launch.',
    timeEstimate: '3-5 hours',
    icon: '🚀',
    category: 'Foundation',

    steps: [
      {
        title: 'Write your one-liner',
        description:
          'Before touching any design tool, nail the sentence that explains your app. Use the formula: "[App name] helps [target user] [achieve outcome] without [frustrating thing they currently deal with]." Test it: if a stranger can immediately understand who it\'s for and why it matters, you\'re good.',
        subtasks: [
          { title: 'Draft 5 one-liner variations', description: 'Don\'t stop at your first attempt — write at least five versions before choosing.' },
          { title: 'Get feedback from 2 non-technical people', description: 'Ask someone outside your field: "What does this app do?" Their confusion reveals your blind spots.' },
          { title: 'Lock in the winner', description: 'Pick the clearest version, not the cleverest one.' }
        ]
      },
      {
        title: 'Structure the page',
        description:
          'Use a proven layout that guides visitors from "I\'m curious" to "I\'ll try this." Every section has one job. Don\'t rearrange or add sections until you have real user data.',
        subtasks: [
          { title: 'Hero: headline + sub-headline + primary CTA', description: 'The headline is your one-liner. Sub-headline adds 1 sentence of context. CTA is one action (sign up, get access, buy now).' },
          { title: 'Problem: 3 bullet points of pain', description: 'Describe the frustrating situation your target user is in before they find you. Use their language, not yours.' },
          { title: 'Solution: how your app fixes it', description: 'Explain the mechanism, not the marketing. What does the app actually do?' },
          { title: 'Proof: screenshot, testimonial, or metric', description: 'If you have zero users, use a screenshot + your own story. If you have users, a single real quote beats 10 fake-looking testimonials.' },
          { title: 'Pricing + final CTA', description: 'Show your pricing tier or a clear next step. End with the same CTA as the hero so people don\'t have to scroll back up.' }
        ]
      },
      {
        title: 'Build it with Carrd or Tailwind',
        description:
          'Use Carrd if you want zero code — it\'s $19/year and you can be live in 2 hours. Use Tailwind + your own stack if you want full control and will maintain it. Don\'t over-engineer: your landing page is a sales tool, not a portfolio piece.',
        subtasks: [
          { title: 'Choose your tool and set up hosting', description: 'Carrd for speed, your own stack if you\'re already set up with Vercel/Netlify.' },
          { title: 'Build the 5-section structure', description: 'Follow the structure from Step 2 exactly. No extra sections yet.' },
          { title: 'Add your domain', description: 'A custom domain is not optional — it builds trust and is worth the $12/year.' },
          { title: 'Mobile-test before declaring done', description: 'Resize to 375px. If anything breaks or looks cramped, fix it before launch.' }
        ]
      },
      {
        title: 'Install analytics',
        description:
          'You need analytics from day one so you can see what\'s working. Plausible is the best default: lightweight, privacy-friendly, GDPR-compliant by default, and gives you the numbers that actually matter (visitors, referrers, top pages).',
        subtasks: [
          { title: 'Create a Plausible account (free 30-day trial)', description: 'plausible.io — no credit card required for the trial.' },
          { title: 'Add the tracking script to your page head', description: 'One line of HTML. Takes 2 minutes.' },
          { title: 'Verify data is flowing in the dashboard', description: 'Visit your own page, then check Plausible — you should see 1 visitor.' },
          { title: 'Set up a goal for your CTA click', description: 'Track when someone clicks your primary CTA so you know your conversion rate.' }
        ]
      },
      {
        title: 'Get feedback from 3 real people',
        description:
          'Share the live URL — not a screenshot, not a mockup — with 3 people who match your target user. Ask: "Would you know what to do next on this page?" Their answers tell you what to fix before you drive traffic.',
        subtasks: [
          { title: 'Find 3 people who match your target user', description: 'Not your best friend who will say it\'s great. Someone who has the problem you\'re solving.' },
          { title: 'Watch them navigate (or ask them to think aloud)', description: 'Don\'t explain anything — see what they understand on their own.' },
          { title: 'Fix the top 2 points of confusion', description: 'Don\'t try to address every piece of feedback. Fix the two things that confused everyone.' }
        ]
      }
    ],

    formFields: [
      {
        id: 'app_name',
        type: 'text',
        label: 'App name',
        placeholder: 'e.g., LaunchPilot',
        required: true
      },
      {
        id: 'app_description',
        type: 'textarea',
        label: 'What does your app do? (1-3 sentences)',
        placeholder: 'e.g., LaunchPilot is a 32-task launch checklist for indie developers. It guides you through pre-launch, launch week, and your first 30 days with step-by-step tasks and AI-generated copy.',
        required: true
      },
      {
        id: 'target_audience',
        type: 'textarea',
        label: 'Who is your target user?',
        placeholder: 'e.g., Indie developers who have built their first SaaS app and don\'t know how to get their first 10 paying customers.',
        required: true
      },
      {
        id: 'key_features',
        type: 'textarea',
        label: 'Top 3 features or benefits (one per line)',
        placeholder: 'Guided 32-task checklist organized by launch phase\nAI generates headlines, emails, and social posts\nStep-by-step walkthroughs with recommended tools',
        required: true
      }
    ],

    aiConfig: {
      promptTemplate: `You are a conversion copywriter who specializes in landing pages for developer tools.

App name: {app_name}
What it does: {app_description}
Target user: {target_audience}
Key features/benefits: {key_features}

Generate the following copy sections:

## 3 Headline Variations
Each headline should be clear, specific, and explain the core outcome. Avoid hype words. Format: one per line.

## Sub-headline (1 sentence)
Expands on the headline with one more specific detail about who it's for or how it works.

## Problem Section (3 bullets)
Three pain points your target user experiences before finding {app_name}. Use "you" language. Start each with a relatable situation, not a feature description.

## Solution Section (2-3 sentences)
How {app_name} solves those problems. Focus on the mechanism and outcome, not marketing language.

## Primary CTA Text (3 options)
Short, action-oriented. Should tell them exactly what happens when they click (e.g., "Start free trial" not "Get started").`,
      temperature: 0.7,
      maxTokens: 1200
    },

    templates: [
      {
        title: 'Headline formula pack',
        content: `[App name] helps [target user] [achieve outcome] without [frustrating thing].

"The [outcome] tool for [target user] who are tired of [pain point]."

"[Outcome] for [target user] — [key mechanism]."

"[Timeframe] to [outcome]. [App name] gives [target user] a step-by-step path from [starting state] to [end state]."`
      },
      {
        title: 'Hero sub-headline',
        content: `[App name] is a [category] for [target user] who want to [primary outcome] without [current frustrating approach]. Used by [X] developers to [specific result].`
      },
      {
        title: 'Problem section (3 bullets)',
        content: `You've built the product. Now what?
→ You don't know where to announce it or in what order
→ You write a tweet and get 3 likes — all from bots
→ You spend hours on copy that sounds like a press release no one asked for`
      },
      {
        title: 'Solution paragraph',
        content: `[App name] gives you a proven 32-task checklist organized by launch phase — pre-launch, launch week, first 30 days, and scaling. Each task has step-by-step instructions, recommended tools (with free tiers listed), and an AI that writes the copy for you. Follow the tasks in order and you'll go from "built it, now what?" to first paying customers.`
      }
    ],

    tools: [
      {
        name: 'Carrd.co',
        url: 'https://carrd.co',
        freeDetails: 'Free plan available (carrd.co domain). Pro plan is $19/year and adds custom domains and forms — worth it.'
      },
      {
        name: 'Plausible Analytics',
        url: 'https://plausible.io',
        freeDetails: '30-day free trial, no credit card. After that $9/month. Privacy-friendly, GDPR-compliant, no cookie banner needed.'
      },
      {
        name: 'Umami',
        url: 'https://umami.is',
        freeDetails: 'Open source, self-hostable for free. Cloud plan has a generous free tier. Good Plausible alternative.'
      }
    ],

    doneCriteria: [
      'Landing page is live at a custom domain (not a builder subdomain)',
      'All 5 sections are present: hero, problem, solution, proof, pricing/CTA',
      'Analytics script is installed and tracking at least 1 visit',
      'Primary CTA is tracked as a goal in analytics',
      'Page loads in under 3 seconds on mobile',
      '3 people from your target audience have seen it and you fixed their top 2 confusions'
    ],

    commonMistakes: [
      'Writing the headline for yourself, not your user. If you wouldn\'t Google those exact words, your user won\'t either. Use their language.',
      'Adding too many CTAs. One primary action per page. More options = more paralysis.',
      'Skipping the proof section. Even a single screenshot with your own story ("I built this because I had this problem") is better than nothing.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 2: Email Capture & Waitlist Setup
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase1-2',
    phase: 1,
    phaseLabel: 'Pre-Launch',
    tier: 'free',
    title: 'Email Capture & Waitlist Setup',
    description:
      'Your email list is the one distribution channel you actually own. Set up capture before you do any promotion — every visitor who doesn\'t sign up is gone forever.',
    timeEstimate: '2-3 hours',
    icon: '📧',
    category: 'Foundation',

    steps: [
      {
        title: 'Choose your email tool',
        description:
          'Buttondown is the default recommendation: developer-friendly, markdown-based, generous free tier (1,000 subscribers free), and it doesn\'t bury you in enterprise features you won\'t use for months. ConvertKit is good if you plan to sell via email heavily. Loops is built for SaaS products with transactional + marketing in one.',
        subtasks: [
          { title: 'Sign up for Buttondown (or your chosen tool)', description: 'Free up to 1,000 subscribers. No credit card required.' },
          { title: 'Verify your sending domain', description: 'Set up SPF/DKIM for your domain to prevent emails landing in spam. Your tool will guide you through this.' },
          { title: 'Set up your sender profile', description: 'Use your name + app name as the sender (e.g., "Marc from LaunchPilot"), not a generic "noreply@" address.' }
        ]
      },
      {
        title: 'Create a signup incentive',
        description:
          'People need a reason to hand over their email. Don\'t just say "Join the waitlist." Give them something immediately useful: early access, a discount, a useful resource, or exclusive updates. The incentive should be something you\'d want if you were the user.',
        subtasks: [
          { title: 'Define your incentive', description: 'Early access + 20% launch discount works for most products. A free resource (checklist, template) works if you can create it in < 1 hour.' },
          { title: 'Write the incentive copy for the signup form', description: 'Be specific: "Get early access + 30% off at launch" not "Join our community."' },
          { title: 'Create the resource (if applicable)', description: 'Keep it simple — a Notion doc or PDF that delivers real value. Don\'t spend more than 2 hours on it.' }
        ]
      },
      {
        title: 'Place signup forms in 3 locations',
        description:
          'One form is easy to miss. Put the form where users naturally pause: the hero section (highest-intent position), at the end of your problem/solution section (after you\'ve created desire), and in the footer (for people who scroll all the way down but didn\'t sign up).',
        subtasks: [
          { title: 'Hero section: above the fold', description: 'The primary form. Email input + CTA button. Keep it to one field — just email.' },
          { title: 'After proof section: mid-page form', description: 'After you\'ve shown social proof or explained the solution, add a second form.' },
          { title: 'Footer form', description: 'Last chance. Simple email input with a one-line incentive reminder.' }
        ]
      },
      {
        title: 'Write and automate your welcome email',
        description:
          'The welcome email sends automatically when someone signs up. It\'s the highest-open-rate email you\'ll ever send (50-80% open rates are normal here). Use it to: confirm their signup, deliver the incentive, tell a quick story about why you built this, and set expectations for what comes next.',
        subtasks: [
          { title: 'Write the welcome email', description: 'Subject line: "You\'re on the list — here\'s what happens next." Body: personal, 150-250 words max.' },
          { title: 'Attach or link the incentive', description: 'If you promised an early access code or resource, deliver it here.' },
          { title: 'Set up automation in your email tool', description: 'Configure the welcome email to send immediately after signup. Test it by signing up yourself.' }
        ]
      },
      {
        title: 'Pre-write your launch email sequence',
        description:
          'You don\'t need to send these now, but drafting them before launch removes a major source of launch-week stress. Write a minimum of 3: launch announcement (day 1), follow-up for non-openers (day 3), and early feedback request (day 5-7).',
        subtasks: [
          { title: 'Draft launch announcement email', description: 'The email you send when you go live. Lead with the problem, show the product, include a clear CTA with your launch offer.' },
          { title: 'Draft day-3 follow-up', description: 'For subscribers who opened but didn\'t click. New angle, new CTA.' },
          { title: 'Draft day-5 feedback email', description: 'Ask early users one specific question: "What was the first thing you tried?" or "What\'s the one thing missing?"' }
        ]
      }
    ],

    formFields: [
      {
        id: 'app_name',
        type: 'text',
        label: 'App name',
        placeholder: 'e.g., LaunchPilot',
        required: true
      },
      {
        id: 'app_description',
        type: 'textarea',
        label: 'What does your app do?',
        placeholder: 'Brief description of your app and who it\'s for.',
        required: true
      },
      {
        id: 'target_audience',
        type: 'textarea',
        label: 'Who is your target user?',
        placeholder: 'e.g., Indie developers shipping their first SaaS',
        required: true
      },
      {
        id: 'email_tool',
        type: 'select',
        label: 'Which email tool are you using?',
        placeholder: '',
        required: true,
        options: [
          { value: 'buttondown', label: 'Buttondown' },
          { value: 'convertkit', label: 'ConvertKit / Kit' },
          { value: 'loops', label: 'Loops.so' },
          { value: 'mailchimp', label: 'Mailchimp' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'signup_incentive',
        type: 'textarea',
        label: 'What\'s your signup incentive?',
        placeholder: 'e.g., Early access + 30% off at launch, plus a checklist of the 10 most important pre-launch tasks',
        required: true
      },
      {
        id: 'launch_date',
        type: 'text',
        label: 'Planned launch date (approximate is fine)',
        placeholder: 'e.g., March 15, 2025 or "in about 3 weeks"',
        required: false
      }
    ],

    aiConfig: {
      promptTemplate: `You are an email copywriter who specializes in early-stage SaaS products.

App name: {app_name}
What it does: {app_description}
Target user: {target_audience}
Email tool: {email_tool}
Signup incentive offered: {signup_incentive}
Planned launch date: {launch_date}

Write the following:

## Recommended Incentive (if the one listed above could be improved)
Suggest a stronger signup incentive if you can. Otherwise affirm the one provided.

## Welcome Email
Subject line + body. 150-250 words. Personal tone — not corporate. Structure: acknowledge signup, deliver incentive, brief story of why the app was built, what to expect next.

## 3 Subject Line Variations (for the welcome email)
Curiosity-driven, benefit-driven, and personal/story-driven. One per line.

## Launch Announcement Email (draft)
Subject line + body. For when the product goes live. Lead with the problem, show the solution, include a clear CTA. 200-300 words.`,
      temperature: 0.72,
      maxTokens: 1400
    },

    templates: [
      {
        title: 'Welcome email',
        content: `Subject: You're on the list — here's what happens next

Hey [first name or "there"],

You just signed up for early access to [App name] — thanks for trusting me with your inbox.

Here's what you signed up for: [brief one-sentence reminder of the incentive].

Quick context on why I built this: [2-3 sentences of your personal story — the problem you had, the thing you wished existed].

Here's what happens next:
→ I'll send updates as I get closer to launch
→ You'll get [specific incentive] when we go live on [launch date]
→ I'd love your feedback before then — reply to this email with your biggest challenge around [problem area]

Talk soon,
[Your name]
[App name]`
      },
      {
        title: 'Launch day email',
        content: `Subject: [App name] is live — your [X]% discount expires in 48 hours

Hey [first name],

[App name] is officially live.

You signed up [X weeks] ago because you wanted [outcome they care about]. Here's what you get:

→ [Feature 1]: [what it does for them]
→ [Feature 2]: [what it does for them]
→ [Feature 3]: [what it does for them]

As an early supporter, you get [X]% off — but only for the next 48 hours.

[CTA Button: Get early access — $XX/month]

Questions? Just reply. I read every email.

— [Your name]`
      },
      {
        title: 'Day-5 feedback email',
        content: `Subject: Quick question about [App name]

Hey [first name],

You signed up [X days] ago. I'm curious:

What's the #1 thing you wish [App name] did that it doesn't do yet?

Reply with whatever's on your mind — even "I haven't tried it yet" is useful feedback.

— [Your name]

P.S. If you haven't tried it yet, here's the link: [URL]`
      }
    ],

    tools: [
      {
        name: 'Buttondown',
        url: 'https://buttondown.email',
        freeDetails: 'Free up to 1,000 subscribers. Markdown-based, developer-friendly, built-in RSS-to-email. No credit card for free tier.'
      },
      {
        name: 'ConvertKit / Kit',
        url: 'https://kit.com',
        freeDetails: 'Free up to 10,000 subscribers. Powerful automations and sequences. Better choice if email marketing is central to your business.'
      },
      {
        name: 'Loops.so',
        url: 'https://loops.so',
        freeDetails: 'Built for SaaS — handles both transactional emails (account, billing) and marketing emails in one tool. Generous free tier.'
      }
    ],

    doneCriteria: [
      'Email tool is configured with your verified sending domain (SPF/DKIM set up)',
      'Signup form is live in at least 2 locations on your landing page',
      'Welcome email is automated and sends immediately on signup',
      'You tested the signup flow yourself and received the welcome email',
      'Launch announcement email is drafted (even if not scheduled)',
      'At least 1 real subscriber on your list (even if it\'s yourself)'
    ],

    commonMistakes: [
      'Using a "noreply@" sender address. People can\'t reply, and it tanks deliverability. Use your real email or a monitored alias.',
      'Asking for too much in the signup form. Just email. Every extra field (name, company, job title) reduces signups by 10-20%.',
      'Not testing the automation. Sign up with a personal email, check the welcome email landed in inbox (not spam), and verify the incentive is delivered.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 3: Social Media Pre-Launch
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase1-3',
    phase: 1,
    phaseLabel: 'Pre-Launch',
    tier: 'free',
    title: 'Social Media Pre-Launch',
    description:
      'Build an audience on 2 platforms max before you launch. The goal is not viral content — it\'s consistent presence so when launch day comes, people already know you.',
    timeEstimate: '3-4 hours',
    icon: '📣',
    category: 'Outreach',

    steps: [
      {
        title: 'Pick 2 platforms max',
        description:
          'More than 2 platforms pre-launch means you\'re spreading your time too thin. Pick the 2 where your target user actually spends time. X (Twitter) is still the best for developer tools and indie hacking. LinkedIn if your app targets professionals. Reddit if there\'s a specific community that already talks about your problem. YouTube if you want to build long-term authority.',
        subtasks: [
          { title: 'Identify where your target user hangs out', description: 'Check subreddits, LinkedIn groups, and X communities related to your problem space.' },
          { title: 'Pick your 2 platforms', description: 'Default: X + one of LinkedIn/Reddit. Commit — no switching mid-launch.' },
          { title: 'Set up or optimize profiles on both', description: 'Bio, profile photo, header image, link to your landing page.' }
        ]
      },
      {
        title: 'Optimize your profiles',
        description:
          'Your profile is the first thing people check after seeing a post they liked. It should answer: who are you, what are you building, why should I follow. Include your landing page URL. Use a real headshot — it outperforms logos for indie developers.',
        subtasks: [
          { title: 'Write a bio that mentions your app and the problem it solves', description: 'Under 160 characters. Clear > clever.' },
          { title: 'Pin a post about what you\'re building', description: 'Pin a "what I\'m building and why" thread or post so new visitors immediately see context.' },
          { title: 'Add your landing page URL everywhere it fits', description: 'Bio, header, pinned post.' }
        ]
      },
      {
        title: 'Build a 10-post content bank',
        description:
          'Batch 10 posts so you always have something to publish without staring at a blank screen. Mix: build-in-public updates (showing progress), problem-focused posts (educating about the pain you solve), and engagement posts (asking questions, sharing opinions). Schedule them out over 2 weeks.',
        subtasks: [
          { title: 'Write 3 build-in-public posts', description: 'Progress updates: screenshots, metrics, what you shipped this week.' },
          { title: 'Write 3 problem-focused posts', description: 'Educate your audience about the problem you solve. No product pitching.' },
          { title: 'Write 2 story posts', description: 'Why you built this, what failed, what you learned. These get the most engagement.' },
          { title: 'Write 2 engagement posts', description: 'Questions for your audience: "What\'s your biggest challenge with X?" Polls, hot takes, or controversial opinions in your space.' }
        ]
      },
      {
        title: 'Set up a daily 15-minute engagement routine',
        description:
          'Following alone doesn\'t build an audience. You need to reply and engage every day. Set a 15-minute timer and spend it replying to posts in your niche. Leave thoughtful replies — not "great post!" but actual additions to the conversation. This is how you get noticed by people who don\'t know you yet.',
        subtasks: [
          { title: 'Find 10 accounts in your niche to follow and engage with regularly', description: 'Other indie developers, writers in your problem space, accounts your target user follows.' },
          { title: 'Bookmark relevant hashtags or X lists', description: 'Makes it faster to find content to reply to during your daily routine.' },
          { title: 'Set a calendar reminder for daily engagement', description: '15 minutes every morning or evening. Consistency matters more than volume.' }
        ]
      },
      {
        title: 'Prepare launch day assets',
        description:
          'Create your launch announcement post, a short screen recording (60-90 seconds), and a simple graphic for each platform before launch day. Having these ready means you\'re not scrambling when the day comes.',
        subtasks: [
          { title: 'Write your launch announcement post', description: 'The post you\'ll publish on launch day. Draft it now, refine it later.' },
          { title: 'Record a 60-90 second screen recording', description: 'Show the product working. Use Loom or gifcap.dev. No voiceover required — just show it doing the key thing.' },
          { title: 'Create a simple graphic for each platform', description: 'A screenshot with your tagline overlaid. Use Figma, Canva, or even screenshots with iOS/Android framing.' }
        ]
      }
    ],

    formFields: [
      {
        id: 'app_name',
        type: 'text',
        label: 'App name',
        placeholder: 'e.g., LaunchPilot',
        required: true
      },
      {
        id: 'app_description',
        type: 'textarea',
        label: 'What does your app do?',
        placeholder: 'Brief description — what it is and who it\'s for.',
        required: true
      },
      {
        id: 'target_audience',
        type: 'textarea',
        label: 'Target audience',
        placeholder: 'e.g., Indie developers shipping their first SaaS product',
        required: true
      },
      {
        id: 'platforms',
        type: 'checkboxes',
        label: 'Which platforms are you targeting?',
        placeholder: '',
        required: true,
        options: [
          { value: 'twitter', label: 'X (Twitter)' },
          { value: 'linkedin', label: 'LinkedIn' },
          { value: 'reddit', label: 'Reddit' },
          { value: 'youtube', label: 'YouTube' },
          { value: 'bluesky', label: 'Bluesky' }
        ]
      },
      {
        id: 'app_url',
        type: 'text',
        label: 'Your app URL',
        placeholder: 'e.g., https://myapp.com',
        required: false
      }
    ],

    aiConfig: {
      promptTemplate: `You are a social media strategist who works with indie developers building in public.

App name: {app_name}
What it does: {app_description}
Target user: {target_audience}
Platforms: {platforms}
App URL: {app_url}

Generate the following:

## Optimized Bio
One bio that works across all selected platforms. Under 160 characters. Clear, specific, includes what you're building and who it's for.

## 5 Pre-Launch Posts
Mix of build-in-public (showing progress), problem-focused (educating about the pain), and story (why you built this). Format each with a platform label (X, LinkedIn, etc.) and the post text. Keep X posts under 280 characters, LinkedIn can be longer.

## Daily Engagement Routine (5 steps)
Concrete daily actions for each platform selected. Under 15 minutes total.

## Launch Day Post
The announcement post for each platform. Should create excitement without overhyping. Include the URL.`,
      temperature: 0.75,
      maxTokens: 1400
    },

    templates: [
      {
        title: 'Build-in-public post',
        content: `Day [X] of building [App name]:

→ Shipped: [specific feature or milestone]
→ Broke: [something that went wrong — be honest]
→ Next: [what you're working on tomorrow]

[Screenshot or GIF]

Building this because [one sentence of personal motivation]. DM me if you're solving the same problem.`
      },
      {
        title: 'Problem post (no product pitch)',
        content: `Most [target users] struggle with [specific problem].

The typical approach is [current workaround]. It works, but:

→ [Frustration 1]
→ [Frustration 2]
→ [Frustration 3]

There's a better way — I'll show you what it is this week.`
      },
      {
        title: 'Engagement post',
        content: `Quick question for [target users]:

What's the #1 thing that slows you down when [doing the thing your app helps with]?

I'm building something to fix [specific problem] and want to make sure I'm solving the right pain point.

Reply with your answer — even "this isn't a problem for me" is useful.`
      }
    ],

    tools: [
      {
        name: 'Buffer',
        url: 'https://buffer.com',
        freeDetails: 'Free plan: 3 social channels, 10 scheduled posts per channel. Enough for pre-launch. Paid plans start at $6/month.'
      },
      {
        name: 'Loom',
        url: 'https://loom.com',
        freeDetails: 'Free plan: unlimited videos, up to 5 minutes each. Perfect for product demos and build-in-public screen recordings.'
      },
      {
        name: 'gifcap.dev',
        url: 'https://gifcap.dev',
        freeDetails: 'Free, browser-based GIF recorder. No install needed. Great for short product demos that auto-play in feeds.'
      }
    ],

    doneCriteria: [
      'Profiles set up on exactly 2 platforms with bio, headshot, and app URL',
      '10 posts drafted and at least 5 scheduled or published',
      'Pinned post on each profile explaining what you\'re building',
      'Daily 15-minute engagement routine is in your calendar',
      'Launch announcement post drafted and saved',
      'Screen recording (60-90 seconds) of the product is done'
    ],

    commonMistakes: [
      'Posting and ghosting — you post once, get 2 likes, and conclude "social doesn\'t work." Consistency over 4+ weeks is what builds traction. Most people quit before it clicks.',
      'Picking 3-4 platforms. You\'ll burn out and do none of them well. Two is the max for a solo developer in pre-launch.',
      'Only posting product updates. Mix in problem-focused content and personal stories. People follow people, not products.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 4: Product Hunt / IH / HN Launch Prep
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase1-4',
    phase: 1,
    phaseLabel: 'Pre-Launch',
    tier: 'free',
    title: 'Product Hunt / IH / HN Launch Prep',
    description:
      'A coordinated launch across Product Hunt, Indie Hackers, and Hacker News can drive hundreds of signups in one day — but only if you prepare the assets and timing in advance.',
    timeEstimate: '4-6 hours',
    icon: '🎯',
    category: 'Outreach',

    steps: [
      {
        title: 'Prepare your Product Hunt listing',
        description:
          'Product Hunt rewards quality submissions, not just activity. A complete listing with a strong tagline, gallery images, and a well-written description gets featured and rises in rankings. Do this prep work 1-2 weeks before your target launch date.',
        subtasks: [
          { title: 'Create or update your PH maker profile', description: 'Add a real headshot, bio, and link to your personal site. People upvote makers they trust.' },
          { title: 'Write a tagline (max 60 characters)', description: 'The hardest part. It must fit in 60 chars and explain the value. No buzzwords. Test 5 variations.' },
          { title: 'Write the PH description (200-300 words)', description: 'Problem → solution → who it\'s for → what makes it different. Not a press release.' },
          { title: 'Create gallery images (5-8 recommended)', description: 'Screenshot 1: the "hero" moment. Screenshots 2-5: key features. Last image: pricing. 1270x760px recommended.' },
          { title: 'Write your maker comment (post it as first comment at launch)', description: 'The first comment on your PH listing is prime real estate. Tell your founding story in 150-200 words.' }
        ]
      },
      {
        title: 'Prepare your Indie Hackers post',
        description:
          'Indie Hackers is a community of bootstrappers who value honesty and metrics. A "Show IH" post gets you feedback from your peers and often drives early signups from fellow founders who become your first power users.',
        subtasks: [
          { title: 'Write a "Show IH" post', description: 'Format: what you built, why, how long it took, early results, what you need help with. Be honest about revenue (even if $0).' },
          { title: 'Post in the correct group', description: 'Use the "Products" section. Tag your post with relevant categories.' },
          { title: 'Prepare 3 specific questions for the community', description: 'IH loves to help when you ask specific questions. "Does the landing page copy make sense?" is better than "What do you think?"' }
        ]
      },
      {
        title: 'Prepare your Hacker News submission',
        description:
          'HN\'s "Show HN" is the most technical audience you\'ll reach. They expect depth, hate hype, and will pick apart technical claims. But a successful Show HN can drive thousands of visitors and your ideal early-adopter engineers.',
        subtasks: [
          { title: 'Write your Show HN title', description: 'Format: "Show HN: [App name] – [plain English description, max 80 chars]". No exclamation marks, no "revolutionary", no "AI-powered" unless it\'s genuinely the point.' },
          { title: 'Prepare your first comment for the thread', description: 'A 200-300 word technical deep-dive: how you built it, interesting technical decisions, stack, current state, what you\'re looking for. This gets pinned as the first response.' },
          { title: 'Create an HN account if you don\'t have one', description: 'HN has karma requirements. If your account is new, you\'ll need to comment on other posts first to build up karma.' }
        ]
      },
      {
        title: 'Identify and prepare secondary platforms',
        description:
          'Beyond the big three, there are smaller communities where your specific audience hangs out. Submit to 2-3 of these before your main launch for early traffic and backlinks that help SEO.',
        subtasks: [
          { title: 'Submit to BetaList (takes 2-4 weeks to review)', description: 'Free listing. Do this 3-4 weeks before launch since there\'s a review queue.' },
          { title: 'Find relevant subreddits and post a "built this" post', description: 'r/sideprojects, r/SaaS, r/webdev, plus any niche subreddits for your problem space.' },
          { title: 'Submit to relevant newsletters for devs', description: 'Changelog Weekly, Pointer, TLDR Newsletter. Most accept free submissions.' }
        ]
      },
      {
        title: 'Write your launch day schedule',
        description:
          'Launch day feels chaotic without a plan. Write a minute-by-minute schedule for the first 6 hours. Product Hunt listings go live at 12:01 AM PST — decide if you\'ll stay up to post at midnight or if you\'ll post in the morning and accept a late start.',
        subtasks: [
          { title: 'Choose your PH launch day (Mon-Thu work best)', description: 'Avoid Fridays (lower traffic) and major holidays. Tuesday-Wednesday tend to have highest competition AND highest traffic.' },
          { title: 'Schedule outreach messages to your email list and social followers', description: 'Draft the messages now, schedule them for launch day so you don\'t forget in the chaos.' },
          { title: 'Write a minute-by-minute plan for the first 4 hours', description: '12:01 AM: post to PH. 6 AM: email your list. 7 AM: post on X. 8 AM: post on LinkedIn. 9 AM: IH and HN.' }
        ]
      }
    ],

    formFields: [
      {
        id: 'app_name',
        type: 'text',
        label: 'App name',
        placeholder: 'e.g., LaunchPilot',
        required: true
      },
      {
        id: 'app_description',
        type: 'textarea',
        label: 'What does your app do?',
        placeholder: 'Brief description of your app and who it\'s for.',
        required: true
      },
      {
        id: 'target_audience',
        type: 'textarea',
        label: 'Target audience',
        placeholder: 'e.g., Indie developers shipping their first SaaS',
        required: true
      },
      {
        id: 'launch_day',
        type: 'select',
        label: 'Target Product Hunt launch day',
        placeholder: '',
        required: true,
        options: [
          { value: 'monday', label: 'Monday' },
          { value: 'tuesday', label: 'Tuesday' },
          { value: 'wednesday', label: 'Wednesday' },
          { value: 'thursday', label: 'Thursday' }
        ]
      },
      {
        id: 'launch_story',
        type: 'textarea',
        label: 'Why did you build this? (Your founding story)',
        placeholder: 'What problem did you personally have? How long did you build for? What makes you the right person to build this?',
        required: true
      },
      {
        id: 'ph_tagline',
        type: 'text',
        label: 'Draft Product Hunt tagline (max 60 characters)',
        placeholder: 'e.g., 32-task launch playbook for indie developers',
        required: false
      }
    ],

    aiConfig: {
      promptTemplate: `You are a launch copywriter who has helped dozens of indie developers ship on Product Hunt, Indie Hackers, and Hacker News.

App name: {app_name}
What it does: {app_description}
Target user: {target_audience}
Launch day: {launch_day}
Founding story: {launch_story}
Draft PH tagline: {ph_tagline}

Generate the following:

## Product Hunt Tagline Options (5 variations, each under 60 characters)
No buzzwords. No "revolutionary". Clear and specific about the outcome.

## Product Hunt Description (250 words)
Problem → what {app_name} does → who it's for → what makes it different. Avoid hype language.

## Product Hunt Maker Comment (200 words)
First-person founding story. Honest, specific, and ends with a call to try the product.

## Show IH Post (300 words)
Title + body. Honest about the current state (revenue, users). Asks 2 specific questions for the community.

## Show HN Title + First Comment
Title: "Show HN: {app_name} – [plain description under 80 chars]"
Comment: 200 words. Technical depth. Stack, interesting decisions, current state, what you're looking for.`,
      temperature: 0.7,
      maxTokens: 1600
    },

    templates: [
      {
        title: 'Product Hunt maker comment',
        content: `Hey PH! I'm [name], the maker of [App name].

I built this because [specific personal pain point — 1-2 sentences of your story].

After [X months] of building, here's what [App name] actually does:
→ [Feature 1]: [what it means for the user]
→ [Feature 2]: [what it means for the user]
→ [Feature 3]: [what it means for the user]

Currently in [early access / beta / v1.0]. [X] people are already using it to [outcome].

I'd love feedback on [specific thing you want input on]. What's the first thing you'd try?

Happy to answer any questions — I'll be here all day.`
      },
      {
        title: '"Show IH" post',
        content: `Show IH: I built [App name] — [one-line description]

After [timeframe], I launched [App name] to solve [problem I had].

**What it does:** [2-3 sentences]

**The numbers so far:**
- [Metric 1]: [number]
- [Metric 2]: [number]
- Revenue: $[amount] (being honest here)

**What I got right:** [1-2 things]

**What I got wrong:** [1-2 honest mistakes]

**What I need help with:**
1. [Specific question 1]
2. [Specific question 2]

Would love feedback from anyone who's solved a similar problem.`
      },
      {
        title: 'Show HN first comment',
        content: `Hi HN. I built [App name] because [specific problem I had].

**Technical stack:** [your stack]

**Interesting technical decisions:**
- [Decision 1]: [why you made it]
- [Decision 2]: [why you made it]

**Current state:** [honest description — is it production-ready? Beta? MVP?]

**What I'm looking for:** Feedback on [specific thing], especially from people who [relevant background].

Happy to answer any technical questions.`
      }
    ],

    tools: [
      {
        name: 'Product Hunt',
        url: 'https://producthunt.com',
        freeDetails: 'Free to list. Create a maker account and start building karma by upvoting and commenting on other products at least 2 weeks before your launch.'
      },
      {
        name: 'Indie Hackers',
        url: 'https://indiehackers.com',
        freeDetails: 'Free community. Post in the Products section for "Show IH" style posts. Very supportive community for bootstrappers.'
      },
      {
        name: 'Hacker News',
        url: 'https://news.ycombinator.com',
        freeDetails: 'Free. Use "Show HN:" prefix in your title for product launches. Technical audience — be specific and avoid marketing language.'
      },
      {
        name: 'BetaList',
        url: 'https://betalist.com',
        freeDetails: 'Free listing (with 2-4 week wait) or $129 for immediate listing. Good for early-adopter traffic before your main launch.'
      }
    ],

    doneCriteria: [
      'Product Hunt maker profile is complete with real headshot and bio',
      'PH tagline written and under 60 characters',
      'PH gallery images created (at least 4)',
      'PH description and maker comment drafted',
      'Show IH post drafted',
      'Show HN title and first comment drafted',
      'BetaList submission sent (or scheduled)',
      'Launch day schedule written with minute-by-minute plan for first 4 hours'
    ],

    commonMistakes: [
      'Launching on a Friday or weekend. Product Hunt traffic peaks Monday-Wednesday. Launching Friday means competing with the same products on a day with 40% less traffic.',
      'Asking friends to upvote on Product Hunt. PH\'s algorithm detects coordinated upvoting from new accounts and downranks you. Ask people who genuinely use the product.',
      'Writing a PH description that sounds like a press release. The PH audience is savvy and reacts badly to corporate language. Be direct, specific, and honest about what the product is and isn\'t.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 5: Analytics & Feedback Setup
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase1-5',
    phase: 1,
    phaseLabel: 'Pre-Launch',
    tier: 'free',
    title: 'Analytics & Feedback Setup',
    description:
      'Without data, you\'re flying blind. Set up web analytics, product event tracking, a feedback loop, and uptime monitoring before you drive any traffic.',
    timeEstimate: '3-5 hours',
    icon: '📊',
    category: 'Foundation',

    steps: [
      {
        title: 'Install web analytics (Plausible)',
        description:
          'Plausible gives you the metrics that actually matter — visitors, sources, top pages, and goal conversions — without the GDPR complexity of Google Analytics. One script tag, no cookies, no consent banner needed.',
        subtasks: [
          { title: 'Create Plausible account and add your domain', description: 'plausible.io — 30-day free trial, no credit card.' },
          { title: 'Add the tracking script to your site\'s <head>', description: 'One line of HTML. Works with any stack.' },
          { title: 'Set up 2-3 custom goals', description: 'Track: CTA button click, signup form submission, pricing page visit. These are the conversions that matter.' },
          { title: 'Verify data is flowing', description: 'Visit your own site, check Plausible dashboard, confirm your visit appears.' }
        ]
      },
      {
        title: 'Install product analytics (PostHog)',
        description:
          'PostHog tracks what users do inside your app — not just that they visited, but that they clicked the button, completed onboarding, or hit an error. The free tier is generous (1M events/month). You need 5 core events tracked from day one.',
        subtasks: [
          { title: 'Create PostHog account and install the SDK', description: 'posthog.com — free up to 1M events/month. Install via npm or script tag.' },
          { title: 'Track "user signed up" event', description: 'Fire this immediately after successful account creation.' },
          { title: 'Track "user completed onboarding" event', description: 'Fire when user finishes your onboarding flow.' },
          { title: 'Track your core "aha moment" event', description: 'The action that shows a user got value — e.g., "task completed", "report generated", "file exported".' },
          { title: 'Track "user hit paywall" and "subscription started" events', description: 'Essential for measuring conversion funnel.' }
        ]
      },
      {
        title: 'Set up a feedback collection form',
        description:
          'You need a way to collect structured feedback without building anything. Tally.so is the best free option: unlimited forms, unlimited responses, embeds cleanly, connects to Notion or email. Build a 3-question form that takes users 60 seconds to complete.',
        subtasks: [
          { title: 'Create a Tally.so account', description: 'Free tier: unlimited forms and responses. No credit card.' },
          { title: 'Build a 3-question feedback form', description: 'Q1: What made you sign up? Q2: What\'s the #1 thing missing? Q3: How would you rate your experience (1-5)? Add an optional open-text field.' },
          { title: 'Embed the form or link to it from your app', description: 'Add a "Give feedback" link in your dashboard header or footer. Make it easy to find.' }
        ]
      },
      {
        title: 'Create your launch dashboard',
        description:
          'Build a simple spreadsheet to track the 5-7 metrics you\'ll monitor daily during launch week. Having a pre-built dashboard means you spend launch day watching numbers, not building a spreadsheet.',
        subtasks: [
          { title: 'Create a Google Sheet or Notion database', description: 'One row per day. Columns: date, visitors, signups, conversion rate, revenue, active users, feedback count.' },
          { title: 'Add Week 1 targets vs. Month 1 targets', description: 'Set realistic targets before launch so you have context for your actual numbers.' },
          { title: 'Share the dashboard URL with yourself (bookmark it)', description: 'You\'ll be checking this multiple times a day during launch week.' }
        ]
      },
      {
        title: 'Set up uptime monitoring and error tracking',
        description:
          'Your app going down during launch is a nightmare. BetterStack monitors your URL and alerts you (SMS/email) within 30 seconds of downtime. Sentry catches JavaScript errors in production before users report them.',
        subtasks: [
          { title: 'Create BetterStack account and add your domain', description: 'betterstack.com — free plan monitors every 3 minutes, sends email/SMS on downtime. Good enough for launch.' },
          { title: 'Install Sentry in your app', description: 'sentry.io — free for small projects. 5 minutes to install, catches unhandled errors and sends you an email immediately.' },
          { title: 'Test both: take your site down, verify alerts fire', description: 'Don\'t discover the alerts don\'t work during a real outage. Test by temporarily breaking something.' }
        ]
      }
    ],

    formFields: [
      {
        id: 'app_name',
        type: 'text',
        label: 'App name',
        placeholder: 'e.g., LaunchPilot',
        required: true
      },
      {
        id: 'app_description',
        type: 'textarea',
        label: 'What does your app do?',
        placeholder: 'Brief description of your app and its core functionality.',
        required: true
      },
      {
        id: 'target_audience',
        type: 'textarea',
        label: 'Target audience',
        placeholder: 'e.g., Indie developers shipping their first SaaS',
        required: true
      },
      {
        id: 'analytics_tool',
        type: 'select',
        label: 'Web analytics tool',
        placeholder: '',
        required: true,
        options: [
          { value: 'plausible', label: 'Plausible Analytics' },
          { value: 'umami', label: 'Umami' },
          { value: 'posthog', label: 'PostHog (analytics + product)' },
          { value: 'ga4', label: 'Google Analytics 4' }
        ]
      },
      {
        id: 'tech_stack',
        type: 'text',
        label: 'Your tech stack',
        placeholder: 'e.g., Vue 3 + Supabase + Netlify Functions',
        required: false
      }
    ],

    aiConfig: {
      promptTemplate: `You are a developer-focused analytics consultant helping indie developers set up their first measurement stack.

App name: {app_name}
What it does: {app_description}
Target user: {target_audience}
Analytics tool chosen: {analytics_tool}
Tech stack: {tech_stack}

Generate the following:

## 5 Custom Product Events to Track
Based on what {app_name} does, define 5 PostHog events that will give the most insight into user behavior and product-market fit. For each event: event name (snake_case), when it fires, and what it tells you.

## Week 1 vs. Month 1 Key Metrics
Two columns: what to measure in week 1 (leading indicators), what to measure in month 1 (outcome indicators). 5 metrics in each column specific to {app_name}.

## Feedback Form Questions (personalized)
3 survey questions for {app_name} users that will surface the most actionable insights. Questions should be specific to the product, not generic.

## Weekly Review Template
A bullet-point template for a 30-minute weekly review: what metrics to check, what questions to ask, what decisions to make.`,
      temperature: 0.65,
      maxTokens: 1400
    },

    templates: [
      {
        title: 'Launch dashboard headers',
        content: `DATE | VISITORS | SIGNUPS | SIGNUP RATE | REVENUE | ACTIVE USERS | FEEDBACK COUNT | NOTES

Targets:
- Week 1 visitors: [X]
- Week 1 signups: [X]
- Week 1 signup rate: [X]%
- Week 1 revenue: $[X]
- Month 1 visitors: [X]
- Month 1 signups: [X]
- Month 1 MRR: $[X]`
      },
      {
        title: 'Feedback form questions',
        content: `1. What made you sign up for [App name]? (Multiple choice: saw it on Product Hunt / Hacker News / Twitter / Friend recommended it / Google search / Other)

2. What's the #1 feature or improvement you wish [App name] had? (Open text)

3. How would you rate your experience so far? (1-5 scale: 1 = Disappointed, 5 = Exactly what I needed)

4. (Optional) Anything else you want to tell us? (Open text)`
      },
      {
        title: 'Weekly review template',
        content: `## Weekly Review — Week of [DATE]

### Numbers
- Visitors this week: [X] (vs. last week: [X])
- New signups: [X] (conversion rate: [X]%)
- Revenue: $[X] MRR (change: +$[X])
- Active users: [X] (% of total signups: [X]%)
- Feedback responses: [X]

### What's working
- [Metric or channel that exceeded expectations]

### What's not
- [Metric or channel below target]

### Top 3 feedback themes
1. [Theme]
2. [Theme]
3. [Theme]

### Decision for next week
- [One concrete change to make based on the data]`
      }
    ],

    tools: [
      {
        name: 'Plausible Analytics',
        url: 'https://plausible.io',
        freeDetails: '30-day free trial, no credit card. $9/month after. Privacy-friendly, no cookies, no GDPR consent banner required.'
      },
      {
        name: 'PostHog',
        url: 'https://posthog.com',
        freeDetails: 'Free up to 1M events/month. Session recording, feature flags, A/B testing — all included. Self-hostable for free if you prefer.'
      },
      {
        name: 'Tally.so',
        url: 'https://tally.so',
        freeDetails: 'Free plan: unlimited forms, unlimited responses. Embeds cleanly, connects to Notion and Slack. No per-response pricing.'
      },
      {
        name: 'BetterStack',
        url: 'https://betterstack.com',
        freeDetails: 'Free plan: 10 monitors, 3-minute check intervals, email and Slack alerts. Enough for launch monitoring.'
      },
      {
        name: 'Sentry',
        url: 'https://sentry.io',
        freeDetails: 'Free for small projects (5K errors/month). Catches JavaScript errors in production and emails you immediately. 5-minute install.'
      }
    ],

    doneCriteria: [
      'Web analytics installed and tracking at least 1 visit',
      'At least 2 conversion goals set up in web analytics (CTA click, signup)',
      'PostHog (or equivalent) installed with at least 5 custom events defined',
      'Feedback form is live and linked from your app or landing page',
      'Launch dashboard spreadsheet created with daily metric columns and targets',
      'BetterStack (or equivalent) monitoring your app URL with email/SMS alerts configured',
      'Sentry (or equivalent) installed and receiving error reports',
      'You tested all monitoring by triggering a fake alert'
    ],

    commonMistakes: [
      'Installing analytics but never checking it. Set a calendar reminder for a 20-minute weekly review. Data you don\'t act on is worthless.',
      'Tracking too many events. Pick the 5 that tell you if users are getting value. More events = more noise = harder to find signal.',
      'Skipping error tracking. You will have JavaScript errors in production on launch day. Sentry tells you about them before users report them.'
    ]
  }
]
