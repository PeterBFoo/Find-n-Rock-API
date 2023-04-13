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

    @Column({
        default: false
    })
    canCreateRoles: boolean;

    constructor(name: string, canCreatePosts: boolean, canSubscribeToPosts: boolean, canCreateRoles: boolean) {
        this.name = name;
        this.canManagePosts = canCreatePosts;
        this.canSubscribe = canSubscribeToPosts;
        this.canCreateRoles = canCreateRoles;
    }
}