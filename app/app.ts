// MIDDLEWARE //
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import { LoggedUser } from './src/middleware/LoggedUser.middleware';
const loggedUserMiddleware = new LoggedUser().rejectIfNotLoggedIn;
import https from 'https';

// ROUTES //
import login from './src/routes/LoginRoute';
import register from './src/routes/RegisterRoute';
import post from './src/routes/PostRoute';
import user from './src/routes/UserRoute';
import genres from './src/routes/MusicGenresRoute';
import genresAuth from './src/routes/MusicGenresAuthRoute';
const noAuthRoutes = [login, register, genres]
const authRoutes = [post, user, genresAuth]

// DB //
import envConfig from './src/config/DatabaseConfigurationConnection';
import "reflect-metadata";
import AppDataSource from './src/db/dataSource';

// SWAGGER //
import swaggerUi, { JsonObject } from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

const app: Express = express();
const port = envConfig.PORT;

app.use(cookieParser());
app.use(cors({
    origin: envConfig.ALLOWED_SERVER,
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api", noAuthRoutes);
app.use("/api/auth", loggedUserMiddleware)
app.use("/api/auth", authRoutes);

if (envConfig.NODE_ENV != "test") {
    AppDataSource.initialize()
        .then(() => {
            console.log('Database connection established');

            app.use(morgan('dev'));

            const swaggerDocument: JsonObject | unknown = yaml.load(fs.readFileSync(path.join(__dirname, "..", "/app/doc/swaggerDocumentation.yaml"), 'utf8'));
            swaggerDocument ? app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument)) :
                console.log("Error loading swagger doc");
        })
        .catch((error) => console.log("Database connection error: ", error));

    if (envConfig.NODE_ENV == "prod") {
        https.createServer({
            key: fs.readFileSync(path.join(__dirname, "..", "./app/cert/key.pem")),
            cert: fs.readFileSync(path.join(__dirname, "..", "./app/cert/cert.pem"))
        }, app).listen(port, () => {
            console.log(`Server is running at https://localhost:${port}`);
        });
    } else {
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    }
}

export default app;