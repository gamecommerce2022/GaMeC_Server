import * as nodemailer from 'nodemailer'

export class AuthenticationUtil {
    public static transporter = nodemailer.createTransport({
        service: 'outlook',
        port: 465,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD,
        },
    })
    public static options = {
        from: 'ecommerce_uit@outlook.com',
        to: 'thinhnd@unicloud.com.vn',
        subject: 'Sending email with node.js',
        text: "wow! That's simple",
    }
    public static sendVerificationEmail(email: string) {
        const transporter = nodemailer.createTransport({
            service: 'outlook',
            port: 465,
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PASSWORD,
            },
        })
        const options = {
            from: 'ecommerce_uit@outlook.com',
            to: 'thinhnd@unicloud.com.vn',
            subject: 'Sending email with node.js',
            text: "wow! That's simple",
        }
        transporter.sendMail(options, function (err, info) {
            if (err) {
                console.log(err)
                return
            }
            console.log('Sent' + info.response)
        })
    }
}
