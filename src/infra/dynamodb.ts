import { DynamoDB } from 'aws-sdk'

let options = {}

if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  }
}

if (process.env.JEST_WORKER_ID) {
  options = {
    endpoint: 'http://localhost:8000',
    region: 'local-env',
    sslEnabled: false
  }
}

const dynamoClient = new DynamoDB.DocumentClient(options)

export const Dynamo = {
  async get (key: any, tableName: string): Promise<any> {
    const params = {
      TableName: tableName,
      Key: { ...key }
    }
    return await dynamoClient.get(params).promise()
  },

  async write (item: any, tableName: string): Promise<void> {
    const params = {
      TableName: tableName,
      Item: item
    }
    await dynamoClient.put(params).promise()
  },

  async query (params: any) {
    return await dynamoClient.query(params).promise()
  }
}

export default Dynamo
