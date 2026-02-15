import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.CONTACT_EMAIL,
            pass: process.env.CONTACT_EMAIL_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: `"EXR Store" <${process.env.CONTACT_EMAIL}>`,
        to,
        subject,
        html,
    });
};

export default sendEmail;