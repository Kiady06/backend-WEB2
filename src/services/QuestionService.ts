import { QuestionRepository } from "../repositories/QuestionRepository";
import { Question, Choice, QuestionDTO } from "../models/Question";
import {
    CreateQuestionInput,
    UpdateQuestionInput,
} from "../models/QuestionSchemas";
import { NotFoundError, ConflictError } from "./errors/CommonErrors";

const toQuestionDTO = (question: Question, choices: Choice[]): QuestionDTO => ({
    id: question.id,
    exam_id: question.exam_id,
    statement: question.statement,
    points: question.points,
    position: question.position,
    choices: choices.map((c) => ({
        id: c.id,
        text: c.text,
        is_correct: c.is_correct,
    })),
});

const listForExam = async (examId: number): Promise<QuestionDTO[]> => {
    const exists = await QuestionRepository.examExists(examId);
    if (!exists) {
        throw new NotFoundError("Exam not found");
    }

    const [questions, choices] = await Promise.all([
        QuestionRepository.findByExamId(examId),
        QuestionRepository.findChoicesByExamId(examId),
    ]);

    const choicesByQuestion = new Map<number, Choice[]>();
    for (const c of choices) {
        const list = choicesByQuestion.get(c.question_id) ?? [];
        list.push(c);
        choicesByQuestion.set(c.question_id, list);
    }

    return questions.map((q) =>
        toQuestionDTO(q, choicesByQuestion.get(q.id) ?? [])
    );
};

const create = async (
    examId: number,
    input: CreateQuestionInput
): Promise<QuestionDTO> => {
    const exists = await QuestionRepository.examExists(examId);
    if (!exists) {
        throw new NotFoundError("Exam not found");
    }

    const locked = await QuestionRepository.examHasAttempts(examId);
    if (locked) {
        throw new ConflictError(
            "Cannot modify questions of an exam that has attempts"
        );
    }

    const { question, choices } = await QuestionRepository.create(examId, input);
    return toQuestionDTO(question, choices);
};

const update = async (
    id: number,
    input: UpdateQuestionInput
): Promise<QuestionDTO> => {
    const existing = await QuestionRepository.findById(id);
    if (!existing) {
        throw new NotFoundError("Question not found");
    }

    const locked = await QuestionRepository.examHasAttempts(existing.exam_id);
    if (locked) {
        throw new ConflictError(
            "Cannot modify questions of an exam that has attempts"
        );
    }

    const result = await QuestionRepository.update(id, input);
    if (!result) {
        throw new NotFoundError("Question not found");
    }

    return toQuestionDTO(result.question, result.choices);
};

const remove = async (id: number): Promise<void> => {
    const existing = await QuestionRepository.findById(id);
    if (!existing) {
        throw new NotFoundError("Question not found");
    }

    const locked = await QuestionRepository.examHasAttempts(existing.exam_id);
    if (locked) {
        throw new ConflictError(
            "Cannot modify questions of an exam that has attempts"
        );
    }

    await QuestionRepository.remove(id);
};

export const QuestionService = {
    listForExam,
    create,
    update,
    remove,
};