import type { FastifyInstance } from "fastify";
import { authStorage } from "./storage";
import { isAuthenticated } from "./replitAuth";

export async function registerAuthRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get("/api/auth/user", async (request, reply) => {
    const authenticated = await isAuthenticated(request, reply);
    if (!authenticated) return;

    try {
      const userId = request.userSession?.claims?.sub;
      if (!userId) {
        return reply.status(401).send({ message: "Unauthorized" });
      }
      
      const user = await authStorage.getUser(userId);
      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }
      
      return reply.send(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      request.log.error({ error }, "Failed to fetch user");
      return reply.status(500).send({ message: "Failed to fetch user" });
    }
  });
}
