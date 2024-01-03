import { fail } from "assert";
import { afterEach, beforeEach, describe, expect, test, vitest } from "vitest";
import type { BitbucketProviderConfig } from "./bitbucket-pull-requests";
import provider from "./bitbucket-pull-requests";

describe("Provider: bitbucket-pull-requests", () => {
  const config: BitbucketProviderConfig = {
    type: "bitbucket",
    project: "my-project",
    repository: "my-repository",
  };

  beforeEach(() => {
    global.$ = { env: {} } as any;
    global.fetch = vitest.fn().mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              values: [
                { id: "143", fromRef: { latestCommit: "abc" } },
                { id: "142", fromRef: { latestCommit: "bca" } },
              ],
            }),
        }) as any,
    );
  });

  afterEach(() => {
    delete global.$;
    delete global.fetch;
  });

  test("should test if applicable", () => {
    expect(provider.isApplicable({ ...config, project: null })).eq(false);
    expect(provider.isApplicable({ ...config, repository: null })).eq(false);
    expect(provider.isApplicable(config)).eq(true);
  });

  test("should compute final URL", async () => {
    await provider.fetcher(config);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://bitbucket.org/rest/api/1.0/projects/my-project/repos/my-repository/pull-requests?state=open",
      expect.anything(),
    );
    await provider.fetcher({
      ...config,
      url: "https://my-bitbucket.company.com",
    });
    expect(global.fetch).toHaveBeenCalledWith(
      "https://my-bitbucket.company.com/rest/api/1.0/projects/my-project/repos/my-repository/pull-requests?state=open",
      expect.anything(),
    );
  });

  test.each`
    env                                                           | headers
    ${{}}                                                         | ${{}}
    ${{ BITBUCKET_TOKEN: "my_token" }}                            | ${{ Authorization: "Bearer my_token" }}
    ${{ BITBUCKET_USERNAME: "user", BITBUCKET_PASSWORD: "pass" }} | ${{ Authorization: "Basic dXNlcjpwYXNz" }}
  `(
    "should compute authorization header with env $env",
    async ({ env, headers }) => {
      global.$ = { env } as any;
      await provider.fetcher(config);
      expect(global.fetch).toHaveBeenCalledWith(expect.anything(), { headers });
    },
  );

  test("should resolve opened pull requests with commits", async () => {
    expect(await provider.fetcher(config)).toEqual([
      { id: "PR-143", commit: "abc" },
      { id: "PR-142", commit: "bca" },
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
