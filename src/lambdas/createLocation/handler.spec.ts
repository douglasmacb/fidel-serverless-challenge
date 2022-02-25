import createLocation from './handler'

describe('createLocation handler', () => {
  test('Should return 400 if an invalid body is provided', async () => {
    const httpRequest: any = {}
    const httpResponse = await createLocation(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  test('Should return 400 if the brandId is not provided', async () => {
    const httpRequest: any = {
      body: JSON.stringify({
        address: 'any_address'
      })
    }
    const httpResponse = await createLocation(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  test('Should return 400 if the address is not provided', async () => {
    const httpRequest: any = {
      body: JSON.stringify({
        brandId: 'any_brand_id'
      })
    }
    const httpResponse = await createLocation(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  test('Should return 200 with correct values', async () => {
    const httpRequest: any = {
      body: JSON.stringify({
        brandId: 'any_brand_id',
        address: 'any_address'
      })
    }
    const httpResponse = await createLocation(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
  })

  test('Should return 409 if the location already exists', async () => {
    const httpRequest: any = {
      body: JSON.stringify({
        brandId: 'any_brand_id',
        address: 'any_address'
      })
    }
    const httpResponse = await createLocation(httpRequest)
    expect(httpResponse.statusCode).toBe(409)
  })
})
