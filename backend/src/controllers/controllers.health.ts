import { FastifyReply, FastifyRequest } from "fastify";

export async function controllerHealth(request: FastifyRequest, reply: FastifyReply){
    return reply.send({msg: "Server is healthy 🚀"});
}