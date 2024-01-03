export const ADDON_ID = "storybook-branch-switcher";
export const PARAM_KEY = "branches" as const;
export const BRANCH_SWITCHER_ID = `${ADDON_ID}/switcher` as const;

export interface BranchSwitcherParameters {
  hostname?: string;
}

export const DEFAULT_ADDON_PARAMETERS: BranchSwitcherParameters = {
  hostname: undefined,
};
