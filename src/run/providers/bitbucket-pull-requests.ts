import type { ProviderConfig } from "../../cli";
import { BranchProvider } from "./index";

export interface BitbucketProviderConfig extends ProviderConfig {
  type: "bitbucket";
  url?: string;
  project: string;
  repository: string;
}

const isApplicable = (config: BitbucketProviderConfig) =>
  config.type === "bitbucket" &&
  config.project != null &&
  config.repository != null;

const computeAuthorizationHeader = (): string => {
  const token = $.env["BITBUCKET_TOKEN"];
  if (token != null) {
    return `Bearer ${token}`;
  }
  const username = $.env["BITBUCKET_USERNAME"];
  const password = $.env["BITBUCKET_PASSWORD"];
  if (username != null && password != null) {
    return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
  }
};

const fetcher = async (config: BitbucketProviderConfig) => {
  const host = config.url ?? "https://bitbucket.org";
  const url = `${host}/rest/api/1.0/projects/${config.project}/repos/${config.repository}/pull-requests?state=open`;
  const response = await fetch(url, {
    headers: { Authorization: computeAuthorizationHeader() },
  });
  if (response.ok) {
    const data = await response.json();
    return data.values.map((v: any) => ({
      id: `PR-${v.id}`,
      commit: v.fromRef.latestCommit,
    }));
  } else {
    throw new Error(
      `Error during fetch: ${response.status} ${response.statusText}`,
    );
  }
};

const provider: BranchProvider<BitbucketProviderConfig> = { isApplicable, fetcher };

export default provider;
