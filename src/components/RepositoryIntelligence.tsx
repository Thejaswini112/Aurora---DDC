import { repositoryIntelligence } from "@/mock-data/insights";
import {
  Github,
  Database,
  FolderGit2,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

function getIcon(name: string) {
  switch (name) {
    case "GitHub":
      return Github;

    case "Amazon S3":
      return Database;

    case "SharePoint":
      return FolderGit2;

    default:
      return MessageSquare;
  }
}

export default function RepositoryIntelligence() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">
          Repository Intelligence
        </h2>

        <p className="text-sm text-muted-foreground">
          Compare security posture across connected repositories.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {repositoryIntelligence.map((repo) => {
          const Icon = getIcon(repo.name);

          const positive = repo.trend.startsWith("-");

          return (
            <div
              key={repo.id}
              className="rounded-xl border border-border bg-card p-6 shadow-card transition hover:shadow-card-hover"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-background-subtle p-3">
                  <Icon className="h-5 w-5" />
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    repo.risk === "Critical"
                      ? "bg-red-100 text-red-700"
                      : repo.risk === "High"
                      ? "bg-orange-100 text-orange-700"
                      : repo.risk === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {repo.risk}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                {repo.name}
              </h3>

              <p className="mt-2 text-3xl font-bold">
                {repo.findings}
              </p>

              <p className="text-sm text-muted-foreground">
                Findings
              </p>

              <div
                className={`mt-4 flex items-center gap-2 text-sm font-medium ${
                  positive ? "text-success" : "text-danger"
                }`}
              >
                {positive ? (
                  <ArrowDownRight className="h-4 w-4" />
                ) : (
                  <ArrowUpRight className="h-4 w-4" />
                )}

                {repo.trend}
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                {repo.summary}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}