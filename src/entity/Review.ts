import User from "./User";


interface Review {
    id:string,
    value:string,
    instructorId:string,
    userId:string,
    createdAt:Date,
    user?: User
}
export default Review;