#!/usr/bin/env node

import "zx/globals";
import { fetchBranches } from "./run/branches";
import {
  buildStorybook,
  checkoutCommit,
  cleanPreviousBundle,
  prepareAddonState,
  prepareStorybook,
} from "./run/build";
import { extractConfiguration, verifyGit, verifyNode } from "./run/setup";
import { logAndWait, logError, logSuccess } from "./run/log";

export interface ProviderConfig {
  type: "bitbucket";

  [key: string]: string;
}

export interface Config {
  directory?: string;
  script_name?: string;
  from: string;
  to: string;
  default_branch?: string;
  default_root?: boolean;
  provider?: ProviderConfig;
}

void (async function () {
  const configPath = argv["c"] ?? argv["config"] ?? ".storybook/.branches.json";
  let config: Config;

  $.verbose = argv["verbose"] !== undefined;

  try {
    config = await extractConfiguration(configPath);
    if (config.directory) {
      cd(config.directory);
    }

    await verifyNode();
    await verifyGit();
    logSuccess("😎 Your workspace looks good!");
  } catch (error) {
    logError(error);
    process.exit(1);
  }

  const branches = await fetchBranches(config.provider);
  const defaultBranch = config.default_branch ?? branches[0].id;

  echo(
    `👐 Branches to build: ${chalk.cyan(
      branches.map((branch) => branch.id).join(", "),
    )}`,
  );

  await cleanPreviousBundle(config.to);

  for (const branch of branches) {
    echo`🚚 Move to the ${chalk.cyan(branch.id)} branch`;

    prepareAddonState({
      list: branches.map((branch) => branch.id),
      currentBranch: branch.id,
      defaultBranch,
    });

    try {
      await logAndWait(`Fetching ${branch.commit}...`, () =>
        checkoutCommit(branch.commit),
      );
      await buildStorybook(config.script_name);
      await logAndWait(`Copying files...`, () =>
        prepareStorybook(
          config.from,
          defaultBranch === branch.id && config.default_root
            ? config.to
            : path.join(config.to, branch.id),
        ),
      );
    } catch (error) {
      logError(error.stderr?.trim() ?? error);
    }
  }

  await $`git checkout ${defaultBranch}`;

  logSuccess("🎉 Bundle ready!");
})();
