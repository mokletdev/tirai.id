import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

export const PageContainer: FC<{
  children?: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <main className={cn("mx-auto min-h-screen w-full bg-white", className)}>
      {children}
    </main>
  );
};