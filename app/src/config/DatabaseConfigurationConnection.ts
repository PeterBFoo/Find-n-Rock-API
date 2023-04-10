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

    constructor() {
        dotenv.config({
            path: path.join(__dirname, "..", "..", "..", process.env.NODE_ENV + ".env")
        });

        let port = process.env.PORT;
        let dbPort = process.env.DB_PORT;

        this.PORT = port != undefined ? parseInt(port) : 3000;
        this.DB_PORT = dbPort != undefined ? parseInt(dbPort) : 5432;
        this.DB_TYPE = process.env.DB_TYPE as DataSourceConnectionOptions || "postgres";
        this.NODE_ENV = process.env.NODE_ENV || "development";
        this.HOST = process.env.HOST || "localhost";
        this.DB_USR = process.env.DB_USR || "postgres";
        this.DB_PWD = process.env.DB_PWD || "postgres";
        this.DB_NAME = process.env.DB_NAME || "";
        this.SYNCHRONIZE = process.env.SYNCHRONIZE === "true";
        this.LOGGING = process.env.LOGGING === "true";
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
}

export default new Config();