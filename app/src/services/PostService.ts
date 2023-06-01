import connection from "../db/dataSource";
import envConf from "../config/DatabaseConfigurationConnection"
import { PostModel } from "../models/PostModel";
import { MusicGenreService } from "./MusicGenreService";
import { Repository } from 'typeorm';
import { Service } from "./interfaces/Service";
import { UserInterface } from "../models/interfaces/UserInterface";
import { PostInterface } from "../models/interfaces/PostInterface";
import { UserModel } from "../models/UserModel";
import { Mailman } from "../utils/mailman/mailman";

export class PostService implements Service {
    private static instance: PostService;
    repository: Repository<PostModel> = connection.getRepository(PostModel);
    private genreservice: MusicGenreService = MusicGenreService.getInstance();
    private mailSender: Mailman = new Mailman(envConf.MAIL_API_KEY, envConf.MAIL);

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
        return await this.repository.createQueryBuilder('post')
            .leftJoinAndSelect('post.genres', 'genres')
            .leftJoin('post.user', 'user')
            .addSelect('user.username')
            .leftJoin('post.suscriptions', 'suscriptions')
            .addSelect(['suscriptions.username'])
            .andWhere('post.active = :active', { active: true })
            .getMany()
    }

    /**
     * 
     * @param filters Object containing the filters to be applied
     * @description Filters can be: city, region, country, genres
     * @returns Array of posts that match the filters, empty array if none found
     */
    async getFilteredPosts(filters: any): Promise<PostModel[] | []> {
        if (filters.genres != undefined) {
            const desiredGenres = await this.genreservice.getMusicGenresByName(filters.genres);

            if (desiredGenres.length === 0) {
                return [];
            } else {
                filters.genres = desiredGenres;
            }
        }

        return await this.repository.find({
            where: {
                ...filters,
                active: true
            },
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
     * @param id Id of the post to be retrieved
     * @returns Active post with the given id, null if not found
     */
    async getActivePostById(id: number): Promise<PostModel | null> {
        return await this.repository.createQueryBuilder('post')
            .leftJoinAndSelect('post.suscriptions', 'suscriptions')
            .leftJoinAndSelect('post.genres', 'genres')
            .leftJoinAndSelect('post.user', 'user')
            .andWhere('post.id = :id', { id: id })
            .andWhere('post.active = :active', { active: true })
            .getOne() || null;
    }

    /**
     * 
     * @param user User object
     * @returns Posts of the input user
     */
    async getPostsOfUser(user: UserInterface) {
        return await this.repository.createQueryBuilder('post')
            .leftJoin('post.suscriptions', 'suscriptions')
            .addSelect(['suscriptions.username', 'suscriptions.phone', 'suscriptions.email'])
            .leftJoinAndSelect('post.genres', 'genres')
            .andWhere('post.user = :id', { id: user.id })
            .getMany();
    }


    async getChosenPostsOfUser(user: UserInterface) {
        return await this.repository.createQueryBuilder('post')
            .leftJoinAndSelect('post.selectedCandidates', 'selectedCandidates')
            .where('selectedCandidates.id = :id', { id: user.id })
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

    /**
     * 
     * @param post Post to be updated
     * @returns The updated post
     */
    async updatePost(post: PostInterface) {
        return await this.repository.save(post);
    }

    /**
     * 
     * @param post Post to be deleted
     * @returns 
     */
    async deletePost(post: PostModel) {
        post.active = false;
        return await this.repository.save(post);
    }

    /**
     * 
     * @param post Post to be suscribed to
     * @param user User that suscribes to the post
     * @returns 
     */
    async suscribeToPost(post: PostModel, user: UserModel) {
        post.suscriptions.push(user);
        return await this.repository.save(post);
    }

    /**
     * 
     * @param post Post to be unsuscribed to
     * @param user User that unsuscribes to the post
     * @returns 
     */
    async unsuscribeToPost(post: PostModel, user: UserModel) {
        for (let i = 0; i < post.suscriptions.length; i++) {
            if (post.suscriptions[i].id == user.id) {
                post.suscriptions[i] = {} as UserModel;
            }
        }
        return await this.repository.save(post);
    }

    /**
     * 
     * Select candidates of the post, after being selected, this post
     * will remain inactive and will not be shown in public searches
     * and will be shown in the history of the entrepreneur or the suscribed users.
     * 
     * Emails will be sent to the selected candidates.
     * 
     * @param post Post to be selected candidates
     * @param candidates Candidates to be selected
     * @returns 
     */
    async selectCandidates(postOwner: UserModel, post: PostModel, candidates: UserModel[]): Promise<PostModel | null> {
        try {
            post.active = false;
            post.selectedCandidates = candidates;

            var savedPost = await this.repository.save(post);
            await this.sendMailToCandidates(candidates, postOwner)

            return savedPost;
        } catch (e) {
            console.log(e);
        }

        return null;
    }

    /**
     * 
     * @param candidates Selected candidates of the post
     * @param postOwner Post owner
     * 
     * Sends an email to the selected candidates of the post
     */
    private async sendMailToCandidates(candidates: UserModel[], postOwner: UserModel) {
        let candidatesEmail: string[] = []
        candidates.forEach(async (candidate) => {
            candidatesEmail.push(candidate.email)
        })

        let html = `<h2>¡Congratulations!</h2><p>You have been selected as a candidate of a job offer. The information details about the entrepreneur are here:</p><ul><li>Address: ${postOwner.address}</li><li>Email: ${postOwner.email}</li><li>Phone number: ${postOwner.phone}</li></ul><br><p>The entrepreneur will contact you as well, if you have any problem, please respond to findnrock@gmail.com.</p>`;

        await this.mailSender.sendMultipleMails(candidatesEmail, "¡Congratulations! You have been selected", html);
    }

    /**
     * 
     * @param user User to get the suscribed posts
     * @returns 
     */
    async getSuscribedPostsOfUser(user: UserModel) {
        return await this.repository.createQueryBuilder('post')
            .leftJoin('post.suscriptions', 'suscriptions')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoinAndSelect('post.genres', 'genres')
            .andWhere('suscriptions.id = :id', { id: user.id })
            .andWhere('post.active = :active', { active: true })
            .getMany();
    }

    /**
     * 
     * @param user User to get the posts that he has created
     * @returns 
     */
    async getHistoryPostsOfEntrepreneur(user: UserModel) {
        return await this.repository.createQueryBuilder('post')
            .leftJoinAndSelect('post.genres', 'genres')
            .andWhere('post.userId = :id', { id: user.id })
            .addOrderBy('post.date', 'DESC')
            .getMany();
    }

    /**
     * 
     * @param user User to get the posts where he is suscribed
     * @returns 
     */
    async getHistoryPostsOfMusicalGroup(user: UserModel) {
        return await this.repository.createQueryBuilder('post')
            .leftJoin('post.suscriptions', 'suscriptions')
            .leftJoinAndSelect('post.genres', 'genres')
            .andWhere('suscriptions.id = :id', { id: user.id })
            .addOrderBy('post.date', 'DESC')
            .getMany();
    }
}