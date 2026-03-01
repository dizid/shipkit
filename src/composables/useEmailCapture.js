/**
 * Reusable email capture composable.
 * POSTs to the buttondown-subscribe Netlify function (server-side dual-write).
 * Replaces direct Supabase client-side insert.
 *
 * Usage:
 *   const { email, submitted, loading, error, captureEmail } = useEmailCapture('hero')
 */
import { ref } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'
import { useUtm } from '@/composables/useUtm'

export function useEmailCapture(source) {
  const { trackEmailCapture } = useAnalytics()
  const utm = useUtm()

  const email = ref('')
  const submitted = ref(false)
  const loading = ref(false)
  const error = ref(null)

  async function captureEmail() {
    if (!email.value) return
    loading.value = true
    error.value = null

    try {
      const resp = await fetch('/.netlify/functions/buttondown-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.value,
          source,
          utm_data: utm
        })
      })

      const data = await resp.json()

      if (!resp.ok) {
        throw new Error(data.error || 'Something went wrong. Try again.')
      }

      submitted.value = true
      trackEmailCapture(source)
    } catch (e) {
      error.value = e.message || 'Something went wrong. Try again.'
    } finally {
      loading.value = false
    }
  }

  return { email, submitted, loading, error, captureEmail }
}
