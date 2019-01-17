"use strict";

const chalk = require("chalk");

module.exports = {
  date(msg) {
    return chalk.green(msg);
  },
  label(msg) {
    return chalk.bold(msg);
  },
  link(msg) {
    return chalk.blue.underline(msg);
  },
  tagName(msg) {
    return chalk.yellow.bold(msg);
  },
  version(msg) {
    return chalk.cyan(msg);
  },
};
