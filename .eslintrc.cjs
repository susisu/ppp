"use strict";

module.exports = {
  overrides: [
    {
      files: ["*.{js,cjs}"],
      extends: [
        "@susisu/eslint-config/preset/es",
        "prettier",
        "plugin:node/recommended",
        "plugin:eslint-comments/recommended",
      ],
      parserOptions: {
        ecmaVersion: 2020,
      },
      env: {
        es6: true,
        node: true,
      },
    },
    {
      files: ["*.cjs"],
      parserOptions: {
        sourceType: "script",
      },
    },
    {
      files: ["*.js"],
      parserOptions: {
        sourceType: "module",
      },
    },
    {
      files: ["*.spec.js", "lib/**/__tests__/**/*.js"],
      extends: ["plugin:jest/recommended", "plugin:jest-formatting/recommended"],
      env: {
        "jest/globals": true,
      },
    },
  ],
};
