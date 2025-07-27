import { cn } from "@/lib/utils";

import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";

export function TeckStack() {
  return (
    <Panel id="stack">
      <PanelHeader>
        <PanelTitle>Stack</PanelTitle>
      </PanelHeader>

      <PanelContent
        className={cn(
          "[--pattern-foreground:var(--color-zinc-950)]/5 dark:[--pattern-foreground:var(--color-white)]/5",
          "bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-size-[10px_10px] bg-center",
          "bg-zinc-950/0.75 dark:bg-white/0.75"
        )}
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <img
            src="https://img.shields.io/badge/html5-%23E34F26.svg?style=flat-square&logo=html5&logoColor=white"
            alt="HTML5"
          />
          <img
            src="https://img.shields.io/badge/css3-%231572B6.svg?style=flat-square&logo=css3&logoColor=white"
            alt="CSS3"
          />
          <img
            src="https://img.shields.io/badge/SASS-hotpink.svg?style=flat-square&logo=SASS&logoColor=white"
            alt="SASS"
          />
          <img
            src="https://img.shields.io/badge/LESS-%230db7ed.svg?style=flat-square&logo=less&logoColor=white"
            alt="LESS"
          />
          <img
            src="https://img.shields.io/badge/Tailwindcss-%2338B2AC.svg?style=flat-square&logo=tailwind-css&logoColor=white"
            alt="TailwindCSS"
          />
          <img
            src="https://img.shields.io/badge/AntDesign-1677ff.svg?style=flat-square&logo=ant-design&logoColor=white"
            alt="Antd"
          />
          <img
            src="https://img.shields.io/badge/Javascript-%23323330.svg?style=flat-square&logo=javascript&logoColor=%23F7DF1E"
            alt="Javascript"
          />
          <img
            src="https://img.shields.io/badge/Typescript-%23007ACC.svg?style=flat-square&logo=typescript&logoColor=white"
            alt="Typescript"
          />
          <img
            src="https://img.shields.io/badge/Reactjs-%2320232a.svg?style=flat-square&logo=react&logoColor=%2361DAFB"
            alt="Reactjs"
          />
          <img
            src="https://img.shields.io/badge/Nextjs-black?style=flat-square&logo=next.js&logoColor=white"
            alt="Nextjs"
          />
          <img
            src="https://img.shields.io/badge/Remix-black?style=flat-square&logo=remix&logoColor=white"
            alt="Remix.run"
          />
          <img
            src="https://img.shields.io/badge/solidjs-4578bc?style=flat-square&logo=solid&logoColor=white"
            alt="Remix.run"
          />
          <img
            src="https://img.shields.io/badge/Vuejs-%2335495e.svg?style=flat-square&logo=vuedotjs&logoColor=%234FC08D"
            alt="Vuejs"
          />
          <img
            src="https://img.shields.io/badge/Svelte-ff3e00?style=flat-square&logo=svelte&logoColor=white"
            alt="Svelte"
          />
          <img
            src="https://img.shields.io/badge/Vitejs-blueviolet?style=flat-square&logo=vite&logoColor=white"
            alt="Vitejs"
          />
          <img
            src="https://img.shields.io/badge/Webpack-dodgerblue?style=flat-square&logo=webpack&logoColor=white"
            alt="Webpack"
          />

          <img
            src="https://img.shields.io/badge/Nodejs-6DA55F?style=flat-square&logo=node.js&logoColor=white"
            alt="Nodejs"
          />
          <img
            src="https://img.shields.io/badge/Expressjs-6DA55F?style=flat-square&logo=nestjs&logoColor=white"
            alt="Expressjs"
          />
          <img
            src="https://img.shields.io/badge/Firebase-%23039BE5.svg?style=flat-square&logo=firebase"
            alt="Firebase"
          />
          <img
            src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat-square&logo=mongodb&logoColor=white"
            alt="MongoDB"
          />
          <img
            src="https://img.shields.io/badge/Docker-%230db7ed.svg?style=flat-square&logo=docker&logoColor=white"
            alt="Docker"
          />
          <img
            src="https://img.shields.io/badge/Nginx-%234ea94b.svg?style=flat-square&logo=nginx&logoColor=white"
            alt="Nginx"
          />
          <img
            src="https://img.shields.io/badge/Git-%23E34F26.svg?style=flat-square&logo=git&logoColor=white"
            alt="Git"
          />
        </div>
      </PanelContent>
    </Panel>
  );
}
