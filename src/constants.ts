import * as process from "process";

export const ADDON_ID = "storybook-addon-branch-switcher";
export const PARAM_KEY = 'branches' as const;
export const GLOBAL_KEY = 'branch' as const;
export const BRANCH_SWITCHER_ID = `${ADDON_ID}/switcher` as const;

export interface BranchSwitcherParameters {
  list: string[];
  defaultBranch: string;
  currentBranch: string;
  hostname?: string;
}

export const DEFAULT_ADDON_PARAMETERS: BranchSwitcherParameters = {
  list: [],
  defaultBranch: 'master',
  currentBranch: 'master',
  hostname: undefined,
}
