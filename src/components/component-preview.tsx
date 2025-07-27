"use client";

import { RepeatIcon } from "lucide-react";
import React, { useMemo, useState } from "react";

import { Index } from "@/__registry__/index";
import { cn } from "@/lib/utils";

import { CodeCollapsibleWrapper } from "./code-collapsible-wrapper";
import { OpenInV0Button } from "./open-in-v0";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { SimpleTooltip } from "./ui/tooltip";
import { Code as CodeInline } from "./ui/typography";

export function ComponentPreview({
  className,
  name,
  openInV0Url,
  canReplay = false,
  notProse = true,
  codeCollapsible = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  name: string;
  openInV0Url?: string;
  canReplay?: boolean;
  notProse?: boolean;
  codeCollapsible?: boolean;
}) {
  const [replay, setReplay] = useState(0);

  const Codes = React.Children.toArray(children) as React.ReactElement[];
  const Code = Codes[0];

  const Preview = useMemo(() => {
    const Component = Index[name]?.component;

    if (!Component) {
      return (
        <p className="text-sm text-muted-foreground">
          Component <CodeInline>{name}</CodeInline> not found in registry.
        </p>
      );
    }

    return <Component />;
  }, [name]);

  return (
    <div className={cn("my-6", notProse && "not-prose", className)} {...props}>
      <Tabs defaultValue="preview" className="gap-4">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <div className="rounded-lg border border-edge bg-zinc-950/0.75 bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-size-[10px_10px] bg-center p-4 [--pattern-foreground:var(--color-zinc-950)]/5 dark:bg-white/0.75 dark:[--pattern-foreground:var(--color-white)]/5">
            {(canReplay || openInV0Url) && (
              <div className="flex justify-end gap-2">
                {canReplay && (
                  <SimpleTooltip content="Replay">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setReplay((v) => v + 1)}
                    >
                      <RepeatIcon />
                    </Button>
                  </SimpleTooltip>
                )}

                {openInV0Url && <OpenInV0Button url={openInV0Url} />}
              </div>
            )}

            <div
              key={replay}
              className="flex min-h-80 items-center justify-center font-sans"
            >
              <React.Suspense
                fallback={
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    Loading...
                  </div>
                }
              >
                {Preview}
              </React.Suspense>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="code" className="[&>figure]:m-0">
          {codeCollapsible ? (
            <CodeCollapsibleWrapper className="my-0">
              {Code}
            </CodeCollapsibleWrapper>
          ) : (
            Code
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
