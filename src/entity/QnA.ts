interface QnA {
    id:string;
    courseId:string
    userId:string;
    userName:string | null;
    userImg:string | null;
    message:string;
    parentId:string|null;
    createdAt:Date
}

export default QnA