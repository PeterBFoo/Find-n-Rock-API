import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import envConfig from '../config/DatabaseConfigurationConnection';
import connection from '../db/dataSource';
import { Service } from './interfaces/Service';
import { LoginResponse } from './types/LoginTypes';
import { ErrorResponse } from './types/CommonTypes';
import { UserModel } from '../models/UserModel';
import { Repository } from 'typeorm';

export class LoginService implements Service {
    private static instance: LoginService;
    repository: Repository<UserModel> = connection.getRepository(UserModel);

    private constructor() { }

    static getInstance(): LoginService {
        if (!LoginService.instance) {
            LoginService.instance = new LoginService();
        }

        return LoginService.instance;
    }

    /**
     * 
     * @param username Username of the user
     * @returns User object if found, null otherwise
     */
    private async getUser(username: string): Promise<UserModel | null> {
        let user = await this.repository.findOne({
            where: {
                username: username
            }
        });

        return user || null;
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
     * @param username Username of the user
     * @param incomingPassword Password of the user
     * @returns LoginResponse object containing a JWT token and the user object if the login was successful, ErrorResponse object otherwise
     */
    async login(username: string, incomingPassword: string): Promise<LoginResponse | ErrorResponse> {
        const user = await this.getUser(username);

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

