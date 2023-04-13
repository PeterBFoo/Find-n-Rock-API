
import { Request, Response } from 'express';
import { RegisterService } from '../services/RegisterService';
import { UserModel } from '../models/UserModel';
import { RoleService } from '../services/RoleService';
import { MusicGenreService } from "../services/MusicGenreService";

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
        if (!this.validRequest(req)) {
            return res.status(400).send({ error: 'Invalid data' })
        }

        const roleModel = await this.RoleService.getRoleByName(req.body.role);
        if (!roleModel) return res.status(400).send({ error: 'Not valid role' })

        const {
            musicalGenres,
            role
        } = req.body;

        const tags = musicalGenres ? await this.MusicGenreService.getMusicGenres(musicalGenres) : [];

        try {
            if (role == "entrepreneur") {
                var user = new UserModel(req.body.username, req.body.password, req.body.name, req.body.description, req.body.email, req.body.image, req.body.address, req.body.country, roleModel, req.body.phone);
            } else {
                var user = new UserModel(req.body.username, req.body.password, req.body.name, req.body.description, req.body.email, req.body.image, req.body.address, req.body.country, roleModel, req.body.phone, req.body.integrants, tags);
            }

            const result = await this.RegisterService.register(user);
            !Object.getOwnPropertyNames(result).includes("error") ? res.status(200).send(user) : res.status(400).send(result);
        }
        catch (err: any) {
            res.status(500).send({ error: err.message });
        }

    }

    private validRequest(req: Request) {
        if (UserModel.VALID_ROLES.includes(req.body.role)) {
            return UserModel.isValid(req.body, req.body.role);
        }

        return false;
    }
}