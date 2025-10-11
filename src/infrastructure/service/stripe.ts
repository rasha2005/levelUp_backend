import Istripe from "../../interface/services/Istripe";
import Stripe from "stripe";

const stripeApi = new Stripe(process.env.STRIPE_SECRET_KEY || "");

class stripe implements Istripe {
    constructor() {}

   async stripePayement(info: any , userId:any): Promise<any> {
        try {

            const {title , start , end , price , instructorId , id , roomId} = info;

            const session = await stripeApi.checkout.sessions.create({
                payment_method_types:["card"],
                mode:"payment",
                line_items:[
                    {
                        price_data:{
                            currency:"inr",
                            product_data:{
                                name:title
                            },
                            unit_amount:price * 100
                        },
                        quantity:1
                    },
                ],
                success_url: `${process.env.FRONT_URL}/user/paymentSuccess`,
                cancel_url: `${process.env.FRONT_URL}/user/paymentCancel`,
                metadata:{
                    type: "slot",
                    title , 
                    start ,
                    end , 
                    price , 
                    instructorId , 
                    id , 
                    roomId ,
                    userId
                }
            })
           
return session.url;
        }catch(err) {
            console.log(err);
        }
    }

    async stripeCoursePayment(info: any, userId: string): Promise<any> {
        try{
            const {id , name , startDate , endDate , instructorId , price} = info

            const session = await stripeApi.checkout.sessions.create({
                payment_method_types:["card"],
                mode:"payment",
                line_items:[
                    {
                        price_data:{
                            currency:"inr",
                            product_data:{
                                name:name
                            },
                            unit_amount:price * 100
                        },
                        quantity:1
                    },
                ],
                success_url: `${process.env.FRONT_URL}/user/paymentSuccess`,
                cancel_url: `${process.env.FRONT_URL}/user/paymentCancel`,
                metadata:{
                    type: "course",
                    courseId:id ,
                    name ,
                    startDate ,
                    endDate ,
                    instructorId ,
                    price , 
                    userId
                }
            })
           
        return session.url;
        }catch(err) {
            console.log(err);
        }
    

        
    }
}

export default stripe;