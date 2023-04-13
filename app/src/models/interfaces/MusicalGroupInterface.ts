import { Tags } from "./Tags";
import { UserInterface } from "./UserInterface";

export interface MusicalGroupInterface extends UserInterface {
    integrants: number | null;
    musicalGenres: Tags[] | null;
}
