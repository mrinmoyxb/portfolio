import { FastifyInstance } from "fastify";
import { controllerCert } from "../controllers/controllers.certs";

export async function getCertificates(fastify: FastifyInstance){
    fastify.get("/api/certs",controllerCert);
}