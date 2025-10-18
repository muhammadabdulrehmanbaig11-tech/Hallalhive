/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/__tests__"],
    testMatch: ["**/*.test.ts"],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1"
    },
    globals: {
      "ts-jest": {
        tsconfig: "<rootDir>/tsconfig.json",
        isolatedModules: true
      }
    }
  };
  module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/__tests__"],
    testMatch: ["**/*.test.ts"],
    moduleNameMapper: {
      "^firebase-admin$": "<rootDir>/__mocks__/firebase-admin.ts",
      "^@/(.*)$": "<rootDir>/src/$1"
    },
    globals: {
      "ts-jest": { tsconfig: "<rootDir>/tsconfig.json", isolatedModules: true }
    }
  };
  