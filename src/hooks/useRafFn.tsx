import { useCallback } from "react";

export const useRafFn = () => {
  const init = useCallback(
    (fnc: () => void, options: { immediate?: boolean } = {}) => {
      let rafId: number | undefined;
      let running = false;
      const { immediate = true } = options || {};

      const frame = () => {
        rafId = requestAnimationFrame(() => {
          fnc();
          if (running) frame();
        });
      };

      const resume = () => {
        if (running) return;
        running = true;
        frame();
      };

      const pause = () => {
        running = false;
        if (rafId !== undefined) cancelAnimationFrame(rafId);
        rafId = undefined;
      };

      if (immediate) resume();

      return {
        resume,
        pause,
      };
    },
    []
  );

  return {
    init,
  };
};
