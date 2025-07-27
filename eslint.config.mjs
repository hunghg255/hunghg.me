import { FlatCompat } from "@eslint/eslintrc";
// import boundaries from "eslint-plugin-boundaries";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * @type {import("eslint").Linter.Config}
 * */
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",
    },
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  // {
  //   // Thanks @WebDevSimplified
  //   plugins: {
  //     boundaries,
  //   },
  //   settings: {
  //     "boundaries/include": ["src/**/*"],
  //     "boundaries/ignore": ["src/scripts/**/*", "src/__registry__/**/*"],
  //     "boundaries/elements": [
  //       {
  //         mode: "full",
  //         type: "shared",
  //         pattern: [
  //           "src/components/**/*",
  //           "src/config/**/*",
  //           "src/data/**/*",
  //           "src/hooks/**/*",
  //           "src/lib/**/*",
  //           "src/registry/**/*",
  //           "src/styles/**/*",
  //           "src/types/**/*",
  //           "src/utils/**/*",
  //         ],
  //       },
  //       {
  //         mode: "full",
  //         type: "feature",
  //         capture: ["featureName"],
  //         pattern: ["src/features/*/**/*"],
  //       },
  //       {
  //         mode: "full",
  //         type: "app",
  //         capture: ["_", "fileName"],
  //         pattern: ["src/app/**/*"],
  //       },
  //       {
  //         mode: "full",
  //         type: "neverImport",
  //         pattern: ["src/*"],
  //       },
  //     ],
  //   },
  //   rules: {
  //     "boundaries/no-unknown": ["error"],
  //     "boundaries/no-unknown-files": ["error"],
  //     "boundaries/element-types": [
  //       "error",
  //       {
  //         default: "disallow",
  //         rules: [
  //           {
  //             from: ["shared"],
  //             allow: ["shared"],
  //           },
  //           {
  //             from: ["feature"],
  //             allow: [
  //               "shared",
  //               ["feature", { featureName: "${from.featureName}" }],
  //             ],
  //           },
  //           {
  //             from: ["app", "neverImport"],
  //             allow: ["shared", "feature"],
  //           },
  //           {
  //             from: ["app"],
  //             allow: [
  //               ["app", { fileName: "*.css" }],
  //               ["app", { fileName: "*.{ts,tsx}" }],
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // },
];

export default eslintConfig;
