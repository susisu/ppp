import chalk from "chalk";

export function date(msg) {
  return chalk.green(msg);
}

export function label(msg) {
  return chalk.bold(msg);
}

export function link(msg) {
  return chalk.blue.underline(msg);
}

export function tagName(msg) {
  return chalk.yellow.bold(msg);
}

export function version(msg) {
  return chalk.cyan(msg);
}
