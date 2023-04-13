import { Request, Response, Router } from 'express';
import { RegisterController } from "../controllers/RegisterController";
const registerController = RegisterController.getInstance();
const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    registerController.register(req, res);
});

export default router;