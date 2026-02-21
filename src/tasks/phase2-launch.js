/**
 * Phase 2: Launch Week Tasks (LAUNCHER tier)
 *
 * 7 tasks covering the first 7 days after going live.
 * This is where the pre-launch work pays off — execute the plan, respond fast,
 * and convert early attention into real users.
 *
 * @type {import('./schema.js').TaskDefinition[]}
 */

export const phase2Tasks = [
  // ─────────────────────────────────────────────────────────────────────────
  // Task 6: Launch Day Execution Playbook
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase2-6',
    phase: 2,
    phaseLabel: 'Launch Week',
    tier: 'launcher',
    title: 'Launch Day Execution Playbook',
    description:
      'Launch day is chaotic. Running it without a playbook means missing your best 6-hour window of attention. This task turns your launch into a repeatable, executed sequence.',
    timeEstimate: '1 day',
    icon: '🏁',
    category: 'Launch',

    steps: [
      {
        title: 'Launch on Product Hunt at 12:01 AM PST',
        description:
          'PH rankings reset at midnight PST. Posts that go live early get more time to accumulate upvotes. If you can\'t stay up, schedule it or have someone post it for you. Immediately post your maker comment as the first reply.',
        subtasks: [
          { title: 'Post to Product Hunt at 12:01 AM PST', description: 'Use the pre-written listing from Task 4. Post the maker comment immediately as the first reply.' },
          { title: 'Share to your email list at 6 AM', description: 'Send the launch announcement email drafted in Task 2. Include a direct PH upvote link.' },
          { title: 'Post on X and LinkedIn at 7-8 AM', description: 'Use the launch day posts drafted in Task 3. Pin the X post.' }
        ]
      },
      {
        title: 'Submit to Hacker News and Indie Hackers',
        description:
          'Post "Show HN" at HN\'s peak traffic time (9 AM-12 PM EST on weekdays). Post "Show IH" on Indie Hackers. Monitor both threads and reply to every comment within the hour for the first 4 hours.',
        subtasks: [
          { title: 'Submit Show HN at 9-10 AM EST', description: 'Use the title and first comment drafted in Task 4. Monitor and reply immediately.' },
          { title: 'Post Show IH on Indie Hackers', description: 'Use the post drafted in Task 4. Check notifications every hour.' }
        ]
      },
      {
        title: 'Respond to every comment and message',
        description:
          'On launch day, your one job is to respond. Every comment on PH, HN, IH, and your social posts deserves a reply. People upvote products where the maker is present and responsive. Set everything else aside.',
        subtasks: [
          { title: 'Check PH, HN, IH every 30 minutes for the first 6 hours', description: 'Set a phone timer. Don\'t rely on notifications alone.' },
          { title: 'Reply to every comment thoughtfully', description: 'Not just "thanks!" — add context, answer questions, engage genuinely.' },
          { title: 'DM people who upvote on PH and thank them', description: 'A personal thank-you converts passive supporters into active ones.' }
        ]
      },
      {
        title: 'Monitor your metrics dashboard',
        description:
          'Keep your launch dashboard spreadsheet open all day. Check analytics every hour. If a traffic source is clearly outperforming (e.g., HN is driving 3x more than PH), double down on engagement there.',
        subtasks: [
          { title: 'Log hourly metrics in your dashboard', description: 'Visitors, signups, revenue — every hour for the first 8 hours.' },
          { title: 'Identify the top traffic source by hour 4', description: 'Focus energy on wherever the most engaged visitors are coming from.' }
        ]
      },
      {
        title: 'End-of-day wrap-up post',
        description:
          'Write a short "day 1 results" post on X and IH. Share your numbers honestly. This transparency performs well with developer audiences and drives a second wave of engagement the next morning.',
        subtasks: [
          { title: 'Write a launch day results post with real numbers', description: 'Visitors, signups, upvotes, revenue. Honest numbers outperform self-promotion.' },
          { title: 'Thank everyone who helped', description: 'Name specific communities or individuals who drove traffic.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'e.g., LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description.', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true },
      { id: 'launch_date', type: 'text', label: 'Launch date', placeholder: 'e.g., March 15, 2025', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are a launch strategist for indie developers.

App: {app_name}
Description: {app_description}
Target user: {target_audience}
Launch date: {launch_date}

Generate:
1. A minute-by-minute launch day schedule (12 AM PST to 6 PM)
2. A launch announcement email subject + body (200 words)
3. Three social posts for launch day: X, LinkedIn, Reddit
4. A "day 1 results" post template for after launch`,
      temperature: 0.7,
      maxTokens: 1200
    },

    templates: [
      {
        title: 'Launch day schedule',
        content: `12:01 AM PST: Post to Product Hunt + post maker comment immediately
06:00 AM: Send launch email to full list
07:00 AM: Post on X (pin it)
08:00 AM: Post on LinkedIn
09:00 AM: Submit Show HN
09:30 AM: Post Show IH
10:00 AM – 4:00 PM: Monitor and reply to EVERY comment
04:00 PM: Share mid-day results on X
End of day: Write and post day-1 results thread`
      },
      {
        title: 'Day-1 results post',
        content: `Day 1 of [App name] launch:

→ Visitors: [X]
→ Signups: [X] ([X]% conversion)
→ Revenue: $[X]
→ PH rank: #[X]
→ HN points: [X]

What worked: [honest 1-2 sentences]
What didn't: [honest 1-2 sentences]

Day 2 starts now.`
      }
    ],

    tools: [
      { name: 'Product Hunt', url: 'https://producthunt.com', freeDetails: 'Free to list. Peak traffic 9 AM–5 PM PST.' },
      { name: 'Hacker News', url: 'https://news.ycombinator.com', freeDetails: 'Free. Submit Show HN between 9-11 AM EST weekdays for best visibility.' }
    ],

    doneCriteria: [
      'Product listing live on PH by 12:01 AM PST',
      'Email sent to full list by 6 AM',
      'Show HN and Show IH submitted',
      'All comments replied to within 2 hours of posting',
      'Hourly metrics logged in dashboard',
      'Day-1 results post published by end of day'
    ],

    commonMistakes: [
      'Launching and disappearing — leaving comments unanswered for hours tanks your PH ranking. Stay available all day.',
      'Not emailing your list. Your email list is your highest-intent audience. If you don\'t email them on launch day, you\'ve wasted pre-launch effort.',
      'Treating launch day as the finish line. It\'s the starting gun. The real work starts the day after.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 7: Press & Newsletter Outreach
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase2-7',
    phase: 2,
    phaseLabel: 'Launch Week',
    tier: 'launcher',
    title: 'Press & Newsletter Outreach',
    description:
      'Targeted outreach to developer newsletters and niche press can drive 200-500 highly qualified visitors. Generic press releases don\'t work — personalized pitches to relevant newsletters do.',
    timeEstimate: '3-5 hours',
    icon: '📰',
    category: 'Outreach',

    steps: [
      {
        title: 'Build a targeted outreach list',
        description:
          'Identify 10-15 newsletters and blogs where your target user actually reads. Developer-focused newsletters with engaged subscribers are worth 10x more than generic tech press. Look for newsletters with 5K-50K subscribers in your niche — they\'re more likely to cover indie tools.',
        subtasks: [
          { title: 'List 5 newsletters your target user reads', description: 'TLDR, Pointer, Changelog Weekly, CSS Tricks, Indie Hackers newsletter, Hacker Newsletter, etc.' },
          { title: 'List 3-5 niche blogs or publications', description: 'Blogs focused on your specific problem space, not just "tech news".' },
          { title: 'Find the right contact for each', description: 'Editor name and email. Most newsletters have a submission form or "tips@" address.' }
        ]
      },
      {
        title: 'Write personalized pitches',
        description:
          'Each pitch should be under 150 words and make two things immediately clear: why this is relevant to their specific audience, and what\'s the interesting angle (not just "I built an app"). Reference specific recent content from their newsletter to show you actually read it.',
        subtasks: [
          { title: 'Write the "why this matters to your readers" hook', description: 'One sentence that connects your app to something they care about. No copy-paste.' },
          { title: 'Write the pitch body (100 words max)', description: 'What it is, who it\'s for, why it\'s interesting, where to try it. No attachments, one URL.' },
          { title: 'Customize each pitch for each recipient', description: 'Reference their newsletter by name and a specific issue or topic they covered recently.' }
        ]
      },
      {
        title: 'Send in batches and track responses',
        description:
          'Send 5 pitches on day 2, wait 48 hours, send another 5. Track who opened, who replied, who passed. Follow up once (not three times) on unanswered pitches after 5 business days.',
        subtasks: [
          { title: 'Send first batch of 5 pitches on day 2 of launch week', description: 'Use a simple spreadsheet to track: contact, sent date, response status.' },
          { title: 'Follow up once after 5 days if no response', description: 'A brief, no-pressure follow-up: "Not sure if this landed in the right place — happy to share more if useful."' }
        ]
      },
      {
        title: 'Prepare media assets for easy pickup',
        description:
          'Make it trivially easy for a newsletter writer to include you. Create a "press kit" page or Notion doc with: headline, tagline, 3-sentence description, 2-3 screenshots, your photo, and a 100-word product description ready to paste.',
        subtasks: [
          { title: 'Create a press kit Notion page or /press page', description: 'Include all assets in one link they can share in one click.' },
          { title: 'Write a 100-word product description in third person', description: '"[App name] is a..." — ready to paste into a newsletter without editing.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are a PR strategist who specializes in pitching developer tools to niche newsletters.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. A 5-newsletter outreach list with contact strategy for each
2. A template pitch email (under 150 words) with [CUSTOMIZE] markers
3. A 100-word product description in third person (ready to paste)
4. 3 different "interesting angle" hooks for different audience types`,
      temperature: 0.7,
      maxTokens: 1000
    },

    templates: [
      {
        title: 'Newsletter pitch email',
        content: `Subject: Quick tip for [Newsletter name] readers: [App name]

Hi [Editor name],

I'm a reader of [Newsletter name] and noticed you covered [specific recent topic] — thought this might be relevant.

I built [App name]: [one-sentence description]. It's for [target user] who [problem they have].

In the first [X] days: [one metric or interesting fact].

Try it free: [URL]

If it's useful to your readers, I'd love to be included in a future issue. Happy to provide a discount code for your subscribers.

Thanks,
[Your name]`
      }
    ],

    tools: [
      { name: 'TLDR Newsletter', url: 'https://tldr.tech', freeDetails: 'Free submission. Developer-focused, millions of subscribers. Highly selective but worth submitting.' },
      { name: 'Changelog Weekly', url: 'https://changelog.com', freeDetails: 'Submit via their website. Open source and developer tools focused.' }
    ],

    doneCriteria: [
      '10-15 target newsletters/blogs identified',
      'Personalized pitches sent to at least 5 contacts',
      'Press kit created with all necessary assets',
      'Tracking spreadsheet set up with response status'
    ],

    commonMistakes: [
      'Sending generic press releases. Newsletter writers receive dozens daily. Personalization is the only thing that gets a response.',
      'Pitching to huge publications first. Start with niche newsletters — they\'re more likely to cover indie tools and have more engaged audiences.',
      'Only pitching once. One follow-up after 5 days is appropriate. More than that damages the relationship.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 8: Community Seeding
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase2-8',
    phase: 2,
    phaseLabel: 'Launch Week',
    tier: 'launcher',
    title: 'Community Seeding',
    description:
      'Find and engage the specific online communities where your target users congregate. Authentic participation — not spam — is how indie developers build lasting distribution.',
    timeEstimate: '2-4 hours',
    icon: '🌱',
    category: 'Outreach',

    steps: [
      {
        title: 'Map your target communities',
        description:
          'Find 5-10 specific communities where your ideal user is already active: subreddits, Discord servers, Slack communities, Facebook groups, or forum boards. The question isn\'t "where are developers" but "where are developers who have the exact problem I solve?"',
        subtasks: [
          { title: 'List relevant subreddits (aim for 3-5)', description: 'r/sideprojects, r/SaaS, plus niche subreddits for your specific problem domain.' },
          { title: 'Find relevant Discord/Slack communities', description: 'Indie Hackers Discord, Makerpad, MicroConf Connect, WIP.co.' },
          { title: 'Check existing threads about your problem', description: 'Search each community for your problem keywords. See how people currently talk about it.' }
        ]
      },
      {
        title: 'Engage authentically for 3 days before posting about your product',
        description:
          'Don\'t join a community and immediately post about your app. That\'s spam and gets you banned. Spend 2-3 days answering questions, leaving helpful comments, and building a presence before you mention what you\'re building.',
        subtasks: [
          { title: 'Answer 3-5 questions per community using genuine knowledge', description: 'Help first. Your profile links to your landing page — let that do the selling.' },
          { title: 'Join conversations about your problem space', description: 'Add value without pitching. People will check your profile if your contribution is good.' }
        ]
      },
      {
        title: 'Post a "built this" announcement',
        description:
          'After establishing presence, post a non-spammy launch announcement. Lead with your story, not your product. Frame it as sharing what you built, not asking for upvotes or sales.',
        subtasks: [
          { title: 'Write a community-specific post for each platform', description: 'Reddit post ≠ Twitter post ≠ Slack message. Customize tone and length.' },
          { title: 'Offer something specific to community members', description: 'A discount, free beta access, or a request for feedback. Give, don\'t just promote.' },
          { title: 'Reply to every comment within the first 4 hours', description: 'Engagement signals to the algorithm (Reddit) and to the community that you\'re present.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are a community growth specialist for indie developer tools.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. A list of 8 specific communities (subreddits, Discords, Slack groups) where {target_audience} hangs out
2. A Reddit-style "I built this" post (not spammy, story-first)
3. A Slack/Discord message for developer communities (shorter, casual)
4. A week-1 community engagement routine (15 minutes/day)`,
      temperature: 0.7,
      maxTokens: 1000
    },

    templates: [
      {
        title: '"I built this" Reddit post',
        content: `Title: I spent [X months] building [App name] to solve [problem] — feedback welcome

Hey r/[subreddit],

I've been lurking here for a while and wanted to share something I built.

[2-3 sentences: personal story about the problem. Not "I'm excited to announce" — just the honest frustration that led to building this.]

What I built: [2-3 sentences describing the solution simply]

Current state: [honest status — beta, paid, free, # users, etc.]

URL: [link]

Would love feedback from anyone who's dealt with [problem]. What would make this genuinely useful for you?`
      }
    ],

    tools: [
      { name: 'Reddit', url: 'https://reddit.com', freeDetails: 'Free. Find niche subreddits for your problem space. Read community rules before posting.' },
      { name: 'WIP.co', url: 'https://wip.co', freeDetails: '$20/month. Community of indie makers shipping daily. Very supportive of new launches.' }
    ],

    doneCriteria: [
      '5+ communities identified and joined',
      'Contributed value (answers/comments) in each community before posting',
      '"I built this" post published in at least 3 communities',
      'Replied to every comment within 4 hours of posting'
    ],

    commonMistakes: [
      'Joining and immediately self-promoting. You will be banned and lose all credibility in that community.',
      'Posting identical content everywhere. Each community has its own culture and expectations. Customize.',
      'Vanishing after the launch post. Check back for comments every day during launch week.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 9: Launch Pricing Strategy
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase2-9',
    phase: 2,
    phaseLabel: 'Launch Week',
    tier: 'launcher',
    title: 'Launch Pricing Strategy',
    description:
      'Your launch price is not your permanent price. Use a time-limited launch discount to create urgency, learn what users are willing to pay, and build early MRR momentum.',
    timeEstimate: '2-3 hours',
    icon: '💰',
    category: 'Strategy',

    steps: [
      {
        title: 'Define your pricing structure',
        description:
          'One plan is better than three for launch. Pick a single price that is low enough to attract early adopters but high enough to attract serious users. Price anchoring: charge more than you think, then offer a launch discount to your first users.',
        subtasks: [
          { title: 'Set your "full price" (post-launch target price)', description: 'What you\'ll charge 90 days from now when the product is proven.' },
          { title: 'Define your launch price (typically 30-40% below full price)', description: 'The price for your first 100 users. Include a deadline — either a date or a user count.' },
          { title: 'Write the pricing copy for your landing page', description: 'Be explicit: "Launch price: $X — increases to $Y on [date]. Lock in your rate now."' }
        ]
      },
      {
        title: 'Set up and test your payment flow',
        description:
          'Test your checkout flow yourself with a real card before launch day. Every broken checkout link during launch week is a lost conversion. The flow should take under 60 seconds from "I want to buy" to "account created and working."',
        subtasks: [
          { title: 'Complete a test purchase yourself', description: 'Go through the full flow: click CTA → Stripe checkout → account creation → first use. Fix every friction point.' },
          { title: 'Verify the receipt email sends correctly', description: 'Check the email goes to inbox (not spam) and contains the right information.' },
          { title: 'Test on mobile', description: 'A significant portion of purchases happen on mobile. The checkout must work flawlessly on a phone.' }
        ]
      },
      {
        title: 'Set up a launch offer with a real deadline',
        description:
          'A deadline creates urgency. "Launch pricing ends March 30" outperforms "limited time offer" by a significant margin. Make the deadline real — honor it and raise the price when it expires.',
        subtasks: [
          { title: 'Set a specific end date for the launch offer', description: 'Typically 7-14 days from launch. Add it to your landing page and email.' },
          { title: 'Schedule the price increase in Stripe', description: 'Actually raise the price when the deadline hits. Fake urgency destroys trust.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are a SaaS pricing consultant for indie developers.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. A pricing recommendation (one-time vs. subscription, price point, launch discount strategy)
2. Pricing page copy for the launch offer (headline, feature list, CTA)
3. Launch pricing FAQ answers (3 common questions)
4. A pricing experiment to run after the first 50 customers`,
      temperature: 0.65,
      maxTokens: 900
    },

    templates: [
      {
        title: 'Launch pricing callout',
        content: `**Launch Pricing — First [X] customers only**

$[LAUNCH PRICE]/month (normally $[FULL PRICE]/month)

→ [Feature 1]
→ [Feature 2]
→ [Feature 3]
→ Lock in this rate forever — price never increases for existing customers

[CTA: Start for $X/month]

*Price increases to $[FULL PRICE]/month on [DATE] or when we hit [X] customers.*`
      }
    ],

    tools: [
      { name: 'Stripe', url: 'https://stripe.com', freeDetails: '2.9% + 30¢ per transaction. No monthly fees. Industry standard.' },
      { name: 'Lemon Squeezy', url: 'https://lemonsqueezy.com', freeDetails: '5% + 50¢ per transaction. Handles VAT/sales tax automatically — valuable if selling internationally.' }
    ],

    doneCriteria: [
      'Full price and launch price defined',
      'Checkout flow tested end-to-end on desktop and mobile',
      'Launch deadline date set and visible on landing page',
      'Price increase scheduled in Stripe for when deadline hits'
    ],

    commonMistakes: [
      'Underpricing out of fear. If you\'re attracting the wrong users (complainers, churners), your price is too low. Raise it.',
      'Offering a "forever discount" to everyone. Grandfathering early users at the launch price is appropriate. Permanent 50% off for everyone signals the real price is wrong.',
      'Not testing the checkout flow yourself. Broken checkouts on launch day are the most painful way to lose sales.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 10: Onboarding Flow Optimization
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase2-10',
    phase: 2,
    phaseLabel: 'Launch Week',
    tier: 'launcher',
    title: 'Onboarding Flow Optimization',
    description:
      'Your onboarding determines whether users stick or churn. The goal is to get users to their first "aha moment" in under 5 minutes. Audit, fix friction, and validate with real users.',
    timeEstimate: '3-4 hours',
    icon: '🧭',
    category: 'Product',

    steps: [
      {
        title: 'Map the current onboarding flow',
        description:
          'Walk through your onboarding exactly as a new user would: sign up, complete first action, get to the core value. Count the steps. Note every decision point. Identify the moment where most users will give up.',
        subtasks: [
          { title: 'Document every step from signup to first value delivery', description: 'Make a list: "Step 1: enter email → Step 2: verify email → Step 3: ..."' },
          { title: 'Identify the "aha moment" — the first moment of real value', description: 'For LaunchPilot it might be: "completed your first task and generated your first AI copy."' },
          { title: 'Count the steps between signup and the aha moment', description: 'Target: ≤ 5 steps. If it\'s more, identify which steps can be removed or deferred.' }
        ]
      },
      {
        title: 'Watch 3 users go through onboarding',
        description:
          'This is the single highest-ROI activity in launch week. Watch 3 people who match your target user complete signup and first use. Don\'t help them — just observe. Every point of confusion is a bug in your onboarding.',
        subtasks: [
          { title: 'Find 3 users to watch (offer free access or a gift card)', description: 'DM people from your target community and offer to watch them try it in exchange for $10 Amazon card.' },
          { title: 'Record the session (with permission) using Loom', description: 'You\'ll want to rewatch the moments of confusion.' },
          { title: 'Note every "I wasn\'t sure what to do next" moment', description: 'These are your fixes. Every moment of confusion costs you a user.' }
        ]
      },
      {
        title: 'Fix the top 3 friction points',
        description:
          'You\'ll see the same 2-3 confusion points across all 3 sessions. Fix those immediately — they\'re costing you users right now. Defer the nice-to-haves.',
        subtasks: [
          { title: 'List the top 3 friction points observed', description: 'Rank by how many users got stuck at each point.' },
          { title: 'Implement fixes for all 3', description: 'Typical fixes: clearer empty states, better first-run prompts, removing a required step that can be optional.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are a UX designer specializing in SaaS onboarding flows for developer tools.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. A 5-step ideal onboarding flow for {app_name}
2. The "aha moment" hypothesis — what's the first moment of genuine value for a new user?
3. A 3-question user interview script to run after onboarding sessions
4. A list of 5 common onboarding friction points for apps like {app_name}`,
      temperature: 0.65,
      maxTokens: 900
    },

    templates: [
      {
        title: 'Onboarding observation script',
        content: `"Thank you for helping me out. I'm going to share my screen — wait, actually I want to watch you share yours.

I want you to try [App name] as if I wasn't here. Just sign up and try to [core action].

If you get confused, don't ask me — just tell me what you're thinking. Think out loud.

I'm not testing you — I'm testing the app. There are no wrong answers.

Ready? Here's the URL: [URL]"`
      }
    ],

    tools: [
      { name: 'Loom', url: 'https://loom.com', freeDetails: 'Free: record user sessions. Share a link and ask them to record their screen while trying your app.' },
      { name: 'PostHog', url: 'https://posthog.com', freeDetails: 'Free: session recordings built in. Watch real user sessions in your app without scheduling a call.' }
    ],

    doneCriteria: [
      'Full onboarding flow mapped step-by-step',
      'Aha moment identified and measurable with analytics',
      '3 real users observed completing onboarding',
      'Top 3 friction points fixed and deployed'
    ],

    commonMistakes: [
      'Assuming you know where users get confused. You built the product — you\'re the worst person to evaluate your own onboarding. Watch real users.',
      'Trying to fix everything at once. Fix the top 3 blockers only. Shipping improvements beats perfecting.',
      'Not measuring onboarding completion rate. If you don\'t have a metric for "completed onboarding," you can\'t know if your fixes are working.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 11: Launch Week Email Sequence
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase2-11',
    phase: 2,
    phaseLabel: 'Launch Week',
    tier: 'launcher',
    title: 'Launch Week Email Sequence',
    description:
      'A 5-email sequence over 7 days keeps your new users engaged, drives activation, collects feedback, and converts free users to paid. Write it before launch so you can execute without thinking.',
    timeEstimate: '3-4 hours',
    icon: '✉️',
    category: 'Retention',

    steps: [
      {
        title: 'Write 5 emails for days 1, 2, 4, 6, and 8',
        description:
          'Each email has one job. Day 1: welcome + first action. Day 2: tip to get more value. Day 4: social proof + upgrade nudge. Day 6: request for feedback. Day 8: check-in for non-activators.',
        subtasks: [
          { title: 'Day 1: Welcome + call to first action', description: 'Short and action-oriented. Link directly to the one thing they should do first.' },
          { title: 'Day 2: Tip that improves their experience', description: 'A non-obvious tip that power users know. Positions you as a helpful guide, not a sales machine.' },
          { title: 'Day 4: Social proof + optional upgrade prompt', description: 'Share a user result or testimonial. Soft mention of what paid users get.' }
        ]
      },
      {
        title: 'Set up the automation sequence',
        description:
          'Configure all 5 emails to send automatically based on signup date, not manual sending. Test the full sequence by signing up with a test account and verifying each email arrives on schedule.',
        subtasks: [
          { title: 'Load all 5 emails into your email tool as a sequence', description: 'Each email triggers based on days since signup (day 1, 2, 4, 6, 8).' },
          { title: 'Test the full sequence with a personal email', description: 'Sign up, receive all 5 emails, verify timing, check for broken links.' }
        ]
      },
      {
        title: 'Monitor open rates and replies',
        description:
          'During launch week, check email metrics daily. Open rates below 30% on your first few emails signal a deliverability or subject line problem. Replies to your feedback email are high-value — read and respond to each one.',
        subtasks: [
          { title: 'Set target open rate: ≥ 40% for day 1, ≥ 30% for subsequent emails', description: 'Early-stage email lists typically see higher engagement. If you\'re below this, check spam folder and subject lines.' },
          { title: 'Reply personally to every feedback response', description: 'Each reply is an interview. Treat it like one.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are an email marketing specialist for early-stage SaaS products targeting developers.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Write all 5 emails in the launch week sequence:

Email 1 (Day 1): Welcome + first action. Under 150 words. One CTA.
Email 2 (Day 2): A non-obvious tip for getting more value. Under 150 words.
Email 3 (Day 4): Social proof + soft upgrade mention. Under 200 words.
Email 4 (Day 6): Feedback request with a single specific question. Under 100 words.
Email 5 (Day 8): Re-engagement for non-activators. Under 150 words.

Include subject lines for each.`,
      temperature: 0.72,
      maxTokens: 1400
    },

    templates: [
      {
        title: 'Day 6 feedback email',
        content: `Subject: Quick question about [App name]

Hey [name],

You signed up 6 days ago. Quick question:

What's the #1 thing that's missing from [App name] right now?

Reply with whatever's on your mind — I read every reply personally.

— [Your name]`
      }
    ],

    tools: [
      { name: 'Buttondown', url: 'https://buttondown.email', freeDetails: 'Free up to 1,000 subscribers. Supports email sequences with time-based automation.' },
      { name: 'Loops.so', url: 'https://loops.so', freeDetails: 'Built for SaaS. Transactional + marketing in one tool. Better option if you want to trigger emails from app events.' }
    ],

    doneCriteria: [
      'All 5 emails written with subject lines',
      'Sequence automated in email tool',
      'Full sequence tested with personal email address',
      'Open rate monitoring set up'
    ],

    commonMistakes: [
      'Writing long emails. People scan. Under 200 words with one clear CTA outperforms long-form emails every time during launch week.',
      'Pitching in every email. Day 1, 2, and 6 should have no pitch at all. Earn trust before you sell.',
      'Never following up on feedback replies. If you ask for feedback and get a reply, not responding signals you don\'t actually care.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 12: Launch Retrospective
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase2-12',
    phase: 2,
    phaseLabel: 'Launch Week',
    tier: 'launcher',
    title: 'Launch Retrospective',
    description:
      'Run a structured retrospective after launch week to extract lessons, update your strategy, and set priorities for the next 30 days. What you learn now shapes whether your second month grows or stalls.',
    timeEstimate: '2-3 hours',
    icon: '🔍',
    category: 'Strategy',

    steps: [
      {
        title: 'Gather your launch week data',
        description:
          'Compile the numbers from every channel: analytics, email, social, communities, and revenue. You need actual numbers to make actual decisions. Gut feelings don\'t count.',
        subtasks: [
          { title: 'Pull final numbers from Plausible/analytics', description: 'Total visitors, top sources, conversion rate, top pages.' },
          { title: 'Pull email metrics', description: 'Total subscribers added, open rates, click rates, replies.' },
          { title: 'Pull revenue numbers', description: 'Total MRR added, number of paying customers, average sale price.' }
        ]
      },
      {
        title: 'Identify what worked and what didn\'t',
        description:
          'For each channel (PH, HN, IH, email, social, communities), rank it by: visitors driven, signups generated, and quality of users (did they stick around, did they give useful feedback). Double down on the top 2, deprioritize the rest.',
        subtasks: [
          { title: 'Rank channels by signup quality (not just volume)', description: 'A channel that drove 10 highly engaged users beats one that drove 200 who never came back.' },
          { title: 'Identify the one biggest missed opportunity', description: 'What would you have done differently if you could repeat launch week?' }
        ]
      },
      {
        title: 'Write a "what I learned" post',
        description:
          'Publishing an honest launch retrospective builds credibility and drives a second wave of traffic. Indie Hackers and X/Twitter developer communities love honest metrics posts. Include your actual numbers — they don\'t have to be impressive to be interesting.',
        subtasks: [
          { title: 'Write the retrospective post (300-500 words)', description: 'What you launched, your goals, actual results, what worked, what failed, what\'s next.' },
          { title: 'Publish on Indie Hackers and/or X', description: 'IH in particular rewards honest retrospectives with featured placement.' }
        ]
      },
      {
        title: 'Set your 30-day priorities',
        description:
          'Based on the data, choose 3 priorities for the next 30 days. Not 10 — 3. These should be: the highest-leverage growth channel to double down on, the product improvement that will increase retention, and the customer discovery activity that will validate your next move.',
        subtasks: [
          { title: 'Write 3 specific 30-day goals with measurable outcomes', description: 'e.g., "Get to 20 paying customers by March 31" not "grow revenue."' },
          { title: 'Identify which Phase 3 tasks to prioritize', description: 'Look at the Phase 3 task list and pick the 3 most relevant to your current situation.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are a startup advisor helping an indie developer analyze their launch results.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. A retrospective template with prompts for: goals vs. results, what worked, what failed, key learnings, 30-day priorities
2. A "Show IH" retrospective post template with [METRIC] placeholders
3. A framework for deciding which 3 priorities to focus on in the next 30 days`,
      temperature: 0.65,
      maxTokens: 900
    },

    templates: [
      {
        title: 'Launch retrospective post',
        content: `**[App name] Launch Retrospective — [X] days in**

**The goal:** [what you set out to achieve]
**The result:** [what actually happened — be honest]

**The numbers:**
- Visitors: [X] from [main sources]
- Signups: [X] ([X]% conversion)
- Paying customers: [X]
- MRR: $[X]

**What worked:**
1. [Channel or tactic] → [result]
2. [Channel or tactic] → [result]

**What didn't:**
1. [What you expected to work but didn't] → [what happened instead]

**The biggest surprise:** [something you didn't predict]

**What's next:**
For the next 30 days I'm focused on: [3 priorities].

Happy to answer questions — especially from anyone who's gone through a similar experience.`
      }
    ],

    tools: [
      { name: 'Indie Hackers', url: 'https://indiehackers.com', freeDetails: 'Best place to publish launch retrospectives. Honest numbers get featured. Community actively engages with retrospectives.' }
    ],

    doneCriteria: [
      'All launch week metrics compiled in one place',
      'Channels ranked by signup quality',
      'Top 3 wins and top 3 failures identified',
      'Retrospective post published on at least one platform',
      '30-day priorities written with measurable outcomes'
    ],

    commonMistakes: [
      'Skipping the retrospective when results are disappointing. A failed launch is more valuable data than a successful one. Document and learn from it.',
      'Setting vague 30-day goals. "Get more users" is not a goal. "Reach 25 paying customers at $29/month by April 15" is a goal.',
      'Publishing the retrospective too late. Write it in the week after launch while the details are fresh. A retrospective published 3 months later misses the community moment.'
    ]
  }
]
