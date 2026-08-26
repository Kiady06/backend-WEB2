import { z } from "zod";

export const createCourseSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
});

export const updateCourseSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
});

export const courseSchema = z.object({
  id: z.number().int().positive(),
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable(),
  createdAt: z.date(),
  examCount: z.number().int().nonnegative(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CourseDTO = z.infer<typeof courseSchema>;