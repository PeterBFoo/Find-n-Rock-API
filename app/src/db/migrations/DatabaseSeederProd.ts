import { MigrationInterface } from "typeorm";
import connection from "../../db/dataSource";
import { RoleModel } from "../../models/RoleModel";
import { MusicalGenreModel } from "../../models/MusicGenreModel";
import { PostModel } from "../../models/PostModel";
import { UserModel } from "../../models/UserModel";
import genres from "../../static/Genres";

export class DataBaseSeederProd implements MigrationInterface {
    roleRepository = connection.getRepository(RoleModel);
    userRepository = connection.getRepository(UserModel);
    musicalGenreRepository = connection.getRepository(MusicalGenreModel);
    postRepository = connection.getRepository(PostModel);

    public async up(): Promise<void> {
        await this.startConnection();

        // roles
        let entrepreneourRole = new RoleModel("entrepreneur", true, false, false);
        let musicalGroupRole = new RoleModel("group", false, true, false);
        let adminRole = new RoleModel("admin", true, true, true);

        await this.roleRepository.save([entrepreneourRole, musicalGroupRole, adminRole]);

        // music genres
        let genresArray: string[] = genres;
        let musicalGenres: MusicalGenreModel[] = [];
        genresArray.forEach(genre => {
            musicalGenres.push(new MusicalGenreModel(genre))
        });

        let rock = new MusicalGenreModel("Rock");
        let blues = new MusicalGenreModel("Blues");

        await this.musicalGenreRepository.save(musicalGenres)
        await this.musicalGenreRepository.save([rock, blues])

        //users
        let entrepreneourUser = new UserModel("EsGremi", "EsGremi", "Es Gremi", "Es Gremi is a very recognized place in Palma, we create a lot of events, most of them concerts and parties of all types of music. If you live in Mallorca, this is your place!", "rrhh@esgremi.com", "https://esgremi.com/wp-content/uploads/2022/10/es-gremi-black.svg", "Carrer Gremi de Porgadors, 16, 07009 Son Castelló, Illes Balears", "Spain", entrepreneourRole, "971 91 10 04")
        let musicalGroupUser = new UserModel("SixDoors", "SixDoors", "Six Doors", "We are a hardrock group, borned in Mallorca and rocking around the island. We have several concerts all the days of the week and experience in many types of events", "borrasexposito@gmail.com", "https://www.testimage.com", "Avda Sa Marina 15 F", "Spain", musicalGroupRole, "+34 646 833 893", 4, [rock, blues])
        let admin = new UserModel("admin", "admin", "Admin", "Admin", "pborrasexposito@cifpfbmoll.eu", "https://st2.depositphotos.com/1002277/5515/i/950/depositphotos_55150353-stock-photo-admin-cubics.jpg", "Avda Sa Marina 15 F, Alcudia, Illes Balears", "Spain", adminRole, "123456789")

        await this.userRepository.save([entrepreneourUser, musicalGroupUser, admin]);

        let festival = new PostModel("Es Gremi - Rocking Good", "Festival of rock music in Es Gremi", new Date(), "We are searching groups that live in Mallorca and play rock or hardrock music. If you have been in other concerts and have a demostrable experience, you can join us! We will meet you at the Rocking Good festival!", this.userRepository.getId(entrepreneourUser), [rock], "https://esgremi.com/wp-content/uploads/2023/02/Live_01.jpeg", [], [], "Spain", "Illes Balears", "Palma")

        let biofest = new PostModel("Biofest", "College nigth party where we are going to play all night long and electro-fying the music!", new Date(), "We are searching artists that play electronics. If you have been in other concerts and have a demostrable experience, you can join us! We will meet at the Biofest party!", this.userRepository.getId(entrepreneourUser), [rock], "https://esgremi.com/wp-content/uploads/2023/02/Live_01.jpeg", [], [], "Spain", "Illes Balears", "Palma")

        await this.postRepository.save([festival, biofest]);
        await this.closeConnection();
    }

    public async down(): Promise<void> {
        await this.startConnection();
        await connection.dropDatabase()
        await this.closeConnection();
    }

    private async startConnection() {
        if (!connection.isInitialized) {
            await connection.initialize();
        }
    }

    private async closeConnection() {
        if (connection.isInitialized) {
            await connection.destroy();
        }
    }
}