import { Request, Response, Router } from 'express';
import { MusicGenresController } from '../controllers/MusicGenresController';

const musicGenresController = MusicGenresController.getInstance();
const router = Router();

router.get("/genres", (req: Request, res: Response) => {
    return musicGenresController.getMusicGenres(req, res);
});

export default router;