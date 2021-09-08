"use strict";

module.exports = {
  roots: ["./lib"],
  testMatch: ["**/*.{test,spec}.js"],
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ["./lib/**/*.js", "!./lib/**/*.{test,spec}.js"],
  coverageDirectory: "coverage",
};
