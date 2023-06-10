import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { WorkExperienceInterface } from "./interfaces/WorkExperienceInterface";
import { UserModel } from "./UserModel";

@Entity("WorkExperience")
export class WorkExperienceModel implements WorkExperienceInterface {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => UserModel, (user) => user.id)
    user: number;

    @Column()
    name: string;

    @Column()
    enterprise: string;

    @Column()
    country: string;

    @Column()
    region: string;

    @Column()
    city: string;

    @Column()
    initialDate: Date;

    @Column()
    endDate: Date;

    @Column()
    description: string;

    constructor(userId: number, name: string, enterprise: string, country: string, region: string, city: string, initialDate: Date, endDate: Date, description: string) {
        this.user = userId;
        this.name = name;
        this.enterprise = enterprise;
        this.country = country;
        this.region = region;
        this.city = city;
        this.initialDate = initialDate;
        this.endDate = endDate;
        this.description = description;
    }


    static isValidExperience(fields: any): boolean {
        let isValid = true;
        let mandatoryFields = ["name", "enterprise", "country", "region", "city", "initialDate", "endDate", "description"];

        mandatoryFields.forEach((field) => {
            if (fields[field] == null || fields[field] == undefined || fields[field] == "") {
                isValid = false;
            }
        });

        return isValid;
    }
}