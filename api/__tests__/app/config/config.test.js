import config from '#config'

describe('Configuration Values', () => {
  it('should load the correct port value', () => {
    const expectedPort = process.env.PORT
    expect(parseInt(config.port, 10)).toBe(parseInt(expectedPort, 10))
  })
})
