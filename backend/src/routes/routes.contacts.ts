import { FastifyInstance } from "fastify";
import { submitContact } from "../controllers/controllers.contact";

export async function registerContactRoute(fastify: FastifyInstance){
    fastify.post("/api/contact/", {
        config: {
            rateLimit: {
                max: 3,
                timeWindow: "1 hour"
            }
        }
    }, submitContact);
}