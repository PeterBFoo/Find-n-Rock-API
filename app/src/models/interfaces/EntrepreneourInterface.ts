import { UserInterface } from "./UserInterface";

export interface EntrepreneourInterface extends UserInterface {
    phone: string | null;
    address: string | null;
}