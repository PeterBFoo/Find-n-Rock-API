import { Request, Response } from 'express';
import { PostService } from '../services/PostService';

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