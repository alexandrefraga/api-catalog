import { nodemailerAdaptSendParams as adaptParams } from '@/infra/service/nodemailer-helper'
import { mockSendMailParams } from '../../mocks/mock-send-mail'

describe('Nodemailer Helper', () => {
  it('Should return mail service params if correct data is provided', () => {
    const mailServiceParams = adaptParams(mockSendMailParams(), 'mail')
    const { subject, name, email, token } = mockSendMailParams()
    expect(mailServiceParams).toEqual({
      mailTo: `${name}<${email}>`,
      subject,
      template: {
        name: 'mail',
        props: {
          name,
          token
        }
      }
    })
  })
})
