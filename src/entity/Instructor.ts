interface  Instructor {
    id?:string,
    img?:string | null,
    name:string , 
    email:string,
    mobile:string,
    password:string,
    description?: string | null;  
    category?: string | null;    
    experience?: string | null;  
    resume?: string | null;       
    isApproved?: boolean;   



}

export default Instructor;