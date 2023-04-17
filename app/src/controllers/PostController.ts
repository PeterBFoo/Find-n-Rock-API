import { Request, Response } from 'express';
import { PostService } from '../services/PostService';
import { LoginService } from '../services/LoginService';
import { PostModel } from '../models/PostModel';
import { MusicGenreService } from '../services/MusicGenreService';
import { UserService } from '../services/UserService';

type AvailableFilters = {
    country?: string,
    region?: string,
    city?: string,
    genres?: string[]
}

export class PostController {
    private FILTERS_LIST = ['country', 'region', 'city', 'genres'];
    private static instance: PostController;
    private postService: PostService = PostService.getInstance();
    private loginService: LoginService = LoginService.getInstance();
    private musicGenreService: MusicGenreService = MusicGenreService.getInstance();
    private userService: UserService = UserService.getInstance();

    private constructor() { }

    static getInstance(): PostController {
        if (!PostController.instance) {
            PostController.instance = new PostController();
        }

        return PostController.instance;
    }

    async getPosts(req: Request, res: Response) {
        if (this.thereAreFilters(req.query)) {
            let filters = this.getFiltersOf(req.query)
            const posts = await this.postService.getFilteredPosts(filters);
            return res.status(200).send(posts);
        }

        const posts = await this.postService.getPosts();
        return res.status(200).send(posts)
    }

    async getPostById(req: Request, res: Response) {
        try {
            let id = parseInt(req.params.id);
            const post = await this.postService.getPostById(id);

            post ? res.status(200).send(post) : res.status(404).send({ error: 'Post not found' });

        } catch (error) {
            return res.status(400).send({ error: 'Invalid ID' });
        }
    }

    async getPostsOfUser(req: Request, res: Response) {
        const user = await this.userService.getUser(req.params.username);
        if (user) {
            const posts = await this.postService.getPostsOfUser(user);
            res.status(200).send(posts);
        } else {
            res.status(404).send("User not found");
        }
    }

    async createPost(req: Request, res: Response) {
        try {
            const user = await this.loginService.getUserInRequest(req);

            if (user.role.canManagePosts) {
                if (PostModel.isValid(req.body)) {
                    const {
                        title,
                        subtitle,
                        body,
                        image,
                        genres,
                        country,
                        region,
                        city
                    } = req.body;

                    const musicGenres = genres.length > 0 ? await this.musicGenreService.getMusicGenresByName(genres) : [];

                    let newPost = new PostModel(title, subtitle, new Date(), body, user.id, musicGenres, image, [], country, region, city);

                    const response = await this.postService.createPost(newPost);

                    return response ? res.status(201).send(response) : res.status(500).send({ error: 'Something went wrong' });
                } else {
                    return res.status(400).send({ error: 'Invalid data' });
                }
            } else {
                return res.status(401).send({ error: 'Not allowed to create posts, only entrepreneours can create posts', user: user });
            }

        } catch (error: any) {
            return res.status(500).send({ error: error.message });
        }
    }

    private thereAreFilters(queryString: any): boolean {
        return this.FILTERS_LIST.some(filter => queryString[filter]);
    }

    private getFiltersOf(queryString: any): AvailableFilters {
        return {
            country: queryString.country,
            region: queryString.region,
            city: queryString.city,
            genres: queryString.genres ? queryString.genres.split(',') : undefined
        };
    }
}