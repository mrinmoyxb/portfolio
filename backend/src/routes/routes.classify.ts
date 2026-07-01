import { FastifyInstance } from "fastify";
import { classifyController } from "../controllers/controllers.classify";

export async function registeredClassifyRoute(app: FastifyInstance){
    app.post("/api/classify/", {
        config: {
            rateLimit: {
                max: 5,
                timeWindow: "1 hour"
            }
        }
    }, classifyController)
}