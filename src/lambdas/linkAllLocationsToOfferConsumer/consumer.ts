import { HttpResponse } from '../../common/protocols/http'
import { SQSEvent } from 'aws-lambda'

export const linkAllLocationsToOfferConsumer = async (event: SQSEvent): Promise<HttpResponse> => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'SQS event processed.',
      input: event
    })
  }
  const body = event.Records[0].body
  console.log('text: ', JSON.parse(body).text)
  return response
}

export default linkAllLocationsToOfferConsumer
