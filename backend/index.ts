import dotenv from "dotenv";
import Fastify from "fastify";
import { connectDB } from "./db";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rareLimit from "@fastify/rate-limit";

const app = Fastify({logger: true});


