import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import envConfig from '../config/DatabaseConfigurationConnection'

export class LoggedUser {

    isLoggedUser(req: Request) {
        let token = req.cookies["auth-token"];
        return token != null ? jwt.verify(token, envConfig.getSecretKey()) : false;
    }

    rejectIfNotLoggedIn(req: Request, res: Response) {
        if (!this.isLoggedUser(req)) {
            return res.status(401).send();
        }
    }
}