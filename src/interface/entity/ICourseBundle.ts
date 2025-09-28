export default interface ICourseBundle {               
    name: string;                
    thumbnail?: string | null;          
    description: string;        
    price: number;               
    participantLimit: number;    
    startDate: string;         
    endDate: string;            
    isFreeTrial: boolean;        
   
    
}