import { ExamRepository } from "../repositories/ExamRepository";


interface SubmittedAnswer{
    question_id: number;
    choice_id: number | null;
}

export const MyExamService = {
    async getAvailableExams(studentId: number){
        return ExamRepository.findAvailableForStudent(studentId);
    }
}