import jwt from 'jsonwebtoken';
import IgenerateOtp from "../../interface/services/IgenerateOtp";

class generateOtp implements IgenerateOtp {
    constructor(){}

    createOtp(): string {
       
        return Math.floor(100000 + Math.random() * 900000).toString() 
    

    }
}

export default generateOtp;