import { Config } from "../cli";

export const extractConfiguration = async (path: string): Promise<Config> => {
  try {
    return await fs.readJson(path);
  } catch (error) {
    throw new Error(`Cannot read configuration file at ${path}`);
  }
}

export const verifyNode = async (): Promise<void> => {
  try {
    await $`node --version`;
  } catch (error) {
    throw new Error('Node must be installed');
  }
}

export const verifyGit = async (): Promise<void> => {
  const gitVersion = await $`git --version`;
  if (!gitVersion.toString().includes('git version 2.')) {
    throw new Error('Git 2.x must be installed');
  }

  try {
    await $`git diff-index --quiet HEAD`
  } catch (e) {
    throw new Error('Git workspace must be clean');
  }
}
