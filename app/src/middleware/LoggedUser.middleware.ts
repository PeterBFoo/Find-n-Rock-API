import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import envConfig from '../config/DatabaseConfigurationConnection'

export class LoggedUser {

    rejectIfNotLoggedIn(req: Request, res: Response, next: Function) {
        function isLoggedUser(req: Request) {
            let token = req.cookies["auth-token"];
            return token != null ? jwt.verify(token, envConfig.getSecretKey()) : false;
        }

        if (!isLoggedUser(req)) {
            return res.status(401).send("Unauthorized");
        } else {
            next();
        }
    }
}