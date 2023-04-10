import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToMany, JoinTable, ManyToOne } from "typeorm"
import { RoleModel } from "./RoleModel";
import bcrypt from 'bcryptjs';
import { MusicalGenreModel } from "./MusicGenreModel";
import { EntrepreneourInterface } from "./interfaces/EntrepreneourInterface";
import { MusicalGroupInterface } from "./interfaces/MusicalGroupInterface";
import { Tags } from "./interfaces/Tags";


@Entity("User")
export class UserModel implements EntrepreneourInterface, MusicalGroupInterface {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        unique: true
    })
    username: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column({
        type: "text",
    })
    description: string;

    @Column({
        unique: true,
    })
    email: string;

    @Column({
        type: "text",
        nullable: true
    })
    phone: string | null;

    @Column({
        type: "text",
        nullable: true
    })
    address: string | null;

    @Column({
        type: "text",
        nullable: true
    })
    integrants: number | null;

    @ManyToMany(() => MusicalGenreModel, (genre) => genre.id)
    @JoinTable({
        name: "MusicGenre_User",
    })
    musicalGenres: Tags[] | null;

    @Column()
    country: string;

    @Column()
    image: string;

    @ManyToOne(() => RoleModel, (role) => role.id)
    @JoinColumn()
    role: number;

    constructor(username: string, password: string, name: string, description: string, email: string, image: string, address: string, country: string, roleId: number, phone?: string, integrants?: number, musicalGenres?: Tags[]) {
        this.username = username;
        this.password = password ? bcrypt.hashSync(password) : "";
        this.name = name;
        this.description = description;
        this.email = email;
        this.country = country;
        this.image = image;
        this.role = roleId;

        this.address = address || null;
        this.phone = phone || null;
        this.integrants = integrants || null;
        this.musicalGenres = musicalGenres || null;
    }

    static getMandatoryFields(role: string): string[] {
        let userBasicProperties = ["username", "password", "name", "description", "email", "address", "country", "image", "role"]
        let entrepreneourProperties = ["phone"]
        let musicalGroupProperties = ["integrants", "musicalGenres"]

        if (role === "entrepreneour") {
            return userBasicProperties.concat(entrepreneourProperties);
        } else if (role === "musicalGroup") {
            return userBasicProperties.concat(musicalGroupProperties);
        } else {
            return userBasicProperties;
        }
    }

    static isValid(user: any, roleType: string): boolean {
        const mandatoryFields = this.getMandatoryFields(roleType);
        for (const field of mandatoryFields) {
            if (!user[field] || user[field] === '') {
                return false;
            }
        }

        return true;
    }
}