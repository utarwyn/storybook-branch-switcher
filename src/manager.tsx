import { BranchSwitcher } from "./components/branch-switcher";
import { ADDON_ID, BRANCH_SWITCHER_ID, PARAM_KEY } from "./constants";

const storybookApi = (globalThis as any).__STORYBOOK_API__;

storybookApi?.addons?.register(ADDON_ID, () => {
  storybookApi.addons.add(BRANCH_SWITCHER_ID, {
    title: "Branches",
    type: storybookApi.types.TOOL,
    match: ({ viewMode }: { viewMode?: string }) =>
      !!(viewMode && /^(story|docs)$/.test(viewMode)),
    render: BranchSwitcher,
    paramKey: PARAM_KEY,
  });
});
