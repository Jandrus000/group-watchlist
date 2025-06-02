import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  /* Next.js defaults you already had                         */
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  /* ------------------------------------------------------- */
  /*  YOUR additional rules / overrides go here              */
  {
    files: ["**/*.ts", "**/*.tsx"],   // only TS files (optional)
    rules: {
      /**
       * Ignore *unused* function / catch parameters
       * **whose name starts with an underscore** (`_`).
       */
      "@typescript-eslint/no-unused-vars": [
        "off",
        { "argsIgnorePattern": "^_" }
      ],
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
];

export default eslintConfig;
