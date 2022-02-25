module.exports = {
  verbose: true,
  preset: '@shelf/jest-dynamodb',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  setupFilesAfterEnv: ['./src/common/config/test-env.ts']
}
