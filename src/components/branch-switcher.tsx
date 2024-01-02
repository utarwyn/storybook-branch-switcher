import {
  IconButton,
  TooltipLinkList,
  WithTooltip,
} from "@storybook/components";
import { BranchIcon } from "@storybook/icons";
import { styled } from "@storybook/theming";
import React, { Fragment, useCallback } from "react";
import { BRANCH_SWITCHER_ID } from "../constants";
import { generateLink } from "../util/location";
import { BranchSwitcherState, state } from "../state";

const IconButtonLabel = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.s2 - 1,
  marginLeft: 10,
}));

const hasMultipleBranches = (branchList: BranchSwitcherState["list"]) =>
  branchList.length > 1;

export const BranchSwitcher = () => {
  const { list, currentBranch, defaultBranch, hostname } = state;

  const changeBranch = useCallback((branch) => {
    if (branch !== currentBranch) {
      window.parent.location = generateLink(
        location,
        hostname,
        defaultBranch,
        currentBranch,
        branch,
      );
    }
  }, []);

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
