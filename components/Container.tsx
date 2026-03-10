import { cn } from "@/lib/utils";
import type { PropsWithChildren, ElementType, ComponentPropsWithoutRef } from "react";

type ContainerProps<T extends ElementType> = PropsWithChildren<{
  as?: T;
  className?: string;
}> &
  Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

export function Container<T extends ElementType = "div">({
  as,
  children,
  className,
  ...props
}: ContainerProps<T>) {
  const Component = as || "div";

  return (
    <Component className={cn("mx-auto w-full max-w-6xl px-4", className)} {...props}>
      {children}
    </Component>
  );
}
