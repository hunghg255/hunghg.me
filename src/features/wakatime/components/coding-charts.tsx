"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

interface LanguageData {
  name: string;
  total_seconds: number;
  percent: number;
  text: string;
}

interface ProjectData {
  name: string;
  total_seconds: number;
  percent: number;
  text: string;
}

interface EditorData {
  name: string;
  total_seconds: number;
  percent: number;
  text: string;
}

interface ChartData {
  languages: LanguageData[];
  projects: ProjectData[];
  editors: EditorData[];
}

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

function ProgressBar({ items, title, icon }: ProgressBarProps) {
  // Only show top 5 items for better visual
  const topItems = items.slice(0, 5);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-mono text-sm font-medium">{title}</h3>
      </div>

      <div className="space-y-2">
        {topItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="space-y-1"
          >
            <div className="flex justify-between font-mono text-xs">
              <span className="text-foreground">{item.name}</span>
              <span className="text-right text-muted-foreground">
                {item.text} ({item.percent.toFixed(1)}%)
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percent}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={cn("h-full rounded-full", item.color)}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function CodingCharts({
  className,
  range = "last_7_days",
}: {
  className?: string;
  range?: string;
}) {
  const [data, setData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(`/api/wakatime-stats?range=${range}`);
        const result = await response.json();

        if (result.error) {
          throw new Error("Failed to fetch data");
        }

        setData({
          languages: result.data.languages || [],
          projects: result.data.projects || [],
          editors: result.data.editors || [],
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [range]);

  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 gap-6 lg:grid-cols-3", className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-64 rounded-lg border border-edge bg-muted p-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className={cn("py-8 text-center", className)}>
        <p className="text-muted-foreground">Unable to load chart data</p>
      </div>
    );
  }

  const languageColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];

  const projectColors = [
    "bg-emerald-500",
    "bg-sky-500",
    "bg-violet-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-lime-500",
    "bg-fuchsia-500",
    "bg-slate-500",
    "bg-stone-500",
    "bg-zinc-500",
  ];

  const editorColors = [
    "bg-purple-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-cyan-500",
  ];

  const languagesWithColors = data.languages.map((lang, index) => ({
    ...lang,
    color: languageColors[index % languageColors.length],
  }));

  const projectsWithColors = data.projects.map((project, index) => ({
    ...project,
    color: projectColors[index % projectColors.length],
  }));

  const editorsWithColors = data.editors.map((editor, index) => ({
    ...editor,
    color: editorColors[index % editorColors.length],
  }));

  return (
    <div className={cn("grid grid-cols-1 gap-6 lg:grid-cols-3", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-lg border border-edge bg-background p-4"
      >
        <ProgressBar
          items={languagesWithColors}
          title="Languages"
          icon={<span className="text-lg">💻</span>}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="rounded-lg border border-edge bg-background p-4"
      >
        <ProgressBar
          items={projectsWithColors}
          title="Projects"
          icon={<span className="text-lg">📁</span>}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="rounded-lg border border-edge bg-background p-4"
      >
        <ProgressBar
          items={editorsWithColors}
          title="Editors"
          icon={<span className="text-lg">⚡</span>}
        />
      </motion.div>
    </div>
  );
}
