export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="px-4 mx-auto h-screen grid items-center justify-center">
      {children}
    </main>
  );
}
