interface Slot {
    title:string;
    startTime:Date;
    endTime:Date;
    roomId:string,
    userId?:string | null;
    instructorId:string;
    courseBundleId?:string | null
}

export default Slot;