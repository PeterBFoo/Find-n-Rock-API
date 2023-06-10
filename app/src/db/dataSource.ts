import envConfig from "../config/DatabaseConfigurationConnection"
import { DataSource } from "typeorm"
import { UserModel } from "../models/UserModel"
import { MusicalGenreModel } from "../models/MusicGenreModel"
import { PostModel } from "../models/PostModel"
import { RoleModel } from "../models/RoleModel"
import { WorkExperienceModel } from "../models/WorkExperienceModel"

const AppDataSource = new DataSource({
    type: envConfig.getDbType(),
    host: envConfig.getHost(),
    port: envConfig.getDbPort(),
    username: envConfig.getDbUsr(),
    password: envConfig.getDbPwd(),
    database: envConfig.getDbName(),
    entities: [
        RoleModel,
        MusicalGenreModel,
        UserModel,
        PostModel,
        WorkExperienceModel
    ],
    synchronize: envConfig.getSynchronize(),
    logging: envConfig.getLogging(),
});

export default AppDataSource