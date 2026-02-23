"use client";

import nextDynamic from "next/dynamic";

const NotificationSettingsPage = nextDynamic(
  () => import("@/views/NotificationSettings"),
  { ssr: false }
);

export default function Page() {
  return <NotificationSettingsPage />;
}
