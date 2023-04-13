import { RoleInterface } from "./RoleInterface";

export interface UserInterface {
    id: number;
    username: string;
    password: string;
    name: string;
    description: string;
    email: string;
    country: string;
    image: string;
    role: RoleInterface;
}