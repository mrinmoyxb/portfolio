import { FastifyInstance } from "fastify";
import { controllerStats } from "../controllers/controllers.stats";

export async function getCoding(fastify: FastifyInstance){
    fastify.get("/api/coding", controllerStats);
}