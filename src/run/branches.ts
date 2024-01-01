import type { ProviderConfig } from "../cli";
import bitbucketPullRequests from "./providers/bitbucket-pull-requests";

export interface Branch {
  id: string;
  commit: string;
}

export interface BranchProvider {
  isApplicable: (config: ProviderConfig) => boolean;
  fetcher: (config: ProviderConfig) => Promise<Branch[]>;
}

const providers: BranchProvider[] = [
  bitbucketPullRequests
];

export const fetchBranches = async (config: ProviderConfig): Promise<Branch[]> => {
  const branches: Branch[] = [];

  // Add current branch to the list
  const currentBranch = await $`git branch --show-current`
  const currentCommit = await $`git log --format="%H" -n 1`
  branches.push({ id: currentBranch.toString().trim(), commit: currentCommit.toString().trim() })

  // Fetch other branches from a provider, based on configuration
  await spinner("Fetching branches..", async () => {
    const provider = providers.find((p) => p.isApplicable(config));
    if (!provider) {
      throw new Error("Cannot find a branch provider");
    }
    branches.push(...await provider.fetcher(config));
  });

  return branches;
}
