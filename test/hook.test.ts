import { renderHook } from '@testing-library/react';
import { useState, useCallback } from 'react';

function useCounter() {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => setCount((x) => x + 1), []);
  return { count, increment };
}

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
    result.current.increment();
    expect(result.current.count).toBe(1);
  });
});
