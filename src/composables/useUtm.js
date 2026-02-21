/**
 * UTM parameter capture composable.
 * Call on page load to persist UTM params to sessionStorage.
 * Returns the stored UTM data for attaching to form submissions.
 *
 * Funnel: [Traffic Source] -> [Landing Page /] -> [Email Capture / Sign Up] -> [GA4 email_capture / sign_up]
 */
export function useUtm() {
  const params = new URLSearchParams(window.location.search)
  const utm = {
    source: params.get('utm_source'),
    medium: params.get('utm_medium'),
    campaign: params.get('utm_campaign'),
    content: params.get('utm_content'),
    term: params.get('utm_term')
  }

  // Only persist if at least utm_source is present
  if (utm.source) {
    sessionStorage.setItem('launchpilot_utm', JSON.stringify(utm))
  }

  return JSON.parse(sessionStorage.getItem('launchpilot_utm') || '{}')
}
