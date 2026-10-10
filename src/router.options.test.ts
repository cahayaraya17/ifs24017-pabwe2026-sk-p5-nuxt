import { describe, it, expect } from 'vitest'
import routerOptions from './router.options'
import { routes } from './routes'

describe('router.options.ts', () => {
  it('mengembalikan deklarasi routes yang benar', () => {
    expect(routerOptions).toBeDefined()
    expect(routerOptions.routes).toBeDefined()
    if (typeof routerOptions.routes === 'function') {
      const res = routerOptions.routes([])
      expect(res).toBe(routes)
    }
  })
})