import { afterEach, beforeEach, describe, expect, test, vitest } from "vitest";
import { logAndWait, logError, logSuccess } from "./log";

describe("log", () => {
  beforeEach(() => {
    global.$ = { env: {} } as any;
    global.chalk = { green: (m: string) => m, red: (m: string) => m } as any;
    global.echo = vitest.fn();
    global.spinner = vitest.fn() as any;
  });

  afterEach(() => {
    delete global.$;
    delete global.echo;
    delete global.spinner;
  });

  describe("Method: logAndWait", () => {
    test("should log message, then start function if on CI system", async () => {
      global.$.env["CI"] = "true";
      const message = "message";
      const fn = vitest.fn();
      await logAndWait(message, fn);
      expect(global.echo).toHaveBeenCalledWith(message);
      expect(fn).toHaveBeenCalled();
    });

    test("should show a spinner if not on CI system", async () => {
      const message = "message";
      const fn = vitest.fn();
      await logAndWait(message, fn);
      expect(global.spinner).toHaveBeenCalledWith(message, fn);
    });
  });

  describe("Method: logSuccess", () => {
    test("should log success message", () => {
      logSuccess("Success");
      expect(global.echo).toHaveBeenCalledWith("Success");
    });
  });

  describe("Method: logError", () => {
    test("should log error message", () => {
      logError("Error");
      expect(global.echo).toHaveBeenCalledWith("❌  Error");
    });
  })
});
