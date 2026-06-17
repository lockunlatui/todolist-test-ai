import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// Default fetch mock: simulates no backend (non-OK response).
// The useTodos hook catches this and falls back to localStorage,
// so existing tests that don't care about the API continue to work.
// Override per-test with vi.mocked(fetch).mockResolvedValueOnce(...).
global.fetch = vi.fn().mockResolvedValue({
  ok: false,
  status: 503,
} as Response);

beforeEach(() => {
  vi.mocked(fetch).mockResolvedValue({
    ok: false,
    status: 503,
  } as Response);
});
