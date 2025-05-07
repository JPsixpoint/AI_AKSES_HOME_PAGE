import { useCallback, useEffect } from 'react';
import StreamingAvatar, { StreamingEvents } from '@heygen/streaming-avatar';

import { useStreamingAvatar, StreamingAvatarSessionState } from '@/components/ai/heygen-avatar-context';
import { getAccessToken, getDefaultAvatarConfig } from '@/lib/heygen-api';

/**
 * Hook to manage HeyGen streaming avatar lifecycle
 */
export function useStreamingAvatarSession() {
  const {
    avatarRef,
    sessionState,
    setSessionState,
    stream,
    setStream,
    setIsAvatarTalking,
    setError
  } = useStreamingAvatar();

  /**
   * Initialize the avatar with API credentials
   */
  const initAvatar = useCallback(async () => {
    try {
      const token = await getAccessToken();
      const config = getDefaultAvatarConfig();
      
      const avatar = new StreamingAvatar({
        token,
        ...config
      });
      
      // @ts-ignore - Need to set the ref value directly
      avatarRef.current = avatar;
      
      return avatar;
    } catch (err: any) {
      console.error('Failed to initialize avatar:', err);
      setError(err.message || 'Failed to initialize avatar');
      return null;
    }
  }, [avatarRef, setError]);

  /**
   * Handle stream ready event
   */
  const handleStreamReady = useCallback((event: any) => {
    console.log('Stream ready:', event.detail);
    setStream(event.detail);
    setSessionState(StreamingAvatarSessionState.CONNECTED);
  }, [setSessionState, setStream]);

  /**
   * Stop the avatar stream and clean up
   */
  const stopAvatar = useCallback(async () => {
    try {
      if (!avatarRef.current) return;
      
      // Remove event listeners
      avatarRef.current.off(StreamingEvents.STREAM_READY, handleStreamReady);
      avatarRef.current.off(StreamingEvents.STREAM_DISCONNECTED, stopAvatar);
      
      // Clean up state
      setIsAvatarTalking(false);
      setStream(null);
      
      // Stop avatar
      await avatarRef.current.stopAvatar();
      setSessionState(StreamingAvatarSessionState.INACTIVE);
    } catch (err: any) {
      console.error('Error stopping avatar:', err);
      setError(err.message || 'Error stopping avatar');
    }
  }, [
    avatarRef, 
    handleStreamReady, 
    setIsAvatarTalking, 
    setStream, 
    setSessionState,
    setError
  ]);

  /**
   * Start the avatar session
   */
  const startAvatar = useCallback(async () => {
    try {
      if (sessionState !== StreamingAvatarSessionState.INACTIVE) {
        throw new Error('There is already an active session');
      }

      // Initialize avatar if needed
      if (!avatarRef.current) {
        const avatar = await initAvatar();
        if (!avatar) {
          throw new Error('Failed to initialize avatar');
        }
      }

      // Set up state and event listeners
      setSessionState(StreamingAvatarSessionState.CONNECTING);
      setError(null);
      
      // Add event listeners
      avatarRef.current!.on(StreamingEvents.STREAM_READY, handleStreamReady);
      avatarRef.current!.on(StreamingEvents.STREAM_DISCONNECTED, stopAvatar);
      avatarRef.current!.on(StreamingEvents.AVATAR_START_TALKING, () => {
        setIsAvatarTalking(true);
      });
      avatarRef.current!.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
        setIsAvatarTalking(false);
      });
      
      // Start the avatar - create a session
      await avatarRef.current!.createStartAvatar();
      
      return avatarRef.current;
    } catch (err: any) {
      console.error('Error starting avatar session:', err);
      setError(err.message || 'Error starting avatar');
      setSessionState(StreamingAvatarSessionState.INACTIVE);
      return null;
    }
  }, [
    avatarRef,
    sessionState,
    initAvatar,
    handleStreamReady,
    stopAvatar,
    setSessionState,
    setIsAvatarTalking,
    setError
  ]);

  /**
   * Make the avatar speak
   */
  const speakWithAvatar = useCallback(async (text: string) => {
    try {
      if (!avatarRef.current || sessionState !== StreamingAvatarSessionState.CONNECTED) {
        throw new Error('Avatar not ready or not connected');
      }
      
      console.log('Making avatar speak:', text);
      
      // The SDK expects 'speak' but in the latest version it's possibly different
      await avatarRef.current.speak({
        text
      });
      
      return true;
    } catch (err: any) {
      console.error('Error making avatar speak:', err);
      setError(err.message || 'Error making avatar speak');
      return false;
    }
  }, [avatarRef, sessionState, setError]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (sessionState !== StreamingAvatarSessionState.INACTIVE) {
        stopAvatar();
      }
    };
  }, [sessionState, stopAvatar]);

  return {
    sessionState,
    stream,
    initAvatar,
    startAvatar,
    stopAvatar,
    speakWithAvatar
  };
}