import { addons, types } from "storybook/manager-api";
import { BranchSwitcher } from "./components/branch-switcher";
import { ADDON_ID, BRANCH_SWITCHER_ID, PARAM_KEY } from "./constants";

addons.register(ADDON_ID, () => {
  addons.add(BRANCH_SWITCHER_ID, {
    title: "Branches",
    type: types.TOOL,
    match: ({ viewMode }) => !!(viewMode && /^(story|docs)$/.test(viewMode)),
    render: BranchSwitcher,
    paramKey: PARAM_KEY,
  });
});
