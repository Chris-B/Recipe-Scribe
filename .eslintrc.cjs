module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        tsconfigRootDir: __dirname,
        project: [
            "./apps/api/tsconfig.json",
            "./apps/web/tsconfig.json",
            "./packages/shared/tsconfig.json"
        ]
    },
    plugins: ["@typescript-eslint"],
    env: {
        es2022: true
    },
    rules: {}
};