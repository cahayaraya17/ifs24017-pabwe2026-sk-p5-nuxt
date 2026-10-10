import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock default browser APIs jika diperlukan
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
})