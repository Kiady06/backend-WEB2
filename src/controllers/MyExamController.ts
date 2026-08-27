import { Request,Response,NextFunction } from "express";
import { MyExamService } from "../services/MyExamService";

export const MyExamController ={
    async getAvailableExams(req:Request,res:Response,next:NextFunction){
        try{
            const studentId= (req as any).user.id;
            const exams = await MyExamService.getAvailableExams(studentId);
            res.status(200).json(exams);
        }catch (err){
            next(err);
        }
    },

    async getExamToTake(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = (req as any).user.id;
      const examId = Number(req.params.id);
      const data = await MyExamService.getExamToTake(studentId, examId);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },

  async submitExam(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = (req as any).user.id;
      const examId = Number(req.params.id);
      const { answers } = req.body;
      const result = await MyExamService.submitExam(studentId, examId, answers || []);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
}