import User from "../../entity/User";

export class UserDTO {
    id?:string;
    img?:string | null
    name:string;
    email:string;
    mobile?:string | null;
    isBlocked:boolean

    constructor(user:User) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.img = user.img || null;
        this.mobile = user.mobile || null;
        this.isBlocked = user.isBlocked;
    }

    static  fromEntity(user:User):UserDTO {
        return new UserDTO(user);
    }
}
