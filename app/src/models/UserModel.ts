import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToMany, JoinTable, ManyToOne } from "typeorm"
import { RoleModel } from "./RoleModel";
import bcrypt from 'bcryptjs';
import { MusicalGenreModel } from "./MusicGenreModel";
import { EntrepreneourInterface } from "./interfaces/EntrepreneourInterface";
import { MusicalGroupInterface } from "./interfaces/MusicalGroupInterface";
import { Tags } from "./interfaces/Tags";
import { RoleInterface } from "./interfaces/RoleInterface";

type ValidRole = "entrepreneur" | "group"

@Entity("User")
export class UserModel implements EntrepreneourInterface, MusicalGroupInterface {
    static VALID_ROLES = ["entrepreneur", "group"]

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
    role: RoleInterface;

    constructor(username: string, password: string, name: string, description: string, email: string, image: string, address: string, country: string, roleId: RoleInterface, phone?: string, integrants?: number, musicalGenres?: Tags[]) {
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

    static getMandatoryFieldsFor(userRole: ValidRole): string[] {
        if (userRole == "entrepreneur") {
            return ["username", "password", "name", "description", "email", "address", "country", "phone", "image", "role"]
        } else {
            return ["username", "password", "name", "description", "email", "address", "country", "phone", "integrants", "image", "role"]
        }
    }

    static isValid(user: any, userRole: ValidRole): boolean {
        const mandatoryFields = this.getMandatoryFieldsFor(userRole);
        for (const field of mandatoryFields) {
            if (!user[field] || user[field] === '') {
                return false;
            }
        }

        return true;
    }

    static getCommonEditableFields() {
        return ["password", "name", "description", "email", "address", "country", "phone", "image"]
    }

    static getEditableFieldsEntrepreneur() {
        let editableFields = this.getCommonEditableFields();
        return editableFields;
    }

    static getEditableFieldsMusicGroup() {
        let editableFields = this.getCommonEditableFields();
        editableFields.push("integrants", "genres")
        return editableFields;
    }

    static hashPassword(password: string): string {
        return bcrypt.hashSync(password);
    }

    static isTheSamePassword(password: string, hashedPassword: string): boolean {
        return bcrypt.compareSync(password, hashedPassword);
    }
}