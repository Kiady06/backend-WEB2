import { z } from "zod";

export const examCreateSchema = z
  .object({
    course_id: z.number().int().positive(),
    name: z.string().min(1).max(255),
    description: z.string().optional().nullable(), 
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
  })
  .refine((data) => data.end_date > data.start_date, {
    message: "end_date doit être postérieure à start_date",
    path: ["end_date"],
  });

export const examUpdateSchema = z
  .object({
    course_id: z.number().int().positive().optional(),
    name: z.string().min(1).max(255).optional(),
    description: z.string().optional().nullable(),
    start_date: z.coerce.date().optional(),
    end_date: z.coerce.date().optional(),
  })
  .refine(
    (data) =>
      !data.start_date || !data.end_date || data.end_date > data.start_date,
    {
      message: "end_date doit être postérieure à start_date",
      path: ["end_date"],
    }
  );

export type ExamCreateInput = z.infer<typeof examCreateSchema>;
export type ExamUpdateInput = z.infer<typeof examUpdateSchema>;