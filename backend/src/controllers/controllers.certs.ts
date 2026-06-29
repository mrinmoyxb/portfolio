import { FastifyRequest, FastifyReply } from "fastify";
import { certs } from "../staticDB/db.certs";

export async function controllerCert(request: FastifyRequest, reply: FastifyReply){
    return reply.send({certs: certs})
}