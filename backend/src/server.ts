import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { PrismaClient } from '@prisma/client';
import { userRoutes } from './routes/user.js';
import { setupAuth, registerAuthRoutes } from './replit_integrations/auth/index.js';

const prisma = new PrismaClient();
const fastify = Fastify({ logger: true });

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

fastify.decorate('prisma', prisma);

await fastify.register(cors, {
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
  credentials: true,
});

await fastify.register(cookie, {
  secret: process.env.SESSION_SECRET || 'korean-real-estate-secret-key-change-in-production',
});

await setupAuth(fastify);
await registerAuthRoutes(fastify);

fastify.register(userRoutes, { prefix: '/api/user' });

fastify.get('/api/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3002, host: '0.0.0.0' });
    console.log('Backend server running on http://0.0.0.0:3002');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  await fastify.close();
});

start();
