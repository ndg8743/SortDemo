import { useEffect, useRef, useCallback } from 'react';
import NoSleepApp from 'no-sleep-app';
import type { NoSleepAppOptions } from 'no-sleep-app';

export function useNoSleep({ autoEnable = false, options = {} }: { autoEnable?: boolean; options?: NoSleepAppOptions } = {}) {
  const noSleepRef = useRef<NoSleepApp | null>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    noSleepRef.current = new NoSleepApp(optionsRef.current);

    if (autoEnable) {
      // Some browsers require this to be triggered by a user gesture
      noSleepRef.current.enable();
    }

    return () => {
      noSleepRef.current?.disable();
    };
  }, [autoEnable]);

  const enable = useCallback(() => {
    if (!noSleepRef.current) {
      noSleepRef.current = new NoSleepApp(optionsRef.current);
    }
    noSleepRef.current.enable();
  }, []);

  const disable = useCallback(() => {
    noSleepRef.current?.disable();
  }, []);

  const isEnabled = noSleepRef.current?.isEnabled ?? false;

  return { enable, disable, isEnabled };
}
