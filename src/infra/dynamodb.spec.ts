import { OfferModel } from '../domain/models/offer'
import Dynamo from './dynamodb'

const validTableName = process.env.OFFER_TABLE

const makeFakeOffer = (): OfferModel => ({
  name: 'Super Duper Offer',
  id: 'any_offer_id',
  brandId: 'any_brand_id',
  locationsTotal: 0
})

const fakeParams = {
  TableName: validTableName,
  IndexName: 'brandIdIndex',
  KeyConditionExpression: '#brandId = :brand_id',
  ExpressionAttributeNames: {
    '#brandId': 'brandId'
  },
  ExpressionAttributeValues: {
    ':brand_id': 'any_brand_id'
  }
}

describe('DynamoDB', () => {
  test('Should confirm if Dynamo is an object', () => {
    expect(typeof Dynamo).toBe('object')
  })

  test('Should confirm if DynamoDB has get, write and scan are functions', () => {
    expect(typeof Dynamo.get).toBe('function')
    expect(typeof Dynamo.write).toBe('function')
    expect(typeof Dynamo.query).toBe('function')
  })

  test('Should call write function with correct values', async () => {
    const writeSpy = jest.spyOn(Dynamo, 'write')
    await Dynamo.write(makeFakeOffer(), validTableName)
    expect(writeSpy).toHaveBeenCalledWith(makeFakeOffer(), validTableName)
  })

  test('Should call query function', async () => {
    const writeSpy = jest.spyOn(Dynamo, 'query')
    await Dynamo.query(fakeParams)
    expect(writeSpy).toHaveBeenCalled()
  })

  test('Should call get function with correct values', async () => {
    const { id } = makeFakeOffer()
    const getSpy = jest.spyOn(Dynamo, 'get')
    await Dynamo.get({ id }, validTableName)
    expect(getSpy).toHaveBeenCalledWith({ id }, validTableName)
  })

  test('Should get an item on DynamoDB with success', async () => {
    const { id } = makeFakeOffer()
    expect.assertions(1)
    const res = await Dynamo.get({ id }, validTableName)
    expect(res).toEqual({ Item: makeFakeOffer() })
  })

  test('Should query items on DynamoDB with success', async () => {
    expect.assertions(1)
    const res = await Dynamo.query(fakeParams)
    expect(res.Items.length).toBeGreaterThan(0)
  })
})
