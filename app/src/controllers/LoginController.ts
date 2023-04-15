import { Request, Response } from 'express';
import { LoginService } from '../services/LoginService';

export class LoginController {
    private LoginService = LoginService.getInstance();
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
        const result = await this.LoginService.login(username, password) as any;

        if (result.error != undefined) {
            return res.status(401).send(result.error);
        }

        return res.cookie("auth-token", result.token).send(result);
    }

    async logout(req: Request, res: Response) {
        res.clearCookie('auth-token').send();
    }
}