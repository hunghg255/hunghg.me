import type { Registry } from "shadcn/registry";

export const components: Registry["items"] = [
  {
    name: "theme-switcher",
    type: "registry:component",
    description:
      "A theme switcher component for Next.js apps with next-themes and Tailwind CSS, supporting system, light, and dark modes.",
    title: "Theme Switcher",
    author: "ncdai <dai@hunghg.me>",
    dependencies: ["next-themes", "lucide-react", "motion"],
    registryDependencies: ["<registryBaseUrl>/utils.json"],
    files: [
      {
        path: "theme-switcher/theme-switcher.tsx",
        type: "registry:component",
      },
    ],
    docs: "https://hunghg.me/components/theme-switcher-component",
  },
  {
    name: "flip-sentences",
    type: "registry:component",
    title: "Flip Sentences",
    author: "ncdai <dai@hunghg.me>",
    dependencies: ["motion"],
    registryDependencies: ["<registryBaseUrl>/utils.json"],
    files: [
      {
        path: "flip-sentences/flip-sentences.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "apple-hello-effect",
    type: "registry:component",
    description:
      "Create a Xin chào and Hello writing effect inspired by Apple using Motion for React.",
    title: "Apple Hello Effect",
    author: "ncdai <dai@hunghg.me>",
    dependencies: ["motion"],
    registryDependencies: ["<registryBaseUrl>/utils.json"],
    files: [
      {
        path: "apple-hello-effect/apple-hello-effect.tsx",
        type: "registry:component",
      },
    ],
    docs: "https://hunghg.me/components/writing-effect-inspired-by-apple",
  },
  {
    name: "wheel-picker",
    type: "registry:component",
    description:
      "iOS-like wheel picker for React with smooth inertia scrolling and infinite loop support.",
    title: "Wheel Picker",
    author: "ncdai <dai@hunghg.me>",
    dependencies: ["@ncdai/react-wheel-picker"],
    registryDependencies: ["<registryBaseUrl>/utils.json"],
    files: [
      {
        path: "wheel-picker/wheel-picker.tsx",
        type: "registry:component",
      },
    ],
    docs: "https://hunghg.me/components/react-wheel-picker",
  },
  {
    name: "work-experience",
    type: "registry:component",
    description:
      "Displays a list of work experiences with role details and durations.",
    title: "Work Experience",
    author: "ncdai <dai@hunghg.me>",
    dependencies: ["react-markdown", "lucide-react"],
    devDependencies: ["@tailwindcss/typography"],
    registryDependencies: [
      "<registryBaseUrl>/utils.json",
      "collapsible",
      "separator",
    ],
    files: [
      {
        path: "work-experience/work-experience.tsx",
        type: "registry:component",
      },
    ],
    cssVars: {
      light: {
        background: "oklch(1 0 0)",
        muted: "oklch(0.967 0.001 286.375)",
        "muted-foreground": "oklch(0.552 0.016 285.938)",
        border: "oklch(0.92 0.004 286.32)",
      },
      dark: {
        background: "oklch(0.141 0.005 285.823)",
        muted: "oklch(0.274 0.006 286.033)",
        "muted-foreground": "oklch(0.705 0.015 286.067)",
        border: "oklch(0.274 0.006 286.033)",
      },
    },
    docs: "https://hunghg.me/components/work-experience-component",
  },
];
