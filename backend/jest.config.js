
module.exports = {
    testEnvironment: 'node',
    verbose: true,
    coveragePathIgnorePatterns: ['/node_modules/'],

    testMatch: [
      "**/tests/**/*.test.js", 
      "**/__tests__/**/*.js"   
    ],
  };
  