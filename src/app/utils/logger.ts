/* eslint-disable no-console */
import chalk from 'chalk';

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(chalk.green(message), ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.log(chalk.yellow(message), ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.log(chalk.red(message), ...args);
  },
};
