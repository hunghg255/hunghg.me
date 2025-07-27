import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { WebSite, WithContext } from "schema-dts";

import { Providers } from "@/components/providers";
import { META_THEME_COLORS, SITE_INFO } from "@/config/site";
import { USER } from "@/data/user";
import { fontMono, fontSans } from "@/lib/fonts";

function getWebSiteJsonLd(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_INFO.name,
    url: SITE_INFO.url,
    alternateName: [USER.username],
  };
}

// Thanks @shadcn-ui, @tailwindcss
const darkModeScript = String.raw`
  try {
    if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
    }
  } catch (_) {}

  try {
    if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)) {
      document.documentElement.classList.add('os-macos')
    }
  } catch (_) {}
`;

// export const metadata: Metadata = {
//   metadataBase: new URL(SITE_INFO.url),
//   alternates: {
//     canonical: "/",
//   },
//   title: {
//     template: `%s | ${SITE_INFO.name}`,
//     default: `${USER.displayName} - ${USER.jobTitle}`,
//   },
//   description: SITE_INFO.description,
//   keywords: SITE_INFO.keywords,
//   authors: [
//     {
//       name: "ncdai",
//       url: SITE_INFO.url,
//     },
//   ],
//   creator: "ncdai",
//   openGraph: {
//     siteName: SITE_INFO.name,
//     url: "/",
//     type: "profile",
//     firstName: USER.firstName,
//     lastName: USER.lastName,
//     username: USER.username,
//     gender: USER.gender,
//     images: [
//       {
//         url: SITE_INFO.ogImage,
//         width: 1200,
//         height: 630,
//         alt: SITE_INFO.name,
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     creator: "@iamncdai", // Twitter username
//     images: [SITE_INFO.ogImage],
//   },
//   icons: {
//     icon: [
//       {
//         url: "https://assets.hunghg.me/images/favicon.ico",
//         sizes: "any",
//       },
//       {
//         url: "https://assets.hunghg.me/images/favicon.svg",
//         type: "image/svg+xml",
//       },
//     ],
//     apple: {
//       url: "https://assets.hunghg.me/images/apple-touch-icon.png",
//       type: "image/png",
//       sizes: "180x180",
//     },
//   },
// };

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: META_THEME_COLORS.light,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <title>Hunghg | Front-end Developer</title>
        <meta property="og:site_name" content="Hunghg | Front-end Developer" />
        <meta property="og:type" content="website" />

        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="title" content="Hunghg | Front-end Developer" />
        <meta
          name="description"
          content="I'm Hung an Front-end Developer. I got a bachelor of Electronics Telecommunication Engineering at Ha Noi University of Science and Technology (2015 - 2020)"
        />
        <meta property="og:locale" content="vi_VN" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hunghg.me/" />
        <meta property="og:title" content="Hunghg | Front-end Developer" />
        <meta
          property="og:description"
          content="I'm Hung an Front-end Developer. I got a bachelor of Electronics Telecommunication Engineering at Ha Noi University of Science and Technology (2015 - 2020)"
        />
        <meta
          property="og:image"
          content="https://cdn.jsdelivr.net/gh/hunghg255/static/og-img.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://hunghg.me/" />
        <meta property="twitter:title" content="Hunghg | Front-end Developer" />
        <meta
          property="twitter:description"
          content="I'm Hung an Front-end Developer. I got a bachelor of Electronics Telecommunication Engineering at Ha Noi University of Science and Technology (2015 - 2020)"
        />
        <meta
          property="twitter:image"
          content="https://cdn.jsdelivr.net/gh/hunghg255/static/og-img.png"
        />

        <meta property="og:image:type" content="image/jpeg" />
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />

        <meta
          name="google-site-verification"
          content="rqkQvaV705ZKW_sDtCtBkos8BtnWhSEwXZXS6YlhSEI"
        />

        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{ __html: darkModeScript }}
        />
        {/*
          Thanks @tailwindcss. We inject the script via the `<Script/>` tag again,
          since we found the regular `<script>` tag to not execute when rendering a not-found page.
         */}
        <Script src={`data:text/javascript;base64,${btoa(darkModeScript)}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getWebSiteJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
      </head>

      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
