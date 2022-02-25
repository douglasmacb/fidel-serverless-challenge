export class InvalidBodyError extends Error {
  constructor () {
    super('Bad Request')
    this.message = 'Invalid body'
  }
}
