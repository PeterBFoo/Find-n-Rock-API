import { Request, Response } from 'express';
import { Constants } from '../static/Constants';
import jwt from 'jsonwebtoken';
import envConfig from '../config/DatabaseConfigurationConnection'

export class LoggedUser {

    rejectIfNotLoggedIn(req: Request, res: Response, next: Function) {
        function isLoggedUser(req: Request) {
            let token = req.cookies["auth-token"] || req.headers["auth-token"];
            return token != null ? jwt.verify(token, envConfig.getSecretKey()) : false;
        }

        if (!isLoggedUser(req)) {
            return res.status(401).send(Constants.UNAUTHORIZED);
        } else {
            next();
        }
    }
}