export interface BranchSwitcherState {
  list: string[];
  defaultBranch: string;
  currentBranch: string;
}

const DEFAULT_ADDON_STATE: BranchSwitcherState = {
  list: [],
  defaultBranch: "master",
  currentBranch: "master",
};

export const state: BranchSwitcherState = Object.assign(
  DEFAULT_ADDON_STATE,
  JSON.parse(process.env["STORYBOOK_BRANCH_SWITCHER_STATE"] ?? "{}"),
);
