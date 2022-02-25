export class InvalidUuidError extends Error {
  constructor () {
    super('Bad Request')
    this.message = 'Invalid uuid'
  }
}
