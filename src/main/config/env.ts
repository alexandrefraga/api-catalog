export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/api-login',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || 'ab69gt94=hr'
}
