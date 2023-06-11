import { WorkExperienceModel } from "../models/WorkExperienceModel";
import { LoginService } from "../services/LoginService";
import { Request, Response } from "express";
import { WorkExperienceService } from "../services/WorkExperienceService";

export class WorkExperienceController {
    private static instance: WorkExperienceController;
    private loginService = LoginService.getInstance();
    private workExperienceService = WorkExperienceService.getInstance();

    private constructor() { }

    static getInstance(): WorkExperienceController {
        if (!WorkExperienceController.instance) {
            WorkExperienceController.instance = new WorkExperienceController();
        }

        return WorkExperienceController.instance;
    }

    async createWorkExperience(req: Request, res: Response) {
        let user = await this.loginService.getUserInRequest(req);
        let incomingExperience = {
            ...req.body,
        }

        if (WorkExperienceModel.isValidExperience(incomingExperience)) {

            let initialDate = this.convertStringToDate(incomingExperience.initialDate);
            let endDate = this.convertStringToDate(incomingExperience.endDate);

            let experience = new WorkExperienceModel(user!.id, incomingExperience.name, incomingExperience.enterprise, incomingExperience.country, incomingExperience.region, incomingExperience.city, initialDate, endDate, incomingExperience.description);

            let result = await this.workExperienceService.createWorkExperience(experience);
            return res.status(201).send(result);
        }

        return res.status(400).send("Invalid experience");
    }

    async getWorkExperiencesByUserId(req: Request, res: Response) {
        let user = req.params.username;
        if (user) {
            let experiences = await this.workExperienceService.getWorkExperiencesByUserId(user);
            return res.status(200).send(experiences);
        }

        return res.status(404).send("User not found");
    }

    async updateWorkExperience(req: Request, res: Response) {
        let user = await this.loginService.getUserInRequest(req);
        let experienceId = parseInt(req.params.id) || null;
        let incomingExperience = {
            ...req.body,
        }

        if (WorkExperienceModel.isValidExperience(incomingExperience) && experienceId && user) {
            let unupdatedExperience = await this.workExperienceService.getWorkExperienceById(user, experienceId) as any;

            if (unupdatedExperience) {
                incomingExperience.initialDate = this.convertStringToDate(incomingExperience.initialDate);
                incomingExperience.endDate = this.convertStringToDate(incomingExperience.endDate);

                let hasChanges = false;
                Object.getOwnPropertyNames(incomingExperience).forEach((value: string) => {
                    if (incomingExperience[value] != unupdatedExperience[value]) {
                        unupdatedExperience[value] = incomingExperience[value];
                        hasChanges = true;
                    }
                });

                if (hasChanges) {
                    let result = await this.workExperienceService.updateWorkExperience(unupdatedExperience);
                    return res.status(200).send(result);
                }

                return res.status(304).send("No changes were made");
            }

            return res.status(404).send("Experience not found");
        }

        return res.status(400).send("Invalid experience");
    }

    async deleteWorkExperienceById(req: Request, res: Response) {
        let user = await this.loginService.getUserInRequest(req);
        let experienceId = parseInt(req.params.id) || null;

        if (experienceId && user) {
            let result = await this.workExperienceService.deleteWorkExperience(user, experienceId);

            if (result != null) return res.status(200).send(result);
            else return res.status(404).send("Experience not found");
        }

        return res.status(400).send("Invalid experience id");
    }

    private convertStringToDate(date: string): Date {
        let newDate = new Date();
        date.split(/[\/-]/).forEach((value: string, index: number) => {
            if (index == 0) {
                newDate.setFullYear(parseInt(value));
            } else if (index == 1) {
                newDate.setMonth(parseInt(value) - 1);
            } else {
                newDate.setDate(parseInt(value));
            }
        });

        return newDate;
    }

    private areDatesValid(initialDate: Date, endDate: Date): boolean {
        return initialDate.getTime() <= endDate.getTime();
    }
}