import { FastifyInstance } from "fastify";
import { controllerHealth } from "../controllers/controllers.health";

export async function getHealth(fastify: FastifyInstance){
    fastify.get("/api/health/", controllerHealth);
}