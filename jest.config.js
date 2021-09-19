module.exports = {
  preset: 'ts-jest',
  testMatch: ['<rootDir>/tests/**/*.(test).[jt]s?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
