import { FastifyReply, FastifyRequest } from "fastify";
import { projects } from "../staticDB/db.projects";

export async function controllerProject(request: FastifyRequest, reply: FastifyReply){
    return reply.send({projects: projects});
}

