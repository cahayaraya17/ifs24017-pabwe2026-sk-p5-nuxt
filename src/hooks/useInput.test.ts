import { describe, it, expect } from 'vitest'
import { useInput } from './useInput'

describe('useInput', () => {
  it('menginisialisasi nilai awal dan mengatur perubahan nilai secara langsung', () => {
    const input = useInput('awal')
    expect(input.value.value).toBe('awal')

    input.setValue('berubah')
    expect(input.value.value).toBe('berubah')

    input.reset()
    expect(input.value.value).toBe('awal')
  })

  it('menangani onInput dari Event input HTML', () => {
    const input = useInput('')
    const fakeEvent = {
      target: { value: 'teks baru' },
    } as unknown as Event

    input.onInput(fakeEvent)
    expect(input.value.value).toBe('teks baru')
  })

  it('menangani onInput dengan nilai primitif langsung', () => {
    const input = useInput('lama')
    input.onInput('baru')
    expect(input.value.value).toBe('baru')
  })
})