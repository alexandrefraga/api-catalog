export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/api-login',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || 'ab69gt94=hr',
  mailFrom: 'Alexandre Fraga<alexandrenfraga@gmail.com>',
  mailParams: {
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '664be95f8e43a4',
      pass: 'caa9298ef4684e'
    }
  }
}
