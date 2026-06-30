import { FastifyRequest, FastifyReply } from "fastify";
import nodemailer from "nodemailer";

interface ContactBody {
    name: string;
    email: string;
    message: string;
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

export async function submitContact(
    request: FastifyRequest<{Body:ContactBody}>,
    reply: FastifyReply)
{


    console.log("user: ✅",process.env.GMAIL_USER);
    
    const { name, email, message } = request.body;
    console.log("name: ✅", name);
    if(!name?.trim() || !email?.trim() || !message?.trim()){
        return reply.code(400).send({error: "All fields are required"});
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return reply.status(400).send({error: "Invalid email address"});
    } 

    if(message.trim().length < 10){
        return reply.status(400).send({error: "Message too short"});
    }

    if(message.trim().length > 2000){
        return reply.status(400).send({error: "Message too long"});
    }

    try{
        await transporter.sendMail({
            from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
            to: process.env.CONTACT_RECEIVER,
            replyTo: email,
            subject: `Portfolio message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
            html: `
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <hr/>
                <p>${message.replace(/\n/g, "<br/>")}</p>
            `
        });
        return reply.status(200).send({success: true});
    }catch(err){
        request.log.error(err);
        return reply.status(500).send({error: "Failed to send message. Try again"})
    }

}

