import { PrismaClient, User } from '@prisma/client';

export interface UpsertUser {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  nickname?: string | null;
  residenceCity?: string | null;
  residenceDistrict?: string | null;
  residenceDong?: string | null;
  targetAreas?: any;
  purchaseTimeline?: number | null;
  availableFunds?: string | null;
  familyTypes?: any;
  interests?: any;
  onboardingCompleted?: boolean | null;
}

export interface IAuthStorage {
  getUser(id: string): Promise<User | null>;
  upsertUser(user: UpsertUser): Promise<User>;
}

class AuthStorage implements IAuthStorage {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getUser(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    return await this.prisma.user.upsert({
      where: { id: userData.id },
      update: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        nickname: userData.nickname,
        residenceCity: userData.residenceCity,
        residenceDistrict: userData.residenceDistrict,
        residenceDong: userData.residenceDong,
        targetAreas: userData.targetAreas,
        purchaseTimeline: userData.purchaseTimeline,
        availableFunds: userData.availableFunds,
        familyTypes: userData.familyTypes,
        interests: userData.interests,
        onboardingCompleted: userData.onboardingCompleted,
        updatedAt: new Date(),
      },
      create: {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        nickname: userData.nickname,
        residenceCity: userData.residenceCity,
        residenceDistrict: userData.residenceDistrict,
        residenceDong: userData.residenceDong,
        targetAreas: userData.targetAreas,
        purchaseTimeline: userData.purchaseTimeline,
        availableFunds: userData.availableFunds,
        familyTypes: userData.familyTypes,
        interests: userData.interests,
        onboardingCompleted: userData.onboardingCompleted,
      },
    });
  }
}

export const authStorage = new AuthStorage();
