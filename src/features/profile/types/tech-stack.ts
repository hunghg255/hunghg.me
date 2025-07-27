export type TechStack = {
  key: string; // Unique identifier used to fetch the corresponding icon
  title: string; // Display name of the technology
  href: string; // Official website URL of the technology
  categories: string[];
  theme?: boolean; // If `true`, the icon changes based on dark and light mode
  // Icon paths:
  // - Default: ./public/tech-stack-icons/[key].svg
  // - Dark mode (if `theme: true`): ./public/tech-stack-icons/[key]-dark.svg
  // - Light mode (if `theme: true`): ./public/tech-stack-icons/[key]-light.svg
};
