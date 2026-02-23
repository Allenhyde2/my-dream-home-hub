import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { z } from 'zod';
import { isAuthenticated } from '../replit_integrations/auth/index.js';

const updateProfileSchema = z.object({
  nickname: z.string().min(2).max(20).optional(),
  residenceCity: z.string().optional(),
  residenceDistrict: z.string().optional(),
  residenceDong: z.string().optional(),
  targetAreas: z.array(z.object({
    city: z.string(),
    district: z.string(),
    dong: z.string(),
    priority: z.number(),
  })).max(3).optional(),
  purchaseTimeline: z.number().min(1).max(12).optional(),
  availableFunds: z.string().optional(),
  familyTypes: z.array(z.string()).max(3).optional(),
  interests: z.array(z.string()).max(5).optional(),
  onboardingCompleted: z.boolean().optional(),
  rewardPoints: z.number().optional(),
});

export async function userRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.patch('/profile', async (request, reply) => {
    const authenticated = await isAuthenticated(request, reply);
    if (!authenticated) return;

    const userId = request.userSession?.claims?.sub;
    if (!userId) {
      return reply.status(401).send({ error: 'Invalid session' });
    }

    const parseResult = updateProfileSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Invalid data', details: parseResult.error.errors });
    }

    const data = parseResult.data;

    const updateData: Record<string, unknown> = {};
    if (data.nickname !== undefined) updateData.nickname = data.nickname;
    if (data.residenceCity !== undefined) updateData.residenceCity = data.residenceCity;
    if (data.residenceDistrict !== undefined) updateData.residenceDistrict = data.residenceDistrict;
    if (data.residenceDong !== undefined) updateData.residenceDong = data.residenceDong;
    if (data.targetAreas !== undefined) updateData.targetAreas = data.targetAreas;
    if (data.purchaseTimeline !== undefined) updateData.purchaseTimeline = data.purchaseTimeline;
    if (data.availableFunds !== undefined) updateData.availableFunds = data.availableFunds;
    if (data.familyTypes !== undefined) updateData.familyTypes = data.familyTypes;
    if (data.interests !== undefined) updateData.interests = data.interests;
    if (data.onboardingCompleted !== undefined) updateData.onboardingCompleted = data.onboardingCompleted;
    if (data.rewardPoints !== undefined) updateData.rewardPoints = data.rewardPoints;

    const user = await fastify.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return user;
  });

  fastify.get('/profile', async (request, reply) => {
    const authenticated = await isAuthenticated(request, reply);
    if (!authenticated) return;

    const userId = request.userSession?.claims?.sub;
    if (!userId) {
      return reply.status(401).send({ error: 'Invalid session' });
    }

    const user = await fastify.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    return user;
  });
}
