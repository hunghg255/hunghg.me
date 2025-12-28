"use client";

import { MoonStarIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useCallback } from "react";

import { META_THEME_COLORS } from "@/config/site";
import { useMetaColor } from "@/hooks/use-meta-color";

import { Button } from "./ui/button";
import { useSound } from "@/hooks/use-sound";

export function ToggleTheme() {
  const { resolvedTheme, setTheme } = useTheme();

  const { setMetaColor } = useMetaColor();
  const playClick = useSound("/audio/ui-sounds/click.wav");

  const handleToggle = useCallback(() => {
    playClick(0.5);

    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setMetaColor(
      resolvedTheme === "dark"
        ? META_THEME_COLORS.light
        : META_THEME_COLORS.dark
    );
  }, [resolvedTheme, setTheme, playClick, setMetaColor]);

  return (
    <Button variant="outline" size="icon" onClick={handleToggle}>
      <MoonStarIcon className="hidden [html.dark_&]:block" />
      <SunIcon className="hidden [html.light_&]:block" />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
}
