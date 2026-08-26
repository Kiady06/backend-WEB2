export interface Course {
    id: number;
    code: string;
    name: string;
    description: string | null;
    created_at: Date;
    exam_count?: number;
}

export interface CreateCourse {
    code: string;
    name: string;
    description?: string | null;
}

export interface UpdateCourse {
    code: string;
    name: string;
    description?: string | null;
}

export interface CourseDTO {
    id: number;
    code: string;
    name: string;
    description: string | null;
    exam_count: number;
}