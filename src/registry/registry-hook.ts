import type { Registry } from "shadcn/registry";

export const hook: Registry["items"] = [
  {
    name: "use-controllable-state",
    type: "registry:hook",
    title: "Controllable State Hook",
    files: [
      {
        path: "src/hooks/use-layout-effect.tsx",
        type: "registry:hook",
      },
      {
        path: "src/hooks/use-controllable-state.ts",
        type: "registry:hook",
      },
    ],
  },
];
