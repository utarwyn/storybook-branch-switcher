export interface BranchSwitcherState {
  list: string[];
  defaultBranch: string;
  currentBranch: string;
  hostname?: string;
}

const DEFAULT_ADDON_STATE: BranchSwitcherState = {
  list: [],
  defaultBranch: "master",
  currentBranch: "master",
  hostname: undefined,
};

export const state: BranchSwitcherState = Object.assign(
  DEFAULT_ADDON_STATE,
  JSON.parse(process.env["STORYBOOK_BRANCH_SWITCHER_STATE"] ?? "{}"),
);
