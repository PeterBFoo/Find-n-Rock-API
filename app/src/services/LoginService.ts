import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import envConfig from '../config/DatabaseConfigurationConnection';
import { LoginResponse } from './types/LoginTypes';
import { ErrorResponse } from './types/CommonTypes';
import { UserService } from './UserService';
import { Request } from 'express';

export class LoginService {
    private static instance: LoginService;
    private userService: UserService = UserService.getInstance();

    private constructor() { }

    static getInstance(): LoginService {
        if (!LoginService.instance) {
            LoginService.instance = new LoginService();
        }

        return LoginService.instance;
    }

    /**
     * 
     * @param incomingPassword Password to be compared with the user's password
     * @param userPassword User's password
     * @returns True if the passwords match, false otherwise
     */
    private comparePassword(incomingPassword: string, userPassword: string): boolean {
        return bcrypt.compareSync(incomingPassword, userPassword);
    }

    /**
     * 
     * @param user User object to be used as payload for the token
     * @returns JWT token
     */
    private generateToken(user: any): string {
        let payload: any = {}
        Object.getOwnPropertyNames(user).forEach((key) => {
            payload[key] = user[key];
        });
        return jwt.sign(payload, envConfig.getSecretKey());
    }

    /**
     * 
     * @param req Express request object
     * @returns User object if the token is valid, null otherwise
     */
    getUserInRequest(req: Request): any {
        return jwt.decode(req.cookies["auth-token"]);
    }


    /**
     * 
     * @param username Username of the user
     * @param incomingPassword Password of the user
     * @returns LoginResponse object containing a JWT token and the user object if the login was successful, ErrorResponse object otherwise
     */
    async login(username: string, incomingPassword: string): Promise<LoginResponse | ErrorResponse> {
        const user = await this.userService.getUser(username);

        if (user) {
            let validPassword = this.comparePassword(incomingPassword, user.password);
            if (validPassword) {
                return {
                    user: user,
                    token: this.generateToken(user)
                }
            }

            return {
                error: 'Incorrect password'
            };
        }

        return {
            error: 'User not found'
        };
    }
}

