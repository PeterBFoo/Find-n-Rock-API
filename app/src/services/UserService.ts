import connection from '../db/dataSource';
import { Service } from './interfaces/Service';
import { UserModel } from '../models/UserModel';
import { Repository } from 'typeorm';

export class UserService implements Service {
    private static instance: UserService;
    repository: Repository<UserModel> = connection.getRepository(UserModel);

    private constructor() { }

    static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }

        return UserService.instance;
    }

    /**
     * 
     * @param username Username of the user
     * @returns User object if found, null otherwise
     */
    async getUserByUsername(username: string): Promise<UserModel | null> {
        return await this.repository.findOne({
            where: {
                username: username
            },
            relations: ["role"]
        });
    }

    /**
     * 
     * @param email 
     * @returns 
     */
    async emailExists(email: string) {
        return await this.repository.exist({
            where: {
                email: email
            }
        });
    }

    /**
     * 
     * @param username User name
     * @returns Bolean that determines if user exists
     */
    async userExists(username: string) {
        return await this.repository.exist({
            where: {
                username: username
            }
        });
    }

    /**
     * 
     * @param user User
     * @returns The edited user
     */
    async editProfile(user: UserModel): Promise<UserModel | null> {
        return await this.repository.save(user);
    }
}

