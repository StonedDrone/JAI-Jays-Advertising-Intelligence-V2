// Add type definitions for the Web Speech API to resolve TypeScript errors.
interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  onstart: () => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly [index: number]: SpeechRecognitionAlternative;
  readonly length: number;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageAuthor } from '../types';
import { chatWithSystem } from '../services/geminiService';
import BrainIcon from './icons/BrainIcon';
import CodeIcon from './icons/CodeIcon';
import LoadingSpinner from './icons/LoadingSpinner';
import MicrophoneIcon from './icons/MicrophoneIcon';

const SystemView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Greet the user on initial load
  useEffect(() => {
    const init = async () => {
        setIsLoading(true);
        const initialMessage = await chatWithSystem([]);
        setMessages([{
            id: Date.now().toString(),
            author: MessageAuthor.AI,
            text: initialMessage
        }]);
        setIsLoading(false);
    }
    init();
  }, [])

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      author: MessageAuthor.USER,
      text: input,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponseText = await chatWithSystem([...messages, userMessage]);
    
    const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        author: MessageAuthor.AI,
        text: aiResponseText,
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleToggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Apologies, Captain. Voice recognition is not supported by this terminal.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Voice recognition error:', event.error);
      if (event.error === 'not-allowed') {
        alert("Directive unclear. Microphone access denied. Please grant permission to proceed.");
      } else if (event.error !== 'no-speech') {
        alert(`System anomaly in voice recognition: ${event.error}. Please try again.`);
      }
      setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setInput(transcript);
    };
    
    recognition.start();
  };
  
  return (
    <div className="w-full max-w-md mx-auto h-full flex flex-col bg-black">
      <div className="p-4 text-center border-b border-gray-800">
        <div className="flex items-center justify-center space-x-2 text-white">
            <CodeIcon className="w-6 h-6 text-cyan-400" />
            <h2 className="text-lg font-semibold">System Analysis</h2>
        </div>
        <p className="text-xs text-gray-500 mt-1">Query JAI's internal architecture.</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.author === MessageAuthor.USER ? 'justify-end' : 'justify-start'}`}>
            {msg.author === MessageAuthor.AI && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <BrainIcon className="w-5 h-5 text-white" />
              </div>
            )}
            <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${msg.author === MessageAuthor.USER 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-end gap-2 justify-start">
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <BrainIcon className="w-5 h-5 text-white" />
              </div>
               <div className="max-w-xs md:max-w-sm px-4 py-3 rounded-2xl bg-gray-800 text-gray-200 rounded-bl-none">
                <LoadingSpinner className="w-5 h-5 text-gray-400" />
              </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-800 bg-black">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Query system architecture..."}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleToggleListening}
            disabled={isLoading}
            className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-white bg-gray-800'}`}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            <MicrophoneIcon className="w-6 h-6" />
          </button>
          <button type="submit" disabled={isLoading || !input.trim()} className="bg-blue-600 rounded-full p-2 text-white disabled:bg-gray-600 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SystemView;