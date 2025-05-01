import { motion } from "framer-motion";
import { Orbit } from "lucide-react";
import { Hexagon } from "../ui/hexagon";
import { useState } from "react";

type AIStatus = "listening" | "processing" | "speaking" | "error";

interface AIAvatarProps {
  status: AIStatus;
  onClick?: () => void;
}

export function AIAvatar({ status, onClick }: AIAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getStatusColor = () => {
    switch (status) {
      case "listening": return "bg-success";
      case "processing": return "bg-warning";
      case "speaking": return "bg-info";
      case "error": return "bg-danger";
      default: return "bg-success";
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case "listening": return "Active and listening";
      case "processing": return "Processing...";
      case "speaking": return "Speaking";
      case "error": return "Error occurred";
      default: return "Active and listening";
    }
  };
  
  return (
    <div className="flex flex-col items-center mb-6">
      <motion.div 
        className="relative"
        whileHover={{ scale: 1.05 }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div 
          className={`w-20 h-20 rounded-full bg-dark-surface border-2 border-primary-light flex items-center justify-center ${status !== 'error' ? 'ai-active' : ''}`}
          animate={{ 
            boxShadow: status === 'error' 
              ? ['0 0 10px 0px rgba(255, 82, 82, 0.4)', '0 0 15px 2px rgba(255, 82, 82, 0.7)'] 
              : ['0 0 10px 0px rgba(106, 90, 205, 0.4)', '0 0 15px 2px rgba(106, 90, 205, 0.7)']
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Hexagon 
            className="w-16 h-16 bg-primary-light opacity-80 flex items-center justify-center"
            animate={status === "listening" || status === "speaking"}
          >
            <Orbit className={`h-8 w-8 text-white ${status === "listening" ? "ai-pulse" : ""}`} />
          </Hexagon>
        </motion.div>
        <motion.div 
          className={`absolute -bottom-1 -right-1 rounded-full w-5 h-5 border-2 border-dark ${getStatusColor()}`}
          animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
      <p className="text-muted-foreground text-sm mt-2">AKSES AI Assistant</p>
      <p className="text-xs text-primary-lighter">{getStatusText()}</p>
    </div>
  );
}
