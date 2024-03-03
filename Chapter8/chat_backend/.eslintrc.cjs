module.exports = {
  extends: ["@hono/eslint-config", "plugin:prettier/recommended", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
  },
};
