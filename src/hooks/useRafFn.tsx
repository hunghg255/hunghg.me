//@ts-nocheck
import { useRef } from "react";

export const useRafFn = () => {
  const refStarted = useRef<any>();
  const refStop = useRef<any>();

  const init = (fnc, options) => {
    let rafId: number;
    let running = false;
    const { immediate = true } = options || {};

    const frame = () => {
      rafId = requestAnimationFrame(() => {
        fnc();
        running && frame();
      });
    };

    refStarted.current = () => {
      running = true;
      frame();
    };

    refStop.current = () => {
      running = false;
      rafId && cancelAnimationFrame(rafId);
      rafId = undefined;
    };

    immediate && refStarted.current();

    return {
      resume: refStarted.current,
      pause: refStop.current,
    };
  };

  return {
    init,
  };
};
