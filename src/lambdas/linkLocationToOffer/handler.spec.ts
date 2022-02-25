import { LocationModel, OfferModel } from '../../domain/models'
import Dynamo from '../../infra/dynamodb'
import linkLocationToOffer from './handler'

const OFFER_TABLE = process.env.OFFER_TABLE
const LOCATION_TABLE = process.env.LOCATION_TABLE

const makeFakeSuperBockOffer = (): OfferModel => ({
  name: 'Super Bock Offer',
  id: 'super_bock_offer_id',
  brandId: 'any_brand_id',
  locationsTotal: 0
})

const makeFakeSuperDuperOffer = (): OfferModel => ({
  name: 'Super Duper Offer',
  id: 'super_duper_offer_id',
  brandId: 'other_any_brand_id',
  locationsTotal: 0
})

const makeFakeLocation = (): LocationModel => ({
  id: 'any_location_id',
  address: 'Address 2',
  brandId: 'any_brand_id',
  hasOffer: false
})

describe('linkLocationToOffer handler', () => {
  beforeAll(async () => {
    await Dynamo.write(makeFakeSuperBockOffer(), OFFER_TABLE)
    await Dynamo.write(makeFakeSuperDuperOffer(), OFFER_TABLE)
    await Dynamo.write(makeFakeLocation(), LOCATION_TABLE)
  })

  test('Should return 400 if an invalid offerId is provided', async () => {
    const httpRequest: any = {
      pathParameters: {
        locationId: 'invalid_location_id'
      }
    }
    const httpResponse = await linkLocationToOffer(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  test('Should return 400 if an invalid locationId is provided', async () => {
    const httpRequest: any = {
      pathParameters: {
        offerId: 'invalid_offer_id'
      }
    }
    const httpResponse = await linkLocationToOffer(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  test('Should return 404 if the location does not exist', async () => {
    const httpRequest: any = {
      pathParameters: {
        offerId: 'super_duper_offer_id',
        locationId: 'non_existing_location'
      }
    }
    const httpResponse = await linkLocationToOffer(httpRequest)
    expect(httpResponse.statusCode).toBe(404)
  })

  test('Should return 404 if the offer does not exist', async () => {
    const httpRequest: any = {
      pathParameters: {
        offerId: 'non_existing_offer',
        locationId: 'any_location_id'
      }
    }
    const httpResponse = await linkLocationToOffer(httpRequest)
    expect(httpResponse.statusCode).toBe(404)
  })

  test('Should return 200 with correct values', async () => {
    const httpRequest: any = {
      pathParameters: {
        offerId: 'super_bock_offer_id',
        locationId: 'any_location_id'
      }
    }
    const httpResponse = await linkLocationToOffer(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
  })

  test('Should return 401 if the brandId from the offer is different than the location', async () => {
    const httpRequest: any = {
      pathParameters: {
        offerId: 'super_duper_offer_id',
        locationId: 'any_location_id'
      }
    }
    const httpResponse = await linkLocationToOffer(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
  })
})
