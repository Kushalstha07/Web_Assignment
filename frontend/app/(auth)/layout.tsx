export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50/50 to-white px-6 py-12">
      <section className="w-full max-w-2xl rounded-[24px] border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-blue-900/5 backdrop-blur-sm md:p-10">
        {children}
      </section>
    </main>
  );
}