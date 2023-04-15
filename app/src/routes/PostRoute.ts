import { Request, Response, Router } from 'express';
const router = Router();
import { PostController } from '../controllers/PostController';
const postController = PostController.getInstance()

router.get('/posts', async (req: Request, res: Response) => {
    postController.getPosts(req, res);
});

export default router;