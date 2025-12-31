"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/features/profile/components/panel";

interface Sponsor {
  login: string;
  name: string | null;
  avatarUrl: string;
  url: string;
  isOneTime: boolean;
}

export function GitHubSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<any>(null);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await fetch("/api/sponsors", {
          cache: "no-store",
        });
        const data = await response.json();
        console.log("🎯 Sponsors API response:", data);
        setSponsors(data.sponsors || []);
        setDebug(data.debug);
        // Only set error if we have an error and no sponsors
        if (data.error && (!data.sponsors || data.sponsors.length === 0)) {
          setError(data.error);
        }
      } catch (error) {
        console.error("❌ Error fetching sponsors:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch sponsors"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  if (loading) {
    return (
      <div className="w-full rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Heart
            className="h-5 w-5 animate-pulse text-pink-500"
            fill="currentColor"
          />
          <h3 className="text-xl font-bold">Loading Sponsors...</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-12 w-12 animate-pulse rounded-full bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-xl border border-red-500/20 bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
          <h3 className="text-xl font-bold text-red-500">
            Error Loading Sponsors
          </h3>
        </div>
        <p className="mb-2 text-sm text-muted-foreground">{error}</p>
        {debug && (
          <details className="mt-2 text-xs text-muted-foreground">
            <summary className="cursor-pointer">Debug Info</summary>
            <pre className="mt-2 rounded bg-muted p-2">
              {JSON.stringify(debug, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  }

  if (sponsors.length === 0) {
    return (
      <div className="group relative w-full overflow-hidden rounded-xl border border-border bg-card">
        <div className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Heart
              className="h-5 w-5 text-pink-500 group-hover:animate-pulse"
              fill="currentColor"
            />
            <h3 className="text-xl font-bold">Become a Sponsor</h3>
          </div>
          <p className="mb-6 text-sm text-muted-foreground">
            Support my open source work and get your name featured here! ✨
          </p>
          <Link
            href="https://github.com/sponsors/hunghg255"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-pink-600 hover:to-purple-700 hover:shadow-xl active:scale-95"
          >
            <Heart className="h-5 w-5" fill="currentColor" />
            Sponsor on GitHub
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Panel id="Sponsors">
      <PanelHeader>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Heart
              className="h-5 w-5 animate-pulse text-pink-500"
              fill="currentColor"
            />
            <PanelTitle>
              Sponsors
              {sponsors.length > 0 && (
                <sup className="ml-1 font-mono text-sm font-medium text-muted-foreground select-none">
                  ({sponsors.length})
                </sup>
              )}
            </PanelTitle>
          </div>
          {sponsors?.length > 0 && (
            <Link
              href="https://github.com/sponsors/hunghg255"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-pink-600 hover:to-purple-700 hover:shadow-lg active:scale-95"
            >
              <Heart className="h-4 w-4" fill="currentColor" />
              Sponsor me
            </Link>
          )}
        </div>
      </PanelHeader>

      <PanelContent>
        {sponsors.length === 0 ? (
          <>
            <div className="mb-4 flex items-center gap-2">
              <Heart
                className="h-5 w-5 text-pink-500 group-hover:animate-pulse"
                fill="currentColor"
              />
              <h3 className="text-xl font-bold">Become a Sponsor</h3>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              Support my open source work and get your name featured here! ✨
            </p>
            <Link
              href="https://github.com/sponsors/hunghg255"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-pink-600 hover:to-purple-700 hover:shadow-xl active:scale-95"
            >
              <Heart className="h-5 w-5" fill="currentColor" />
              Sponsor on GitHub
              <ExternalLink className="h-4 w-4" />
            </Link>
          </>
        ) : null}
        <p className="mb-6 text-sm text-muted-foreground">
          Thank you to these amazing people for supporting my work! 💖
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sponsors.map((sponsor, index) => (
            <div key={sponsor.login}>
              <Link
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="relative flex min-h-[105px] items-center rounded-lg border border-border bg-card/50 p-4 transition-all duration-300 hover:scale-[1.02] hover:border-pink-500/50 hover:bg-card hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14 shrink-0 border-2 border-pink-500/30 transition-all duration-300 group-hover:scale-105 group-hover:border-pink-500">
                      <AvatarImage
                        src={sponsor.avatarUrl}
                        alt={sponsor.name || sponsor.login}
                      />
                      <AvatarFallback>
                        {sponsor.login[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h4 className="truncate text-sm font-semibold">
                          {sponsor.name || sponsor.login}
                        </h4>
                        <Heart
                          className="h-3 w-3 shrink-0 text-pink-500"
                          fill="currentColor"
                        />
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        @{sponsor.login}
                      </p>
                      {sponsor.isOneTime && (
                        <Badge
                          variant="secondary"
                          className="mt-1.5 text-[10px]"
                        >
                          One-time Sponsor
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {sponsors.length >= 10 && (
          <Link
            href="https://github.com/sponsors/hunghg255"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all sponsors
            <ExternalLink className="h-3 w-3" />
          </Link>
        )}
      </PanelContent>
    </Panel>
  );
}
