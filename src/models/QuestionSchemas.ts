import { z } from "zod";

export const createChoiceSchema = z.object({
    text: z.string().min(1, "Choice text is required"),
    is_correct: z.boolean(),
});

export const createQuestionSchema = z.object({
    statement: z.string().min(1, "Statement is required"),
    points: z.number().int().min(1).optional().default(1),
    position: z.number().int().optional().default(1),
    choices: z
        .array(createChoiceSchema)
        .min(2, "A question must have between 2 and 6 choices")
        .max(6, "A question must have between 2 and 6 choices")
        // RG-04 : exactement un choix correct
        .refine(
            (choices) => choices.filter((c) => c.is_correct).length === 1,
            { message: "A question must have exactly one correct choice" }
        ),
});

export const updateQuestionSchema = createQuestionSchema;

export const choiceSchema = z.object({
    id: z.number().int().positive(),
    text: z.string().min(1),
    is_correct: z.boolean(),
});

export const questionSchema = z.object({
    id: z.number().int().positive(),
    exam_id: z.number().int().positive(),
    statement: z.string().min(1),
    points: z.number().int().positive(),
    position: z.number().int(),
    choices: z.array(choiceSchema),
});

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
export type QuestionDTO = z.infer<typeof questionSchema>;