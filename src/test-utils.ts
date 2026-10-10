import { mount, type MountingOptions } from '@vue/test-utils'
import { createPinia, type Pinia } from 'pinia'
import { createRouter, createMemoryHistory, type Router } from 'vue-router'
import { routes } from './routes'

export function createMockPinia(): Pinia {
  return createPinia()
}

export function createTestRouter(): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes,
  })
}

export interface RenderWithProvidersOptions extends MountingOptions<any> {
  pinia?: Pinia
  router?: Router
  initialRoute?: string
}

export async function renderWithProviders(
  component: any,
  options: RenderWithProvidersOptions = {}
) {
  const pinia = options.pinia || createMockPinia()
  const router = options.router || createTestRouter()

  if (options.initialRoute) {
    await router.push(options.initialRoute)
    await router.isReady()
  }

  const { plugins = [], stubs = {}, ...restOptions } = options.global || {}

  return mount(component, {
    ...options,
    global: {
      ...options.global,
      plugins: [pinia, router, ...plugins],
      stubs: {
        NuxtPage: { template: '<router-view />' },
        NuxtLink: { template: '<a><slot /></a>' },
        ...stubs,
      },
    },
  })
}