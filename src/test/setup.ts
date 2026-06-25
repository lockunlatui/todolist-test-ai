import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Reset DOM and persisted storage between tests so the localStorage-backed
// useTodos hook does not leak state across test cases.
afterEach(() => {
  cleanup()
  localStorage.clear()
})
