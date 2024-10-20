interface IsendEmailOtp {
    sendEmail(email:string , otp:string):Promise<void>
}

export default IsendEmailOtp;