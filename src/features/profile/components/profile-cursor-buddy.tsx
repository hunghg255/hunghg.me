"use client";

import { CursorBuddy } from "@/components/cursor-buddy";

export function ProfileCursorBuddy() {
  return (
    <CursorBuddy
      directions="/mascots/hung-directions.webp"
      reactions="/mascots/hung-reactions.webp"
      size={88}
      label="Hung cursor buddy — click for a reaction"
      className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    />
  );
}
