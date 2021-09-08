"use strict";

module.exports = {
  overrides: [
    {
      files: ["*.js", "bin/*"],
      extends: [
        "@susisu/eslint-config/preset/es",
        "prettier",
        "plugin:node/recommended",
        "plugin:eslint-comments/recommended",
      ],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "script",
      },
      env: {
        es6: true,
        node: true,
      },
    },
    {
      files: ["*.{test,spec}.js", "src/**/__tests__/**/*.js"],
      extends: ["plugin:jest/recommended", "plugin:jest-formatting/recommended"],
      env: {
        "jest/globals": true,
      },
    },
  ],
};
