
import { Request, Response } from 'express';
import { RegisterService } from '../services/RegisterService';
import { UserModel } from '../models/UserModel';
import { RoleService } from '../services/RoleService';
import { MusicGenreService } from "../services/MusicGenreService";
import { Constants } from '../static/Constants';

export class RegisterController {
    private RegisterService = RegisterService.getInstance();
    private RoleService = RoleService.getInstance();
    private MusicGenreService = MusicGenreService.getInstance();

    private static instance: RegisterController;

    private constructor() { }

    static getInstance(): RegisterController {
        if (!RegisterController.instance) {
            RegisterController.instance = new RegisterController();
        }

        return RegisterController.instance;
    }

    async register(req: Request, res: Response) {
        if (!this.validRequest(req)) return res.status(400).send(Constants.BAD_REQUEST)

        const roleModel = await this.RoleService.getRoleByName(req.body.role);
        if (!roleModel) return res.status(400).send(Constants.ROLE_NOT_FOUND)

        const musicalGenres = req.body.musicalGenres;
        const tags = musicalGenres ? await this.MusicGenreService.getMusicGenresByName(musicalGenres) : [];

        try {
            if (roleModel.name == Constants.ROLE_ENTREPRENEOUR) {
                var user = this.createEntrepreour(req, roleModel);

            } else if (roleModel.name == Constants.ROLE_MUSIC_GROUP) {
                var user = this.createMusicGroup(req, roleModel, tags);

            } else {
                return res.status(400).send(Constants.ROLE_NOT_FOUND);
            }

            const result = await this.RegisterService.register(user);
            return !Object.getOwnPropertyNames(result).includes("error") ? res.status(200).send(user) : res.status(400).send(result);
        }
        catch (err: any) {
            return res.status(500).send({ error: err.message });
        }
    }

    private validRequest(req: Request) {
        if (UserModel.VALID_ROLES.includes(req.body.role)) {
            return UserModel.isValid(req.body, req.body.role);
        }

        return false;
    }

    private createMusicGroup(req: Request, roleModel: any, tags: any): UserModel {
        return new UserModel(req.body.username, req.body.password, req.body.name, req.body.description, req.body.email, req.body.image, req.body.address, req.body.country, roleModel, req.body.phone, req.body.integrants, tags);
    }

    private createEntrepreour(req: Request, roleModel: any): UserModel {
        return new UserModel(req.body.username, req.body.password, req.body.name, req.body.description, req.body.email, req.body.image, req.body.address, req.body.country, roleModel, req.body.phone);
    }
}