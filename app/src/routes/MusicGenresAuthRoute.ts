import { Request, Response, Router } from 'express';
import { MusicGenresController } from '../controllers/MusicGenresController';

const musicGenresController = MusicGenresController.getInstance();
const router = Router();

router.post("/genres/create", (req: Request, res: Response) => {
    return musicGenresController.createMusicGenre(req, res);
});


router.delete("/genres/delete/:name", (req: Request, res: Response) => {
    return musicGenresController.deleteMusicGenre(req, res);
});

export default router;