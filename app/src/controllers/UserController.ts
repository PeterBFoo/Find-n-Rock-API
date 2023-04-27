import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { UserModel } from '../models/UserModel';
import { Constants } from '../static/Constants';
import { LoginService } from '../services/LoginService';

export class UserController {
    private static instance: UserController;
    private userService: UserService = UserService.getInstance();
    private loginService: LoginService = LoginService.getInstance();

    private constructor() { }

    static getInstance(): UserController {
        if (!UserController.instance) {
            UserController.instance = new UserController();
        }

        return UserController.instance;
    }

    async getProfile(req: Request, res: Response): Promise<Response<UserModel> | Response<string>> {
        const userInRequest = this.loginService.getUserInRequest(req);
        const user = await this.userService.getUserByUsername(userInRequest.username);

        return user ? res.status(200).send(user) : res.status(404).send(Constants.USER_NOT_FOUND)
    }

    async getProfileByUsername(req: Request, res: Response): Promise<Response<UserModel> | Response<string>> {
        const username = req.params.username;
        const user = await this.userService.getUserByUsername(username);

        return user ? res.status(200).send(user) : res.status(404).send(Constants.USER_NOT_FOUND)
    }
}