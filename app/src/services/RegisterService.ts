import connection from "../db/dataSource";
import { Repository } from 'typeorm';
import { UserModel } from "../models/UserModel";
import { ErrorResponse } from "./types/CommonTypes";
import { Constants } from "../static/Constants";
import { ExtendedService } from "./interfaces/ExtendedService";
import { UserService } from "./UserService";

export class RegisterService implements ExtendedService {
    private static instance: RegisterService;
    repository: Repository<UserModel> = connection.getRepository(UserModel);
    externalService: UserService = UserService.getInstance();

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
        if (await this.externalService.userExists(user.username)) {
            return {
                error: Constants.USER_ALREADY_EXISTS
            };
        } else if (await this.externalService.emailExists(user.email)) {
            return {
                error: Constants.EMAIL_ALREADY_EXISTS
            }
        }

        return await this.repository.save(user);
    }
}