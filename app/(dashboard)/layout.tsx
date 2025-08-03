import { ClientProvider } from '../client-provider';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ClientProvider>
      <div className="dashboard-layout">
        {children}
      </div>
    </ClientProvider>
  );
}

export const metadata = {
  title: 'Dashboard',
  description: 'Dashboard application',
};