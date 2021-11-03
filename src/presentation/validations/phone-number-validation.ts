import { InvalidParamError } from '@/data/errors'
import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocolls'
export class PhoneNumberArrayValidation implements Validation {
  constructor (
    private readonly input: any,
    private readonly fieldName: string,
    private readonly minLength: number
  ) {}

  async validate (): Promise<Error> {
    return new Promise(resolve => {
      let response = null
      if (this.input[this.fieldName]) {
        if (Array.isArray(this.input[this.fieldName]) && this.input[this.fieldName].length >= this.minLength) {
          // eslint-disable-next-line prefer-regex-literals
          const isPhoneNumber = new RegExp('^\\d{2}-\\d{8,9}$')
          const onError: string = this.input[this.fieldName].find(e => {
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
