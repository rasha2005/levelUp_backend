interface User {
    id?:string,
    img?:string | null,
    name:string,
    email:string,
    mobile:string,
    password:string,
    isBlocked:Boolean
}

export default User