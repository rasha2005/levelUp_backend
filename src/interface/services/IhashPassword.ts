interface IhashPassword {
    hash(password:string):Promise<string>
}

export default IhashPassword;