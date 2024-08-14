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

    static sendPasswordResetToken = async (user:IEMail)=>{
        //send email
      const info=  await transporter.sendMail({
            from:'UpTask <admin@uptask.com>',
            to:user.email,
            subject:'UpTask - Reset ypur password',
            html:`<p>Hola: ${user.name}, Have you reset your password </p>
                    <p>Visit the next link</p>
                    <a href="${process.env.FRONTEND_URL}/auth/new-password">Reset password</a>
                    <p>Put the code: <b>${user.token}</b></p>
                    <p>This token will expired in 10 minutes</p>
                    `
        })

        console.log('Message sended',info.messageId);
        

    }
}