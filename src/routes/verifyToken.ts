import { Request, Response, NextFunction } from 'express'

import jwt from 'jsonwebtoken'
interface IVerified {
  _id: string
  iat: number
  exp: number
}
import { JWT_SECRET_KEY } from '../config'

export default function verify(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // *FORMAT OF TOKEN
  // *Authorization: "Bearer <access_token>"
  // Get auth header value
  const bearerHeader: string | undefined = req.header('Authorization')
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ')

    if (bearer[0] === 'Bearer') {
      // Get token from array potion 1
      const bearerToken = bearer[1]
      try {
        const verified: IVerified | string | object = jwt.verify(
          bearerToken,
          JWT_SECRET_KEY
        )
        if (typeof verified !== 'string') {
          console.log('_id:', (verified as IVerified)._id)
        }
        next()
      } catch (err) {
        res.status(403).send(err)
      }
    } else {
      res.status(403).send('Access to the requested resource has been denied')
    }
  } else {
    res.status(403).send('Access to the requested resource has been denied')
  }
}
