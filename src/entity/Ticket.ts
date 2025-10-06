export interface Ticket {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    instructorId?: string | null;
    instructorName?: string | null;
    courseId?: string | null;
    courseName?: string | null;
    description: string;
    attachments?: string | null;      
    status: string;
    adminRemarks?: string | null;
    createdAt: Date;
  }
  