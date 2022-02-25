import createOffer from './handler'

describe('createOffer handler', () => {
  test('Should return 400 if an invalid body is provided', async () => {
    const httpRequest: any = {}
    const httpResponse = await createOffer(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  test('Should return 400 if the brandId is not provided', async () => {
    const httpRequest: any = {
      body: JSON.stringify({
        name: 'any_name'
      })
    }
    const httpResponse = await createOffer(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  test('Should return 400 if the name is not provided', async () => {
    const httpRequest: any = {
      body: JSON.stringify({
        brandId: 'any_brand_id'
      })
    }
    const httpResponse = await createOffer(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  test('Should return 201 with correct values', async () => {
    const httpRequest: any = {
      body: JSON.stringify({
        brandId: 'any_brand_id',
        name: 'any_name'
      })
    }
    const httpResponse = await createOffer(httpRequest)
    expect(httpResponse.statusCode).toBe(201)
  })

  test('Should return 409 if the offer already exists', async () => {
    const httpRequest: any = {
      body: JSON.stringify({
        brandId: 'any_brand_id',
        name: 'any_name'
      })
    }
    const httpResponse = await createOffer(httpRequest)
    expect(httpResponse.statusCode).toBe(409)
  })
})
