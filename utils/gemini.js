const axios = require('axios');

const API_KEY = 'AIzaSyBywyuARVnFRcSMDerQJ2PZ_DZWHt5XaxA';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${API_KEY}&alt=sse`;

async function generateAIResponse(userMessage, persona) {
  try {
    const prompt = `You are a chatbot with the following persona: ${persona}. 
    Respond to the user's message in character. Keep your response concise and engaging.
    
    User: ${userMessage}
    
    Your response:`;

    const response = await axios.post(API_URL, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Parse the SSE response
    const lines = response.data.split('\n');
    let fullResponse = '';
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') break;
        
        try {
          const parsed = JSON.parse(data);
          if (parsed.candidates && parsed.candidates[0].content.parts[0].text) {
            fullResponse += parsed.candidates[0].content.parts[0].text;
          }
        } catch (e) {
          // Continue parsing other lines
        }
      }
    }

    return fullResponse || "I'm sorry, I couldn't generate a response at the moment.";
  } catch (error) {
    console.error('Gemini API error:', error);
    return "I'm experiencing technical difficulties. Please try again later.";
  }
}

module.exports = { generateAIResponse };
