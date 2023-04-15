import connection from "../db/dataSource";
import { RoleModel } from "../models/RoleModel";
import { Repository } from 'typeorm';
import { Service } from "./interfaces/Service";

export class RoleService implements Service {
    private static instance: RoleService;
    repository: Repository<RoleModel> = connection.getRepository(RoleModel);

    static getInstance(): RoleService {
        if (!RoleService.instance) {
            RoleService.instance = new RoleService();
        }

        return RoleService.instance;
    }

    /**
     * 
     * @param role Name of the role
     * @returns Role object if found, null otherwise
     */
    async getRoleByName(role: string): Promise<RoleModel | null> {
        const roleModel = await this.repository.findOne({
            where: {
                name: role
            }
        });

        return roleModel != null ? roleModel : null;
    }

    /**
     * 
     * @param id Id of the role
     * @returns Role object if found, null otherwise
     */
    async getRoleById(id: number): Promise<RoleModel | null> {
        const roleModel = await this.repository.findOne({
            where: {
                id: id
            }
        });

        return roleModel || null;
    }

    /**
     * 
     * @param role Role object to be created
     * @returns Role object if creation was successful, null otherwise
     */
    async createRole(role: RoleModel): Promise<RoleModel> {
        return await this.repository.save(role);
    }

    /**
     * 
     * @param id Id of the role to be deleted
     * @returns True if deletion was successful, false otherwise
     */
    async deleteRole(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);

        if (result.affected == 0) {
            return false;
        }

        return true;
    }

}