import { Request, Response, Router } from 'express';
import { UserController as userController } from '../controllers/UserController';

const UserController = userController.getInstance();
const router = Router();

router.get('/profile', async (req: Request, res: Response) => {
    return UserController.getProfile(req, res);
});

router.get('/profile/:username', async (req: Request, res: Response) => {
    return UserController.getProfileByUsername(req, res);
});

export default router;