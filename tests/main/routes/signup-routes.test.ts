import app from '@/main/config/app'
import request from 'supertest'

describe('SignUp Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      })
      .expect(200)
  })
})
