export class DataInUseError extends Error {
  constructor (stack: string) {
    super('The received data are already in use')
    this.name = 'DataInUseError'
    this.stack = stack
  }
}
