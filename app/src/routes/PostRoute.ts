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

router.get('/history/posts', async (req: Request, res: Response) => {
    postController.getHistoryPostsOfUser(req, res);
})

router.get('/posts/suscriptions/chosen', async (req: Request, res: Response) => {
    postController.getChosenPostsOfUser(req, res);
})

router.get("/suscribed/posts", async (req: Request, res: Response) => {
    postController.getSuscribedPostsOfUser(req, res);
})

router.get('/post/:id', async (req: Request, res: Response) => {
    postController.getPostById(req, res);
});

router.post("/post/choose/:postId", async (req: Request, res: Response) => {
    postController.chooseCandidatesOfPost(req, res);
});

router.post("/posts/create", async (req: Request, res: Response) => {
    postController.createPost(req, res);
});

router.post("/posts/edit/:postId", async (req: Request, res: Response) => {
    postController.editPost(req, res);
})

router.post("/posts/delete/:postId", async (req: Request, res: Response) => {
    postController.deletePost(req, res);
})

router.post("/posts/suscribe/:postId", async (req: Request, res: Response) => {
    postController.suscribeToPost(req, res);
})

router.post("/posts/unsuscribe/:postId", async (req: Request, res: Response) => {
    postController.unsuscribeToPost(req, res);
})

export default router;