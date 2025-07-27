import { Button } from "@/components/ui/button";

import { Icons } from "./icons";

export function OpenInV0Button({ url }: { url: string }) {
  return (
    <Button className="not-prose gap-1 font-sans" variant="default" asChild>
      <a
        href={`https://v0.dev/chat/api/open?url=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open in v0"
      >
        Open in
        <Icons.v0 className="size-5" />
      </a>
    </Button>
  );
}
