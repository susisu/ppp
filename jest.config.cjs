"use strict";

module.exports = {
  roots: ["./lib"],
  moduleFileExtensions: ["js", "cjs"],
  testMatch: ["**/*.{test,spec}.{js,cjs}"],
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ["./lib/**/*.{js,cjs}", "!./lib/**/*.{test,spec}.{js,cjs}"],
  coverageDirectory: "coverage",
};
