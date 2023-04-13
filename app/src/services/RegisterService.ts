import connection from "../db/dataSource";
import { Repository } from 'typeorm';
import { UserModel } from "../models/UserModel";

export class RegisterService {
    private static instance: RegisterService;
    private userRepository: Repository<UserModel> = connection.getRepository(UserModel);

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

        return await this.userRepository.save(user);
    }

    private async userExists(username: string): Promise<boolean> {
        const user = await this.userRepository.findOne({
            where: {
                username: username
            }
        });

        return user != null;
    }



}