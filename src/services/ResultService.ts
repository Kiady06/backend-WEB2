import { attemptRepository } from "../repositories/AttemptRepository";
import { ExamRepository } from "../repositories/ExamRepository";
import { NotFoundError } from "./errors/CommonErrors";


const PASS_THRESHOLD = 0.5;

export const resultService = {
  async getResultsForExam(examId: number) {
    const exam = await ExamRepository.findById(examId);
    if (!exam) throw new NotFoundError("Exam not found");

    const attempts = await attemptRepository.findAllByExam(examId);

    return attempts.map((a: any) => {
      const ratio = a.total_points > 0 ? a.score / a.total_points : 0;
      return {
        student_email: a.student_email,
        score: a.score,
        total_points: a.total_points,
        admitted: ratio >= PASS_THRESHOLD,
        submitted_at: a.submitted_at,
      };
    });
  },
};