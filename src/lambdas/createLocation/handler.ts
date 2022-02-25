import { HttpResponse } from '../../common/protocols/http'
import { badRequest, ok, serverError, conflict } from '../../common/helpers/http/http-helper'
import { APIGatewayEvent } from 'aws-lambda'
import { makeValidation } from './validation'
import Dynamo from '../../infra/dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { LocationModel } from '../../domain/models'
import { ResourceExistsError, InvalidBodyError } from '../../common/errors'

export const createLocation = async (event: APIGatewayEvent): Promise<HttpResponse> => {
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
    const { address, brandId }: LocationModel = body

    const locations = await Dynamo.query({
      TableName: process.env.LOCATION_TABLE,
      IndexName: 'brandIdIndex',
      KeyConditionExpression: '#brandId = :brand_id',
      FilterExpression: '#address = :address_value',
      ExpressionAttributeNames: {
        '#brandId': 'brandId',
        '#address': 'address'
      },
      ExpressionAttributeValues: {
        ':brand_id': brandId,
        ':address_value': address
      }
    })

    if (locations.Items.length > 0) {
      return conflict(new ResourceExistsError('Offer'))
    }

    const location: LocationModel = {
      address,
      brandId,
      id: uuidv4(),
      hasOffer: false
    }
    await Dynamo.write(location, process.env.LOCATION_TABLE)
    return ok({ location, resource: event.path })
  } catch (error) {
    console.error(error)
    return serverError(error)
  }
}

export default createLocation
