import { Request, Response } from 'express';
import { LoginService } from '../services/LoginService';
import { UserModel } from '../models/UserModel';

export class LoginController {
    private loginService = LoginService.getInstance();
    private static instance: LoginController;

    private constructor() { }

    static getInstance(): LoginController {
        if (!LoginController.instance) {
            LoginController.instance = new LoginController();
        }

        return LoginController.instance;
    }

    async login(req: Request, res: Response) {
        const { username, password } = req.body;
        const result = await this.loginService.login(username, password) as any;

        if (result.error != undefined) {
            return res.status(401).send(result.error);
        }

        return res.cookie("auth-token", result.token).send(result);
    }

    async logout(res: Response) {
        res.clearCookie('auth-token').send();
    }

    static async logoutAndGenerateNewToken(res: Response, user: UserModel) {
        res.clearCookie('auth-token');
        return await LoginService.getInstance().login(user.username, user.password)
    }
}