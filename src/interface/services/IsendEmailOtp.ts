interface IsendEmailOtp {
    sendEmail(email:string , otp:string):Promise<void>
    sendReminder(email:string , name:string): Promise<void>
}

export default IsendEmailOtp;