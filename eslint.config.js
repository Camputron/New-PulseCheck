import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import prettier from "eslint-plugin-prettier"
import prettierConfig from "eslint-config-prettier"

export default tseslint.config(
  { ignores: ["dist", "firebase"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      prettierConfig, // disables ESLint formattting rules that conflict with Prettier
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "no-console": ["error", { allow: ["warn", "error", "debug"] }], // Allow warnings but block logs
      "no-debugger": "error", // Debugger statements should never be in production
      "no-redeclare": "error", // Prevent accidental variable re-declaration
      "no-shadow": "error", // Avoid variable name shadowing
      eqeqeq: ["error", "always"], // Always use strict equality (===)
      "no-multi-str": "error", // Avoid multiline strings using backslashes
      "consistent-return": "error", // Ensure functions always return something or nothing
      "default-case": "error", // Require `default` case in `switch` statements

      "no-eval": "error", // `eval()` is a major security risk
      "no-implied-eval": "error", // Avoid indirect `eval()` calls
      "no-new-func": "error", // Avoid `new Function()` (similar to `eval()`)
      "no-prototype-builtins": "error", // Prevent prototype pollution issues
      "no-script-url": "error", // Prevent security vulnerabilities with `javascript:` URLs
      "no-unsafe-optional-chaining": "error", // Prevent crashing issues when chaining unsafe properties

      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "prettier/prettier": "error",
    },
  }
)
