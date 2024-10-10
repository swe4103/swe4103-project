import config from '#config'

describe('Configuration Values', () => {
  it('should load the correct environment', () => {
    const expectedEnv = process.env.NODE_ENV
    expect(config.env).toBe(expectedEnv)
  })
})
