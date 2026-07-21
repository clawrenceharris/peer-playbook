import { UserProvider, ModalProvider } from "@/components/providers";
import { SidebarLayout } from "@/components/sidebar";

export default function AppLayout({ children }) {
  return (
    <UserProvider>
      <ModalProvider>
        <SidebarLayout>{children}</SidebarLayout>
      </ModalProvider>
    </UserProvider>
  );
}
