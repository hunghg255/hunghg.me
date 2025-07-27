import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";

import type { SocialLink } from "@/features/profile/types/social-links";
import { cn } from "@/lib/utils";

export function SocialLinkItem({ icon, title, description, href }: SocialLink) {
  return (
    <a
      className={cn(
        "group/link flex cursor-pointer items-center gap-4 rounded-2xl p-4 pr-2 transition-colors select-none",
        "max-sm:screen-line-before max-sm:screen-line-after",
        "sm:nth-[2n+1]:screen-line-before sm:nth-[2n+1]:screen-line-after"
      )}
      href={href}
      target="_blank"
      rel="noopener"
    >
      <div className="relative size-12 shrink-0">
        <Image
          className="rounded-xl"
          src={icon}
          alt={title}
          width={48}
          height={48}
          quality={100}
          unoptimized
        />
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/8 ring-inset dark:ring-white/8" />
      </div>

      <div className="flex-1">
        <h3 className="flex items-center font-medium underline-offset-4 group-hover/link:underline">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <ArrowUpRightIcon className="size-4 text-muted-foreground" />
    </a>
  );
}
