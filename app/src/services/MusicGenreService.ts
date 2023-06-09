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

    /**
     * 
     * @param name Name of the genre
     * @returns Genre object if found, null otherwise
     */
    async getMusicGenreByName(name: string) {
        return await this.repository.findOne({
            where: {
                name: name
            }
        })
    }

    /**
     * 
     * @param names Array of genre names
     * @returns Array of genre objects, empty array if none found
     */
    async getMusicGenresByName(names: string[]): Promise<MusicalGenreModel[]> {
        return await this.repository.createQueryBuilder("genres")
            .where("genres.name IN (:...names)", { names: names })
            .getMany()
    }

    /**
     * 
     * @returns Array of all genres
     */
    async getMusicGenres(): Promise<MusicalGenreModel[]> {
        return await this.repository.find();
    }

    /**
     * 
     * @param name Genre name
     * @returns Boolean determining if genre exists
     */
    async genreExists(name: string): Promise<boolean> {
        return await this.repository.exist({
            where: {
                name: name
            }
        });
    }

    /**
     * 
     * @param name Genre name
     * @returns Creates a music genre
     */
    async createMusicGenre(name: string): Promise<MusicalGenreModel> {
        const genre = new MusicalGenreModel(name);
        return await this.repository.save(genre);
    }

    /**
     * 
     * @param name Genre name
     * Deletes an music genre
     */
    async deleteMusicGenre(name: string): Promise<void> {
        await this.repository.delete({
            name: name
        });
    }
}