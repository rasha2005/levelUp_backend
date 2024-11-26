export interface Events {
    title : string;
    start : any;
    end   : any;
    price : string;
    status: "open" | "booked";
    scheduledSession? :  any
}

export interface Session {
    id?:string;
    instructorId : string;
    instructor?  : any;
    events       : Events[];
}