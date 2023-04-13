import connection from "../db/dataSource";
import { RoleModel } from "../models/RoleModel";
import { Repository } from 'typeorm';

export class RoleService {
    private static instance: RoleService;
    roleRepository: Repository<RoleModel> = connection.getRepository(RoleModel);

    static getInstance(): RoleService {
        if (!RoleService.instance) {
            RoleService.instance = new RoleService();
        }

        return RoleService.instance;
    }

    async getRoleByName(role: string): Promise<RoleModel | null> {
        const roleModel = await this.roleRepository.findOne({
            where: {
                name: role
            }
        });

        return roleModel != null ? roleModel : null;
    }

    async getRoleById(id: number): Promise<RoleModel | null> {
        const roleModel = await this.roleRepository.findOne({
            where: {
                id: id
            }
        });

        return roleModel || null;
    }

    async createRole(role: RoleModel): Promise<RoleModel> {
        return await this.roleRepository.save(role);
    }

    async deleteRole(id: number): Promise<boolean> {
        const result = await this.roleRepository.delete(id);

        if (result.affected == 0) {
            return false;
        }

        return true;
    }

}