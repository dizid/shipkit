import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },
  projects: [
    // Auth setup — runs first, saves login state
    {
      name: 'setup',
      testMatch: /auth\.setup\.js/
    },
    // Public pages — no auth needed
    {
      name: 'public',
      testMatch: /public-pages|navigation|auth-guard|auth-flow/,
      use: { browserName: 'chromium' }
    },
    // Authenticated tests — depend on setup
    {
      name: 'authenticated',
      testIgnore: /public-pages|navigation|auth-guard|auth-flow|auth\.setup/,
      use: {
        browserName: 'chromium',
        storageState: 'e2e/.auth/user.json'
      },
      dependencies: ['setup']
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 30000
  }
})
