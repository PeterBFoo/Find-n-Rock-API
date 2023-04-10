import { Tags } from "./Tags";

export interface MusicalGroupInterface extends UserInterface {
    integrants: number | null;
    musicalGenres: Tags[] | null;
}
