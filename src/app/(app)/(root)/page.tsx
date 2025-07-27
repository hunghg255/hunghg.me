import { About } from "@/features/profile/components/about";
import { Certifications } from "@/features/profile/components/certifications";
import { Experiences } from "@/features/profile/components/experiences";
import { Overview } from "@/features/profile/components/overview";
import { ProfileCover } from "@/features/profile/components/profile-cover";
import { ProfileHeader } from "@/features/profile/components/profile-header";
import { SocialLinks } from "@/features/profile/components/social-links";
import { TeckStack } from "@/features/profile/components/teck-stack";
import Wakatime from "@/features/profile/components/wakatime";
import { cn } from "@/lib/utils";

export default function Page() {
  return (
    <>
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPageJsonLd()).replace(/</g, "\\u003c"),
        }}
      /> */}

      <div className="mx-auto md:max-w-3xl">
        <ProfileCover />
        <ProfileHeader />
        <Separator />

        <Overview />
        <Separator />

        <SocialLinks />
        <Separator />

        <About />
        <Separator />

        <TeckStack />
        <Separator />

        {/* <Blog />
        <Separator /> */}

        <Experiences />
        <Separator />

        <Certifications />
        <Separator />

        <Wakatime />
        <Separator />

        {/*  <Awards />
        <Separator />

        <Certifications />
        <Separator />

        <Brand />
        <Separator /> */}
      </div>
    </>
  );
}

// function getPageJsonLd(): WithContext<PageSchema> {
//   return {
//     "@context": "https://schema.org",
//     "@type": "ProfilePage",
//     dateCreated: dayjs(USER.dateCreated).toISOString(),
//     dateModified: dayjs().toISOString(),
//     mainEntity: {
//       "@type": "Person",
//       name: USER.displayName,
//       identifier: USER.username,
//       image: USER.avatar,
//     },
//   };
// }

function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-8 w-full border-x border-edge",
        "before:absolute before:-left-[100vw] before:-z-1 before:h-8 before:w-[200vw]",
        "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56",
        className
      )}
    />
  );
}
