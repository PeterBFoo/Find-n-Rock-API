import { MigrationInterface } from "typeorm";
import connection from "../../db/dataSource";
import { RoleModel } from "../../models/RoleModel";
import { MusicalGenreModel } from "../../models/MusicGenreModel";
import { PostModel } from "../../models/PostModel";
import { UserModel } from "../../models/UserModel";

export class DataBaseSeeder implements MigrationInterface {
    roleRepository = connection.getRepository(RoleModel);
    userRepository = connection.getRepository(UserModel);
    musicalGenreRepository = connection.getRepository(MusicalGenreModel);
    postRepository = connection.getRepository(PostModel);

    public async up(): Promise<void> {
        await this.startConnection();

        let entrepreneourRole = new RoleModel("entrepreneur", true, false);
        let musicalGroupRole = new RoleModel("group", false, true);

        await this.roleRepository.save([entrepreneourRole, musicalGroupRole]);

        let entrepreneourUser = new UserModel("username", "password", "Entrepreneour test", "Description test", "test@test.com", "https://www.testimage.com", "Avda Test 2", "Spain", entrepreneourRole, "123456789")

        await this.userRepository.save(entrepreneourUser);

        let rock = new MusicalGenreModel("Rock");
        let blues = new MusicalGenreModel("Blues");

        await this.musicalGenreRepository.save([rock, blues])

        let musicalGroupUser = new UserModel("username2", "password2", "Musical group test", "Description test", "test2@test.com", "https://www.testimage.com", "Avda Test 2", "Spain", musicalGroupRole, "123456789", 4, [rock, blues])

        await this.userRepository.save(musicalGroupUser);

        let post = new PostModel("Post test", "Subtitle post test", new Date(), "Body post test", this.userRepository.getId(entrepreneourUser), [this.musicalGenreRepository.getId(rock), this.musicalGenreRepository.getId(blues)], "https://www.testimage.com", [])

        await this.postRepository.save(post);

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