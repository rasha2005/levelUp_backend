interface IhashPassword {
    hash(password:string):Promise<string>
    compare(password:string , hashedPassword:string):Promise<boolean>
}

export default IhashPassword;