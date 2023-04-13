import connection from "../db/dataSource";
import { MusicalGenreModel } from "../models/MusicGenreModel";
import { Repository } from 'typeorm';

export class MusicGenreService {
    private static instance: MusicGenreService;
    MusicGenreService: Repository<MusicalGenreModel> = connection.getRepository(MusicalGenreModel);

    static getInstance(): MusicGenreService {
        if (!MusicGenreService.instance) {
            MusicGenreService.instance = new MusicGenreService();
        }

        return MusicGenreService.instance;
    }

    async getMusicGenre(name: string) {
        return await this.MusicGenreService.findOne({
            where: {
                name: name
            }
        })
    }

    async getMusicGenres(names: string[]): Promise<MusicalGenreModel[]> {
        return await this.MusicGenreService.createQueryBuilder("genres")
            .where("genres.name IN (:...names)", { names: names })
            .getMany()
    }
}