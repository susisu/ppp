"use strict";

module.exports = {
  roots: ["./lib"],
  moduleFileExtensions: ["js", "mjs"],
  testMatch: ["**/*.{test,spec}.{js,mjs}"],
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ["./lib/**/*.{js,mjs}", "!./lib/**/*.{test,spec}.{js,mjs}"],
  coverageDirectory: "coverage",
};
