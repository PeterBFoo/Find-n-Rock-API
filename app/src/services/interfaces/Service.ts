import { Repository } from "typeorm";

export interface Service {
    repository: Repository<any>;
}