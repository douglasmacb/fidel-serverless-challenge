import { handlerPath } from '@utils/handler-resolver'

export default {
  handler: `${handlerPath(__dirname)}/consumer.linkAllLocationsToOfferConsumer`,
  events: [
    {
      sqs: {
        arn: {
          'Fn::GetAtt': [
            'FidelQueue',
            'Arn'
          ]
        }
      }
    }
  ]
}
