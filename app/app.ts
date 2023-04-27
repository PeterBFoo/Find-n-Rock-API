// MIDDLEWARE //
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import { LoggedUser } from './src/middleware/LoggedUser.middleware';
const loggedUserMiddleware = new LoggedUser().rejectIfNotLoggedIn;

// ROUTES //
import login from './src/routes/LoginRoute';
import register from './src/routes/RegisterRoute';
import post from './src/routes/PostRoute';
import user from './src/routes/UserRoute';
const noAuthRoutes = [login, register]
const authRoutes = [post, user]

// DB //
import envConfig from './src/config/DatabaseConfigurationConnection';
import "reflect-metadata";
import AppDataSource from './src/db/dataSource';

const app: Express = express();
const port = envConfig.PORT;

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api", noAuthRoutes);
app.use("/api/auth", loggedUserMiddleware)
app.use("/api/auth", authRoutes);

if (envConfig.NODE_ENV != "test") {
    app.use(morgan('dev'));

    AppDataSource.initialize()
        .then(() => {
            console.log('Database connection established');
        })
        .catch((error) => console.log("Database connection error: ", error));

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

export default app;