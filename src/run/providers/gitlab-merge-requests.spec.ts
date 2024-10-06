import { fail } from "assert";
import { afterEach, beforeEach, describe, expect, test, vitest } from "vitest";
import provider from "./gitlab-merge-requests";
import type { GitLabProviderConfig } from "./gitlab-merge-requests";

describe("Provider: gitlab-merge-requests", () => {
  const config: GitLabProviderConfig = {
    type: "gitlab",
    projectId: "123",
  };

  beforeEach(() => {
    global.$ = { env: {} } as any;
    global.fetch = vitest.fn().mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: 56,
                title: "Cat's Meow",
                source_branch: "mr/hiss",
                head: { sha: "aze" },
              },
              {
                id: 54,
                title: "Zombie guts",
                source_branch: "mr/gutsofdatzombie",
                head: { sha: "eza" },
              },
            ]),
        }) as any
    );
  });

  afterEach(() => {
    delete global.fetch;
    delete global.$;
  });

  test("should test if applicable", () => {
    expect(provider.isApplicable(config)).eq(true);
    expect(provider.isApplicable({ ...config, projectId: null })).eq(false);
  });

  test("should compute final URL with default base", async () => {
    await provider.fetcher(config);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://gitlab.com/api/v4/projects/123/merge_requests?state=opened&order_by=updated_at&sort=desc",
      expect.anything()
    );
  });

  test("should compute final URL with custom base", async () => {
    await provider.fetcher({ ...config, url: "https://gitlab.local" });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("https://gitlab.local/api/"),
      expect.anything()
    );
  });

  test("should compute headers", async () => {
    global.$ = { env: { GITLAB_TOKEN: "123" } } as any;
    await provider.fetcher(config);
    expect(global.fetch).toHaveBeenCalledWith(expect.anything(), {
      headers: expect.objectContaining({
        "PRIVATE-TOKEN": `${$.env["GITLAB_TOKEN"]}`,
      }),
    });
  });

  test("should resolve opened pull requests with commits", async () => {
    expect(await provider.fetcher(config)).toEqual([
      {
        id: 56,
        title: "Cat's Meow",
        source_branch: "mr/hiss",
        commit: "aze",
      },
      {
        id: 54,
        title: "Zombie guts",
        source_branch: "mr/gutsofdatzombie",
        commit: "eza",
      },
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
      expect(error.message).eq("HTTP error! status: 403 Forbidden");
    }
  });
});
