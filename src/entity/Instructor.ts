import Chat from "./Chat";
import { Session } from "./Session";
import { Wallet } from "./Wallet";

interface  Instructor {
    id?:string,
    img?:string | null,
    name:string , 
    email:string,
    mobile:string,
    password?:string,
    description?: string | null;  
    category?: string | null;    
    experience?: string | null;  
    resume?: string | null;       
    isApproved?: boolean;   
    scheduledSession? : Session | null
    wallet?:Wallet | null
    chats? : Chat[] | null
    rating? : number | null
    specializations?  : string[] | null



}

export default Instructor;