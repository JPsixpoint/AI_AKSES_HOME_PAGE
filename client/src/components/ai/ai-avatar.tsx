import { motion } from "framer-motion";
import { Orbit, ActivityIcon, BrainCogIcon, AlertCircleIcon, MicIcon } from "lucide-react";
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

  const getStatusIcon = () => {
    switch (status) {
      case "listening": return <MicIcon className="h-4 w-4 text-white" />;
      case "processing": return <BrainCogIcon className="h-4 w-4 text-white" />;
      case "speaking": return <ActivityIcon className="h-4 w-4 text-white" />;
      case "error": return <AlertCircleIcon className="h-4 w-4 text-white" />;
      default: return <MicIcon className="h-4 w-4 text-white" />;
    }
  };
  
  // Color animation for different statuses
  const getHexagonColor = () => {
    switch (status) {
      case "listening": return "bg-success bg-opacity-80";
      case "processing": return "bg-warning bg-opacity-80";
      case "speaking": return "bg-info bg-opacity-80";
      case "error": return "bg-danger bg-opacity-80";
      default: return "bg-primary-light opacity-80";
    }
  };
  
  // Pulse animation based on status
  const getPulseAnimation = () => {
    if (status === "processing") {
      return "animate-pulse";
    } else if (status === "speaking") {
      return "animate-bounce";
    } else if (status === "listening") {
      return "ai-pulse";
    }
    return "";
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
          className={`w-20 h-20 rounded-full bg-dark-surface border-2 ${status === "error" ? "border-danger" : "border-primary-light"} flex items-center justify-center`}
          animate={{ 
            boxShadow: status === 'error' 
              ? ['0 0 10px 0px rgba(255, 82, 82, 0.4)', '0 0 15px 2px rgba(255, 82, 82, 0.7)'] 
              : status === 'processing'
                ? ['0 0 10px 0px rgba(255, 193, 7, 0.4)', '0 0 15px 2px rgba(255, 193, 7, 0.7)']
                : status === 'speaking'
                  ? ['0 0 10px 0px rgba(33, 150, 243, 0.4)', '0 0 15px 2px rgba(33, 150, 243, 0.7)']
                  : ['0 0 10px 0px rgba(76, 175, 80, 0.4)', '0 0 15px 2px rgba(76, 175, 80, 0.7)']
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Hexagon 
            className={`w-16 h-16 ${getHexagonColor()} flex items-center justify-center`}
            animate={true}
          >
            <motion.div 
              animate={status === "processing" ? { rotate: 360 } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="flex items-center justify-center"
            >
              <Orbit className={`h-8 w-8 text-white ${getPulseAnimation()}`} />
            </motion.div>
          </Hexagon>
        </motion.div>
        <div className={`absolute -bottom-1 -right-1 rounded-full w-6 h-6 border-2 border-dark ${getStatusColor()} flex items-center justify-center`}>
          {getStatusIcon()}
        </div>
      </motion.div>
      <p className="text-muted-foreground text-sm mt-2">AKSES AI Assistant</p>
      <div className={`text-xs px-2 py-1 rounded-full mt-1 font-medium ${
        status === "listening" ? "bg-success bg-opacity-20 text-success" :
        status === "processing" ? "bg-warning bg-opacity-20 text-warning" :
        status === "speaking" ? "bg-info bg-opacity-20 text-info" :
        "bg-danger bg-opacity-20 text-danger"
      }`}>
        {getStatusText()}
      </div>
    </div>
  );
}
