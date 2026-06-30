import { FastifyInstance } from "fastify";
import { submitContact } from "../controllers/controllers.contact";

export async function postContact(fastify: FastifyInstance){
    fastify.post("/api/contact/", submitContact);
}