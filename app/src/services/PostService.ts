import connection from "../db/dataSource";
import { PostModel } from "../models/PostModel";
import { MusicGenreService } from "./MusicGenreService";
import { Repository } from 'typeorm';
import { Service } from "./interfaces/Service";
import { UserInterface } from "../models/interfaces/UserInterface";
import { PostInterface } from "../models/interfaces/PostInterface";

export class PostService implements Service {
    private static instance: PostService;
    repository: Repository<PostModel> = connection.getRepository(PostModel);
    private genreservice: MusicGenreService = MusicGenreService.getInstance();

    static getInstance(): PostService {
        if (!PostService.instance) {
            PostService.instance = new PostService();
        }

        return PostService.instance;
    }

    /**
     * 
     * @returns Array of all posts, empty array if none found
     */
    async getPosts() {
        return await this.repository.find({
            relations: ["genres", "suscriptions", "user"]
        });
    }

    /**
     * 
     * @param filters Object containing the filters to be applied
     * @description Filters can be: city, region, country, genres
     * @returns Array of posts that match the filters, empty array if none found
     */
    async getFilteredPosts(filters: any): Promise<PostModel[] | []> {
        if (filters.genres != undefined) {
            let query = this.repository.createQueryBuilder('post')
            const desiredGenres = await this.genreservice.getMusicGenresByName(filters.genres);

            if (desiredGenres.length === 0) {
                return [];
            }

            query = query.leftJoinAndSelect('post.genres', 'genres')
                .where('genres.id IN (:...ids)', { ids: desiredGenres.map(genre => genre.id) })
                .leftJoinAndSelect('post.user', 'user')
                .leftJoinAndSelect('post.suscriptions', 'suscriptions')

            // Remove the genres from the filters to avoid filtering by them and not altering the original data by reference
            let filtersWithoutGenres: any = new Object(filters);
            filtersWithoutGenres.genres = undefined;

            for (const [key, value] of Object.entries(filtersWithoutGenres)) {
                if (value) {
                    query = query.andWhere(`post.${key} = :${key}`, { [key]: value })
                }
            }

            return await query.getMany();
        }

        return await this.repository.find({
            where: filters,
            relations: ["user", "genres", "suscriptions"]
        });
    }

    /**
     * 
     * @param id Id of the post to be retrieved
     * @returns Post with the given id, null if none found
     */
    async getPostById(id: number): Promise<PostModel | null> {
        return await this.repository.findOne({
            where: {
                id: id
            },
            relations: ["user", "genres", "suscriptions"]
        }) || null;
    }

    /**
     * 
     * @param user User object
     * @returns Posts of the input user
     */
    async getPostsOfUser(user: UserInterface) {
        return await this.repository.createQueryBuilder('post')
            .andWhere('post.user = :id', { id: user.id })
            .getMany();
    }

    /**
     * 
     * @param post Post to be created
     * @returns The created post
     */
    async createPost(post: PostInterface) {
        return await this.repository.save(post);
    }

    async updatePost(post: PostInterface) {
        return await this.repository.save(post);
    }

    async deletePost(post: PostModel) {
        return await this.repository.remove(post);
    }
}