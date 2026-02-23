"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { TargetArea } from "@/shared/models/auth";

interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  nickname: string | null;
  residenceCity: string | null;
  residenceDistrict: string | null;
  residenceDong: string | null;
  targetAreas: TargetArea[] | null;
  purchaseTimeline: number | null;
  availableFunds: string | null;
  familyTypes: string[] | null;
  interests: string[] | null;
  onboardingCompleted: boolean | null;
  rewardPoints: number | null;
  marketingAccepted: boolean | null;
  adAgreementAccepted: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
}

async function fetchUser(): Promise<User | null> {
  const response = await fetch("/api/auth/user", {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
}

async function logout(): Promise<void> {
  window.location.href = "/api/logout";
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    needsOnboarding: !!user && !user.onboardingCompleted,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}

export type { User, TargetArea };
