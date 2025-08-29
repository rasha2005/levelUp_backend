import Chat from "../../entity/Chat";
import Instructor from "../../entity/Instructor";
import { Session } from "../../entity/Session";
import { Wallet } from "../../entity/Wallet";

export class InstructorDTO {
    id?:string;
    img?:string | null;
    name:string ;
    email:string;
    mobile:string;
    description?: string | null;  
    category?: string | null;    
    experience?: string | null;  
    resume?: string | null;       
    scheduledSession? : Session | null
    wallet?:Wallet | null
    chats? : Chat[] | null
    rating? : number | null
    isApproved?: boolean

    constructor(instructor: Instructor) {
        this.id = instructor.id;
        this.img = instructor.img || null;
        this.name = instructor.name;
        this.email = instructor.email;
        this.mobile = instructor.mobile;
        this.description = instructor.description || null;
        this.category = instructor.category || null;
        this.experience = instructor.experience || null;
        this.resume = instructor.resume || null;
        this.scheduledSession = instructor.scheduledSession || null;
        this.wallet = instructor.wallet || null;
        this.chats = instructor.chats || null;
        this.rating = instructor.rating || null;
        this.isApproved = instructor.isApproved
    }
    

    static  fromEntity(instructor:Instructor):InstructorDTO {
        return new InstructorDTO(instructor)
    }
}
