import type { ProviderConfig } from "../../cli";
import type { Branch } from "../branches";
import bitbucketPullRequests from "./bitbucket-pull-requests";

export interface BranchProvider {
  isApplicable: (config: ProviderConfig) => boolean;
  fetcher: (config: ProviderConfig) => Promise<Branch[]>;
}

const providers: BranchProvider[] = [
  bitbucketPullRequests
];

export default providers;
