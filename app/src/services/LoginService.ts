import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/UserModel';
import { Repository } from 'typeorm';
import connection from '../db/dataSource';
import envConfig from '../config/DatabaseConfigurationConnection';
import { Service } from './interfaces/Service';

type LoginResponse = {
    token: string,
    user: object
}

type LoginError = {
    error: string
}

export class LoginService implements Service {
    private static instance: LoginService;
    repository: Repository<UserModel> = connection.getRepository(UserModel);

    private constructor() { }

    static getInstance(): Service {
        if (!LoginService.instance) {
            LoginService.instance = new LoginService();
        }

        return LoginService.instance;
    }

    async getUser(username: string): Promise<UserModel | null> {
        let user = await this.repository.findOne({
            where: {
                username: username
            }
        });

        return user || null;
    }

    comparePassword(incomingPassword: string, userPassword: string): boolean {
        return bcrypt.compareSync(incomingPassword, userPassword);
    }

    generateToken(user: UserModel): string {
        return jwt.sign(user.username, envConfig.getSecretKey());
    }

    async login(username: string, incomingPassword: string): Promise<LoginResponse | LoginError> {
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

