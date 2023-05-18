import path from "path";
import dotenv from "dotenv";

// supported drivers, must be one of those
type DataSourceConnectionOptions = "postgres" | "mysql" | "mariadb" | "sqlite" | "mssql" | "oracle" | "mongodb" | "cordova" | "nativescript" | "react-native" | "sqljs" | "expo" | "react-native" | "better-sqlite3"

class Config {
    NODE_ENV: string;
    DB_TYPE: DataSourceConnectionOptions;
    HOST: string;
    PORT: number;
    DB_PORT: number;
    DB_USR: string;
    DB_PWD: string;
    DB_NAME: string;
    SYNCHRONIZE: boolean;
    LOGGING: boolean;
    SECRET_KEY: string;
    MAIL_API_KEY: string;
    MAIL: string;
    ALLOWED_SERVER: string;

    constructor() {
        dotenv.config({
            path: path.join(__dirname, "..", "..", "..", process.env.NODE_ENV + ".env")
        });

        this.PORT = process.env.PORT != undefined ? parseInt(process.env.PORT) : 3000;
        this.DB_PORT = process.env.DB_PORT != undefined ? parseInt(process.env.DB_PORT) : 5432;
        this.DB_TYPE = process.env.DB_TYPE as DataSourceConnectionOptions || "postgres";
        this.NODE_ENV = process.env.NODE_ENV || "development";
        this.HOST = process.env.HOST || "localhost";
        this.DB_USR = process.env.DB_USR || "postgres";
        this.DB_PWD = process.env.DB_PWD || "postgres";
        this.DB_NAME = process.env.DB_NAME || "";
        this.SYNCHRONIZE = process.env.SYNCHRONIZE === "true";
        this.LOGGING = process.env.LOGGING === "true";
        this.SECRET_KEY = process.env.SECRET_KEY || "secret";
        this.ALLOWED_SERVER = process.env.ALLOWED_SERVER || "http://localhost:4200";

        if (process.env.MAIL_API_KEY == undefined) {
            throw new Error("Couldn't get the correct key for the mail API")
        } else {
            this.MAIL_API_KEY = process.env.MAIL_API_KEY
        }

        this.MAIL = process.env.MAIL = "findnrock@gmail.com"
    }

    getPort(): number {
        return this.PORT;
    }

    getDbPort(): number {
        return this.DB_PORT;
    }

    getDbType(): any {
        return this.DB_TYPE;
    }

    getHost(): string {
        return this.HOST;
    }

    getDbUsr(): string {
        return this.DB_USR;
    }

    getDbPwd(): string {
        return this.DB_PWD;
    }

    getDbName(): string {
        return this.DB_NAME;
    }

    getSynchronize(): boolean {
        return this.SYNCHRONIZE;
    }

    getLogging(): boolean {
        return this.LOGGING;
    }

    getEnv(): string {
        return this.NODE_ENV;
    }

    getSecretKey(): string {
        return this.SECRET_KEY;
    }
}

export default new Config();