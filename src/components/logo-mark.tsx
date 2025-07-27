export function LogoMark(props: React.ComponentProps<"svg">) {
  return (
    <div className={"icon-logo"}>
      <svg viewBox="0 0 304 304" width={60} fill="none">
        <path
          d="M7 152C7 71.88 71.88 7 152 7c80.01 0 145 64.88 145 145 0 80.01-64.88 145-145 145C71.99 297 7 232.01 7 152Z"
          strokeWidth={14}
        />
        <path
          d="M134.53 76v111.49a35.08 35.08 0 0 1-35.21 35.01C79.83 222.5 64 206.76 64 187.49c0-19.27 15.83-35.1 35.32-35.1h30.22l40.98.09h34.26c19.48 0 35.22-16.6 35.22-35.97a35.08 35.08 0 0 0-35.22-35.01c-19.48 0-35.22 15.74-35.22 35.01V229"
          strokeWidth={12}
        />
      </svg>
    </div>
  );
}

export function getMarkSVG(color: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 256 128"><path fill="${color}" d="M96 128H32V96h64v32ZM224 32h-64v64h64v32h-96V0h96v32ZM32 96H0V32h32v64ZM256 96h-32V32h32v64ZM96 32H32V0h64v32Z"/></svg>`;
}
