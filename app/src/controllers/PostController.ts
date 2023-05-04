import { Request, Response } from 'express';
import { PostService } from '../services/PostService';
import { LoginService } from '../services/LoginService';
import { PostModel } from '../models/PostModel';
import { MusicGenreService } from '../services/MusicGenreService';
import { UserService } from '../services/UserService';
import { UserModel } from '../models/UserModel';
import { Constants } from '../static/Constants';
import { AvailableFilters } from './types/PostTypes';


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

            post ? res.status(200).send(post) : res.status(404).send({ error: Constants.POSTS_NOT_FOUND });

        } catch (error) {
            return res.status(400).send({ error: 'Invalid ID' });
        }
    }

    async getPostsOfUser(req: Request, res: Response) {
        const user = await this.userService.getUserByUsername(req.params.username);
        if (user) {
            const posts = await this.postService.getPostsOfUser(user);
            res.status(200).send(posts);
        } else {
            res.status(404).send(Constants.USER_NOT_FOUND);
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
                    let newPost = new PostModel(title, subtitle, new Date(), body, user.id, musicGenres, image, [], [], country, region, city);

                    const response = await this.postService.createPost(newPost);
                    return response ? res.status(201).send(response) : res.status(500).send({ error: Constants.GENERAL_ERROR });
                } else {
                    return res.status(400).send({ error: Constants.BAD_REQUEST });
                }
            } else {
                return res.status(401).send({ error: Constants.POSTS_CREATE_NOT_ALLOWED, user: user });
            }

        } catch (error: any) {
            return res.status(500).send({ error: error.message });
        }
    }

    async editPost(req: Request, res: Response) {
        try {
            const postId = parseInt(req.params.postId);
            if (!postId) return res.status(400).send(Constants.POSTS_INVALID_ID)

            const user: UserModel = await this.loginService.getUserInRequest(req);
            const post: any = await this.postService.getActivePostById(postId);

            if (post == null) return res.status(404).send(Constants.POSTS_NOT_FOUND)

            if (this.isPostOwner(user, post)) {
                if (!this.areGenresValid(req.body.musicalGenres)) {
                    return res.status(400).send(Constants.GENRES_INVALID)
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
                return res.status(401).send(Constants.POSTS_EDIT_NOT_ALLOWED)
            }
        } catch (e) {
            return res.status(500).send(e);
        }
    }

    async deletePost(req: Request, res: Response) {
        try {
            const postId = parseInt(req.params.postId);
            if (!postId) return res.status(400).send(Constants.POSTS_INVALID_ID)

            const user: UserModel = await this.loginService.getUserInRequest(req);
            const post: any = await this.postService.getActivePostById(postId);

            if (post == null) return res.status(404).send(Constants.POSTS_NOT_FOUND)

            if (this.isPostOwner(user, post)) {
                const response = await this.postService.deletePost(post);
                return res.status(200).send(response);
            } else {
                return res.status(401).send(Constants.POSTS_DELETE_NOT_ALLOWED)
            }
        } catch (e) {
            return res.status(500).send(e);
        }
    }

    async suscribeToPost(req: Request, res: Response) {
        try {
            const postId = parseInt(req.params.postId);
            if (!postId) return res.status(400).send(Constants.POSTS_INVALID_ID)

            const post: any = await this.postService.getActivePostById(postId);

            if (post == null) return res.status(404).send(Constants.POSTS_NOT_FOUND)

            const user: UserModel = await this.loginService.getUserInRequest(req);

            if (this.canSuscribeToPosts(user)) {
                if (this.isAlreadySuscribed(user, post)) {
                    return res.status(400).send(Constants.POSTS_SUSCRIBE_ALREADY_SUSCRIBED)
                }

                const response = await this.postService.suscribeToPost(post, user);
                return res.status(200).send(response);
            } else {
                return res.status(401).send(Constants.POSTS_SUSCRIBE_NOT_ALLOWED)
            }

        } catch (e) {
            return res.status(500).send(e);
        }
    }

    async unsuscribeToPost(req: Request, res: Response) {
        try {
            const postId = parseInt(req.params.postId);
            if (!postId) return res.status(400).send(Constants.POSTS_INVALID_ID)

            const post: any = await this.postService.getActivePostById(postId);

            if (post == null) return res.status(404).send(Constants.POSTS_NOT_FOUND)

            const user: UserModel = await this.loginService.getUserInRequest(req);

            if (!this.canSuscribeToPosts(user)) {
                return res.status(401).send(Constants.POSTS_UNSUSCRIBE_NOT_ALLOWED)
            }

            if (!this.isAlreadySuscribed(user, post)) {
                return res.status(400).send(Constants.POSTS_UNSUSCRIBE_ALREADY_UNSUSCRIBED)
            }

            const response = await this.postService.unsuscribeToPost(post, user);
            return response ? res.status(200).send(Constants.POSTS_UNSUSCRIBE_OK) :
                res.status(500).send(Constants.POSTS_UNSUSCRIBE_ERROR)

        } catch (e) {
            return res.status(500).send(e);
        }
    }

    async chooseCandidatesOfPost(req: Request, res: Response) {
        const postId = parseInt(req.params.postId);
        if (!postId) return res.status(400).send(Constants.POSTS_INVALID_ID)

        const post: PostModel | null = await this.postService.getActivePostById(postId);

        if (post == null) return res.status(404).send(Constants.POSTS_NOT_FOUND)

        const postOwner: UserModel = await this.loginService.getUserInRequest(req);

        if (!this.isPostOwner(postOwner, post)) return res.status(401).send(Constants.POSTS_CHOOSE_NOT_ALLOWED)

        let candidatesInRequest = req.body.candidates;
        if (candidatesInRequest == undefined) return res.status(400).send(Constants.BAD_REQUEST);
        let candidates = [];

        for (let i = 0; i < candidatesInRequest.length; i++) {
            const user = post.suscriptions.find(suscription => suscription.username == candidatesInRequest[i])
            if (user) {
                candidates.push(user)
            }
        }

        if (candidates.length > 0) {
            const response = await this.postService.selectCandidates(postOwner, post, candidates)

            return response != null ? res.status(200).send(post.selectedCandidates) : res.status(500).send(Constants.GENERAL_ERROR)
        }

        return res.status(400).send(Constants.POSTS_CHOOSE_INVALID_USERS)

    }

    async getSuscribedPostsOfUser(req: Request, res: Response) {
        try {
            const user: UserModel = await this.loginService.getUserInRequest(req);
            const response = await this.postService.getSuscribedPostsOfUser(user);

            return res.status(200).send(response);
        } catch (e) {
            return res.status(500).send(e);
        }
    }

    async getHistoryPostsOfUser(req: Request, res: Response) {
        try {
            const user: UserModel = await this.loginService.getUserInRequest(req);
            if (user.role.name == Constants.ROLE_ENTREPRENEOUR) {
                var response = await this.postService.getHistoryPostsOfEntrepreneur(user);

            } else if (user.role.name == Constants.ROLE_MUSIC_GROUP) {
                var response = await this.postService.getHistoryPostsOfMusicalGroup(user);

            } else {
                return res.status(401).send(Constants.POSTS_HISTORY_NOT_ALLOWED)
            }

            return res.status(200).send(response);
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

    private isAlreadySuscribed(user: UserModel, post: any) {
        return post.suscriptions.some((suscription: any) => suscription.id == user.id);
    }

    private canSuscribeToPosts(user: UserModel) {
        return user.role.canSubscribe;
    }

    private isPostOwner(user: UserModel, post: any) {
        return user.role.canManagePosts && post?.user.id == user.id
    }
}