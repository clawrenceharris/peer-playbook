
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex justify-center bg-linear-to-br to-primary-300 from-secondary-300">
      {children}
    </main>
  );
}

