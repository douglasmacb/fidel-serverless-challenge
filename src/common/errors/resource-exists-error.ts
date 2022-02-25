export class ResourceExistsError extends Error {
  constructor (paramName: string) {
    super(`${paramName} already exists`)
  }
}
