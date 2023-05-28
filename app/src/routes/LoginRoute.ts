import { Request, Response, Router } from 'express';
import { LoginController as loginController } from '../controllers/LoginController';

const LoginController = loginController.getInstance();
const router = Router();

router.post('/login', async (req: Request, res: Response) => {
    return LoginController.login(req, res);
});

router.post('/logout', (req: Request, res: Response) => {
    if (req.cookies["auth-token"] == null) {
        return res.status(400).send('You are not logged in');
    }

    return LoginController.logout(res);
});

export default router;