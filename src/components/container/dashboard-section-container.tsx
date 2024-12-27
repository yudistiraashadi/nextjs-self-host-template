import { cn } from "@/lib/utils/styling";

export function DashboardSectionContainer({
  children,
  className,
}: {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg bg-white p-6 shadow-lg", className)}>
      {children}
    </section>
  );
}
