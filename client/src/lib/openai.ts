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
  // Check for "send email to" or "also send to" patterns in the content
  const patterns = [
    // Pattern 1: send/forward/resend email to someone@example.com
    /(?:send|forward|resend)\s*(?:that|this|an|the)?\s*(?:email|screening|pre-screening|prescreening)\s*(?:to|for)\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
    
    // Pattern 2: also send/add/include someone@example.com
    /(?:also|and)\s+(?:send|forward|add|include)\s+(?:to\s+)?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
    
    // Pattern 3: send it to someone@example.com as well
    /(?:send|forward)\s+(?:it|that|this)\s+(?:to|for)\s+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
    
    // Pattern 4: plain email address with minimal context
    /(?:email|send|to)\s*:?\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
  ];
  
  // Try all patterns
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      // Check if there are multiple emails in the content (comma-separated)
      const emailPart = match[1].trim();
      const emails = emailPart.includes(',') ? 
                     emailPart.split(',').map(e => e.trim()) : 
                     [emailPart];
      
      // Filter out any invalid email-like strings
      const validEmails = emails.filter(email => 
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
      );
      
      if (validEmails.length > 0) {
        const emailsText = validEmails.length > 1 ? 
                          validEmails.slice(0, -1).join(', ') + ' and ' + validEmails[validEmails.length - 1] : 
                          validEmails[0];
                          
        return {
          type: "send_additional_email",
          data: { email: validEmails.join(',') },
          message: `I'll send the pre-screening email to ${emailsText}.`
        };
      }
    }
  }
  
  // Also try to extract any email addresses from the text
  const allEmailsMatch = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  if (allEmailsMatch && allEmailsMatch.length > 0) {
    const validEmails = allEmailsMatch.filter(email => 
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    );
    
    if (validEmails.length > 0) {
      const emailsText = validEmails.length > 1 ? 
                        validEmails.slice(0, -1).join(', ') + ' and ' + validEmails[validEmails.length - 1] : 
                        validEmails[0];
                        
      return {
        type: "send_additional_email",
        data: { email: validEmails.join(',') },
        message: `I'll send the pre-screening email to ${emailsText}.`
      };
    }
  }
  
  try {
    // First try to find a code block with JSON
    const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        // Try to parse the JSON from code block
        return JSON.parse(match[1]);
      } catch (jsonError) {
        console.error('Error parsing JSON from code block:', jsonError);
        // If parsing the code block fails, try to clean it up
        return extractAndParseJson(content);
      }
    } else {
      // If no code blocks, try to find and parse JSON directly
      return extractAndParseJson(content);
    }
  } catch (error) {
    console.error('Error parsing AI response:', error);
    
    // Try one last attempt to extract any readable message
    let cleanedContent = content;
    
    // Remove code blocks
    cleanedContent = cleanedContent.replace(/```[\s\S]*?```/g, "").trim();
    
    // Remove obvious JSON-like content
    if (cleanedContent.includes('{') && cleanedContent.includes('}')) {
      const jsonStart = cleanedContent.indexOf('{');
      const jsonEnd = cleanedContent.lastIndexOf('}') + 1;
      
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const potentialJson = cleanedContent.substring(jsonStart, jsonEnd);
        try {
          // Try to parse this as JSON
          const parsedJson = JSON.parse(potentialJson);
          
          // If it has a message field, use that
          if (parsedJson.message) {
            return { 
              type: "message", 
              message: parsedJson.message,
              followUpQuestions: parsedJson.followUpQuestions || []
            };
          }
        } catch (e) {
          // If not valid JSON, just remove it
          cleanedContent = cleanedContent.replace(potentialJson, "").trim();
        }
      }
    }
    
    // Fall back to using the content as a plain message
    return { 
      type: "message", 
      message: cleanedContent || "I understand your request.",
      followUpQuestions: []
    };
  }
}

// Helper function to try to extract and parse JSON from text content
function extractAndParseJson(content: string) {
  try {
    // Try to extract JSON from the content
    const potentialJsonStart = content.indexOf('{');
    const potentialJsonEnd = content.lastIndexOf('}') + 1;
    
    if (potentialJsonStart >= 0 && potentialJsonEnd > potentialJsonStart) {
      const potentialJson = content.substring(potentialJsonStart, potentialJsonEnd);
      try {
        // Try to parse this JSON
        const parsedJson = JSON.parse(potentialJson);
        return parsedJson;
      } catch (e) {
        // Not valid JSON
        console.warn('Extracted content is not valid JSON:', e);
      }
    }
    
    // If we couldn't find or parse JSON, return the content as a message
    return { 
      type: "message", 
      message: content,
      followUpQuestions: []
    };
  } catch (error) {
    console.error('Error in extractAndParseJson:', error);
    return { 
      type: "message", 
      message: content,
      followUpQuestions: []
    };
  }
}
