/**
 * @type {import('lint-staged').Configuration}
 */
const lintStagedConfig = {
  "*.{js,jsx,ts,tsx}": ["oxlint --fix", "oxfmt --write"],
  "*.mdx": "oxfmt --write",
};

export default lintStagedConfig;
