import type { BranchSwitcherState } from "../state";

export const cleanPreviousBundle = async (directory: string): Promise<void> => {
  fs.removeSync(directory);
};

export const checkoutCommit = async (commit: string): Promise<void> => {
  await $`git fetch origin`;
  await $`git checkout ${commit}`;
};

export const prepareAddonState = (state: BranchSwitcherState): void => {
  process.env["STORYBOOK_BRANCH_SWITCHER_STATE"] = JSON.stringify(state);
};

export const buildStorybook = async (scriptName?: string): Promise<void> => {
  await $`npm run ${scriptName ?? "build-storybook"}`;
};

export const prepareStorybook = async (
  from: string,
  to: string,
): Promise<void> => {
  fs.cpSync(from, to, { recursive: true });
};
