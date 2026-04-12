import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar type="dashboard" />
        <main className="flex-1 p-6 lg:p-8 min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </>
  );
}
