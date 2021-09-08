"use strict";

module.exports = {
  roots: ["./lib"],
  testMatch: ["**/*.spec.js"],
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ["./lib/**/*.js", "!./lib/**/*.spec.js"],
  coverageDirectory: "coverage",
};
