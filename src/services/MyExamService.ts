import { ExamRepository } from "../repositories/ExamRepository";
import { NotFoundError ,ConflictError} from "./errors/CommonErrors";
import { AppError } from "./errors/AppError";
import { attemptRepository } from "../repositories/attemptRepository";
import { QuestionService } from "./QuestionService";
import { QuestionRepository } from "../repositories/QuestionRepository";

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
      throw new ConflictError("You have already taken this exam");
    }

    const questions = await QuestionService.listForExam(examId);
    return { exam, questions };
  },

  async submitExam(
    studentId: number,
    examId: number,
    answers: SubmittedAnswer[]
  ) {
    const exam = await ExamRepository.findById(examId);
    if (!exam) throw new AppError("Exam not found", 404);

    const now = new Date();
    if (now < new Date(exam.start_date) || now > new Date(exam.end_date)) {
      throw new AppError("The submission period for this exam has ended", 403);
    }

    const existingAttempt = await attemptRepository.findByStudentAndExam(
      studentId,
      examId
    );
    if (existingAttempt) {
      throw new AppError("You have already submitted this exam", 409);
    }

    const questions = await QuestionRepository.findByExamId(examId);

    let score = 0;
    let totalPoints = 0;
    const correction = [];

    for (const question of questions) {
      totalPoints += question.points;

      const choices = await QuestionRepository.findChoicesByQuestionId(
        question.id
      );

      const submitted = answers.find((a) => a.question_id === question.id);
      const selectedChoiceId = submitted ? submitted.choice_id : null;

      const correctChoice = choices.find((c) => c.is_correct);
      const isCorrect =
        selectedChoiceId !== null &&
        correctChoice !== undefined &&
        selectedChoiceId === correctChoice.id;

      if (isCorrect) {
        score += question.points;
      }

      correction.push({
        question_id: question.id,
        statement: question.statement,
        points: question.points,
        obtained_points: isCorrect ? question.points : 0,
        selected_choice_id: selectedChoiceId,
        correct_choice_id: correctChoice ? correctChoice.id : null,
        choices: choices,
      });
    }

    try {
      const attempt = await attemptRepository.createAttempt(
        studentId,
        examId,
        score,
        totalPoints
      );

      for (const q of questions) {
        const submitted = answers.find((a) => a.question_id === q.id);
        await attemptRepository.saveAnswer(
          attempt.id,
          q.id,
          submitted ? submitted.choice_id : null
        );
      }

      return { score, total_points: totalPoints, correction };
    } catch (err: any) {
      if (err.code === "23505") {
        throw new AppError("You have already submitted this exam", 409);
      }
      throw err;
    }
  },
}

