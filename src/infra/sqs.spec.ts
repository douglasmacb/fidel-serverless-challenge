import Sqs from './sqs'

const fakeParams = {
  MessageBody: { text: 'hello' },
  QueueUrl: Sqs.getQueueUrl('FidelQueue')
}

describe('SQS', () => {
  test('Should confirm if Sqs is an object', () => {
    expect(typeof Sqs).toBe('object')
  })

  test('Should confirm if DynamoDB has sendMessage function', () => {
    expect(typeof Sqs.sendMessage).toBe('function')
  })

  test('Should call sendMessage function with correct values', async () => {
    const writeSpy = jest.spyOn(Sqs, 'sendMessage')
    await Sqs.sendMessage(JSON.stringify(fakeParams))
    expect(writeSpy).toHaveBeenCalledWith(JSON.stringify(fakeParams))
  })
})
