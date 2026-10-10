import { ref, type Ref } from 'vue'

export interface UseInputReturn<T = string> {
  value: Ref<T>
  onInput: (event: Event | T) => void
  setValue: (newValue: T) => void
  reset: () => void
}

export function useInput<T = string>(initialValue: T): UseInputReturn<T> {
  const value = ref(initialValue) as Ref<T>

  function onInput(event: Event | T) {
    if (event && typeof event === 'object' && 'target' in event) {
      const target = (event as Event).target as HTMLInputElement | HTMLTextAreaElement
      value.value = (target.value as unknown) as T
    } else {
      value.value = event as T
    }
  }

  function setValue(newValue: T) {
    value.value = newValue
  }

  function reset() {
    value.value = initialValue
  }

  return {
    value,
    onInput,
    setValue,
    reset,
  }
}