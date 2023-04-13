import connection from "../db/dataSource";
import { Repository } from 'typeorm';
import { UserModel } from "../models/UserModel";
import { Service } from "./interfaces/Service";
import { ErrorResponse } from "./types/CommonTypes";

export class RegisterService implements Service {
    private static instance: RegisterService;
    repository: Repository<UserModel> = connection.getRepository(UserModel);

    static getInstance(): RegisterService {
        if (!RegisterService.instance) {
            RegisterService.instance = new RegisterService();
        }

        return RegisterService.instance;
    }

    async register(user: UserModel): Promise<UserModel | ErrorResponse> {
        if (await this.userExists(user.username)) {
            return {
                error: "User already exists"
            };
        }

        return await this.repository.save(user);
    }

    private async userExists(username: string): Promise<boolean> {
        return await this.repository.exist({
            where: {
                username: username
            }
        });
    }



}