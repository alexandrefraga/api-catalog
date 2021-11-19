if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config()
}

export default {
  baseUrl: 'http://localhost:5050/api',
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/api-catalog',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET,
  mailFrom: process.env.MAIL_FROM,
  mailParams: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  }
}
