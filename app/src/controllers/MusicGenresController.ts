import { Request, Response } from 'express';
import { MusicGenreService } from '../services/MusicGenreService';

export class MusicGenresController {
    private genresService = MusicGenreService.getInstance();
    private static instance: MusicGenresController;

    private constructor() { }

    static getInstance(): MusicGenresController {
        if (!MusicGenresController.instance) {
            MusicGenresController.instance = new MusicGenresController();
        }

        return MusicGenresController.instance;
    }

    async getMusicGenres(req: Request, res: Response) {
        const genres = await this.genresService.getMusicGenres();
        return res.status(200).send(genres);
    }
}