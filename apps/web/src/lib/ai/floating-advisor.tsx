'use client';

import dynamic from 'next/dynamic';

// Load the advisor only on client side
const AgroAdvisor = dynamic(
  () => import('@/components/ai/agro-advisor').then(m => m.AgroAdvisor),
  { ssr: false }
);

export function FloatingAdvisor() {
  return <AgroAdvisor floating={true} />;
}
