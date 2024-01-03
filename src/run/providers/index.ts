import type { ProviderConfig } from "../../cli";
import type { Branch } from "../branches";
import bitbucketPullRequests from "./bitbucket-pull-requests";

export interface BranchProvider<C extends ProviderConfig> {
  isApplicable: (config: C) => boolean;
  fetcher: (config: C) => Promise<Branch[]>;
}

const providers: BranchProvider<ProviderConfig>[] = [
  bitbucketPullRequests
];

export default providers;
