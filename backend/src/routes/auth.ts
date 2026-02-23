import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export async function authRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get('/user', async (request, reply) => {
    const userId = request.cookies['userId'];
    
    if (!userId) {
      return reply.status(401).send({ error: 'Not authenticated' });
    }

    const user = await fastify.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    return user;
  });

  fastify.post('/logout', async (request, reply) => {
    reply.clearCookie('userId');
    return { success: true };
  });
}
