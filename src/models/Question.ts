export interface Choice {
    id: number;
    question_id: number;
    text: string;
    is_correct: boolean;
}

export interface Question {
    id: number;
    exam_id: number;
    statement: string;
    points: number;
    position: number;
    created_at: Date;
}

export interface CreateChoice {
    text: string;
    is_correct: boolean;
}

export interface CreateQuestion {
    statement: string;
    points: number;
    position: number;
    choices: CreateChoice[];
}

export interface UpdateQuestion {
    statement: string;
    points: number;
    position: number;
    choices: CreateChoice[];
}

export interface ChoiceDTO {
    id: number;
    text: string;
    is_correct: boolean;
}

export interface QuestionDTO {
    id: number;
    exam_id: number;
    statement: string;
    points: number;
    position: number;
    choices: ChoiceDTO[];
}