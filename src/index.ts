import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import morgan from 'morgan'
import rateLimit, { RateLimit } from 'express-rate-limit'
import helmet from 'helmet'

import authRoute from './routes/auth'
import postRoute from './routes/posts'
// Configure dotenv
dotenv.config()
;(async () => {
  const connectDB = async () => {
    const MONGODB_URL: string = process.env.MONGODB_URL
      ? process.env.MONGODB_URL
      : 'mongodb://localhost/jwtAuth'
    // Connect to Mongoose
    const connection = await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('Connected to MongDB')
  }

  //
  await connectDB()

  // Create express app
  const app = express()
  // Set up middleware
  app.use(helmet())

  // Ser up Rate limit setup
  const limiter: RateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 1500, // limit of number of request per IP
    message: 'Too many requests per IP',
  })

  app.use(limiter)
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(
    morgan(
      ':method :url - :status - :response-time ms - :res[content-length] - Authorization: ":req[Authorization]"'
    )
  )

  // Route Middlewares
  authRoute(app)
  postRoute(app)

  const PORT = +(process.env.PORT || 3000)
  app.listen(PORT, () => {
    console.log(`NODE_ENV=${process.env.NODE_ENV}`)
    console.log(`Express server started on port ${PORT}`)
  })
})()
