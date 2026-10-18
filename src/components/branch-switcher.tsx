import { BranchIcon } from "@storybook/icons";
import React, { useCallback } from "react";
import {
  ActionList,
  Button,
  PopoverProvider,
} from "storybook/internal/components";
import { useParameter } from "storybook/manager-api";
import type { BranchSwitcherParameters } from "../constants";
import {
  BRANCH_SWITCHER_ID,
  DEFAULT_ADDON_PARAMETERS,
  PARAM_KEY,
} from "../constants";
import { BranchSwitcherState, state } from "../state";
import { generateLink } from "../util/location";

const hasMultipleBranches = (branchList: BranchSwitcherState["list"]) =>
  branchList.length > 1;

export const BranchSwitcher = () => {
  const { hostname: targetHost } = useParameter<BranchSwitcherParameters>(
    PARAM_KEY,
    DEFAULT_ADDON_PARAMETERS,
  );
  const { list, currentBranch, defaultBranch } = state;

  const changeBranch = useCallback(
    (branch: string) => {
      if (branch !== currentBranch) {
        window.parent.location = generateLink({
          location,
          targetHost,
          defaultBranch,
          target: branch,
        });
      }
    },
    [targetHost, defaultBranch, currentBranch],
  );

  return hasMultipleBranches(list) ? (
    <PopoverProvider
      ariaLabel="Select a branch"
      placement="bottom"
      popover={({ onHide }) => (
        <ActionList>
          {list.map((branch) => (
            <ActionList.Item key={branch} active={currentBranch === branch}>
              <ActionList.Action
                ariaLabel={false}
                aria-current={currentBranch === branch ? "true" : undefined}
                onClick={() => {
                  changeBranch(branch);
                  onHide();
                }}
              >
                {branch}
              </ActionList.Action>
            </ActionList.Item>
          ))}
        </ActionList>
      )}
    >
      <Button
        key={BRANCH_SWITCHER_ID}
        title="Branch"
        ariaLabel={currentBranch ? false : "Switch branch"}
      >
        <BranchIcon />
        {currentBranch && (
          <div style={{ fontSize: 11, marginLeft: 10 }}>{currentBranch}</div>
        )}
      </Button>
    </PopoverProvider>
  ) : null;
};
