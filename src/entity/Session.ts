import Instructor from "./Instructor";

export interface Events {
    title : string;
    start : Date;
    end   : Date;
    price : string;
    status: "open" | "booked";
    scheduledSession? : Session
    // hasInstructorJoined : boolean
}

export interface Session {
    id?:string;
    instructorId : string;
    instructor?  : Instructor;
    events       : Events[];
}