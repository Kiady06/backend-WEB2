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
    }
}