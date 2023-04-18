import { Request, Response, Router } from 'express';
const router = Router();
import { PostController } from '../controllers/PostController';
const postController = PostController.getInstance()

router.get('/posts', async (req: Request, res: Response) => {
    postController.getPosts(req, res);
});

router.get('/posts/:username', async (req: Request, res: Response) => {
    postController.getPostsOfUser(req, res);
})

router.get('/post/:id', async (req: Request, res: Response) => {
    postController.getPostById(req, res);
});

router.post("/posts/create", async (req: Request, res: Response) => {
    postController.createPost(req, res);
});

router.post("/posts/edit/:postId", async (req: Request, res: Response) => {
    postController.editPost(req, res);
})

export default router;