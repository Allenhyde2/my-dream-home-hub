import * as client from "openid-client";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import memoize from "memoizee";
import { authStorage } from "./storage";

interface UserSession {
  claims: any;
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
}

declare module 'fastify' {
  interface FastifyRequest {
    userSession?: UserSession;
  }
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

function updateUserSession(
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
): UserSession {
  const claims = tokens.claims();
  return {
    claims,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: claims?.exp as number | undefined,
  };
}

async function upsertUser(claims: any) {
  await authStorage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
    nickname: claims["nickname"],
    residenceCity: claims["residence_city"],
    residenceDistrict: claims["residence_district"],
    residenceDong: claims["residence_dong"],
    targetAreas: claims["target_areas"],
    purchaseTimeline: claims["purchase_timeline"],
    availableFunds: claims["available_funds"],
    familyTypes: claims["family_types"],
    interests: claims["interests"],
    onboardingCompleted: claims["onboarding_completed"],
  });
}

const getAuthDomain = (request: FastifyRequest) => {
  const devDomain = process.env.REPLIT_DEV_DOMAIN;
  if (devDomain) {
    return devDomain;
  }
  const domains = process.env.REPLIT_DOMAINS?.split(",");
  return domains?.[0] || request.hostname;
};

export async function setupAuth(fastify: FastifyInstance) {
  // MOCK AUTH: If REPL_ID is a dummy, use mock auth for local development
  if (process.env.REPL_ID === 'dummy_text') {
    fastify.log.warn('Using Mock Auth for local development (REPL_ID=dummy_text)');

    fastify.get<{ Querystring: { redirect?: string } }>("/api/login", async (request, reply) => {
      // Create a mock user session
      const mockUser = {
        sub: 'mock-user-123',
        email: 'user@example.com',
        first_name: 'Local',
        last_name: 'User',
        profile_image_url: 'https://placehold.co/100x100?text=LU',
        // Mock Profile Data
        nickname: '부동산왕',
        residence_city: '서울특별시',
        residence_district: '강남구',
        residence_dong: '역삼동',
        target_areas: [
          { city: '서울특별시', district: '서초구', dong: '반포동', priority: 1 },
          { city: '서울특별시', district: '송파구', dong: '잠실동', priority: 2 }
        ],
        purchase_timeline: 6,
        available_funds: '10억 이상',
        family_types: ['1인 가구', '예비 신혼부부'],
        interests: ['청약', '재건축/재개발', '갭투자'],
        onboarding_completed: true,
      };

      await upsertUser(mockUser);

      const userSession: UserSession = {
        claims: mockUser,
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
        expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      };

      const sessionData = JSON.stringify(userSession);
      reply.setCookie('session', Buffer.from(sessionData).toString('base64'), {
        httpOnly: true,
        secure: false, // Local dev usually not https
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
        sameSite: 'lax',
      });

      const redirectUrl = request.query.redirect || '/';
      return reply.redirect(redirectUrl);
    });

    fastify.get<{ Querystring: { redirect?: string } }>("/api/login/test", async (request, reply) => {
      const testUserId = `test-user-${Date.now()}`;
      const mockUser = {
        sub: testUserId,
        email: `test${Date.now()}@example.com`,
        first_name: '테스트',
        last_name: '사용자',
        profile_image_url: 'https://placehold.co/100x100?text=TEST',
        nickname: null,
        residence_city: null,
        residence_district: null,
        residence_dong: null,
        target_areas: null,
        purchase_timeline: null,
        available_funds: null,
        family_types: null,
        interests: null,
        onboarding_completed: false,
      };

      await upsertUser(mockUser);

      const userSession: UserSession = {
        claims: mockUser,
        access_token: 'test_access_token',
        refresh_token: 'test_refresh_token',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
      };

      const sessionData = JSON.stringify(userSession);
      reply.setCookie('session', Buffer.from(sessionData).toString('base64'), {
        httpOnly: true,
        secure: false,
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
        sameSite: 'lax',
      });

      if (request.query.redirect) {
        return reply.redirect(request.query.redirect as string);
      }

      return reply.send({ success: true, userId: testUserId });
    });

    fastify.get("/api/logout", async (request, reply) => {
      reply.clearCookie('session', { path: '/' });
      return reply.redirect('/');
    });

    // We don't need callback for mock auth
    return;
  }

  const config = await getOidcConfig();

  fastify.get("/api/login", async (request, reply) => {
    const domain = getAuthDomain(request);
    const callbackUrl = `https://${domain}/api/callback`;

    const codeVerifier = client.randomPKCECodeVerifier();
    const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);
    const state = client.randomState();

    reply.setCookie('code_verifier', codeVerifier, {
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: 600,
    });
    reply.setCookie('oauth_state', state, {
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: 600,
    });

    const authUrl = client.buildAuthorizationUrl(config, {
      redirect_uri: callbackUrl,
      scope: "openid email profile offline_access",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      state,
      prompt: "login consent",
    });

    return reply.redirect(authUrl.href);
  });

  fastify.get("/api/callback", async (request, reply) => {
    const domain = getAuthDomain(request);
    const callbackUrl = `https://${domain}/api/callback`;

    const codeVerifier = request.cookies['code_verifier'];
    const savedState = request.cookies['oauth_state'];

    if (!codeVerifier) {
      return reply.redirect('/api/login');
    }

    try {
      const url = new URL(request.url, `https://${domain}`);
      const tokens = await client.authorizationCodeGrant(config, url, {
        pkceCodeVerifier: codeVerifier,
        expectedState: savedState,
      });

      const userSession = updateUserSession(tokens);
      await upsertUser(tokens.claims());

      reply.clearCookie('code_verifier');
      reply.clearCookie('oauth_state');

      const sessionData = JSON.stringify(userSession);
      reply.setCookie('session', Buffer.from(sessionData).toString('base64'), {
        httpOnly: true,
        secure: true,
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
        sameSite: 'lax',
      });

      return reply.redirect('/');
    } catch (error) {
      console.error('Auth callback error:', error);
      return reply.redirect('/api/login');
    }
  });

  fastify.get("/api/logout", async (request, reply) => {
    const domain = getAuthDomain(request);

    reply.clearCookie('session');

    const endSessionUrl = client.buildEndSessionUrl(config, {
      client_id: process.env.REPL_ID!,
      post_logout_redirect_uri: `https://${domain}`,
    });

    return reply.redirect(endSessionUrl.href);
  });
}

export async function isAuthenticated(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<boolean> {
  const sessionCookie = request.cookies['session'];

  if (!sessionCookie) {
    reply.status(401).send({ message: "Unauthorized" });
    return false;
  }

  try {
    const sessionData = JSON.parse(Buffer.from(sessionCookie, 'base64').toString());
    const now = Math.floor(Date.now() / 1000);

    if (sessionData.expires_at && now > sessionData.expires_at) {
      if (sessionData.refresh_token) {
        try {
          const config = await getOidcConfig();
          const tokenResponse = await client.refreshTokenGrant(config, sessionData.refresh_token);
          const newSession = updateUserSession(tokenResponse);

          const newSessionData = JSON.stringify(newSession);
          reply.setCookie('session', Buffer.from(newSessionData).toString('base64'), {
            httpOnly: true,
            secure: true,
            path: '/',
            maxAge: 7 * 24 * 60 * 60,
            sameSite: 'lax',
          });

          request.userSession = newSession;
          return true;
        } catch (error) {
          reply.status(401).send({ message: "Unauthorized" });
          return false;
        }
      }
      reply.status(401).send({ message: "Unauthorized" });
      return false;
    }

    request.userSession = sessionData;
    return true;
  } catch (error) {
    reply.status(401).send({ message: "Unauthorized" });
    return false;
  }
}

