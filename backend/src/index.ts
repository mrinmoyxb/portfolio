import Fastify from "fastify";
import staticPlugin from "@fastify/static";
import path from "path";
import { getHealth } from "./routes/routes.health";

const app = Fastify({logger: true});

app.register(getHealth)

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