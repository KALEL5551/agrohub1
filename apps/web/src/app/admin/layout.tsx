import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar type="admin" />
        <main className="flex-1 p-6 lg:p-8 min-h-[calc(100vh-4rem)] bg-muted/20">{children}</main>
      </div>
    </>
  );
}
