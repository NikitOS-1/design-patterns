import { Sidebar } from "@/components/Sidebar";

export default function PatternsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
      <aside className="lg:py-8">
        <Sidebar />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
