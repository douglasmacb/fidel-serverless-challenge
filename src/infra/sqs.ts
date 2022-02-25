import { SQS } from 'aws-sdk'

const LOCAL_ENDPOINT = 'http://localhost:9324'

const queue = new SQS({
  endpoint: LOCAL_ENDPOINT,
  region: 'eu-west-1',
  apiVersion: '2012-11-05'
})

export const Sqs = {
  async sendMessage (message: string): Promise<any> {
    const params = {
      MessageBody: message,
      QueueUrl: Sqs.getQueueUrl('FidelQueue')
    }
    return await queue.sendMessage(params).promise()
  },

  getQueueUrl (queueName: string): string {
    const { AWS_ACCOUNT_ID, AWS_DEPLOY_REGION } = process.env
    if (process.env.IS_OFFLINE || process.env.JEST_WORKER_ID) {
      return [LOCAL_ENDPOINT, 'queue', queueName].join('/')
    }
    return [`https://sqs.${AWS_DEPLOY_REGION}.amazonaws.com`, AWS_ACCOUNT_ID, queueName].join('/')
  }
}

export default Sqs
