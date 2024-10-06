import type { ProviderConfig } from "../../cli";
import { BranchProvider } from "./index";

export interface GitLabProviderConfig extends ProviderConfig {
  type: "gitlab";
  url?: string;
  projectId: string;
}

const isApplicable = (config: GitLabProviderConfig) =>
  config.type === "gitlab" && config.projectId != null;

const fetcher = async (config: GitLabProviderConfig) => {
  const host = config.url ?? "https://gitlab.com";
  const url = `${host}/api/v4/projects/${config.projectId}/merge_requests?state=opened&order_by=updated_at&sort=desc`;
  const response = await fetch(url, {
    headers: { "PRIVATE-TOKEN": `${$.env["GITLAB_TOKEN"]}` },
  });

  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.map((mr: any) => ({
    id: mr.id,
    commit: mr.head.sha,
    title: mr.title,
    source_branch: mr.source_branch,
  }));
};

const provider: BranchProvider<GitLabProviderConfig> = {
  isApplicable,
  fetcher,
};

export default provider;
