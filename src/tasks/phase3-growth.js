/**
 * Phase 3: First 30 Days Tasks (LAUNCHER tier)
 *
 * 10 tasks for the month after launch. Focus shifts from acquisition
 * to retention, discovery, and building a repeatable growth engine.
 *
 * @type {import('./schema.js').TaskDefinition[]}
 */

export const phase3Tasks = [
  // ─────────────────────────────────────────────────────────────────────────
  // Task 13: SEO Foundation
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase3-13',
    phase: 3,
    phaseLabel: 'First 30 Days',
    tier: 'launcher',
    title: 'SEO Foundation',
    description:
      'Set up the technical and on-page SEO basics that let Google understand and rank your site. This is a one-time setup that compounds over months.',
    timeEstimate: '3-5 hours',
    icon: '🔎',
    category: 'Growth',

    steps: [
      {
        title: 'Submit to Google Search Console and Bing Webmaster Tools',
        description: 'Verify ownership of your domain and submit your sitemap. This tells Google your site exists and gives you data on what queries you rank for.',
        subtasks: [
          { title: 'Add your site to Google Search Console', description: 'Verify with DNS TXT record or HTML file. Submit your sitemap URL.' },
          { title: 'Add your site to Bing Webmaster Tools', description: 'Bing powers DuckDuckGo. Free, 5-minute setup. Import your Search Console data directly.' }
        ]
      },
      {
        title: 'Optimize title tags, meta descriptions, and Open Graph',
        description: 'Every page needs a unique title (50-60 chars), meta description (120-160 chars), and OG image. These affect click-through rates from search results and social shares.',
        subtasks: [
          { title: 'Write optimized title tags for all key pages', description: 'Format: "[Primary keyword] - [App name]". Include your main keyword near the start.' },
          { title: 'Write meta descriptions for all key pages', description: 'Include the primary keyword and a call to action. Think of it as ad copy for your search result.' },
          { title: 'Create and add OG images (1200x630px)', description: 'One image per key page. Canva works fine. Test with opengraph.xyz.' }
        ]
      },
      {
        title: 'Target 3 long-tail keywords',
        description: 'Find 3 keywords your target user searches for that you can realistically rank for in 3-6 months. Use them in your landing page copy and create a simple content plan around them.',
        subtasks: [
          { title: 'Research keywords using Ahrefs free tools or Google Suggest', description: 'Look for: 100-1000 searches/month, difficulty under 30, matches what your user would search.' },
          { title: 'Add target keywords naturally to landing page headings and copy', description: 'Don\'t stuff — use once in H1, once in H2, naturally in body copy.' },
          { title: 'Plan 3 blog posts targeting one keyword each', description: 'These are Phase 3 content pieces. Plan them now, write in next 30 days.' }
        ]
      },
      {
        title: 'Build 5 quality backlinks',
        description: 'Backlinks are the primary factor in ranking. Launch on PH/HN/IH already gave you some. Now earn 5 more from relevant directories, community profiles, and niche blogs.',
        subtasks: [
          { title: 'Submit to 5 SaaS and developer tool directories', description: 'SaaSHub, AlternativeTo, G2, Capterra (if applicable), StackShare.' },
          { title: 'Add your tool to relevant GitHub Awesome lists', description: 'Find awesome-[topic] lists in your niche and submit a PR adding your tool.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are an SEO specialist for indie SaaS products.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. An optimized title tag and meta description for the main landing page
2. 5 long-tail keyword opportunities with estimated difficulty and search intent
3. 5 directory sites to submit {app_name} to (with URLs)
4. Outline for 3 blog posts targeting one keyword each`,
      temperature: 0.6,
      maxTokens: 1000
    },

    templates: [
      {
        title: 'Meta tag template',
        content: `<title>[Primary keyword] - [App name] | [Value proposition in 5 words]</title>
<meta name="description" content="[App name] helps [target user] [achieve outcome] with [key mechanism]. [CTA: Try free / Start today].">
<meta property="og:title" content="[App name] - [Primary keyword]">
<meta property="og:description" content="[Same as meta description or slight variation]">
<meta property="og:image" content="[URL to 1200x630 OG image]">`
      }
    ],

    tools: [
      { name: 'Google Search Console', url: 'https://search.google.com/search-console', freeDetails: 'Free. Essential. Shows you what queries Google shows your site for and which pages get impressions.' },
      { name: 'Ahrefs Free Tools', url: 'https://ahrefs.com/free-seo-tools', freeDetails: 'Free keyword difficulty checker, backlink checker, and SERP checker. No account required.' },
      { name: 'SaaSHub', url: 'https://saashub.com', freeDetails: 'Free directory listing. Good for backlinks and discovery by developers comparing tools.' }
    ],

    doneCriteria: [
      'Site verified in Google Search Console and sitemap submitted',
      'Title tags and meta descriptions set for all key pages',
      'OG image created and tested',
      '3 target keywords identified and used in landing page copy',
      '5 directory submissions sent'
    ],

    commonMistakes: [
      'Expecting results in weeks. SEO takes 3-6 months to show meaningful results. Set it up now so you\'re benefiting in month 4.',
      'Targeting high-volume keywords. You will not rank for "project management tool" in month 1. Target specific, low-competition terms your exact user would search.',
      'Ignoring technical SEO. Check that your pages load under 3 seconds, have canonical URLs, and don\'t have duplicate content issues.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 14: Content Marketing Engine
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase3-14',
    phase: 3,
    phaseLabel: 'First 30 Days',
    tier: 'launcher',
    title: 'Content Marketing Engine',
    description:
      'Build a content system that creates one high-quality piece per week. Content that ranks, gets shared, and attracts your ideal user is the highest-ROI long-term marketing for solo developers.',
    timeEstimate: '4-6 hours',
    icon: '✍️',
    category: 'Growth',

    steps: [
      {
        title: 'Define your content strategy',
        description: 'You don\'t need a blog about everything — you need content on 2-3 specific topics that your ideal user searches for and that naturally connects to your product. Pick your content pillars before writing a single post.',
        subtasks: [
          { title: 'Define 3 content pillars (topics you\'ll write about repeatedly)', description: 'Each pillar should be a topic your user cares about AND connects naturally to your product\'s value.' },
          { title: 'List 10 article ideas (3-4 per pillar)', description: 'These are articles you\'ll write over the next 2-3 months. Include the target keyword for each.' }
        ]
      },
      {
        title: 'Write your first 2 pillar articles',
        description: 'Pillar articles are 1,500-2,500 word posts that thoroughly cover a topic your user searches for. They rank on Google, get shared, and establish credibility. Quality beats quantity — one great article per month beats 10 mediocre ones.',
        subtasks: [
          { title: 'Write article 1 (targeting keyword from task 13)', description: 'Research competitors ranking for the keyword, include something they missed, and make it the most useful article on the topic.' },
          { title: 'Write article 2', description: 'Different pillar, different keyword. Aim for 1,500+ words with practical advice.' },
          { title: 'Add article CTAs that link to your product', description: 'Each article should have 2-3 in-text mentions of your product and a CTA at the end.' }
        ]
      },
      {
        title: 'Distribute each article after publishing',
        description: 'Publishing to your blog is step 1. Step 2 is distribution: share to your email list, post on social, submit to relevant newsletters, and post to dev communities. One article × 5 distribution channels = 5× the reach.',
        subtasks: [
          { title: 'Email your list within 24 hours of publishing', description: 'Short email: here\'s what I wrote, here\'s why it matters to you, link.' },
          { title: 'Post to relevant communities (Reddit, IH, dev forums)', description: 'Share as a resource, not as self-promotion. "I wrote about X because I kept seeing this question..." works.' },
          { title: 'Submit to developer newsletters', description: 'Changelog, TLDR, Pointer — use the contacts from Task 7.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are a content strategist for indie SaaS products targeting developers.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. 3 content pillars with 4 article ideas each (12 total)
2. A detailed outline for the highest-priority article (intro, H2s, conclusion, CTA)
3. A content calendar template for 8 weeks
4. A distribution checklist to run after each article is published`,
      temperature: 0.7,
      maxTokens: 1100
    },

    templates: [
      {
        title: 'Article distribution checklist',
        content: `Published: [Title] — [URL]

Day 1:
[ ] Email list — short intro + link
[ ] Share on X with key takeaway quote
[ ] Post on LinkedIn (longer format OK)
[ ] Submit to relevant newsletters (use contact list from Task 7)

Day 2:
[ ] Post to relevant subreddits (as a resource, not promotion)
[ ] Post to Indie Hackers (if relevant to IH audience)
[ ] Add to your own "resources" or "blog" section

Day 7:
[ ] Check Search Console for early impression data
[ ] Note top 3 referrers in your content tracking sheet`
      }
    ],

    tools: [
      { name: 'Hashnode', url: 'https://hashnode.com', freeDetails: 'Free developer-focused blogging platform. Custom domain, good SEO defaults, built-in dev community.' },
      { name: 'Ghost', url: 'https://ghost.org', freeDetails: 'Self-host for free, or $9/month managed. Better for email + blog combination. Clean SEO.' }
    ],

    doneCriteria: [
      '3 content pillars defined',
      '10 article ideas listed',
      '2 pillar articles published',
      'Distribution completed for both articles (email, social, communities)'
    ],

    commonMistakes: [
      'Writing about your product instead of your user\'s problem. "Why you should use LaunchPilot" gets 10 views. "How to get your first 10 SaaS customers" gets 10,000.',
      'Publishing without distributing. Most of your article\'s traffic in the first 3 months will come from distribution, not SEO.',
      'Inconsistency. One article every 2 weeks consistently outperforms a burst of 10 articles followed by 3 months of silence.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 15: Build-in-Public Strategy
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase3-15',
    phase: 3,
    phaseLabel: 'First 30 Days',
    tier: 'launcher',
    title: 'Build-in-Public Strategy',
    description:
      'Sharing your real progress — metrics, decisions, failures — builds an audience of ideal users who root for you and convert at higher rates than cold traffic.',
    timeEstimate: '2-3 hours',
    icon: '🏗️',
    category: 'Growth',

    steps: [
      {
        title: 'Define what you\'ll share and what you won\'t',
        description: 'Build-in-public works when you\'re genuinely transparent. Set your personal guidelines: will you share MRR? User counts? Churn rate? Define this now so you don\'t hesitate when the numbers are ugly.',
        subtasks: [
          { title: 'Decide which metrics you\'ll share publicly', description: 'MRR, visitor count, user count — pick what you\'re comfortable with and commit to sharing it consistently.' },
          { title: 'Define your weekly sharing cadence', description: '1 weekly update post + daily smaller posts. The weekly update is the anchor.' }
        ]
      },
      {
        title: 'Create a monthly metrics update format',
        description: 'Write your month 1 metrics post. Include: MRR, users, key wins, key failures, what you\'re building next. This post format should be consistent every month — readers follow you because the format is familiar.',
        subtasks: [
          { title: 'Write month 1 metrics update', description: 'Honest numbers, key learnings, what\'s next. Publish on X, IH, and your blog.' },
          { title: 'Set a recurring monthly calendar reminder to write the next update', description: 'Consistency is the entire game with BIP. Set it up now.' }
        ]
      },
      {
        title: 'Build a BIP content bank',
        description: 'You have more to share than you think: every feature shipped, every user conversation, every pivot decision, every failed experiment. Document as you go — these are your future posts.',
        subtasks: [
          { title: 'Create a "BIP content log" (Notion or Obsidian)', description: 'Note every interesting thing that happens: user feedback, feature decisions, metrics milestones, failures.' },
          { title: 'Write 5 BIP posts from your launch experience', description: 'You just went through a product launch — you have 20 interesting things to share.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are a build-in-public strategist who helps indie developers share their journey authentically.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. A monthly metrics update template (consistent format to use every month)
2. 10 BIP post ideas specific to {app_name} and its launch phase
3. A guide on what metrics to share vs. keep private
4. An X/Twitter thread format for the monthly update`,
      temperature: 0.72,
      maxTokens: 1000
    },

    templates: [
      {
        title: 'Monthly metrics update',
        content: `[App name] — Month [N] Update

MRR: $[X] (+$[X] from last month)
Users: [X] total / [X] paying
Churn: [X]%

What shipped:
→ [Feature 1]
→ [Feature 2]

What worked:
→ [Channel or tactic] drove [X] signups

What didn't:
→ [What you expected to work but didn't]

Biggest learning: [1 sentence]

Next month's focus: [3 priorities]`
      }
    ],

    tools: [
      { name: 'Typefully', url: 'https://typefully.com', freeDetails: 'Free plan for scheduling X threads. Good for writing and publishing BIP content.' }
    ],

    doneCriteria: [
      'Metrics-sharing guidelines defined',
      'Month 1 metrics post published',
      'Monthly reminder set in calendar',
      'BIP content log created with 5+ entries'
    ],

    commonMistakes: [
      'Only sharing wins. The posts that get the most engagement are failures and honest lessons. Vulnerability outperforms celebration.',
      'Inconsistency. Posting 5 times in one week then nothing for 3 weeks destroys audience trust. One weekly update beats sporadic bursts.',
      'Sharing metrics without context. "MRR went from $200 to $300" is less interesting than "MRR went from $200 to $300 because we tried X and it worked."'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 16: User Interviews & Research
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase3-16',
    phase: 3,
    phaseLabel: 'First 30 Days',
    tier: 'launcher',
    title: 'User Interviews & Research',
    description:
      'Talk to 5 users in depth. What you learn in 5 hours of user conversations will save you months of building the wrong features.',
    timeEstimate: '5-8 hours',
    icon: '🎤',
    category: 'Strategy',

    steps: [
      {
        title: 'Recruit 5 users for 30-minute interviews',
        description: 'Prioritize users who activated (used the core feature) and users who signed up but didn\'t activate. Both groups give you critical data. Offer a gift card or extended free access as an incentive.',
        subtasks: [
          { title: 'Email 3 activated users asking for a 30-minute interview', description: 'Keep the ask short: "I\'d love to hear about your experience — 30 minutes, I\'ll send a $15 Amazon card."' },
          { title: 'Email 3 signed-up but inactive users asking why', description: 'These conversations are painful but essential. Find out what blocked them.' },
          { title: 'Schedule all 5 interviews using Calendly', description: 'Free Calendly link + Google Meet or Zoom.' }
        ]
      },
      {
        title: 'Run the interviews with a consistent script',
        description: 'Use the same 5 questions for every interview so you can compare responses. Don\'t pitch — just listen. Ask "why" after every answer. Record with permission.',
        subtasks: [
          { title: 'Open: "Tell me about the last time you dealt with [problem]"', description: 'Start with their story, not your product.' },
          { title: 'Dig: "What have you tried before? What worked? What didn\'t?"', description: 'Understand the competitive landscape from the user\'s perspective.' },
          { title: 'Close: "If [App name] disappeared tomorrow, what would you do?"', description: 'This reveals true attachment (or lack of it).' }
        ]
      },
      {
        title: 'Synthesize findings and update your roadmap',
        description: 'After 5 interviews, patterns emerge. Write a 1-page synthesis: top 3 jobs-to-be-done, top 3 pain points, top 3 feature requests. Use this to reprioritize your roadmap.',
        subtasks: [
          { title: 'List every pain point mentioned across all 5 interviews', description: 'Then rank by frequency. The top 3 are your real priorities.' },
          { title: 'Update your product roadmap based on findings', description: 'Remove features nobody asked for. Add features multiple users mentioned.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are a user research specialist for early-stage SaaS products.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. A complete 30-minute user interview script (opening, 5 core questions, follow-up probes, closing)
2. A research synthesis template for finding patterns across 5 interviews
3. An email template to recruit users for interviews (activated + inactive versions)
4. A guide on how to identify "jobs-to-be-done" from interview transcripts`,
      temperature: 0.65,
      maxTokens: 1100
    },

    templates: [
      {
        title: 'Interview recruitment email',
        content: `Subject: 30 minutes of your time? ($15 gift card)

Hey [name],

You signed up for [App name] [X days] ago — thank you.

I'm running user research to understand how people actually use [App name] (and where it falls short). I'd love to hear your perspective in a 30-minute video call.

As a thank-you: $15 Amazon gift card delivered same day.

Book a time here: [Calendly link]

No prep needed — just your honest experience.

— [Your name]`
      }
    ],

    tools: [
      { name: 'Calendly', url: 'https://calendly.com', freeDetails: 'Free plan: 1 event type, unlimited bookings. Enough for scheduling user interviews.' },
      { name: 'Otter.ai', url: 'https://otter.ai', freeDetails: 'Free: 300 minutes/month of transcription. Auto-transcribes your interview recordings so you can search for keywords.' }
    ],

    doneCriteria: [
      '5 users recruited and interviews scheduled',
      'All 5 interviews completed and recorded',
      'Transcripts reviewed and patterns identified',
      '1-page research synthesis written',
      'Roadmap updated based on findings'
    ],

    commonMistakes: [
      'Asking "would you use a feature that does X?" Users will say yes to hypothetical features. Ask about past behavior instead: "Tell me about the last time you tried to do X."',
      'Talking more than listening. You should speak for under 20% of the interview time. Ask "tell me more about that" when you want to go deeper.',
      'Only interviewing happy users. Your churned and inactive users hold the most important signal about what\'s broken.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 17: Referral System
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase3-17',
    phase: 3,
    phaseLabel: 'First 30 Days',
    tier: 'launcher',
    title: 'Referral System',
    description:
      'A simple referral program turns your best users into your best salespeople. Start with a manual double-sided reward — you don\'t need software for your first 50 referrals.',
    timeEstimate: '3-4 hours',
    icon: '🔗',
    category: 'Growth',

    steps: [
      {
        title: 'Design a double-sided incentive',
        description: 'Both the referrer and the new user need to benefit. Cash discounts work. Free months work. Extended trial works. The referrer\'s incentive should be slightly better than the new user\'s since they\'re doing the work.',
        subtasks: [
          { title: 'Define referrer reward (e.g., 1 free month per successful referral)', description: 'Should be valuable enough to motivate sharing but sustainable for your margins.' },
          { title: 'Define new user reward (e.g., 20% off first month)', description: 'Lower-value is fine since they\'re receiving, not giving.' }
        ]
      },
      {
        title: 'Set up a manual referral system',
        description: 'For your first 50 referrals, use a simple Google Form + spreadsheet tracking. Don\'t overbuild — add software only when you have enough volume to justify it.',
        subtasks: [
          { title: 'Create unique referral URLs for your top 10 users', description: 'Add a query param: ?ref=[username]. Track in a spreadsheet. Takes 30 minutes.' },
          { title: 'Set up a referral tracking spreadsheet', description: 'Columns: referrer, referred user, date, reward status. Update manually when referrals come in.' }
        ]
      },
      {
        title: 'Announce the referral program to existing users',
        description: 'Email your user list about the referral program. Lead with what they get, not what you get. Include their personal referral link.',
        subtasks: [
          { title: 'Write and send the referral program announcement email', description: 'Clear: here\'s what you get, here\'s your link, here\'s how it works.' },
          { title: 'Add a "Refer a friend" link in your app or dashboard', description: 'Make it easy to find for users who didn\'t read the email.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are a growth advisor specializing in early-stage SaaS referral programs.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. A double-sided referral incentive recommendation (referrer + new user reward)
2. A referral program announcement email (subject + body, 200 words)
3. In-app referral prompt copy (50 words, shown after a user achieves their first success)
4. A simple spreadsheet structure for tracking referrals manually`,
      temperature: 0.7,
      maxTokens: 900
    },

    templates: [
      {
        title: 'Referral program announcement email',
        content: `Subject: Share [App name], get a free month

Hey [name],

Quick announcement: [App name] now has a referral program.

**Here's the deal:**
→ You share [App name] with someone who'd find it useful
→ They sign up using your link
→ You get 1 free month ($[price] value)
→ They get [X]% off their first month

Your referral link: [UNIQUE_LINK]

Share it however feels natural — DM a friend, mention it in a post, include it in a blog. No pushy tactics needed.

Thanks for being an early user.

— [Your name]`
      }
    ],

    tools: [
      { name: 'ReferralHero', url: 'https://referralhero.com', freeDetails: 'Free plan available. Adds referral tracking widgets and unique link generation without custom code. Upgrade when you hit scale.' }
    ],

    doneCriteria: [
      'Double-sided incentive defined',
      'Unique referral links created for top 10 users',
      'Referral tracking spreadsheet set up',
      'Announcement email sent to all existing users',
      '"Refer a friend" link visible in app'
    ],

    commonMistakes: [
      'One-sided referral programs (only the new user gets a discount). The referrer is doing the work — they deserve the better reward.',
      'Making it too complicated. Every extra step (fill out a form, wait for approval) reduces referral completion. Simple unique URL is enough.',
      'Launching a referral program before your product has retained users for 30 days. If users churn after 2 weeks, they won\'t refer anyone.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 18: Changelog & Updates
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase3-18',
    phase: 3,
    phaseLabel: 'First 30 Days',
    tier: 'launcher',
    title: 'Changelog & Updates',
    description:
      'A public changelog shows users you\'re actively building, surfaces new features they missed, and gives you a reason to email your list every week.',
    timeEstimate: '2-3 hours',
    icon: '📋',
    category: 'Retention',

    steps: [
      {
        title: 'Set up a public changelog',
        description: 'A changelog doesn\'t need to be fancy. A simple /changelog page or a Beamer widget is enough. What matters is consistency — ship something every week, add it to the changelog, tell your users.',
        subtasks: [
          { title: 'Create a /changelog page on your site or use Beamer', description: 'Beamer is free for small audiences and adds a notification bell in your app. Custom page works too.' },
          { title: 'Write your first changelog entry with your launch week releases', description: 'Backdate entries to your launch date. Show users what shipped.' }
        ]
      },
      {
        title: 'Establish a weekly shipping cadence',
        description: 'Ship something small every week. "Something" can be a bug fix, a UX improvement, or a small feature. The goal is momentum — users who see regular updates churn at lower rates.',
        subtasks: [
          { title: 'Define your minimum shippable unit per week', description: 'Even 1 bug fix + 1 UX improvement counts as a week\'s changelog entry.' },
          { title: 'Set a Friday "what shipped this week?" calendar reminder', description: 'Block 30 minutes to write the changelog entry and draft the update email.' }
        ]
      },
      {
        title: 'Email your list about major updates',
        description: 'For significant features (not bug fixes), send an email to your entire list. Short: here\'s what\'s new, here\'s why it matters, here\'s the link to try it.',
        subtasks: [
          { title: 'Define your threshold for "email-worthy" updates', description: 'New feature that changes user workflow = email. Bug fix = changelog only.' },
          { title: 'Write a template for feature announcement emails', description: 'Subject: "New in [App name]: [Feature name]". Body: what, why, how to use it. Under 150 words.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are a product manager for an indie SaaS product.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. A changelog entry format/template (with emoji, title, description)
2. A feature announcement email template (subject + body, under 150 words)
3. A system for categorizing changes (new feature, improvement, fix, removed)
4. 5 example changelog entries for a product like {app_name}`,
      temperature: 0.65,
      maxTokens: 800
    },

    templates: [
      {
        title: 'Changelog entry format',
        content: `## [Version or Date] — [Short title of main update]

**New:**
→ [Feature]: [What it does and why users will care]

**Improved:**
→ [Improvement]: [What changed and how it's better]

**Fixed:**
→ [Bug]: [What was broken and what it does now]

---
*Questions? Reply to this email or join our Discord.*`
      }
    ],

    tools: [
      { name: 'Beamer', url: 'https://getbeamer.com', freeDetails: 'Free plan: unlimited posts, in-app notification bell. Adds a changelog widget to your app without custom code.' },
      { name: 'Headway', url: 'https://headwayapp.co', freeDetails: 'Free plan available. Similar to Beamer. Simple in-app changelog widget.' }
    ],

    doneCriteria: [
      '/changelog page live or Beamer widget installed',
      'First changelog entry published (even backdated)',
      'Weekly "what shipped?" reminder in calendar',
      'Feature announcement email template written'
    ],

    commonMistakes: [
      'Writing changelogs for developers, not users. "Refactored auth module" means nothing to users. "Login is now 2x faster" does.',
      'Skipping changelog when you ship a bug fix. Every fix is a positive signal. Show users you\'re responding to feedback.',
      'Writing a changelog nobody sees. Every entry should also be posted on social and sent via email if it\'s significant.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 19: Customer Support Setup
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase3-19',
    phase: 3,
    phaseLabel: 'First 30 Days',
    tier: 'launcher',
    title: 'Customer Support Setup',
    description:
      'Great support is a growth lever for indie developers. Users who get fast, personal help become loyal customers and write reviews. Set up a simple system that doesn\'t eat your day.',
    timeEstimate: '2-3 hours',
    icon: '🎧',
    category: 'Retention',

    steps: [
      {
        title: 'Set up a support inbox',
        description: 'Use a dedicated support email (support@yourdomain.com) that forwards to your main inbox. For small user bases, email beats chat — it\'s async, documented, and less pressuring. Add a support link in your app footer.',
        subtasks: [
          { title: 'Create support@yourdomain.com and set up forwarding', description: '5 minutes in your email host settings. Forward to your personal inbox.' },
          { title: 'Add "Email support" link in your app', description: 'Footer, settings page, and anywhere a user might look for help.' },
          { title: 'Set a response time SLA for yourself', description: '"All emails answered within 24 hours" is a reasonable commitment for a solo developer. Post it on your contact page.' }
        ]
      },
      {
        title: 'Write a basic FAQ / help doc',
        description: 'The 5 questions users ask most frequently should have written answers before you launch. Link to the FAQ from your app. This reduces support volume and helps users self-serve at 2 AM.',
        subtasks: [
          { title: 'List the 5 most common questions from launch week', description: 'Check your support inbox and community posts. What did people ask repeatedly?' },
          { title: 'Write clear, concise answers for each', description: 'Under 150 words per answer. Link to the relevant part of your app.' },
          { title: 'Publish in a Notion page or simple /faq page', description: 'Notion is free and makes a decent FAQ doc. Link from your app.' }
        ]
      },
      {
        title: 'Create email response templates for common issues',
        description: 'Having 5-10 template responses means you can handle common support tickets in under 2 minutes. Templates aren\'t robotic if you personalize the first and last line.',
        subtasks: [
          { title: 'Write templates for: billing question, bug report, feature request, how-to question, cancellation', description: 'Keep them human — start with the user\'s name, end with an offer to follow up.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are a customer success specialist for early-stage SaaS products.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. A list of the 8 most common support questions for a product like {app_name}
2. Answer templates for each (under 100 words per answer)
3. A cancellation email response template that attempts to save the user
4. A support system setup guide for a solo developer handling < 20 tickets/day`,
      temperature: 0.65,
      maxTokens: 1000
    },

    templates: [
      {
        title: 'Cancellation email response',
        content: `Hi [name],

I'm sorry to see you go. I've processed your cancellation — you'll have access until [end date].

Quick question: what was the main reason you decided to cancel?

[ ] Too expensive
[ ] Missing a feature I need
[ ] Found an alternative
[ ] Not using it enough to justify the cost
[ ] Other: ___

Your feedback directly shapes what I build next. Even one sentence helps.

If anything changes, your account will be here.

— [Your name]`
      }
    ],

    tools: [
      { name: 'Crisp', url: 'https://crisp.chat', freeDetails: 'Free plan: 2 agents, unlimited conversations. Adds a live chat widget. Good if your users expect real-time support.' },
      { name: 'Plain', url: 'https://plain.com', freeDetails: 'Free for very small teams. Slack-like support inbox designed for developers.' }
    ],

    doneCriteria: [
      'support@ email set up and forwarding',
      'Support link added to app UI',
      'FAQ doc with 5+ questions published and linked',
      'Email response templates created for 5 common scenarios'
    ],

    commonMistakes: [
      'Using your personal email for support. Even 5 support emails/day will pollute your inbox and cause you to miss messages. Separate support from personal.',
      'Taking more than 24 hours to respond to paying customers. Fast support is a retention tool — users who get a same-day response don\'t churn.',
      'Writing FAQ answers that are too technical. Write them for a user who\'s frustrated and in a hurry. Short, clear, scannable.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 20: Testimonials & Social Proof
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase3-20',
    phase: 3,
    phaseLabel: 'First 30 Days',
    tier: 'launcher',
    title: 'Testimonials & Social Proof',
    description:
      'Collecting and displaying testimonials is the highest-leverage landing page change you can make after launch. One strong quote converts better than 1,000 words of copy.',
    timeEstimate: '2-3 hours',
    icon: '⭐',
    category: 'Growth',

    steps: [
      {
        title: 'Ask your 5 most engaged users for a testimonial',
        description: 'Identify users who have been active for 2+ weeks, given positive feedback, or replied to your emails. Ask for a specific type of testimonial: outcome-focused ("I did X, got Y result") beats vague praise ("great app!").',
        subtasks: [
          { title: 'Identify 5-7 most engaged users from your email/analytics data', description: 'Check who opened the most emails, who\'s been using the app most, who gave positive feedback.' },
          { title: 'Send a personalized ask with a specific prompt', description: '"Would you be willing to share a 2-3 sentence quote about what you\'ve gotten from [App name]? Specifically: what outcome or result have you seen?"' }
        ]
      },
      {
        title: 'Create a social proof section on your landing page',
        description: 'Add a dedicated section with 3-5 testimonials. Real names and photos outperform initials and avatars by 300%. Even a Twitter-style card with a real profile picture converts well.',
        subtasks: [
          { title: 'Design a testimonial section with real names and photos', description: 'Ask users for permission to use their photo. LinkedIn photo + real name is the minimum.' },
          { title: 'Add to landing page between your solution section and pricing', description: 'This is the highest-converting position for testimonials.' }
        ]
      },
      {
        title: 'Set up a system for ongoing review collection',
        description: 'Add a prompt to your email sequence (day 14) asking users to leave a review on G2 or Capterra. Set up Google Alerts for your app name to find mentions you can screenshot and use.',
        subtasks: [
          { title: 'Add a "leave a review" prompt in your day-14 email', description: 'Link directly to your G2 or Capterra profile (create one if you haven\'t).' },
          { title: 'Set up Google Alerts for "[App name]"', description: 'Catch organic mentions you can screenshot and add to your social proof collection.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are a conversion optimization specialist.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. A testimonial request email (subject + body, under 100 words)
2. A specific prompt to help users write outcome-focused testimonials
3. 3 example testimonials in the right format (outcome-focused, with name/title)
4. Copywriting for a social proof section (heading, subheading, layout suggestions)`,
      temperature: 0.7,
      maxTokens: 900
    },

    templates: [
      {
        title: 'Testimonial request email',
        content: `Subject: Would you share your experience?

Hey [name],

You've been using [App name] for [X] weeks — I wanted to ask a favor.

Would you be willing to write a 2-3 sentence quote for my landing page? Specifically:

*"Before [App name], I [had this problem]. Now, [specific outcome you've seen]."*

If you're up for it, reply with your quote and a photo I can use. I'll add your name and link to your [Twitter/LinkedIn/website] as credit.

Thanks either way.
— [Your name]`
      }
    ],

    tools: [
      { name: 'Senja', url: 'https://senja.io', freeDetails: 'Free plan: collect and display testimonials with an embeddable widget. Handles the request, collection, and display.' },
      { name: 'Testimonial.to', url: 'https://testimonial.to', freeDetails: 'Free plan available. Video and text testimonials. Clean embeddable walls.' }
    ],

    doneCriteria: [
      '5 testimonial requests sent',
      '3+ testimonials received and approved for use',
      'Testimonial section added to landing page',
      'Day-14 review prompt added to email sequence',
      'Google Alerts set up for app name'
    ],

    commonMistakes: [
      'Accepting vague testimonials. "Great app!" doesn\'t convert. Coach users with a specific prompt: "What outcome did you see?" Rewrite vague submissions (with permission) to be outcome-focused.',
      'Using initials instead of real names. "J.S., Developer" converts worse than "Jake Sullivan, Indie Developer at wip.co". Get permission to use full names and photos.',
      'Collecting testimonials and forgetting to add them to your page. Set a weekly reminder to update your social proof section.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 21: Partnership Opportunities
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase3-21',
    phase: 3,
    phaseLabel: 'First 30 Days',
    tier: 'launcher',
    title: 'Partnership Opportunities',
    description:
      'Find 2-3 non-competing tools your users also use and propose a simple co-promotion. Newsletter swaps, bundle deals, and integration partnerships are low-effort and high-reward.',
    timeEstimate: '3-4 hours',
    icon: '🤝',
    category: 'Growth',

    steps: [
      {
        title: 'Map the tool stack your users use alongside your app',
        description: 'Ask in your next email: "What other tools do you use for [problem domain]?" The most common answers are your partnership targets. Look for tools that serve the same user but don\'t compete directly.',
        subtasks: [
          { title: 'Survey your users about their adjacent tool stack', description: 'Add a single question to your next email or feedback form.' },
          { title: 'List 5 non-competing tools with your same target user', description: 'These are your partnership targets. Examples: if you\'re a launch checklist, potential partners are email tools, analytics tools, landing page builders.' }
        ]
      },
      {
        title: 'Reach out to 3 potential partners',
        description: 'Start with tools in a similar stage (early-stage, bootstrapped, solo developer) — they\'re more likely to respond and have similar-sized audiences. Propose something simple: a newsletter mention swap or a bundle deal.',
        subtasks: [
          { title: 'Draft a partnership pitch (under 100 words)', description: 'Keep it simple: "I\'m building X for [audience]. You\'re building Y for the same audience. Want to do a newsletter swap or bundle deal?" No long pitches.' },
          { title: 'Send to 3 potential partners via DM or email', description: 'DM on X is most effective for solo founders — email often goes to a support inbox.' }
        ]
      },
      {
        title: 'Execute 1 partnership this month',
        description: 'Pick the most receptive partner and execute one simple co-promotion: a newsletter mention, a mutual social post, or a bundle offer. Measure: how many new users came from the partner\'s audience.',
        subtasks: [
          { title: 'Agree on a specific, time-bounded co-promotion', description: '"We both mention each other in our next newsletter" is simple and measurable.' },
          { title: 'Track signups from the partner channel', description: 'Use UTM parameters on your landing page URL so you can measure partner traffic.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are a partnership strategist for bootstrapped SaaS products.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. A list of 8 non-competing tools that serve the same target user as {app_name}
2. A partnership pitch template (under 100 words, DM-friendly)
3. 3 partnership formats ranked from easiest to hardest to execute
4. A UTM tracking structure for measuring partner-driven traffic`,
      temperature: 0.68,
      maxTokens: 900
    },

    templates: [
      {
        title: 'Partnership pitch DM',
        content: `Hey [name],

I'm building [App name] — [one sentence: what it is, who it's for].

I notice you're building [their product] for a similar audience. Would you be open to a simple newsletter swap? I mention you to my [X] subscribers, you mention me to yours.

No commitment to anything else — just trying this once and seeing if our audiences find each other useful.

Worth a shot?

— [Your name]`
      }
    ],

    tools: [
      { name: 'PartnerStack', url: 'https://partnerstack.com', freeDetails: 'Marketplace for finding partnership opportunities. Free to browse. Paid plans for managing affiliate/partner programs at scale.' }
    ],

    doneCriteria: [
      '5 potential partners identified',
      '3 partnership pitches sent',
      '1 partnership agreement reached',
      'Co-promotion executed and tracked with UTM parameters',
      'Results measured and documented'
    ],

    commonMistakes: [
      'Pitching large, established products first. They get hundreds of partnership requests. Start with founders at a similar stage who are more likely to respond quickly and be genuinely helpful.',
      'Proposing complex partnerships (rev share, integrations) before establishing trust. Start simple: one newsletter mention. Build from there.',
      'Not tracking partner traffic. If you can\'t measure it, you can\'t scale it. UTM parameters on every partner link are non-negotiable.'
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Task 22: First Month Review
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phase3-22',
    phase: 3,
    phaseLabel: 'First 30 Days',
    tier: 'launcher',
    title: 'First Month Review',
    description:
      'A structured 30-day review helps you decide whether to double down on what\'s working, fix what\'s broken, or pivot before you invest another month in the wrong direction.',
    timeEstimate: '3-4 hours',
    icon: '📅',
    category: 'Strategy',

    steps: [
      {
        title: 'Compile 30-day metrics',
        description: 'Pull numbers from every source: analytics, email, revenue, support. Don\'t skip this step — without numbers, your retrospective is based on feelings, not facts.',
        subtasks: [
          { title: 'Pull analytics: visitors, signups, activation rate, retention rate', description: 'Check Plausible/PostHog. Calculate: what % of signups activated? What % are still active after 30 days?' },
          { title: 'Pull revenue: MRR, paying customers, churn rate', description: 'If you have < 30 days of data, extrapolate carefully.' },
          { title: 'Pull channel data: top traffic sources, email open rates, community mentions', description: 'Which channels drove the most high-quality users?' }
        ]
      },
      {
        title: 'Answer the 4 key month-1 questions',
        description: 'These questions determine your strategy for month 2. Answer them with data, not optimism.',
        subtasks: [
          { title: 'Q1: Do users who activate retain for 30 days?', description: 'If activation rate > 50% and day-30 retention > 30%, your core product works. If not, fix this before growth.' },
          { title: 'Q2: Which acquisition channel has the best signup quality?', description: 'Not just volume — which channel sent users who actually used the product?' },
          { title: 'Q3: What are users using most? Least?', description: 'Check PostHog events. The most-used features tell you what\'s valuable. The least-used tell you what to cut or improve.' },
          { title: 'Q4: What\'s the #1 thing users ask for that you don\'t have?', description: 'Check support inbox, feedback form, user interviews. This is your roadmap priority.' }
        ]
      },
      {
        title: 'Set month-2 strategy',
        description: 'Based on your answers, choose one of three stances: Double down (product works, focus on growth), Improve (product has gaps, focus on retention before growth), or Pivot (core assumptions were wrong, rethink the product).',
        subtasks: [
          { title: 'Choose your month-2 stance', description: 'Double down, improve, or pivot. Be honest about what the data says.' },
          { title: 'Set 3 month-2 goals with measurable outcomes', description: 'Each goal should answer: what metric, what target, by what date.' },
          { title: 'Identify which Phase 4 tasks to prioritize', description: 'Look at Phase 4 and pick the 2-3 most relevant to your current situation.' }
        ]
      }
    ],

    formFields: [
      { id: 'app_name', type: 'text', label: 'App name', placeholder: 'LaunchPilot', required: true },
      { id: 'app_description', type: 'textarea', label: 'What does your app do?', placeholder: 'Brief description', required: true },
      { id: 'target_audience', type: 'textarea', label: 'Target audience', placeholder: 'Who is your user?', required: true }
    ],

    aiConfig: {
      promptTemplate: `You are a startup advisor reviewing an indie developer's first 30 days.

App: {app_name}
Description: {app_description}
Target user: {target_audience}

Generate:
1. A 30-day review template with all key metrics to collect
2. A decision framework for "double down vs. improve vs. pivot"
3. A month-2 goal-setting template (3 goals with measurable targets)
4. A "month 1 in review" post template for Indie Hackers`,
      temperature: 0.65,
      maxTokens: 1000
    },

    templates: [
      {
        title: '30-day metrics summary',
        content: `[App name] — Month 1 Numbers

ACQUISITION:
- Total visitors: [X] (top sources: [X], [X], [X])
- New signups: [X] ([X]% conversion rate)
- Paying customers: [X] ([X]% of signups)
- MRR: $[X]

RETENTION:
- Activation rate (used core feature): [X]%
- Day-30 retention: [X]%
- Churn rate: [X]%

ENGAGEMENT:
- Most-used feature: [feature]
- Least-used feature: [feature]
- Avg. sessions/user/week: [X]

FEEDBACK:
- Support tickets: [X] (top issue: [X])
- Feedback form responses: [X]
- NPS: [X] (if measured)

VERDICT: [Double down / Improve / Pivot] because [one sentence reason]`
      }
    ],

    tools: [
      { name: 'PostHog', url: 'https://posthog.com', freeDetails: 'Free. Check the retention cohort chart — it shows exactly what % of users return after day 1, 7, 14, 30.' }
    ],

    doneCriteria: [
      '30-day metrics compiled across all sources',
      '4 key questions answered with data',
      'Month-2 stance chosen (double down / improve / pivot)',
      '3 month-2 goals written with measurable targets',
      'Month-1 review post published'
    ],

    commonMistakes: [
      'Skipping this review because the numbers are disappointing. Bad numbers are the most important data you have. They tell you exactly what to fix.',
      'Setting month-2 goals without first understanding why month-1 numbers are what they are. Correlation isn\'t causation — understand the why before setting targets.',
      'Pivoting too quickly. One month is not enough data to pivot a product. It\'s enough to identify 2-3 improvements. Pivot only if your core assumption (users have this problem) is wrong.'
    ]
  }
]
