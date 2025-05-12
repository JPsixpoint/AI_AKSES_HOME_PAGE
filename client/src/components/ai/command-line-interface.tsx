import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X } from 'lucide-react';
import { Button } from "../ui/button";
import './voice-wave.css';

interface CommandLineInterfaceProps {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  onSendMessage: (message: string) => void;
  onEndChat: () => void;
  isListening: boolean;
  toggleListening: () => void;
  isSpeaking: boolean;
}

export function CommandLineInterface({
  messages,
  onSendMessage,
  onEndChat,
  isListening,
  toggleListening,
  isSpeaking
}: CommandLineInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-green-400 font-mono rounded-lg p-4 overflow-hidden">
      {/* Terminal-like interface */}
      <div 
        ref={terminalRef}
        className="flex-grow overflow-y-auto mb-4 custom-scrollbar"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        {/* System greeting */}
        <div className="pb-2 text-gray-400">
          <p>AKSES AI Command Terminal [Version 1.0.0]</p>
          <p>(c) 2025 SixPoint Capital. All rights reserved.</p>
          <p className="my-2">-----------------------------------------</p>
        </div>
        
        {/* Messages */}
        {messages.map((message, index) => (
          <div key={index} className="mb-3">
            {message.role === "user" ? (
              <div>
                <span className="text-yellow-400">user@akses:</span>
                <span className="text-blue-400">~$</span>{' '}
                <span>{message.content}</span>
              </div>
            ) : (
              <div>
                <span className="text-green-600">ai@akses:</span>
                <span className="text-purple-400">~$</span>{' '}
                <span className="whitespace-pre-wrap">{message.content}</span>
              </div>
            )}
          </div>
        ))}
        
        {/* Current prompt line */}
        <div className="flex items-center">
          <span className="text-yellow-400">user@akses:</span>
          <span className="text-blue-400">~$</span>{' '}
          <span className="ml-1 animate-pulse">▌</span>
        </div>
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Voice visualization */}
      <div className="mb-4 flex flex-col items-center">
        <div className="voice-wave-container h-16 w-40 flex items-center justify-center">
          {isListening || isSpeaking ? (
            <div className="voice-wave">
              <div className="voice-bar"></div>
              <div className="voice-bar"></div>
              <div className="voice-bar"></div>
              <div className="voice-bar"></div>
              <div className="voice-bar"></div>
            </div>
          ) : (
            <div className="voice-wave inactive">
              <div className="voice-bar"></div>
              <div className="voice-bar"></div>
              <div className="voice-bar"></div>
              <div className="voice-bar"></div>
              <div className="voice-bar"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Control buttons */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <Button 
          onClick={toggleListening}
          variant="outline"
          size="icon"
          className={`rounded-full w-12 h-12 ${isListening ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-green-500/20 border-green-500 text-green-500'}`}
        >
          {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>
        
        <Button
          onClick={onEndChat}
          variant="outline"
          size="icon"
          className="rounded-full w-12 h-12 bg-red-500/20 border-red-500 text-red-500"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? "Listening..." : "Type a command..."}
          className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 placeholder-gray-500"
        />
        <Button 
          type="submit" 
          variant="ghost" 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500"
        >
          Enter
        </Button>
      </form>
    </div>
  );
}