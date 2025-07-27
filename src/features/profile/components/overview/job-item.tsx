import {
  BriefcaseBusinessIcon,
  CodeXmlIcon,
  LightbulbIcon,
} from "lucide-react";

import { UTM_PARAMS } from "@/config/site";
import { addQueryParams } from "@/utils/url";

import { IntroItem } from "./intro-item";

function getJobIcon(title: string) {
  if (/(developer|engineer)/i.test(title)) {
    return CodeXmlIcon;
  }

  if (/(founder|co-founder)/i.test(title)) {
    return LightbulbIcon;
  }

  return BriefcaseBusinessIcon;
}

export function JobItem({
  title,
  company,
  website,
}: {
  title: string;
  company: string;
  website: string;
}) {
  return (
    <IntroItem
      icon={getJobIcon(title)}
      content={
        <>
          {title} @
          <a
            className="ml-0.5 font-medium underline-offset-4 hover:underline"
            href={addQueryParams(website, UTM_PARAMS)}
            target="_blank"
            rel="noopener"
          >
            {company}
          </a>
        </>
      }
    />
  );
}
