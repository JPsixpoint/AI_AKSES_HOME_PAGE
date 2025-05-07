import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface HexagonProps {
  className?: string;
  children?: React.ReactNode;
  animate?: boolean;
}

export function Hexagon({ className, children, animate = false }: HexagonProps) {
  const HexagonComponent = animate ? motion.div : "div";
  
  return (
    <HexagonComponent 
      className={cn("hexagon", className)}
      {...(animate && {
        animate: { 
          scale: [1, 0.98, 1],
          opacity: [1, 0.85, 1]
        },
        transition: {
          duration: 2.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      })}
    >
      {children}
    </HexagonComponent>
  );
}
