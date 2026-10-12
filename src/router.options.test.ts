import { describe, it, expect } from 'vitest'
import type { RouteRecordRaw } from 'vue-router'
import routerOptions from './router.options'
import { routes } from './routes'

async function resolveAllComponents(list: RouteRecordRaw[]): Promise<number> {
  let total = 0
  for (const route of list) {
    if (typeof route.component === 'function') {
      const mod = await (route.component as () => Promise<any>)()
      expect(mod.default).toBeDefined()
      total++
    }
    if (route.children) {
      total += await resolveAllComponents(route.children)
    }
  }
  return total
}

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

describe('routes.ts', () => {
  it('seluruh komponen lazy-load dapat di-resolve', async () => {
    const total = await resolveAllComponents(routes)
    expect(total).toBe(9)
  })
})