import { describe, expect, test, vitest } from "vitest";
import { state } from "./state";

vitest.hoisted(() => {
  process.env["STORYBOOK_BRANCH_SWITCHER_STATE"] = JSON.stringify({
    list: ["master", "PR-5"],
    currentBranch: "PR-5",
  });
});

describe("state", () => {
  test("should retrieve state from environment variable if defined", () => {
    expect(state).toEqual({
      list: ["master", "PR-5"],
      defaultBranch: "master",
      currentBranch: "PR-5",
    });
  });
});
