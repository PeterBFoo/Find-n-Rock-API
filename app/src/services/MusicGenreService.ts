import connection from "../db/dataSource";
import { MusicalGenreModel } from "../models/MusicGenreModel";
import { Repository } from 'typeorm';
import { Service } from "./interfaces/Service";

export class MusicGenreService implements Service {
    private static instance: MusicGenreService;
    repository: Repository<MusicalGenreModel> = connection.getRepository(MusicalGenreModel);

    static getInstance(): MusicGenreService {
        if (!MusicGenreService.instance) {
            MusicGenreService.instance = new MusicGenreService();
        }

        return MusicGenreService.instance;
    }

    async getMusicGenre(name: string) {
        return await this.repository.findOne({
            where: {
                name: name
            }
        })
    }

    async getMusicGenres(names: string[]): Promise<MusicalGenreModel[]> {
        return await this.repository.createQueryBuilder("genres")
            .where("genres.name IN (:...names)", { names: names })
            .getMany()
    }
}