interface User {
    id?:string,
    img?:string | null,
    name:string,
    email:string,
    mobile?:string | null,
    password?:string | null,
    isBlocked:boolean
}

export default User