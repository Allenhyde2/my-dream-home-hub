"use client";

import nextDynamic from "next/dynamic";

const NotificationsPage = nextDynamic(() => import("@/views/Notifications"), {
  ssr: false,
});

export default function Page() {
  return <NotificationsPage />;
}
