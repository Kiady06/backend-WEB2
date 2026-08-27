import { ExamRepository } from "../repositories/ExamRepository";
import { NotFoundError } from "./errors/CommonErrors";
import { AppError } from "./errors/AppError";
import { attemptRepository } from "../repositories/attemptRepository";
import { QuestionService } from "./QuestionService";

interface SubmittedAnswer{
    question_id: number;
    choice_id: number | null;
}

export const MyExamService = {
    async getAvailableExams(studentId: number){
        return ExamRepository.findAvailableForStudent(studentId);
    },

    async getExamToTake(studentId: number, examId: number) {
    const exam = await ExamRepository.findById(examId);
    if (!exam) throw new NotFoundError("Exam not found");

    const now = new Date();
    if (now < new Date(exam.start_date) || now > new Date(exam.end_date)) {
      throw new AppError("This exam is not currently available", 403);
    }

    const existingAttempt = await attemptRepository.findByStudentAndExam(
      studentId,
      examId
    );
    if (existingAttempt) {
      throw new AppError("You have already taken this exam", 409);
    }

    const questions = await QuestionService.listForExam(examId);
    return { exam, questions };
  }
}

