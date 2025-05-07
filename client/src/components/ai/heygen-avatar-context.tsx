import React, { createContext, useContext, useRef, useState, ReactNode } from 'react';
import StreamingAvatar from '@heygen/streaming-avatar';

// Session state enum
export enum StreamingAvatarSessionState {
  INACTIVE = 'inactive',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
}

// Context interface
interface StreamingAvatarContextValue {
  avatarRef: React.RefObject<StreamingAvatar>;
  sessionState: StreamingAvatarSessionState;
  setSessionState: (state: StreamingAvatarSessionState) => void;
  stream: MediaStream | null;
  setStream: (stream: MediaStream | null) => void;
  isAvatarTalking: boolean;
  setIsAvatarTalking: (isTalking: boolean) => void;
  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

// Create context with default values
const StreamingAvatarContext = createContext<StreamingAvatarContextValue>({
  avatarRef: { current: null },
  sessionState: StreamingAvatarSessionState.INACTIVE,
  setSessionState: () => {},
  stream: null,
  setStream: () => {},
  isAvatarTalking: false,
  setIsAvatarTalking: () => {},
  isMuted: false,
  setIsMuted: () => {},
  error: null,
  setError: () => {},
});

// Provider component
export const StreamingAvatarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const avatarRef = useRef<StreamingAvatar>(null);
  const [sessionState, setSessionState] = useState<StreamingAvatarSessionState>(
    StreamingAvatarSessionState.INACTIVE
  );
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAvatarTalking, setIsAvatarTalking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value = {
    avatarRef,
    sessionState,
    setSessionState,
    stream,
    setStream,
    isAvatarTalking,
    setIsAvatarTalking,
    isMuted,
    setIsMuted,
    error,
    setError,
  };

  return (
    <StreamingAvatarContext.Provider value={value}>
      {children}
    </StreamingAvatarContext.Provider>
  );
};

// Custom hook to use the context
export const useStreamingAvatar = () => useContext(StreamingAvatarContext);