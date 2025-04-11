import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
// @ts-ignore -- no types for this plugin
import drizzle from "eslint-plugin-drizzle";
import enforceServerApiImport from "./eslint-rules/enforce-server-api-import.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      drizzle,
      "custom-rules": { rules: { "enforce-server-api-import": enforceServerApiImport } },
    },
    rules: {
      "import/no-cycle": 2,
      "@typescript-eslint/no-explicit-any": "off",
      "drizzle/enforce-delete-with-where": [
        "error",
        { drizzleObjectName: ["db", "ctx.db"] },
      ],
      "drizzle/enforce-update-with-where": [
        "error",
        { drizzleObjectName: ["db", "ctx.db"] },
      ],
      "custom-rules/enforce-server-api-import": "error",
    },
  },
];

export default eslintConfig;
