export const logAndWait = async (
  message: string,
  fn: () => Promise<void>,
): Promise<void> => {
  if ($.env["CI"] === "true") {
    echo(message);
    return fn();
  } else {
    return spinner(message, fn);
  }
};

export const logSuccess = (message: string) => echo(chalk.green(message));

export const logError = (error: string) => echo(`❌  ${chalk.red(error)}`);
