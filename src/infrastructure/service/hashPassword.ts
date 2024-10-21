import IhashPassword from "../../interface/services/IhashPassword";
import bcrypt from "bcrypt"

class hashPassword implements IhashPassword {
    async hash(password: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(password,10);
        return hashedPassword;
    }
}

export default hashPassword;