export interface Attempt {
    id: number;
    student_id: number;
    exam_id: number;
    score: number;
    total_points: number;
    submitted_at: Date;
}

export interface Answer{
    id: number;
    attempt_id:number;
    quesion_id:number;
    choice_id: number | null;
}