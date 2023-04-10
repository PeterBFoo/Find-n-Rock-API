import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleInterface } from "./interfaces/RoleInterface";
import { UserModel } from "./UserModel";

@Entity("Role")
export class RoleModel implements RoleInterface {
    @PrimaryGeneratedColumn()
    @OneToMany(() => UserModel, (user) => user.role)
    id!: number;

    @Column()
    name: string;

    @Column()
    canManagePosts: boolean;

    @Column()
    canSubscribe: boolean;

    constructor(name: string, canCreatePosts: boolean, canSubscribeToPosts: boolean) {
        this.name = name;
        this.canManagePosts = canCreatePosts;
        this.canSubscribe = canSubscribeToPosts;
    }
}