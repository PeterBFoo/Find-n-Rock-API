import { Request, Response } from 'express';
import { PostService } from '../services/PostService';
import { LoginService } from '../services/LoginService';
import { PostModel } from '../models/PostModel';
import { MusicGenreService } from '../services/MusicGenreService';
import { UserService } from '../services/UserService';
import { UserModel } from '../models/UserModel';

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
        if (this.areThereFilters(req.query)) {
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
                if (PostModel.isValidPost(req.body)) {
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

    async editPost(req: Request, res: Response) {
        try {
            const postId = parseInt(req.params.postId);
            const user: UserModel = await this.loginService.getUserInRequest(req);
            const post: any = await this.postService.getPostById(postId);

            if (post == null) return res.status(404).send("Post not found")

            if (this.isPostOwner(user, post)) {
                if (!this.areGenresValid(req.body.musicalGenres)) {
                    return res.status(400).send("Some genres are invalid")
                }

                PostModel.getEditableFields().forEach((key) => {
                    let value = req.body[key];
                    if (value != post[key] && value != undefined) {
                        post[key] = value;
                    }
                })

                const response = await this.postService.updatePost(post);
                return res.status(200).send(response);
            } else {
                return res.status(401).send("Only the post owner can update this post")
            }
        } catch (e) {
            return res.status(500).send(e);
        }
    }

    async deletePost(req: Request, res: Response) {
        try {
            const postId = parseInt(req.params.postId);
            const user: UserModel = await this.loginService.getUserInRequest(req);
            const post: any = await this.postService.getPostById(postId);

            if (post == null) return res.status(404).send("Post not found")

            if (this.isPostOwner(user, post)) {
                const response = await this.postService.deletePost(post);
                return res.status(200).send(response);
            } else {
                return res.status(401).send("Only the post owner can delete this post")
            }
        } catch (e) {
            return res.status(500).send(e);
        }
    }

    private async areGenresValid(genres: string[]): Promise<boolean> {
        if (genres?.length > 0) {
            let response = await this.musicGenreService.getMusicGenresByName(genres);
            return response.length != genres.length
        }

        return true;
    }

    private areThereFilters(queryString: any): boolean {
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

    private isPostOwner(user: UserModel, post: any) {
        return user.role.canManagePosts && post?.user.id == user.id
    }
}