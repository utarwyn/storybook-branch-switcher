import { beforeAll, describe, expect, test, vitest } from "vitest";
import { ADDON_ID, BRANCH_SWITCHER_ID, PARAM_KEY } from "./constants";

describe("manager", () => {
  const addons = { register: vitest.fn(), add: vitest.fn() };
  const types = { TOOL: "TOOL" };

  vitest.mock("storybook/manager-api", () => ({
    addons,
    types,
  }));

  beforeAll(async () => {
    await import("./manager");
  });

  test("should register the addon", () => {
    expect(addons.register).toHaveBeenCalledWith(
      ADDON_ID,
      expect.any(Function)
    );
  });

  test("should add a tool", () => {
    addons.register.mock.calls[0][1](null);
    expect(addons.add).toHaveBeenCalledWith(BRANCH_SWITCHER_ID, {
      title: "Branches",
      type: "TOOL",
      match: expect.any(Function),
      render: expect.any(Function),
      paramKey: PARAM_KEY,
    });
  });
});
