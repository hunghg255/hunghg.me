"use client";

import dayjs from "dayjs";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";

import { useIsClient } from "@/hooks/use-is-client";

export function Confetti({
  datesWithoutYear = [],
  datesWithYear = [],
}: {
  datesWithoutYear?: string[];
  datesWithYear?: string[];
}) {
  const isClient = useIsClient();

  const { width, height } = useWindowSize();

  const todayWithoutYear = dayjs().format("MM-DD");
  const todayWithYear = dayjs().format("YYYY-MM-DD");
  const shouldShow =
    datesWithoutYear.some(
      (date) => dayjs(date).format("MM-DD") === todayWithoutYear
    ) ||
    datesWithYear.some(
      (date) => dayjs(date).format("YYYY-MM-DD") === todayWithYear
    );

  if (!isClient) {
    return null;
  }

  if (!shouldShow) {
    return null;
  }

  return (
    <ReactConfetti
      className="fixed inset-0 z-50"
      width={width}
      height={height}
      numberOfPieces={300}
      gravity={0.3}
      recycle={false}
    />
  );
}
