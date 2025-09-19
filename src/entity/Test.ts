export interface Test {
    id: string;
    slotId: string;
    questions: string[];
    score?: number | null;    
    attended: boolean;
    createdAt: Date;
}  