import { useHead, useSeoMeta } from '@unhead/vue'

/**
 * Per-route SEO composable wrapping @unhead/vue.
 * Call inside a component's <script setup> or setup() to set page-level meta.
 *
 * @param {object} options
 * @param {string} options.title       - Page title (appended with "| LaunchPilot")
 * @param {string} options.description - Meta description
 * @param {string} [options.path]      - Route path for canonical URL (e.g. '/pricing')
 * @param {string} [options.image]     - Absolute OG image URL (falls back to og-image.svg)
 */
export function useSeo({ title, description, path, image }) {
  const baseUrl = 'https://launchpilot.example.com'
  const fullUrl = `${baseUrl}${path || '/'}`
  const fullImage = image || `${baseUrl}/og-image.svg`

  useHead({
    title: `${title} | LaunchPilot`,
    link: [{ rel: 'canonical', href: fullUrl }]
  })

  useSeoMeta({
    ogTitle: title,
    ogDescription: description,
    ogUrl: fullUrl,
    ogImage: fullImage,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: fullImage
  })
}
