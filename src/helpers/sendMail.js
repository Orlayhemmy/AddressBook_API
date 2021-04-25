/* eslint-disable no-console */
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.GMAIL_HOST,
    port: process.env.GMAIL_PORT,
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
    }
})

const sendMail = async ({ receiver, subject, text }) => {
    const message = {
        from: process.env.GMAIL_USERNAME,
        to: receiver,
        subject,
        text
    }

    await transporter.sendMail(message)
}

export default sendMail
