import "dotenv/config";

import Fastify from "fastify";
import staticPlugin from "@fastify/static";
import path from "path";
import { getHealth } from "./routes/routes.health";
import { getProjects } from "./routes/routes.projects";
import { getCertificates } from "./routes/routes.certs";
import cors from "@fastify/cors";
import { getCoding } from "./routes/routes.stats";
import { postContact } from "./staticDB/db.contact";

const app = Fastify({logger: true, ignoreTrailingSlash: true});

app.register(cors, {
    origin: ["http://localhost:2610", "http://3.6.237.123"],
    methods: ["GET", "POST"]
})

app.register(getHealth)
app.register(getProjects);
app.register(getCertificates);
app.register(getCoding);
app.register(postContact);

app.register(staticPlugin, {
    root: path.join(__dirname, "../../frontend"),
    prefix: "/"
});

const shutdown = async (signal: string) => {
    app.log.info(`Received ${signal}, shutting down...`);
    await app.close();
    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

const start = async () => {
    try{
        await app.listen({port: 2610, host: "0.0.0.0"});
    } catch(err){
        app.log.error(err);
        process.exit(1);
    }
};

start();