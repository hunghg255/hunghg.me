import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const result = matchMedia(query);

    result.addEventListener(
      "change",
      (event: MediaQueryListEvent) => {
        setValue(event.matches);
      },
      { signal }
    );

    setValue(result.matches);

    return () => {
      abortController.abort();
    };
  }, [query]);

  return value;
}
