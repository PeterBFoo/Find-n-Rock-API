// MIDDLEWARE //
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';

// ROUTES //
import login from './src/routes/LoginRoute';
const noAuthRoutes = [login]
const authRoutes = []

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