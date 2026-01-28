export default {
  testTimeout: 60000,
  projects: [
    {
      displayName: 'client',
      testEnvironment: 'jest-environment-jsdom',
      testMatch: ['<rootDir>/src/client/**/*.test.{ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
      moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      transform: {
        '^.+\\.tsx?$': ['ts-jest', {
          useESM: true,
        }],
      },
      extensionsToTreatAsEsm: ['.ts', '.tsx'],
    },
    {
      displayName: 'service',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/src/service/**/*.test.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      transform: {
        '^.+\\.ts$': ['ts-jest', {
          useESM: true,
        }],
      },
      extensionsToTreatAsEsm: ['.ts'],
    }
  ]
};
