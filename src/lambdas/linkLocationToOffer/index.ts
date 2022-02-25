import { handlerPath } from '@utils/handler-resolver'

export default {
  handler: `${handlerPath(__dirname)}/handler.linkLocationToOffer`,
  events: [
    {
      http: {
        method: 'post',
        path: 'v1/offers/{offerId}/locations/{locationId}'
      }
    }
  ]
}
