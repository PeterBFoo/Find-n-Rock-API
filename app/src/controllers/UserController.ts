import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { UserModel } from '../models/UserModel';
import { Constants } from '../static/Constants';
import { LoginService } from '../services/LoginService';
import { MusicGenreService } from '../services/MusicGenreService';

export class UserController {
    private static instance: UserController;
    private userService: UserService = UserService.getInstance();
    private genreService: MusicGenreService = MusicGenreService.getInstance();
    private loginService: LoginService = LoginService.getInstance();

    private constructor() { }

    static getInstance(): UserController {
        if (!UserController.instance) {
            UserController.instance = new UserController();
        }

        return UserController.instance;
    }

    async getProfile(req: Request, res: Response): Promise<Response<UserModel> | Response<string>> {
        const userInRequest = await this.loginService.getUserInRequest(req);
        if (!userInRequest) return res.status(401).send(Constants.UNAUTHORIZED);

        const user = await this.userService.getUserByUsername(userInRequest.username);

        return user ? res.status(200).send(user) : res.status(404).send(Constants.USER_NOT_FOUND)
    }

    async getProfileByUsername(req: Request, res: Response): Promise<Response<UserModel> | Response<string>> {
        const username = req.params.username;
        const user = await this.userService.getUserByUsername(username);

        return user ? res.status(200).send(user) : res.status(404).send(Constants.USER_NOT_FOUND)
    }

    async editProfile(req: Request, res: Response) {
        try {
            let user: any = await this.loginService.getUserInRequest(req);
            if (!user) return res.status(401).send(Constants.UNAUTHORIZED);

            let userInDb = await this.userService.getUserByUsername(user.username);

            if (!userInDb) return res.status(404).send(Constants.USER_NOT_FOUND);
            if (await this.doesEmailExist(req)) return res.status(400).send(Constants.EMAIL_ALREADY_EXISTS)

            const editableFields = user.role.name == Constants.ROLE_ENTREPRENEOUR ?
                UserModel.getEditableFieldsEntrepreneur() :
                UserModel.getEditableFieldsMusicGroup();

            editableFields.forEach(async (field) => {
                if (field == "genres" && req.body["genres"] != undefined) {
                    let genres = await this.genreService.getMusicGenresByName(req.body["genres"]);
                    if (genres) user.musicalGenres = genres;
                }
                else if (field == "password"
                    && req.body["password"] != undefined) {
                    user.password = UserModel.hashPassword(req.body["password"])
                }
                else if (user[field] != req.body[field] && req.body[field] != undefined) {
                    user[field] = req.body[field]
                }
            })

            const response = await this.userService.editProfile(user);

            return response ? res.status(200).clearCookie("auth-token").send(response) :
                res.status(400).send(Constants.BAD_REQUEST)
        } catch (e) {
            console.log(e)
            return res.status(500).send(e);
        }
    }

    private async doesEmailExist(req: Request) {
        const email = req.body["email"];
        return email != undefined ? await this.userService.emailExists(email) : false;
    }
}