# Development

This guide provides instructions on how to set up and run the project locally.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [pnpm](https://pnpm.io/)
- [Git](https://git-scm.com/)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/hunghg255/hunghg.me.git minimal-portfolio
cd minimal-portfolio
```

### 2. Install dependencies

```bash
pnpm i
```

### 3. Configure Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Then, update the necessary environment variables inside `.env.local`.

### 4. Run the development server

```bash
pnpm dev
```

The application should now be available at http://localhost:1408

## Building for Production

```bash
pnpm build
```

After building, start the application with:

```bash
NODE_ENV=production pnpm start
```

## Registry

This project utilizes **shadcn Registry**, which allows you to manage and distribute custom components, hooks, pages, and other files across multiple React projects. By hosting a registry, you can reuse UI components easily without manually copying code between projects.

### Using Registry in other React projects

If you're working on a different React project and want to reuse the custom components from this repository, you can add them using the **shadcn CLI** with the following commands:

```bash
npx shadcn@latest add https://hunghg.me/r/utils.json
npx shadcn@latest add https://hunghg.me/r/theme-switcher.json
npx shadcn@latest add https://hunghg.me/r/flip-sentences.json
npx shadcn@latest add https://hunghg.me/r/apple-hello-effect.json
npx shadcn@latest add https://hunghg.me/r/wheel-picker.json
npx shadcn@latest add https://hunghg.me/r/use-controllable-state.json
```

> Note: These components are compatible with [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4) and [React 19](https://react.dev/blog/2024/12/05/react-19).

### Registry configuration

Documentation: [shadcn Registry Docs](https://ui.shadcn.com/docs/registry)

Source files:

- `./src/registry`

Before using the registry, run the following command to build and generate the registry JSON files:

```bash
pnpm registry:internal:build
pnpm registry:build
```

When running the `npx shadcn@latest add <registry-url>` command, the selected component will be automatically downloaded and integrated into your project.
