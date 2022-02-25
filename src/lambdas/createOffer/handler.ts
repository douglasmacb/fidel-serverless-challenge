import { HttpResponse } from '../../common/protocols/http'
import { badRequest, ok, serverError, conflict } from '../../common/helpers/http/http-helper'
import { APIGatewayEvent } from 'aws-lambda'
import { makeValidation } from './validation'
import Dynamo from '../../infra/dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { OfferModel } from '../../domain/models'
import { ResourceExistsError, InvalidBodyError } from '../../common/errors'

export const createOffer = async (event: APIGatewayEvent): Promise<HttpResponse> => {
  try {
    if (!event.body) {
      return badRequest(new InvalidBodyError())
    }
    const body = JSON.parse(event.body)
    const validation = makeValidation()
    const error = validation.validate(body)
    if (error) {
      return badRequest(error)
    }
    const { name, brandId }: OfferModel = body

    const offers = await Dynamo.query({
      TableName: process.env.OFFER_TABLE,
      IndexName: 'brandIdIndex',
      KeyConditionExpression: '#brandId = :brand_id',
      FilterExpression: '#name = :name_value',
      ExpressionAttributeNames: {
        '#brandId': 'brandId',
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':brand_id': brandId,
        ':name_value': name
      }
    })

    if (offers.Items.length > 0) {
      return conflict(new ResourceExistsError('Offer'))
    }

    const offer: OfferModel = {
      name,
      brandId,
      id: uuidv4(),
      locationsTotal: 0
    }
    await Dynamo.write(offer, process.env.OFFER_TABLE)
    return ok({ offer, resource: event.path })
  } catch (error) {
    console.error(error)
    return serverError(error)
  }
}

export default createOffer
