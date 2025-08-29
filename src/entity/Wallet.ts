import Instructor from "./Instructor"

export interface Wallet {
    id:string
    balance:number
    instructor?:Instructor
    instructorId:string
    transaction?:Transaction
}

export interface Transaction {
    id:string
    amount:number
    type:string
    wallet:Wallet
    walletId:string
    createdAt:Date
}