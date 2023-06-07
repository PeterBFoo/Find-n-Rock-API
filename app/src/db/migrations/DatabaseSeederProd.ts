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
        let metal = new MusicalGenreModel("Metal");
        let punk = new MusicalGenreModel("Punk");

        await this.musicalGenreRepository.save(musicalGenres)
        await this.musicalGenreRepository.save([rock, blues, metal, punk])

        //users
        let entrepreneourUser = new UserModel("EsGremi", "EsGremi", "Es Gremi", "Es Gremi is a very recognized place in Palma, we create a lot of events, most of them concerts and parties of all types of music. If you live in Mallorca, this is your place!", "findnrock@gmail.com", "https://esgremi.com/wp-content/uploads/2022/10/es-gremi-black.svg", "Carrer Gremi de Porgadors, 16, 07009 Son Castelló, Illes Balears", "Spain", entrepreneourRole, "971 91 10 04")
        let entrepreneourUser2 = new UserModel(
            "RockFest",
            "RockFest",
            "Rock Fest",
            "Rock Fest is an organization dedicated to promoting rock music events and festivals. We bring together rock fans from all over the world to celebrate the power of this genre. Join us for an unforgettable rock experience!",
            "info@rockfest.com",
            "https://tracktohell.com/wp-content/uploads/2021/12/barcelona-rock-fest-pic-1-768x768-1-e1639582289469.jpg",
            "123 Main Street, Los Angeles, CA 90001, United States",
            "United States",
            entrepreneourRole,
            "123-456-7890"
        );
        let musicalGroupUser = new UserModel("TheDoors", "TheDoors", "The Doors", "We are a hardrock group, borned in Mallorca and rocking around the island. We have several concerts all the days of the week and experience in many types of events", "borrasexposito@gmail.com", "https://upload.wikimedia.org/wikipedia/commons/6/60/Doors_electra_publicity_photo.JPG", "Avda Sa Marina 15 F", "Spain", musicalGroupRole, "+34 646 833 893", 4, [rock, blues])
        let admin = new UserModel("admin", "admin", "Admin", "Admin", "pborrasexposito@cifpfbmoll.eu", "https://st2.depositphotos.com/1002277/5515/i/950/depositphotos_55150353-stock-photo-admin-cubics.jpg", "Avda Sa Marina 15 F, Alcudia, Islas Baleares", "Spain", adminRole, "123456789")

        await this.userRepository.save([entrepreneourUser, entrepreneourUser2, musicalGroupUser, admin]);

        let festival = new PostModel("Es Gremi - Rocking Good", "Festival of rock music in Es Gremi", new Date(), "We are searching groups that live in Mallorca and play rock or hardrock music. If you have been in other concerts and have a demostrable experience, you can join us! We will meet you at the Rocking Good festival!", this.userRepository.getId(entrepreneourUser), [rock], "https://esgremi.com/wp-content/uploads/2023/02/Live_01.jpeg", [musicalGroupUser], [], "Spain", "Illes Balears", "Palma")

        let biofest = new PostModel("Biofest", "College nigth party where we are going to play all night long and electro-fying the music!", new Date(), "We are searching artists that play electronics. If you have been in other concerts and have a demostrable experience, you can join us! We will meet at the Biofest party!", this.userRepository.getId(entrepreneourUser), [rock], "https://m1.megaentradas.com/5/eventos/1022.jpg", [], [], "Spain", "Illes Balears", "Palma")

        let festival2 = new PostModel(
            "Rock Fest 2023",
            "The ultimate rock festival experience",
            new Date(),
            "Join us for the Rock Fest 2023, a three-day extravaganza of rock music. Bands from all over the world will be performing their best hits. Get ready to rock!",
            this.userRepository.getId(entrepreneourUser),
            [rock, metal],
            "https://www.mexicoescultura.com/galerias/actividades/principal/335053613_607944660751014_753108354055412869_n_1.jpg",
            [],
            [],
            "United States",
            "California",
            "Los Angeles"
        );

        let festival3 = new PostModel(
            "Classic Rock Revival",
            "A celebration of classic rock",
            new Date(),
            "Calling all classic rock fans! Join us for the Classic Rock Revival, where legendary bands will take the stage to perform their greatest hits. Don't miss this nostalgic musical journey!",
            this.userRepository.getId(entrepreneourUser2),
            [rock],
            "https://static.wixstatic.com/media/708e20_b7408effb05d4484abae2c101f9c314d~mv2.gif",
            [musicalGroupUser],
            [],
            "United Kingdom",
            "England",
            "London"
        );

        let festival4 = new PostModel(
            "Metal Mayhem Festival",
            "The ultimate metal experience",
            new Date(),
            "Prepare yourself for the Metal Mayhem Festival, a headbanging extravaganza featuring the heaviest bands in the metal scene. Get ready to mosh and unleash your inner metalhead!",
            this.userRepository.getId(entrepreneourUser2),
            [metal],
            "https://es.concerts-metal.com/images/flyers/202107/1625655207.webp",
            [],
            [],
            "Germany",
            "Bavaria",
            "Munich"
        );

        let festival5 = new PostModel(
            "Rock Imperium",
            "An outdoor rock music event",
            new Date(),
            "Experience the thrill of outdoor rock music at Rcok Imperium. Join us for a day of live performances, delicious food, and a great atmosphere. Don't forget to bring your lawn chairs and enjoy the show!",
            this.userRepository.getId(entrepreneourUser),
            [rock],
            "https://www.rockimperiumfestival.es/wp-content/uploads/2021/06/rif-announce-es.jpg",
            [],
            [],
            "Canada",
            "Ontario",
            "Toronto"
        );

        let festival6 = new PostModel(
            "Hardcore Hysteria",
            "A hardcore punk extravaganza",
            new Date(),
            "Calling all hardcore punk enthusiasts! Get ready for Hardcore Hysteria, a high-energy showcase of hardcore punk bands. Expect intense mosh pits, crowd surfing, and non-stop adrenaline!",
            this.userRepository.getId(entrepreneourUser2),
            [punk],
            "https://m.media-amazon.com/images/I/61azHmK68oL._UF894,1000_QL80_.jpg",
            [],
            [],
            "United States",
            "New York",
            "New York City"
        );


        await this.postRepository.save([festival, biofest, festival2, festival3, festival4, festival5, festival6]);
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