import Instructor from "./Instructor";
import Slot from "./Slot";

interface Enrollment {
    id: string;
    userId: string;
    status: string;
    enrolledAt: Date;      
    completedAt?: Date | null;
  }

export default interface CourseBundle {
    id?: string;                 
    name: string;                
    thumbnail?: string | null;          
    description: string;        
    price: number;               
    participantLimit: number;    
    startDate: Date;         
    endDate: Date;            
    isFreeTrial: boolean;        
    status: string; 
    sessionCount?: number;       
    instructorId : string;
    enrollments? : Enrollment[];
}