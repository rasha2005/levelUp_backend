interface Istripe {
    stripePayement(info:any ,  userId:any):Promise<any>
    stripeCoursePayment(info:any , userId:string):Promise<any>
}

export default Istripe