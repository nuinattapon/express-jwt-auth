import dotenv from 'dotenv'

// Configure dotenv
dotenv.config()

export const {
  MONGODB_URL = 'mongodb://localhost/jwtAuth',
  NODE_ENV = 'development',
  PORT = 3000,
  JWT_SECRET_KEY = 'secret',
} = process.env
