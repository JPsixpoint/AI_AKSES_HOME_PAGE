import { apiRequest } from "./queryClient";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionResponse {
  id: string;
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }[];
}

export async function getAIResponse(messages: Message[]): Promise<string> {
  try {
    const response = await apiRequest('POST', '/api/ai/chat', { messages, model: MODEL });
    const data: ChatCompletionResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw new Error('Failed to get AI response. Please try again.');
  }
}

export async function parseAIResponse(content: string): Promise<{ 
  type: string; 
  data?: any; 
  message?: string;
  followUpQuestions?: string[];
}> {
  try {
    // Try to parse structured AI response
    const match = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      return JSON.parse(match[1]);
    } else {
      // If no json format found, return as message
      return { 
        type: "message", 
        message: content,
        followUpQuestions: []
      };
    }
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return { 
      type: "message", 
      message: content,
      followUpQuestions: []
    };
  }
}
