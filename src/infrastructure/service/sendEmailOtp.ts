import nodemailer from 'nodemailer'
import mailgen from 'mailgen';
import IsendEmailOtp from "../../interface/services/IsendEmailOtp";

class sendEmailOtp implements IsendEmailOtp {
    constructor() {}

    async sendEmail(email:string , otp:string) {
        const config = {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,  
                pass: process.env.PASSWORD 
            }
        };

        // Create transport
        const transporter = nodemailer.createTransport(config);

        // Configure Mailgen
        const mailGenerator = new mailgen({
            theme: "default",
            product: {
                name: "rasha",
                link: 'https://mailgen.js/'  
            }
        });

        // Generate email content
        const response = {
            body: {
                name: "rasha",
                intro: "This is Aysha Rasha.C",
                table: {
                    data: [
                        {
                            description: `Your OTP is ${otp}` // Include the OTP in the message
                        }
                    ]
                },
                outro: "Thank you for your time. Have a nice day."
            }
        };

        // Generate email HTML using Mailgen
        const mail = mailGenerator.generate(response);

        // Email message options
        const message = {
            from: process.env.EMAIL,    // Sender's email
            to: email,                  // Recipient's email
            subject: "Your OTP Code",   // Email subject
            html: mail                  // Email content in HTML format
        };

        // Send email and handle result or errors
        try {
            await transporter.sendMail(message);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }
}

export default sendEmailOtp;