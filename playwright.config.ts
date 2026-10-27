import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  timeout: 45_000,
  expect: { timeout: 5_000 },
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4391', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: [
    { command: 'python3 -m http.server 4391 --bind 127.0.0.1 --directory dist', url: 'http://127.0.0.1:4391/santuario/', timeout: 10_000 },
    { command: 'python3 -m http.server 4174 --bind 127.0.0.1 --directory reference/El-Santuario-Premium-Codex/dist', url: 'http://127.0.0.1:4174/', timeout: 10_000, reuseExistingServer: !process.env.CI },
  ],
});
