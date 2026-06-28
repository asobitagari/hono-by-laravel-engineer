import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    env: {
      DATABASE_URL: process.env.DATABASE_URL ?? ':memory:',
      JWT_SECRET: process.env.JWT_SECRET ?? 'test-secret',
    },
    setupFiles: ['./src/__tests__/setup.ts'],
  },
})
