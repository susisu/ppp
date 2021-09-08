"use strict";

module.exports = {
  overrides: [
    {
      files: ["*.{js,cjs,mjs}"],
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
      files: ["*.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
    {
      files: ["*.mjs"],
      parserOptions: {
        sourceType: "module",
      },
    },
    {
      files: ["*.{test,spec}.{js,cjs,mjs}", "lib/**/__tests__/**/*.{js,cjs,mjs}"],
      extends: ["plugin:jest/recommended", "plugin:jest-formatting/recommended"],
      env: {
        "jest/globals": true,
      },
    },
  ],
};
