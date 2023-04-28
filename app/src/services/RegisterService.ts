import connection from "../db/dataSource";
import { Repository } from 'typeorm';
import { UserModel } from "../models/UserModel";
import { Service } from "./interfaces/Service";
import { ErrorResponse } from "./types/CommonTypes";
import { Constants } from "../static/Constants";
import { UserService } from "./UserService";

export class RegisterService implements Service {
    private static instance: RegisterService;
    repository: Repository<UserModel> = connection.getRepository(UserModel);
    userService: UserService = UserService.getInstance();

    static getInstance(): RegisterService {
        if (!RegisterService.instance) {
            RegisterService.instance = new RegisterService();
        }

        return RegisterService.instance;
    }

    /**
     * 
     * @param user New user object to be registered
     * @returns User object if registration was successful, error message otherwise
     */
    async register(user: UserModel): Promise<UserModel | ErrorResponse> {
        if (await this.userService.userExists(user.username)) {
            return {
                error: Constants.USER_ALREADY_EXISTS
            };
        } else if (await this.userService.emailExists(user.email)) {
            return {
                error: Constants.EMAIL_ALREADY_EXISTS
            }
        }

        return await this.repository.save(user);
    }
}