export interface Question{
    id: number;
    exam_id: number;
    statement: string;
    points: number;
    created_at: Date;
}

export interface Choice{
    id: number;
    question_id: number;
    choice_text: string;
    is_correct: boolean;
}