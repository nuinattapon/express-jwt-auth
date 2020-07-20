import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import rateLimit, { RateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import { MONGODB_URL, NODE_ENV, PORT } from './config'

import authRoute from './routes/auth'
import postRoute from './routes/posts'

console.log(`NODE_ENV=${NODE_ENV}`)
console.log(`MONGODB_URL=${MONGODB_URL}`)
;(async () => {
  const connectDB = async () => {
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
      'tiny'
      // ':method :url - :status - :response-time ms - :res[content-length] - Authorization: ":req[Authorization]"'
    )
  )

  // Route Middlewares
  authRoute(app)
  postRoute(app)

  app.listen(PORT, () => {
    console.log(`Express server started on port ${PORT}`)
  })
})()
