import type { Activity } from "@/components/ui/contribution-graph";
import { GITHUB_USERNAME } from "@/config/site";

type GitHubContributionsResponse = {
  contributions: Activity[];
};

export async function getGitHubContributions(): Promise<Activity[]> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`,
      {
        next: { revalidate: 86400 }, // Cache for 1 day (86400 seconds)
      }
    );
    if (!res.ok) {
      console.error(`GitHub contributions API responded ${res.status}`);
      return [];
    }
    const data = (await res.json()) as Partial<GitHubContributionsResponse>;
    // The API answers errors (rate limits, unknown users) with JSON that has no
    // `contributions`; an empty list renders nothing instead of failing the build.
    return Array.isArray(data.contributions) ? data.contributions : [];
  } catch (error) {
    console.error("Failed to load GitHub contributions", error);
    return [];
  }
}
