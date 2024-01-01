#!/usr/bin/env node

import "zx/globals";
import { fetchBranches } from "./run/branches";
import { buildStorybook, checkoutCommit, cleanPreviousBundle, prepareStorybook } from "./run/build";
import { extractConfiguration, verifyGit, verifyNode } from "./run/setup";

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
  provider: ProviderConfig;
}

void async function() {
  const configPath = argv["c"] ?? argv["config"] ?? ".storybook/.branches.json";
  let config: Config;

  console.log(chalk.green('😎 Verify if the workspace is ready'));
  try {
    config = await extractConfiguration(configPath);
    if (config.directory) {
      cd(config.directory);
    }

    await verifyNode();
    await verifyGit();
  } catch (error) {
    console.error("❌ ", chalk.red(error));
    process.exit(1);
  }

  const branches = await fetchBranches(config.provider);
  const defaultBranch = config.default_branch ?? branches[0].id;

  console.log(chalk.green('⌛  Start building the bundle...'));
  await cleanPreviousBundle(config.to);

  for (const branch of branches) {
    try {
      await spinner(`Fetching ${branch.id}...`, () => checkoutCommit(branch.commit));
      await spinner(`Building Storybook for branch ${branch.id}...`, () => buildStorybook(config.script_name));
      await spinner(`Copying Storybook of branch ${branch.id}...`, () => prepareStorybook(
        config.from, defaultBranch === branch.id && config.default_root ? config.to : path.join(config.to, branch.id)
      ));
    } catch (error) {
      console.error("❌ ", chalk.red(`Cannot build Storybook for branch ${branch.id}:`), error.stderr.trim());
    }
  }

  console.log(chalk.green('🧹 Clean up...'));
  await $`git checkout ${defaultBranch}`;
}();
