import { Request, Response, Application, Express } from 'express'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import User, { IUser } from '../model/User'

import { JWT_SECRET_KEY, NODE_ENV, MONGODB_URL } from '../config'

console.log(`JWT_SECRET_KEY=${JWT_SECRET_KEY}`)

const router = (app: Express) => {
  app.route('/api/user/register').post(async (req: Request, res: Response) => {
    const { name, email, password } = req.body

    if (validator.isEmail(email)) {
      if (await User.findOne({ email })) {
        res.status(400).send({
          error: `E-Mail address "${email}" already exists`,
        })
      } else {
        // * Hash password
        // const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(password, 10)

        // Create User object to save via Mongoose
        const user = new User({
          name,
          email,
          password: hashPassword,
        })

        try {
          // Save user into MongoDB
          const savedUser = await user.save()
          res.send({ userID: user.id, name, email })
        } catch (err) {
          res.status(400).send(err)
        }
      }
    } else {
      // !Send error to client that email is an invalid email
      res
        .status(400)
        .send({ error: `E-Mail address "${req.body.email}" is invalid` })
    }
  })

  app.route('/api/user/login').post(async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (validator.isEmail(email)) {
      const user: IUser | null = await User.findOne({ email })
      if (!user) {
        res.status(400).send({
          error: `E-Mail address "${email}" is not found`,
        })
      } else {
        // * Check if password is correct
        const validPass = bcrypt.compareSync(password, user.password)

        if (!validPass) {
          res.status(400).send({
            error: `Password for "${email}" is incorrect`,
          })
        } else {
          // * Create and assign a token
          const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, {
            expiresIn: '15m',
            algorithm: 'HS512',
          })
          console.log(`Bearer ${token}`)
          res.header('Authorization', `Bearer ${token}`).send({ token })
        }
      }
    } else {
      // !Send error to client that email is an invalid email
      res
        .status(400)
        .send({ error: `E-Mail address "${req.body.email}" is invalid` })
    }
  })
}
export default router
