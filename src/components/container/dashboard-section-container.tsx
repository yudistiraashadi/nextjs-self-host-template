import { cn } from "@/lib/utils/styling";

export function DashboardSectionContainer({
  children,
  className,
}: {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
}) {
  return (
    <section
      className={cn(
        "space-y-6 rounded-lg border border-[var(--app-shell-border-color)] bg-[var(--mantine-color-body)] p-6",
        className,
      )}
    >
      {children}
    </section>
  );
}
