import { describe, expect, test } from "vitest";
import { generateLink } from "./location";

describe("location", () => {
  describe("Method: generateLink", () => {
    const location = {
      protocol: "https:",
      hostname: "company.design",
      port: "443",
      search: "",
      hash: "",
    } as Location;

    test("should use current host by default", () => {
      expect(generateLink(location, null, null, null)).toBe(
        "https://company.design:443/",
      );
    });

    test("should use targetHost if provided", () => {
      expect(generateLink(location, "localhost:3000", null, null)).toBe(
        "https://localhost:3000/",
      );
    });

    test("should pass same search and hash params to target", () => {
      const loc = { ...location, search: "?a=b", hash: "#c=d" };
      expect(generateLink(loc, null, null, null)).toBe(
        "https://company.design:443/?a=b#c=d",
      );
    });

    test.each`
      def         | current     | target      | expectedPath | description
      ${"master"} | ${"master"} | ${"master"} | ${"/"}       | ${"target is the current branch"}
      ${"master"} | ${"master"} | ${"PR-6"}   | ${"/PR-6/"}  | ${"target is not the default branch"}
      ${"master"} | ${"PR-6"}   | ${"master"} | ${"/"}       | ${"target is the default branch"}
      ${"master"} | ${"PR-6"}   | ${"PR-7"}   | ${"/PR-7/"}  | ${"target is neither the current branch nor the default one"}
    `(
      "should replace root path if $description",
      ({ def, current, target, expectedPath }) => {
        const loc = { ...location, pathname: `/${current}/` };
        expect(generateLink(loc, null, def, target)).toBe(
          `https://company.design:443${expectedPath}`,
        );
      },
    );

    test.each`
      def         | current     | target      | expectedPath         | description
      ${"master"} | ${"master"} | ${"master"} | ${"/subpath/"}       | ${"target is the current branch"}
      ${"master"} | ${"master"} | ${"PR-6"}   | ${"/subpath/PR-6/"}  | ${"target is not the default branch"}
      ${"master"} | ${"PR-6"}   | ${"master"} | ${"/subpath/"}       | ${"target is the default branch"}
      ${"master"} | ${"PR-6"}   | ${"PR-7"}   | ${"/subpath/PR-7/"}  | ${"target is neither the current branch nor the default one"}
    `(
      "should replace subpath via targetHost if $description",
      ({ def, current, target, expectedPath }) => {
        const loc = { ...location, pathname: `/subpath/${current}` };
        const targetHost = "company.design:443/subpath"
        expect(generateLink(loc, targetHost, def, target)).toBe(
          `https://company.design:443${expectedPath}`,
        );
      },
    );
  });
});
