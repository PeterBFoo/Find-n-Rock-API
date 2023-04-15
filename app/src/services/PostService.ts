import connection from "../db/dataSource";
import { PostModel } from "../models/PostModel";
import { MusicGenreService } from "./MusicGenreService";
import { Repository } from 'typeorm';
import { Service } from "./interfaces/Service";

export class PostService implements Service {
    private static instance: PostService;
    repository: Repository<PostModel> = connection.getRepository(PostModel);
    private musicalGenreService: MusicGenreService = MusicGenreService.getInstance();

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
        return await this.repository.find();
    }

    /**
     * 
     * @param filters Object containing the filters to be applied
     * @description Filters can be: city, region, country, genres
     * @returns Array of posts that match the filters, empty array if none found
     */
    async getFilteredPosts(filters: any) {
        if (filters.genres != undefined) {
            let query = this.repository.createQueryBuilder('post')
            const desiredGenres = await this.musicalGenreService.getMusicGenresByName(filters.genres);

            if (desiredGenres.length === 0) {
                return [];
            }

            query = query.leftJoinAndSelect('post.musicalGenres', 'musicalGenres')
                .where('musicalGenres.id IN (:...ids)', { ids: desiredGenres.map(genre => genre.id) })

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
            where: filters
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
            }
        }) || null;
    }
}