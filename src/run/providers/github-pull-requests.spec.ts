import { fail } from "assert";
import { afterEach, beforeEach, describe, expect, test, vitest } from "vitest";
import provider from "./github-pull-requests";
import type { GithubProviderConfig } from "./github-pull-requests";

describe("Provider: github-pull-requests", () => {
  const config: GithubProviderConfig = {
    type: "github",
    owner: "myself",
    repository: "my-repository",
  };

  beforeEach(() => {
    global.$ = { env: {} } as any;
    global.fetch = vitest.fn().mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { number: 56, head: { sha: "aze" } },
              { number: 54, head: { sha: "eza" } },
            ]),
        }) as any,
    );
  });

  afterEach(() => {
    delete global.fetch;
    delete global.$;
  });

  test("should test if applicable", () => {
    expect(provider.isApplicable(config)).eq(true);
    expect(provider.isApplicable({ ...config, repository: null })).eq(false);
    expect(provider.isApplicable({ ...config, owner: null })).eq(false);
  });

  test("should compute final URL", async () => {
    await provider.fetcher(config);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.github.com/repos/myself/my-repository/pulls?state=open",
      expect.anything(),
    );
  });

  test("should compute headers", async () => {
    global.$ = { env: { GITHUB_TOKEN: "my-token" } } as any;
    await provider.fetcher(config);
    expect(global.fetch).toHaveBeenCalledWith(expect.anything(), {
      headers: {
        Accept: "Accept: application/vnd.github+json",
        Authorization: "Bearer my-token",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  });

  test("should resolve opened pull requests with commits", async () => {
    expect(await provider.fetcher(config)).toEqual([
      { id: "PR-56", commit: "aze" },
      { id: "PR-54", commit: "eza" },
    ]);
  });

  test("should propagate errors", async () => {
    global.fetch = () =>
      Promise.resolve({
        ok: false,
        status: 403,
        statusText: "Forbidden",
      }) as any;

    try {
      await provider.fetcher(config);
      fail("should throw an error");
    } catch (error) {
      expect(error.message).eq("Error during fetch: 403 Forbidden");
    }
  });
});
