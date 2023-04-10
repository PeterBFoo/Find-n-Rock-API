import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MusicalGenreModel } from "./MusicGenreModel";
import { UserModel } from "./UserModel";
import { Tags } from "./interfaces/Tags";
import { PostInterface } from "./interfaces/PostInterface";

@Entity("Post")
export class PostModel implements PostInterface {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title: string;

    @Column()
    subtitle: string;

    @Column()
    date: Date;

    @Column()
    body: string;

    @Column("text", { nullable: true, default: null })
    image: string | null;

    @OneToOne(() => UserModel, (entrepreneour) => entrepreneour.id)
    @JoinColumn()
    user: number;

    @ManyToMany(() => MusicalGenreModel, (genre) => genre.id, { onDelete: "CASCADE" })
    @JoinTable({
        name: "MusicalGenres_Posts",
    })
    musicalGenres: Tags[];

    @ManyToMany(() => UserModel, (group) => group.id, { onDelete: "CASCADE" })
    @JoinTable({
        name: "Suscriptions",
    })
    suscriptions: UserModel[];

    constructor(title: string, subtitle: string, date: Date, body: string, userId: number, musicalGenreId: Tags[], image: string | null = null, suscriptions: UserModel[]) {
        this.title = title;
        this.subtitle = subtitle;
        this.date = date;
        this.body = body;
        this.image = image;
        this.user = userId;
        this.musicalGenres = musicalGenreId;
        this.suscriptions = suscriptions;
    }
}