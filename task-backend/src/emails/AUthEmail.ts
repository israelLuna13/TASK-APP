import { transporter } from "../config/nodemailer"

interface IEMail{
    email:string,
    name:string
    token:string
}
export class AuthEMail{
    static sendConfirmationEmail = async (user:IEMail)=>{
        //send email
      const info=  await transporter.sendMail({
            from:'UpTask <admin@uptask.com>',
            to:user.email,
            subject:'UpTask - Confirm you account',
            html:`<p>Hola: ${user.name}, you have created you account on UpTask, you just need to confirm your account  </p>
                    <p>Visit the following link</p>
                    <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirm you account</a>
                    <p>Put the code: <b>${user.token}</b></p>
                    <p>This token will expired in 10 minutes</p>
                    `
        })

        console.log('Message sended',info.messageId);
        

    }
}