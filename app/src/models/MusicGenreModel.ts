import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Tags } from "./interfaces/Tags";

@Entity("MusicGenre")
export class MusicalGenreModel implements Tags {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}