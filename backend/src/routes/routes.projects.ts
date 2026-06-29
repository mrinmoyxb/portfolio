import { FastifyInstance } from "fastify";
import { controllerProject } from "../controllers/controllers.projects";

export async function getProjects(fastify: FastifyInstance){
    fastify.get("/api/projects", controllerProject);
}