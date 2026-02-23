"use client"
'use client';

import nextDynamic from 'next/dynamic';

const ConsultationReportPage = nextDynamic(() => import('@/views/ConsultationReport'), { ssr: false });

export default function Page() {
  return <ConsultationReportPage />;
}
