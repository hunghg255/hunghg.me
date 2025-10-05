import { Suspense } from "react";

import { Panel } from "../panel";
import { GitHubContributionFallback, GitHubContributionGraph } from "./graph";
import { getGitHubContributions } from "@/features/profile/data/github-contributions";

export function GitHubContributions() {
  const contributions = getGitHubContributions();

  return (
    <Panel>
      <h2 className="sr-only">GitHub Contributions</h2>

      <Suspense fallback={<GitHubContributionFallback />}>
        <GitHubContributionGraph contributions={contributions} />
      </Suspense>
    </Panel>
  );
}
