import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
    body: string;

    @Column()
    date: Date;

    @Column("text", { nullable: true, default: null })
    image: string | null;

    @ManyToOne(() => UserModel, (entrepreneour) => entrepreneour.id)
    @JoinColumn()
    user: number;

    @ManyToMany(() => MusicalGenreModel, (genre) => genre.id, { onDelete: "CASCADE" })
    @JoinTable({
        name: "MusicalGenres_Posts",
    })
    genres: Tags[];

    @ManyToMany(() => UserModel, (group) => group.id, { onDelete: "CASCADE" })
    @JoinTable({
        name: "Suscriptions",
    })
    suscriptions: UserModel[];

    @Column()
    country: string;

    @Column()
    region: string;

    @Column()
    city: string;

    @Column()
    active: boolean

    constructor(title: string, subtitle: string, date: Date, body: string, userId: number, genres: Tags[], image: string | null = null, suscriptions: UserModel[], country: string, region: string, city: string) {
        this.title = title;
        this.subtitle = subtitle;
        this.date = date;
        this.body = body;
        this.image = image;
        this.user = userId;
        this.genres = genres;
        this.suscriptions = suscriptions;
        this.country = country;
        this.region = region;
        this.city = city;
        this.active = true;
    }

    static getEditableFields(): string[] {
        return ['title', 'subtitle', 'body', 'genres', 'image', 'country', 'region', 'city']
    }

    static getMandatoryFields(): string[] {
        return ['title', 'subtitle', 'body', 'genres', 'country', 'region', 'city'];
    }

    static isValidPost(post: any): boolean {
        const mandatoryFields = this.getMandatoryFields();
        for (const field of mandatoryFields) {
            if (!post[field] || post[field] === '') {
                return false;
            }
        }

        return true;
    }
}