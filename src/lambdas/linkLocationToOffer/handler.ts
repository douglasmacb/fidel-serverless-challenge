import { HttpResponse } from '../../common/protocols/http'
import { badRequest, notFound, ok, serverError, unauthorized } from '../../common/helpers/http/http-helper'
import { APIGatewayEvent } from 'aws-lambda'
import { makeValidation } from './validation'
import Dynamo from '../../infra/dynamodb'
import { LocationModel, OfferModel, Item } from '../../domain/models'
import { isEmpty } from '../../utils/validators'
import { NotFoundError } from '../../common/errors'

export const linkLocationToOffer = async (event: APIGatewayEvent): Promise<HttpResponse> => {
  try {
    const validation = makeValidation()
    const error = validation.validate(event.pathParameters)
    if (error) {
      return badRequest(error)
    }
    const { offerId, locationId } = event.pathParameters

    const location: Item<LocationModel> = await Dynamo.get({ id: locationId }, process.env.LOCATION_TABLE)
    if (isEmpty(location)) {
      return notFound(new NotFoundError('Location'))
    }

    const offer: Item<OfferModel> = await Dynamo.get({ id: offerId }, process.env.OFFER_TABLE)
    if (isEmpty(offer)) {
      return notFound(new NotFoundError('Offer'))
    }

    if (offer.Item.brandId !== location.Item.brandId) {
      return unauthorized()
    }

    const { linkedLocation, linkedOffer }: LinkModel = link(location.Item, offer.Item)

    await Dynamo.write(linkedLocation, process.env.LOCATION_TABLE)
    await Dynamo.write(linkedOffer, process.env.OFFER_TABLE)

    return ok({ resource: event.path })
  } catch (error) {
    console.error(error)
    return serverError(error)
  }
}

interface LinkModel {
  linkedLocation: LocationModel
  linkedOffer: OfferModel
}

const link = (location: LocationModel, offer: OfferModel): LinkModel => {
  let linkedLocation = location
  let linkedOffer = offer

  if (!existOffersArray(location)) {
    linkedLocation = { ...location, hasOffer: true, offers: [offer.id] }
    linkedOffer = { ...offer, locationsTotal: 1 }
  } else if (existOffersArray(location) && !isLocationOffersContainsOfferId(offer.id, location)) {
    linkedLocation = { ...location, offers: [...location.offers, offer.id] }
    linkedOffer = { ...offer, locationsTotal: location.offers.length + 1 }
  }
  return {
    linkedLocation,
    linkedOffer
  }
}

const existOffersArray = (location: LocationModel): boolean => {
  return location.offers?.length > 0
}

const isLocationOffersContainsOfferId = (offerId: string, location: LocationModel): boolean => {
  return location.offers.includes(offerId)
}

export default linkLocationToOffer
