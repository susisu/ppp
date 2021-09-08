"use strict";

module.exports = {
  roots: ["./lib"],
  moduleFileExtensions: ["js", "cjs", "mjs"],
  testMatch: ["**/*.{test,spec}.{js,cjs,mjs}"],
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ["./lib/**/*.{js,cjs,mjs}", "!./lib/**/*.{test,spec}.{js,cjs,mjs}"],
  coverageDirectory: "coverage",
};
