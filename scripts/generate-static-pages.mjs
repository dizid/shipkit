#!/usr/bin/env node
/**
 * Postbuild step (see package.json's "build" script): writes
 * dist/pricing/index.html and dist/score/index.html with real,
 * route-specific title/description/OG/canonical, so crawlers that don't
 * execute JS see distinct content per page instead of index.html's generic
 * tags repeated everywhere. Both pages are fully static (no DB/auth
 * dependency), so this just templates dist/index.html directly rather than
 * running the app through SSR — the interactive page itself is untouched,
 * client-side useSeo() calls (src/composables/useSeo.js) still refine these
 * same tags further after hydration.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = resolve(__dirname, '..', 'dist')
const SITE_URL = 'https://launchpilot.marketing'

const PAGES = [
  {
    path: '/pricing',
    title: 'Pricing | LaunchPilot',
    description: "Start free. Upgrade when you're ready to go all-in on your launch. 30-day money-back guarantee on all paid plans."
  },
  {
    path: '/score',
    title: 'Launch Readiness Score | LaunchPilot',
    description: "Answer 8 quick questions about your app's marketing readiness and get a personalized gap report. Takes 60 seconds."
  }
]

function escapeHtml(str = '') {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function renderPage(template, page) {
  const url = `${SITE_URL}${page.path}`

  return template
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/>/,
      `<meta name="description" content="${escapeHtml(page.description)}" />`
    )
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(page.title)}" />`)
    .replace(
      /<meta property="og:description" content="[^"]*"\s*\/>/,
      `<meta property="og:description" content="${escapeHtml(page.description)}" />`
    )
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`)
    .replace(
      /<meta name="twitter:description" content="[^"]*"\s*\/>/,
      `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`
    )
}

async function main() {
  const template = await readFile(resolve(DIST, 'index.html'), 'utf-8')

  for (const page of PAGES) {
    const outDir = resolve(DIST, page.path.replace(/^\//, ''))
    await mkdir(outDir, { recursive: true })
    await writeFile(resolve(outDir, 'index.html'), renderPage(template, page), 'utf-8')
  }

  console.log(`Generated ${PAGES.length} static SEO page(s).`)
}

main().catch((err) => {
  console.error(`generate-static-pages failed: ${err.message}`)
  process.exitCode = 1
})
