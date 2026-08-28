import { ExamRepository } from "../repositories/ExamRepository";
import { CourseRepository } from "../repositories/CourseRepository";
import { BadRequestError,ConflictError, NotFoundError } from "./errors/CommonErrors";

export const ExamService = {
    async getAll() {
    return ExamRepository.findAll();
  },

  async getById(id: number) {
    const exam = await ExamRepository.findById(id);
    if (!exam) throw new NotFoundError("Exam not found");
    return exam;
  },

   async create(
    courseId: number,
    name: string,
    description: string,
    startDate: string,
    endDate: string
  ) {
    if (!courseId || !name || !startDate || !endDate) {
      throw new BadRequestError("All fields are required");
    }

    const course = await CourseRepository.findById(courseId);
    if (!course) throw new NotFoundError("Exam not found");

    if (new Date(endDate) <= new Date(startDate)) {
      throw new BadRequestError("The end date must be after the start date");
    }
    return ExamRepository.create(courseId, name, description,startDate, endDate);
  },

   async update(id: number, name: string, description: string, startDate: string, endDate: string) {
    const exam = await ExamRepository.findById(id);
    if (!exam) throw new NotFoundError("Exam not found");

    if (new Date(endDate) <= new Date(startDate)) {
      throw new BadRequestError("The end date must be after the start date");
    }

    const updated = await ExamRepository.update(id, name, description, startDate, endDate);
    return updated;
  },

  async remove(id: number) {
    const exam = await ExamRepository.findById(id);
    if (!exam) throw new NotFoundError("Exam not found");

    const attemptCount = await ExamRepository.countAttemptsForExam(id);
    if (attemptCount > 0) {
      throw new ConflictError("Cannot delete an exam that has attempts");
    }
    await ExamRepository.remove(id);
  },
}
