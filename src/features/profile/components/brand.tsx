import { ArrowRightIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

import { LogoMark } from "@/components/logo-mark";
import { LogoWordmark } from "@/components/logo-wordmark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Panel, PanelHeader, PanelTitle } from "./panel";

const BrandContextMenu = dynamic(() =>
  import("@/components/brand-context-menu").then((mod) => mod.BrandContextMenu)
);

export function Brand() {
  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>Brand</PanelTitle>
      </PanelHeader>

      <BrandContextMenu>
        <div
          className={cn(
            "[--pattern-foreground:var(--color-zinc-950)]/5 dark:[--pattern-foreground:var(--color-white)]/5",
            "bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-size-[10px_10px] bg-center",
            "bg-zinc-950/0.75 dark:bg-white/0.75"
          )}
        >
          <div className="grid grid-cols-[2.5rem_1fr]">
            <div className="flex h-28 items-center justify-center border-r border-dashed border-edge bg-background">
              <span className="rotate-270 font-mono text-sm text-muted-foreground select-none">
                Mark
              </span>
            </div>

            <div className="screen-line-after flex items-center justify-center pr-8 after:z-1">
              <LogoMark className="h-8 w-auto sm:h-12" />
            </div>

            <div className="flex h-28 items-center justify-center border-r border-dashed border-edge bg-background">
              <span className="rotate-270 font-mono text-sm text-muted-foreground select-none">
                Logotype
              </span>
            </div>

            <div className="screen-line-after flex items-center justify-center pr-8 after:z-1">
              <LogoWordmark className="h-6 w-auto sm:h-10" />
            </div>
          </div>
        </div>
      </BrandContextMenu>

      <div className="flex h-12 items-center justify-center pb-px">
        <Button variant="default" asChild>
          <Link href="/blog/chanhdai-brand">
            ChanhDai Brand
            <ArrowRightIcon />
          </Link>
        </Button>
      </div>
    </Panel>
  );
}
