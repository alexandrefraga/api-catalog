import { InvalidParamError } from '@/data/errors'
import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocolls'

export class PhoneNumberArrayValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly minLength: number
  ) {}

  async validate (input: any): Promise<Error> {
    return new Promise(resolve => {
      let response = null
      if (input[this.fieldName]) {
        if (Array.isArray(input[this.fieldName]) && input[this.fieldName].length >= this.minLength) {
          const isPhoneNumber = new RegExp('^\\d{2}-\\d{8,9}$')
          const onError: string = input[this.fieldName].find(e => {
            return typeof e === 'string' ? !isPhoneNumber.test(e) : true
          })
          response = onError ? new InvalidParamError(`${this.fieldName}: ${onError}`) : null
        } else {
          response = new InvalidParamError(`${this.fieldName}`)
        }
      } else {
        response = new MissingParamError(this.fieldName)
      }
      resolve(response)
    })
  }
}
