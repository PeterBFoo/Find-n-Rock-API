import connection from '../db/dataSource';
import { Service } from './interfaces/Service';
import { Repository } from 'typeorm';
import { WorkExperienceModel } from '../models/WorkExperienceModel';
import { UserModel } from '../models/UserModel';

export class WorkExperienceService implements Service {
    private static instance: WorkExperienceService;
    repository: Repository<WorkExperienceModel> = connection.getRepository(WorkExperienceModel);

    private constructor() { }

    static getInstance(): WorkExperienceService {
        if (!WorkExperienceService.instance) {
            WorkExperienceService.instance = new WorkExperienceService();
        }

        return WorkExperienceService.instance;
    }

    async getWorkExperiencesByUserId(username: string): Promise<WorkExperienceModel[] | null> {
        return await this.repository.createQueryBuilder("workExperience")
            .leftJoin("workExperience.user", "user")
            .where("user.username = :username", { username: username })
            .getMany();
    }

    async getWorkExperienceById(user: UserModel, workExperienceId: number): Promise<WorkExperienceModel | null> {
        try {
            return await this.repository.findOne({
                where: {
                    id: workExperienceId,
                    user: user.id
                }
            });
        } catch (error) {
            return null;
        }

    }

    async createWorkExperience(workExperience: WorkExperienceModel): Promise<WorkExperienceModel> {
        return await this.repository.save(workExperience);
    }

    async updateWorkExperience(workExperience: WorkExperienceModel): Promise<WorkExperienceModel> {
        return await this.repository.save(workExperience);
    }

    async deleteWorkExperience(user: UserModel, workExperienceId: number): Promise<WorkExperienceModel | null> {
        let workExperienceToDelete = await this.repository.findOne({
            where: {
                id: workExperienceId,
                user: user.id
            }
        });
        if (workExperienceToDelete) {
            return await this.repository.remove(workExperienceToDelete);
        }

        return null;
    }
}

