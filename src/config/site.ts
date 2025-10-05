import { USER } from "@/data/user";
import type { NavItem } from "@/types/nav";

export const SITE_INFO = {
  name: USER.displayName,
  url: "https://hunghg.me",
  ogImage: USER.ogImage,
  description: USER.bio,
  keywords: USER.keywords,
};

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const MAIN_NAV: NavItem[] = [
  // {
  //   title: "Daifolio",
  //   href: "/",
  // },
  {
    title: "Blog",
    href: "https://blog.hunghg.me",
  },
  {
    title: "Projects",
    href: "https://npmstat.hunghg.me/",
  },
  // {
  //   title: "Components",
  //   href: "/components",
  // },
];

export const GITHUB_USERNAME = "hunghg255";
export const SOURCE_CODE_GITHUB_REPO = "hunghg255/hunghg.me";
export const SOURCE_CODE_GITHUB_URL = "https://github.com/hunghg255/hunghg.me";

export const UTM_PARAMS = {
  utm_source: "hunghg.me",
  utm_medium: "portfolio_website",
  utm_campaign: "referral",
};
