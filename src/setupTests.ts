import { vi } from 'vitest'

// Mock sweetalert2 agar tidak melempar uncaught error di DOM headless
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn().mockResolvedValue({ isConfirmed: true, isDismissed: false }),
    close: vi.fn(),
  },
}))