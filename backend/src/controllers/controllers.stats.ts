import { FastifyReply, FastifyRequest } from "fastify";
import { HackerRank, LeetCode } from "../staticDB/db.stats";

export async function controllerStats(request: FastifyRequest, reply: FastifyReply){
    return reply.send({leetcode: LeetCode, hackerRank: HackerRank});
}