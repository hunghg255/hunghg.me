"use client";

import { CodeIcon, FolderIcon, MonitorIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  items: Array<{
    name: string;
    percent: number;
    text: string;
    color: string;
  }>;
  title: string;
  icon: React.ReactNode;
}

interface CodingChartsStaticProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stats: any; // Keep any for simplicity
}

function ProgressBar({ items, title, icon }: ProgressBarProps) {
  // Only show top 5 items to avoid clutter
  const topItems = items.slice(0, 5);

  return (
    <div className="rounded-lg border border-edge bg-background p-4">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h3 className="font-mono text-sm font-semibold">{title}</h3>
      </div>

      <div className="space-y-3">
        {topItems.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between gap-1 text-sm">
              <span className="font-mono text-muted-foreground">
                {item.name}
              </span>
              <span className="text-left font-mono font-semibold">
                {item.text}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className={cn("h-full rounded-full", item.color)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CodingChartsStatic({ stats }: CodingChartsStaticProps) {
  if (!stats?.data) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No chart data available</p>
      </div>
    );
  }

  const { languages = [], projects = [], editors = [] } = stats.data;

  // Define colors for different categories
  const languageColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-purple-500",
  ];

  const projectColors = [
    "bg-indigo-500",
    "bg-cyan-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500",
  ];

  const editorColors = [
    "bg-violet-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-slate-500",
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const languagesWithColors = languages.map((lang: any, index: number) => ({
    ...lang,
    color: languageColors[index % languageColors.length],
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projectsWithColors = projects.map((project: any, index: number) => ({
    ...project,
    color: projectColors[index % projectColors.length],
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorsWithColors = editors.map((editor: any, index: number) => ({
    ...editor,
    color: editorColors[index % editorColors.length],
  }));

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <ProgressBar
        items={languagesWithColors}
        title="Languages"
        icon={<CodeIcon className="size-4 text-muted-foreground" />}
      />

      <ProgressBar
        items={projectsWithColors}
        title="Projects"
        icon={<FolderIcon className="size-4 text-muted-foreground" />}
      />

      <ProgressBar
        items={editorsWithColors}
        title="Editors"
        icon={<MonitorIcon className="size-4 text-muted-foreground" />}
      />
    </div>
  );
}
