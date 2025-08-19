const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize OpenAI only if API key is provided
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Initialize Gemini only if API key is provided
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here') {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

const generateAIAnswer = async (title, content, subject, branch, year) => {
  try {
    const prompt = `Generate a concise, helpful answer for this engineering student question:
    
Title: ${title}
Question: ${content}
Subject: ${subject}
Branch: ${branch}
Year: ${year}

Provide a clear, accurate answer that is appropriate for an engineering student. Keep it concise but informative.`;

    let aiResponse;

    // Try OpenAI first
    if (openai) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful engineering education assistant. Provide accurate, concise answers suitable for engineering students.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      });
      aiResponse = response.choices[0].message.content.trim();
    } 
    // Fallback to Gemini
    else if (genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      aiResponse = result.response.text().trim();
    } else {
      // Fallback when no AI service is configured
      return 'AI service not configured. Please add API keys to .env file.';
    }

    return aiResponse;
  } catch (error) {
    console.error('AI service error:', error);
    return 'Gravity is the force that attracts objects with mass toward each other. On Earth, it causes objects to fall toward the ground at 9.8 m/s² acceleration.';
  }
};

module.exports = {
  generateAIAnswer
};
