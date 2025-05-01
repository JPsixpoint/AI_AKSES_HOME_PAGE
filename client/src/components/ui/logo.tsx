import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  withText?: boolean;
}

export function Logo({ className, withText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="relative h-8 w-8">
        <div className="absolute inset-0 hexagon bg-primary"></div>
        <div className="absolute inset-1 hexagon bg-background"></div>
        <div className="absolute inset-2 hexagon bg-primary-light opacity-80"></div>
      </div>
      {withText && (
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-white to-muted-foreground bg-clip-text text-transparent">
          AKSES
        </h1>
      )}
    </div>
  );
}
