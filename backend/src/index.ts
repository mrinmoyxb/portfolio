import "dotenv/config";

import Fastify, { fastify } from "fastify";
import staticPlugin from "@fastify/static";
import path from "path";
import { getHealth } from "./routes/routes.health";
import { getProjects } from "./routes/routes.projects";
import { getCertificates } from "./routes/routes.certs";
import cors from "@fastify/cors";
import { getCoding } from "./routes/routes.stats";
import rateLimit from "@fastify/rate-limit";
import { registerContactRoute } from "./routes/routes.contacts";
import { loadSecrets } from "./config/secrets";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { registeredClassifyRoute } from "./routes/routes.classify";

const app = Fastify({ logger: true, ignoreTrailingSlash: true, trustProxy: true });

const shutdown = async (signal: string) => {
    app.log.info(`Received ${signal}, shutting down...`);
    await app.close();
    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

const start = async () => {
    try {
        await loadSecrets();

        await app.register(cors, {
            origin: ["http://localhost:2610", "http://3.6.237.123"],
            methods: ["GET", "POST"]
        })

        await app.register(rateLimit, {
            global: false,
            errorResponseBuilder: () => ({
                error: "Too many messages sent. Try again in an hour"
            })
        })

        await app.register(swagger, {
            openapi: {
                info: {
                    title: 'Portfolio API',
                    description: 'API documentation for portfolio backend',
                    version: '1.0.0'
                },
                servers: [
                    { url: 'http://3.6.237.123', description: 'Production' },
                    { url: 'http://localhost:2610', description: 'Local' }
                ]
            }
        });

        await app.register(swaggerUi, {
            routePrefix: '/docs',
            uiConfig: {
                docExpansion: 'list',
                deepLinking: false
            }
        });

        app.register(getHealth)
        app.register(getProjects);
        app.register(getCertificates);
        app.register(getCoding);
        await registerContactRoute(app);
        await registeredClassifyRoute(app);

        app.register(staticPlugin, {
            root: path.join(__dirname, "../../frontend"),
            prefix: "/"
        });

        await app.listen({ port: 2610, host: "0.0.0.0" });

    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();