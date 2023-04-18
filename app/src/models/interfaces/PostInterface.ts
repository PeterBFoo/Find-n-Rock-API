import { Tags } from "./Tags";

export interface PostInterface {
    id: number;
    title: string;
    subtitle: string;
    body: string;
    date: Date;
    image: string | null;
    user: number;
    genres: Tags[];
}