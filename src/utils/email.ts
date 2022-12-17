import { google } from 'googleapis'
import * as nodemailer from 'nodemailer'

export default class EmailUtil {
    public static sendEmail = async (from: string, to: string, subject: string, html: string) => {
        const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET)
        oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })
        const accessToken = await oauth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_ADDRESS,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token || '',
            },
        })
        transport.sendMail({ from: from, to: to, subject: subject, html: html }, (err, info) => {
            console.log(info.envelope)
        })
    }
}
