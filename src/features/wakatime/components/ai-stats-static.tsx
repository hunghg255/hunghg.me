"use client";

import {
  BotIcon,
  CoinsIcon,
  CpuIcon,
  MessageSquareTextIcon,
  SparklesIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { WakatimeStatsResponse } from "@/types/wakatime";

interface AiStatsStaticProps {
  stats: WakatimeStatsResponse;
}

// Categorical slots 1 & 2, stepped separately for light and dark surfaces
const SERIES = {
  ai: {
    label: "AI",
    swatch: "bg-[#eb6834] dark:bg-[#d95926]",
  },
  human: {
    label: "Human",
    swatch: "bg-[#2a78d6] dark:bg-[#3987e5]",
  },
} as const;

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const fullNumber = new Intl.NumberFormat("en-US");

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function formatPercent(value: number) {
  if (value > 0 && value < 1) return "<1%";
  return `${Math.round(value)}%`;
}

export function AiStatsStatic({ stats }: AiStatsStaticProps) {
  const data = stats.data;

  const aiAdditions = data.ai_additions ?? 0;
  const aiDeletions = data.ai_deletions ?? 0;
  const humanAdditions = data.human_additions ?? 0;
  const humanDeletions = data.human_deletions ?? 0;

  const aiLines = aiAdditions + aiDeletions;
  const humanLines = humanAdditions + humanDeletions;
  const totalLines = aiLines + humanLines;

  const models = [...(data.ai_model_breakdown ?? [])]
    .filter((model) => model.lines > 0 || model.cost > 0)
    .sort((a, b) => b.lines - a.lines);

  const aiCodingTime = data.categories?.find(
    (category) => category.name === "AI Coding"
  );

  const hasAiData =
    totalLines > 0 ||
    models.length > 0 ||
    (data.ai_sessions ?? 0) > 0 ||
    Boolean(aiCodingTime);

  if (!hasAiData) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">
          No AI activity tracked for this time range
        </p>
      </div>
    );
  }

  const aiPercent = totalLines > 0 ? (aiLines / totalLines) * 100 : 0;
  const humanPercent = totalLines > 0 ? 100 - aiPercent : 0;

  const inputTokens =
    (data.ai_input_tokens ?? 0) + (data.ai_cached_input_tokens ?? 0);
  const outputTokens = data.ai_output_tokens ?? 0;

  const tiles = [
    {
      icon: SparklesIcon,
      label: "AI coding time",
      value: aiCodingTime?.text || "0 mins",
      detail: aiCodingTime
        ? `${formatPercent(aiCodingTime.percent)} of coding time`
        : undefined,
    },
    {
      icon: MessageSquareTextIcon,
      label: "Prompts",
      value: fullNumber.format(data.ai_prompt_events_total ?? 0),
      detail: `${fullNumber.format(data.ai_sessions ?? 0)} sessions`,
    },
    {
      icon: CpuIcon,
      label: "Tokens",
      value: compactNumber.format(inputTokens + outputTokens),
      detail: `${compactNumber.format(inputTokens)} in · ${compactNumber.format(outputTokens)} out`,
    },
    {
      icon: CoinsIcon,
      label: "Estimated cost",
      value: currency.format(data.ai_model_total_cost ?? 0),
      detail: models.length
        ? `${models.length} ${models.length === 1 ? "model" : "models"}`
        : undefined,
    },
  ];

  const maxModelLines = Math.max(1, ...models.map((model) => model.lines));

  return (
    <div className="space-y-4">
      {totalLines > 0 && (
        <div className="rounded-lg border border-edge bg-background p-4">
          <p className="font-mono text-sm text-muted-foreground">
            Line changes written by AI
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="font-mono text-4xl font-semibold tracking-tight">
              {formatPercent(aiPercent)}
            </p>
            <p className="font-mono text-sm text-muted-foreground">
              {fullNumber.format(aiLines)} of {fullNumber.format(totalLines)}{" "}
              lines
            </p>
          </div>

          <div
            className="mt-4 flex h-3 gap-0.5"
            role="img"
            aria-label={`AI ${formatPercent(aiPercent)}, Human ${formatPercent(humanPercent)} of line changes`}
          >
            {aiLines > 0 && (
              <ShareSegment
                className={SERIES.ai.swatch}
                percent={aiPercent}
                tooltip={`AI · ${fullNumber.format(aiLines)} lines`}
              />
            )}
            {humanLines > 0 && (
              <ShareSegment
                className={SERIES.human.swatch}
                percent={humanPercent}
                tooltip={`Human · ${fullNumber.format(humanLines)} lines`}
              />
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
            <LegendItem
              swatch={SERIES.ai.swatch}
              label={SERIES.ai.label}
              percent={aiPercent}
              additions={aiAdditions}
              deletions={aiDeletions}
            />
            <LegendItem
              swatch={SERIES.human.swatch}
              label={SERIES.human.label}
              percent={humanPercent}
              additions={humanAdditions}
              deletions={humanDeletions}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="rounded-lg border border-edge bg-background p-3 transition-colors hover:border-foreground/20 sm:p-4"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <tile.icon className="size-4" />
              <p className="font-mono text-xs sm:text-sm">{tile.label}</p>
            </div>
            <p className="mt-2 font-mono text-base font-semibold sm:text-lg">
              {tile.value}
            </p>
            {tile.detail && (
              <p className="font-mono text-xs text-muted-foreground">
                {tile.detail}
              </p>
            )}
          </div>
        ))}
      </div>

      {models.length > 0 && (
        <div className="rounded-lg border border-edge bg-background p-4">
          <div className="mb-4 flex items-center gap-2">
            <BotIcon className="size-4 text-muted-foreground" />
            <h3 className="font-mono text-sm font-semibold">AI Models</h3>
            <span className="ml-auto font-mono text-xs text-muted-foreground">
              lines · est. cost
            </span>
          </div>

          <ul className="space-y-3">
            {models.slice(0, 6).map((model) => (
              <li key={model.name} className="group/model space-y-1">
                <div className="flex justify-between gap-2 text-sm">
                  <span className="truncate font-mono text-muted-foreground">
                    {model.name}
                  </span>
                  <span className="shrink-0 font-mono">
                    <span className="font-semibold">
                      {fullNumber.format(model.lines)}
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      · {currency.format(model.cost)}
                    </span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-opacity group-hover/model:opacity-80",
                      SERIES.ai.swatch
                    )}
                    style={{ width: `${(model.lines / maxModelLines) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ShareSegment({
  className,
  percent,
  tooltip,
}: {
  className: string;
  percent: number;
  tooltip: string;
}) {
  return (
    <div
      className="group/segment relative h-full min-w-1"
      style={{ flexGrow: percent, flexBasis: 0 }}
    >
      <div
        className={cn(
          "h-full rounded-sm transition-opacity group-hover/segment:opacity-80",
          className
        )}
      />
      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-md border border-edge bg-popover px-2 py-1 font-mono text-xs whitespace-nowrap text-popover-foreground opacity-0 shadow-sm transition-opacity group-hover/segment:opacity-100">
        {tooltip}
      </div>
    </div>
  );
}

function LegendItem({
  swatch,
  label,
  percent,
  additions,
  deletions,
}: {
  swatch: string;
  label: string;
  percent: number;
  additions: number;
  deletions: number;
}) {
  return (
    <div className="flex items-center gap-2 font-mono text-sm">
      <span className={cn("size-2.5 shrink-0 rounded-sm", swatch)} />
      <span className="font-semibold">{label}</span>
      <span className="text-muted-foreground">{formatPercent(percent)}</span>
      <span className="text-muted-foreground">
        <span className="text-green-700 dark:text-green-400">
          +{compactNumber.format(additions)}
        </span>{" "}
        <span className="text-red-700 dark:text-red-400">
          −{compactNumber.format(deletions)}
        </span>
      </span>
    </div>
  );
}
