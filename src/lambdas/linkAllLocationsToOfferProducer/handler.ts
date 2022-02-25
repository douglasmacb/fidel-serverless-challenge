import { HttpResponse } from '../../common/protocols/http'
import { ok, serverError, notFound, badRequest } from '../../common/helpers/http/http-helper'
import { APIGatewayEvent } from 'aws-lambda'
import { Dynamo, Sqs } from '../../infra'
import { makeValidation } from './validation'
import { OfferModel, LocationModel, Item } from '../../domain/models'
import { isEmpty } from '../../utils/validators'
import { NotFoundError } from '../../common/errors'

export const linkAllLocationsToOfferProducer = async (event: APIGatewayEvent): Promise<HttpResponse> => {
  try {
    const validation = makeValidation()
    const error = validation.validate(event.pathParameters)
    if (error) {
      return badRequest(error)
    }
    const { offerId } = event.pathParameters
    const offer: Item<OfferModel> = await Dynamo.get({ id: offerId }, process.env.OFFER_TABLE)
    if (isEmpty(offer)) {
      return notFound(new NotFoundError('Offer'))
    }

    const locations = await Dynamo.query({
      TableName: process.env.LOCATION_TABLE,
      IndexName: 'brandIdIndex',
      KeyConditionExpression: '#brandId = :brand_id',
      ExpressionAttributeNames: {
        '#brandId': 'brandId'
      },
      ExpressionAttributeValues: {
        ':brand_id': offer.Item.brandId
      }
    })

    const message = {
      offerId: offer.Item.id,
      locations: locations.Items.map((location: LocationModel) => location.id)
    }

    await Sqs.sendMessage(JSON.stringify(message))
    return ok({ message })
  } catch (error) {
    console.error(error)
    return serverError(error)
  }
}

export default linkAllLocationsToOfferProducer
