import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,vue}'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.d.ts',
        'src/app.vue',
        'src/app.html',
        'src/setupTests.ts',
        'src/test-utils.ts',
        'src/middleware/**',
        'src/pages/**',
        'src/features/common/**',
      ],
    },
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})