import { afterEach, beforeEach, describe, expect, test, vitest } from "vitest";
import { fetchBranches } from "./branches";
import { fail } from "assert";

vitest.mock("./providers", () => ({
  default: [
    {
      name: "github",
      isApplicable: (config: any) => config.type === "github",
      fetcher: vitest.fn().mockResolvedValue([{ id: "PR-1", commit: "hiy" }]),
    },
  ],
}));

describe("branches", () => {
  beforeEach(() => {
    global.$ = vitest
      .fn()
      .mockImplementationOnce(
        () => Promise.resolve({ toString: () => "master " }) as any,
      )
      .mockImplementationOnce(
        () => Promise.resolve({ toString: () => "  123abc  " }) as any,
      ) as any;
    global.spinner = vitest
      .fn()
      .mockImplementation((_, callback) => callback());
  });

  afterEach(() => {
    delete global.$;
    delete global.spinner;
  });

  test("should retrieve current branch id and commit", async () => {
    const branches = await fetchBranches();
    expect(branches).toHaveLength(1);
    expect(branches[0]).toEqual({ id: "master", commit: "123abc" });
  });

  test("should retrieve branches from a provider", async () => {
    const branches = await fetchBranches({ type: "github" });
    expect(branches).toHaveLength(2);
    expect(branches[0]).toEqual({ id: "master", commit: "123abc" });
    expect(branches[1]).toEqual({ id: "PR-1", commit: "hiy" });
  });

  test("should throw an error because no valid provider is found", async () => {
    try {
      await fetchBranches({ type: "bitbucket" });
      fail("should throw an error");
    } catch (error) {
      expect(error.message).eq("Cannot find a branch provider");
    }
  });
});
