import { Request, Response, Application, Express } from 'express'
import verify from './verifyToken'

const router = (app: Express) => {
  app.route('/api/posts').post(verify, async (req: Request, res: Response) => {
    res.json({
      posts: [
        {
          title: 'my first post',
          description: "Data which you shouldn't access without login",
        },
      ],
    })
  })
}
export default router
