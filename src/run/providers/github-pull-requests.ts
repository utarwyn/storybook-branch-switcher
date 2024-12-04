import type { ProviderConfig } from "../../cli";
import type { BranchProvider } from "./index";

export interface GithubProviderConfig extends ProviderConfig {
  type: "github";
  url?: string;
  owner: string;
  repository: string;
}

const isApplicable = (config: GithubProviderConfig) =>
  config.type === "github" && config.owner != null && config.repository != null;

const fetcher = async (config: GithubProviderConfig) => {
  const host = config.url ?? "https://api.github.com";
  const url = `${host}/repos/${config.owner}/${config.repository}/pulls?state=open`;
  const response = await fetch(url, {
    headers: {
      Accept: "Accept: application/vnd.github+json",
      Authorization: `Bearer ${$.env["GITHUB_TOKEN"]}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (response.ok) {
    const data = await response.json();
    return data.map((v: any) => ({ id: `PR-${v.number}`, commit: v.head.sha }));
  } else {
    throw new Error(
      `Error during fetch: ${response.status} ${response.statusText}`,
    );
  }
};

const provider: BranchProvider<GithubProviderConfig> = {
  isApplicable,
  fetcher,
};

export default provider;
