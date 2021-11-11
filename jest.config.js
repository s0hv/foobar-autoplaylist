module.exports = {
  preset: 'ts-jest',
  testMatch: ['<rootDir>/tests/**/*.(test).[jt]s?(x)'],
  setupFilesAfterEnv: ['jest-extended/all'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
