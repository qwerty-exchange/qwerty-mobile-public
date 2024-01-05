import { useEffect } from 'react';
import { AppState } from 'react-native';

export function useAppState(onChange) {
  useEffect(() => {
    const sub = AppState.addEventListener('change', onChange);
    return () => {
      sub.remove();
    };
  }, [onChange]);
}
