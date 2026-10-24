"use client";

import { cn } from "@/lib/utils";

interface RangeSelectorProps {
  value: string;
  onChange: (range: string) => void;
  className?: string;
}

const ranges = [
  { value: "last_7_days", label: "7 Days", shortLabel: "7D" },
  { value: "last_30_days", label: "30 Days", shortLabel: "30D" },
  { value: "last_6_months", label: "6 Months", shortLabel: "6M" },
  { value: "last_year", label: "Year", shortLabel: "1Y" },
  { value: "all_time", label: "All Time", shortLabel: "All" },
];

export function RangeSelector({
  value,
  onChange,
  className,
}: RangeSelectorProps) {
  return (
    <div
      role="group"
      aria-label="Time range"
      className={cn(
        "grid grid-cols-5 gap-1 rounded-lg border border-edge p-1 sm:inline-grid",
        className
      )}
    >
      {ranges.map((range) => {
        const isActive = value === range.value;

        return (
          <button
            key={range.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(range.value)}
            className={cn(
              "min-h-10 rounded-md px-1 font-mono text-xs whitespace-nowrap transition-colors sm:px-3 sm:text-sm",
              isActive
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <span className="min-[420px]:hidden">{range.shortLabel}</span>
            <span className="max-[420px]:hidden">{range.label}</span>
          </button>
        );
      })}
    </div>
  );
}
