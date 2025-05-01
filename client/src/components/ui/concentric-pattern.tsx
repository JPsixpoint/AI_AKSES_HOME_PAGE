import { motion } from "framer-motion";

interface ConcentricPatternProps {
  className?: string;
}

export function ConcentricPattern({ className }: ConcentricPatternProps) {
  return (
    <motion.div 
      className={`absolute w-[500px] h-[500px] opacity-5 z-0 ${className || 'top-10 -left-[150px]'}`}
      animate={{ rotate: 360 }}
      transition={{ 
        duration: 30, 
        repeat: Infinity, 
        ease: "linear" 
      }}
    >
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <path d="M200,20 A180,180 0 1,1 199,20 z" fill="none" stroke="hsl(var(--primary-light))" strokeWidth="1"/>
        <path d="M200,40 A160,160 0 1,1 199,40 z" fill="none" stroke="hsl(var(--primary-light))" strokeWidth="1"/>
        <path d="M200,60 A140,140 0 1,1 199,60 z" fill="none" stroke="hsl(var(--primary-light))" strokeWidth="1"/>
        <path d="M200,80 A120,120 0 1,1 199,80 z" fill="none" stroke="hsl(var(--primary-light))" strokeWidth="1"/>
        <path d="M200,100 A100,100 0 1,1 199,100 z" fill="none" stroke="hsl(var(--primary-light))" strokeWidth="1"/>
        <path d="M200,120 A80,80 0 1,1 199,120 z" fill="none" stroke="hsl(var(--primary-light))" strokeWidth="1"/>
        <path d="M200,140 A60,60 0 1,1 199,140 z" fill="none" stroke="hsl(var(--primary-light))" strokeWidth="1"/>
        <path d="M200,160 A40,40 0 1,1 199,160 z" fill="none" stroke="hsl(var(--primary-light))" strokeWidth="1"/>
        <path d="M200,180 A20,20 0 1,1 199,180 z" fill="none" stroke="hsl(var(--primary-light))" strokeWidth="1"/>
      </svg>
    </motion.div>
  );
}
