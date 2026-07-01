import { FastifyReply, FastifyRequest } from "fastify";
import { checkFirewall } from "../security/security.firewall";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "../security/security.systemPrompt";

interface ClassifyBody {
    message: string
}

export async function classifyController(request: FastifyRequest<{Body: ClassifyBody}>, reply: FastifyReply){
    const { message } = request.body;

    if(!message || typeof message !== "string"){
        return reply.status(400).send({error: "Message is required"});
    }

    const sanitized = message
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
        .trim();
    
    if(sanitized.length === 0) return reply.status(400).send({error: "Message cannot be empty."});
    if(sanitized.length > 500) return reply.status(400).send({error: "Message too long. Keep it under 500 characters."});

    const firewall = checkFirewall(sanitized);
    if(firewall.blocked){
        return reply.status(403).send({error: firewall.reason});
    }

    try{
        const client = new Anthropic();
        const response = await client.messages.create({
            model: "claude-sonnet-4-6",
            max_tokens: 300,
            system: SYSTEM_PROMPT,
            messages: [
                {role: "user", content: sanitized}
            ]
        });

        const raw = response.content[0].type === "text" ? response.content[0].text : "";
        
        const filtered = raw.replace(/system prompt|my instructions|i was told to|as instrcuted/gi, "")
                            .slice(0, 1000)
                            .trim();

        return reply.status(200).send({response: filtered});

    }catch(error){
        request.log.error(error);
        return reply.status(500).send({error: "Something went wrong. Try again"});
    }
}