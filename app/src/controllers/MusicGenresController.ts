import { Request, Response } from 'express';
import { MusicGenreService } from '../services/MusicGenreService';
import { LoginService } from '../services/LoginService';
import { Constants } from '../static/Constants';

export class MusicGenresController {
    private genresService = MusicGenreService.getInstance();
    private loginService: LoginService = LoginService.getInstance();
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

    async createMusicGenre(req: Request, res: Response) {
        let genre = req.body.name;
        let user: any = await this.loginService.getUserInRequest(req);

        if (!user) return res.status(401).send(Constants.UNAUTHORIZED);
        if (!genre) return res.status(400).send(Constants.GENRES_NAME_REQUIRED);
        if (await this.genresService.genreExists(genre)) return res.status(400).send(Constants.GENRES_ALREADY_EXISTS);
        if (!user.role.canCreateRolesAndGenres) return res.status(403).send(Constants.GENRES_CREATION_NOT_ALLOWED);

        const newGenre = await this.genresService.createMusicGenre(genre);
        return res.status(201).send(newGenre);
    }

    async deleteMusicGenre(req: Request, res: Response) {
        let genre = req.params.name;
        let user: any = await this.loginService.getUserInRequest(req);

        if (!user) return res.status(401).send(Constants.UNAUTHORIZED);
        if (!genre) return res.status(400).send(Constants.GENRES_NAME_REQUIRED);
        if (!await this.genresService.genreExists(genre)) return res.status(404).send(Constants.GENRES_NOT_FOUND);

        if (!user.role.canCreateRolesAndGenres) return res.status(403).send(Constants.GENRES_DELETION_NOT_ALLOWED);

        await this.genresService.deleteMusicGenre(genre);
        return res.status(204).send(Constants.GENRES_DELETED);
    }
}