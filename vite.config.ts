import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/helpers/**',
        'src/hooks/**',
        'src/features/auth/api/**',
        'src/features/auth/states/**',
        'src/features/users/api/**',
        'src/features/users/states/**',
        'src/features/cashflows/api/**',
        'src/features/cashflows/states/**',
        'src/router.options.ts',
      ],
      exclude: [
        '**/*.d.ts',
        '**/*.test.ts',
        'src/test-utils.ts',
        'src/setupTests.ts',
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
})