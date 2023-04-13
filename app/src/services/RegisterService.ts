import connection from "../db/dataSource";
import { Repository } from 'typeorm';
import { UserModel } from "../models/UserModel";
import { Service } from "./interfaces/Service";

export class RegisterService implements Service {
    private static instance: RegisterService;
    repository: Repository<UserModel> = connection.getRepository(UserModel);

    static getInstance(): RegisterService {
        if (!RegisterService.instance) {
            RegisterService.instance = new RegisterService();
        }

        return RegisterService.instance;
    }

    async register(user: UserModel): Promise<UserModel | { error: string }> {
        if (await this.userExists(user.username)) {
            return {
                error: "User already exists"
            };
        }

        return await this.repository.save(user);
    }

    private async userExists(username: string): Promise<boolean> {
        const user = await this.repository.findOne({
            where: {
                username: username
            }
        });

        return user != null;
    }



}