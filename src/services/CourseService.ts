import { CourseRepository } from "../repositories/CourseRepository";

import { Course, CourseDTO } from "../models/Course";

import {
    NotFoundError,
    ConflictError,
} from "./errors/CommonErrors";

const toCourseDTO = (course: Course): CourseDTO => ({
    id: course.id,
    code: course.code,
    name: course.name,
    description: course.description,
    createdAt: course.createdAt,
    examCount: course.examCount
});

const list = async (): Promise<CourseDTO[]> => {
    const courses = await CourseRepository.findAll();

    return courses.map(toCourseDTO);
};

const create = async (
    code: string,
    name: string,
    description?: string | null
): Promise<CourseDTO> => {

    const existing = await CourseRepository.findByCode(code);

    if (existing) {
        throw new ConflictError("Course code already in use");
    }

    const course = await CourseRepository.create({
        code,
        name,
        description: description ?? null
    });

    return toCourseDTO(course);
};

interface UpdateCourseInput {
    code: string;
    name: string;
    description?: string | null;
}

const update = async (
    id: number,
    input: UpdateCourseInput
): Promise<CourseDTO> => {

    const existing = await CourseRepository.findById(id);

    if (!existing) {
        throw new NotFoundError("Course not found");
    }

    const existingWithCode =
        await CourseRepository.findByCodeExcludingId(
            input.code,
            id
        );

    if (existingWithCode) {
        throw new ConflictError("Course code already in use");
    }

    const updated = await CourseRepository.update(
        id,
        {
            code: input.code,
            name: input.name,
            description: input.description ?? null
        }
    );

    if (!updated) {
        throw new NotFoundError("Course not found");
    }

    return toCourseDTO(updated);
};

const remove = async (
    id: number
): Promise<void> => {

    const existing = await CourseRepository.findById(id);

    if (!existing) {
        throw new NotFoundError("Course not found");
    }

    const hasExams =
        await CourseRepository.hasExams(id);

    if (hasExams) {
        throw new ConflictError(
            "Cannot delete a course that has exams"
        );
    }

    await CourseRepository.remove(id);
};

export const CourseService = {
    list,
    create,
    update,
    remove,
};