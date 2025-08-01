import { ClientProvider } from '../client-provider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientProvider>
      {children}
    </ClientProvider>
  );
}
