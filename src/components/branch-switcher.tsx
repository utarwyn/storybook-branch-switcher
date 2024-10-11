import { BranchIcon } from "@storybook/icons";
import React, { Fragment, useCallback } from "react";
import {
  IconButton,
  TooltipLinkList,
  WithTooltip,
} from "storybook/internal/components";
import { useParameter } from "storybook/internal/manager-api";
import { styled } from "storybook/internal/theming";
import type { BranchSwitcherParameters } from "../constants";
import {
  BRANCH_SWITCHER_ID,
  DEFAULT_ADDON_PARAMETERS,
  PARAM_KEY,
} from "../constants";
import { BranchSwitcherState, state } from "../state";
import { generateLink } from "../util/location";

const IconButtonLabel = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.s2 - 1,
  marginLeft: 10,
}));

const hasMultipleBranches = (branchList: BranchSwitcherState["list"]) =>
  branchList.length > 1;

export const BranchSwitcher = () => {
  const { hostname } = useParameter<BranchSwitcherParameters>(
    PARAM_KEY,
    DEFAULT_ADDON_PARAMETERS
  );
  const { list, currentBranch, defaultBranch } = state;

  const changeBranch = useCallback(
    (branch: string) => {
      if (branch !== currentBranch) {
        window.parent.location = generateLink(
          location,
          hostname,
          defaultBranch,
          branch
        );
      }
    },
    [hostname, defaultBranch, currentBranch]
  );

  return hasMultipleBranches(list) ? (
    <Fragment>
      <WithTooltip
        placement="top"
        trigger="click"
        closeOnClick
        tooltip={({ onHide }) => {
          return (
            <TooltipLinkList
              links={list.map((branch) => ({
                id: branch,
                title: branch,
                active: currentBranch === branch,
                onClick: () => {
                  changeBranch(branch);
                  onHide();
                },
              }))}
            />
          );
        }}
      >
        <IconButton key={BRANCH_SWITCHER_ID} title="Branch" active={true}>
          <BranchIcon />
          {currentBranch && <IconButtonLabel>{currentBranch}</IconButtonLabel>}
        </IconButton>
      </WithTooltip>
    </Fragment>
  ) : null;
};
