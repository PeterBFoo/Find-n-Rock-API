import { Request, Response, Router } from 'express';
import { WorkExperienceController } from '../controllers/WorkExperienceController';
const router = Router();
const workExperienceController = WorkExperienceController.getInstance();

router.get('/get/experiences', (req: Request, res: Response) => {
    return workExperienceController.getWorkExperiencesByUserId(req, res);
});

router.post('/create/experience', async (req: Request, res: Response) => {
    return workExperienceController.createWorkExperience(req, res);
});

router.put('/update/experience/:id', async (req: Request, res: Response) => {
    return workExperienceController.updateWorkExperience(req, res);
});

router.delete('/delete/experience/:id', async (req: Request, res: Response) => {
    return workExperienceController.deleteWorkExperienceById(req, res);
});

export default router;