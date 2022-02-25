import { handlerPath } from '@utils/handler-resolver'

export default {
  handler: `${handlerPath(__dirname)}/handler.createLocation`,
  provisionedConcurrency: 5,
  events: [
    {
      http: {
        method: 'post',
        path: 'v1/locations'
      }
    }
  ]
}
