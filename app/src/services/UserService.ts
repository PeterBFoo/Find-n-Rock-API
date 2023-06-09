import connection from '../db/dataSource';
import { Service } from './interfaces/Service';
import { UserModel } from '../models/UserModel';
import { Repository } from 'typeorm';
import { MusicGenreService } from './MusicGenreService';

export class UserService implements Service {
    private static instance: UserService;
    repository: Repository<UserModel> = connection.getRepository(UserModel);
    private genreservice: MusicGenreService = MusicGenreService.getInstance();

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
            relations: ["role", "musicalGenres"]
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

    async getProfilesEntrepreneur(): Promise<UserModel[]> {
        return await this.repository.createQueryBuilder("user")
            .leftJoinAndSelect("user.role", "role")
            .where("role.canManagePosts = :active", { active: true })
            .getMany();
    }

    async getProfilesArtists(filters: {
        type: string,
        genre: any,
        country: string
    }): Promise<UserModel[]> {

        let users = await this.repository.createQueryBuilder("user")
            .leftJoinAndSelect("user.musicalGenres", "genres")
            .leftJoinAndSelect("user.role", "role")
            .where("role.canSubscribe = :active", { active: true })
            .getMany()

        if (filters.genre || filters.country) {
            let filteredUsers: UserModel[] = [];
            users.forEach((user) => {
                if (filters.genre) {
                    for (let i = 0; i < user.musicalGenres!.length; i++) {
                        const genre = user.musicalGenres![i];
                        if (genre.name == filters.genre) filteredUsers.push(user)
                    }
                } else if (filters.country) {
                    if (filters.country == user.country) filteredUsers.push(user);
                }
            })

            return filteredUsers;
        }



        return users;
    }
}

