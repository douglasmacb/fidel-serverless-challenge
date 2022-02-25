import type { AWS } from '@serverless/typescript'

import {
  linkLocationToOffer,
  createOffer,
  createLocation,
  linkAllLocationsToOfferProducer,
  linkAllLocationsToOfferConsumer
} from './src/lambdas'

const serverlessConfiguration: AWS = {
  service: 'be-techtest-douglasmiranda',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-dynamodb-local',
    'serverless-offline',
    'serverless-export-env',
    'serverless-offline-sqs'
  ],
  resources: {
    Resources: {
      FidelQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'FidelQueue'
        }
      },
      offersDynamoDbTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH'
            }
          ],
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S'
            },
            {
              AttributeName: 'brandId',
              AttributeType: 'S'
            }
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: 'brandIdIndex',
              KeySchema: [
                {
                  AttributeName: 'brandId',
                  KeyType: 'HASH'
                }
              ],
              Projection: {
                ProjectionType: 'ALL'
              }
            }
          ],
          BillingMode: 'PAY_PER_REQUEST',
          TableName: 'offer-table'
        }
      },
      locationsDynamoDbTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH'
            }
          ],
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S'
            },
            {
              AttributeName: 'brandId',
              AttributeType: 'S'
            }
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: 'brandIdIndex',
              KeySchema: [
                {
                  AttributeName: 'brandId',
                  KeyType: 'HASH'
                }
              ],
              Projection: {
                ProjectionType: 'ALL'
              }
            }
          ],
          BillingMode: 'PAY_PER_REQUEST',
          TableName: 'location-table'
        }
      }
    }
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    profile: 'fidelServerlessAccount',
    region: 'eu-west-1',
    stage: '${opt:stage, "dev"}',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      OFFER_TABLE: 'offer-table',
      LOCATION_TABLE: 'location-table',
      NODE_ENV: '${self:provider.stage}',
      SERVICE: '${self:service}',
      AWS_DEPLOY_REGION: '${self:provider.region}',
      AWS_ACCOUNT_ID: '${AWS::AccountId}',
      QUEUE_URL: {
        Ref: 'FidelQueue'
      },
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000'
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem'
            ],
            Resource: '*'
          },
          {
            Effect: 'Allow',
            Action: [
              'sqs:SendMessage',
              'sqs:GetQueueUrl',
              'sqs:ReceiveMessage',
              'sqs:ListQueues',
              'sqs:GetQueueUrl'
            ],
            Resource: '*'

          }
        ]
      }
    }
  },
  functions: {
    linkLocationToOffer,
    linkAllLocationsToOfferProducer,
    linkAllLocationsToOfferConsumer,
    createOffer,
    createLocation
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10
    },
    'serverless-offline-sqs': {
      autoCreate: true,
      apiVersion: '2012-11-05',
      endpoint: 'http://0.0.0.0:9324',
      region: 'eu-west-1',
      accessKeyId: 'root',
      secretAccessKey: 'root',
      skipCacheInvalidation: false
    },
    dynamodb: {
      stages: ['dev'],
      start: {
        port: 8000,
        inMemory: true,
        heapInitial: '200m',
        heapMax: '1g',
        migrate: true,
        seed: true,
        convertEmptyValues: true
      },
      seed: {
        domain: {
          sources: [
            {
              table: 'offer-table',
              sources: ['./src/offline/migrations/offers.json']
            },
            {
              table: 'location-table',
              sources: ['./src/offline/migrations/locations.json']
            }
          ]
        }
      }
    }
  }
}

module.exports = serverlessConfiguration
