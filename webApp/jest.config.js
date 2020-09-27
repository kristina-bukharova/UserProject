module.exports = {
    roots: ["<rootDir>"],
    testPathIgnorePatterns: ["/dist/", "temp"],
    transform: {
        "^.+\\.ts?$": "ts-jest"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    globals: {
        "ts-jest": {
            tsConfigFile: "tsconfig.json"
        }
    },
};