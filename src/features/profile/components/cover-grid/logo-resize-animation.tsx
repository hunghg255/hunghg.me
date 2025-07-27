"use client";

import * as motion from "motion/react-m";
import { useState } from "react";

import { LogoMark } from "@/components/logo-mark";

const variants = {
  show: {
    opacity: 1,
  },
  hide: {
    opacity: 0,
  },
};

export function LogoResizeAnimation({
  minWidth = 128,
  maxWidth = 160,
}: {
  minWidth?: number;
  maxWidth?: number;
}) {
  const [width, setWidth] = useState(maxWidth);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <motion.div
      className="relative"
      initial={{ width: maxWidth }}
      whileInView={{ width: [maxWidth, minWidth, maxWidth] }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: 0.4 }}
      onUpdate={(latest) => {
        setWidth(latest.width as number);
      }}
      onAnimationComplete={() => {
        setIsEnd(true);
      }}
    >
      <motion.div
        variants={variants}
        animate={isEnd ? "hide" : "show"}
        transition={{
          duration: 0.6,
          delay: 0.2,
        }}
        className="absolute -top-px -right-px -bottom-px -left-px border border-blue-500 *:absolute *:size-[9px] *:border *:border-blue-500 *:bg-background dark:border-zinc-600 dark:*:border-zinc-600"
      >
        <div className="-top-[5px] -left-[5px]" />
        <div className="-top-[5px] -right-[5px]" />
        <div className="-bottom-[5px] -left-[5px]" />
        <div className="-right-[5px] -bottom-[5px]" />
      </motion.div>

      <motion.div
        variants={variants}
        animate={isEnd ? "hide" : "show"}
        transition={{
          duration: 0.6,
          delay: 0.2,
        }}
        className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full transform rounded-sm bg-blue-600 px-1 font-mono text-sm whitespace-nowrap text-white dark:bg-zinc-600"
      >
        {Math.round(width)}x{Math.round(width / 2)}
      </motion.div>

      <LogoMark className="size-full text-black dark:text-white" />
    </motion.div>
  );
}
