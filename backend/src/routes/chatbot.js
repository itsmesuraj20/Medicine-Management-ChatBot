const express = require('express');
const router = express.Router();

// Sample chatbot responses and intents
const intents = {
  greeting: {
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
    responses: [
      'Hello! I\'m your pharmacy assistant. How can I help you today?',
      'Hi there! What can I assist you with?',
      'Good to see you! How may I help you with your medication needs?'
    ]
  },
  medicine_info: {
    patterns: ['what is', 'tell me about', 'side effects', 'dosage', 'information about'],
    responses: [
      'I can help you with medicine information. What specific medicine are you asking about?',
      'Please specify the medicine name and I\'ll provide detailed information.',
      'I have comprehensive information about medicines. Which one interests you?'
    ]
  },
  availability_check: {
    patterns: ['do you have', 'is available', 'in stock', 'availability'],
    responses: [
      'Let me check our inventory for you.',
      'I\'ll look up the availability right away.',
      'Checking our current stock levels...'
    ]
  },
  price_inquiry: {
    patterns: ['price', 'cost', 'how much', 'rate'],
    responses: [
      'I can help you with pricing information.',
      'Let me get the current price for you.',
      'I\'ll check the latest pricing details.'
    ]
  },
  prescription_help: {
    patterns: ['prescription', 'doctor prescribed', 'medication list'],
    responses: [
      'I can help you understand your prescription.',
      'Please share your prescription details and I\'ll assist you.',
      'I\'m here to help with prescription-related queries.'
    ]
  }
};

// Simple intent classification function
function classifyIntent(message) {
  const lowercaseMessage = message.toLowerCase();
  
  for (const [intent, data] of Object.entries(intents)) {
    for (const pattern of data.patterns) {
      if (lowercaseMessage.includes(pattern)) {
        return intent;
      }
    }
  }
  return 'unknown';
}

// Generate response based on intent
function generateResponse(intent, message) {
  if (intents[intent]) {
    const responses = intents[intent].responses;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  return 'I\'m sorry, I didn\'t understand that. Can you please rephrase your question or ask about medicine information, availability, prices, or prescriptions?';
}

// POST /api/chatbot/message - Process chatbot message
router.post('/message', async (req, res) => {
  const { message, userId, sessionId } = req.body;
  
  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'Message is required'
    });
  }
  
  try {
    // Classify the intent
    const intent = classifyIntent(message);
    
    // Generate response based on intent
    let response = generateResponse(intent, message);
    let suggestions = [];
    let data = null;
    
    // Handle specific intents with additional logic
    if (intent === 'medicine_info') {
      // Extract medicine name from message
      const medicineMatch = message.match(/(?:about|for|of)\s+([a-zA-Z]+)/i);
      if (medicineMatch) {
        const medicineName = medicineMatch[1];
        // This would typically query the database
        response = `Here's information about ${medicineName}. It's commonly used for pain relief and fever reduction. Please consult with a pharmacist for detailed dosage instructions.`;
        suggestions = ['Show side effects', 'Check availability', 'Alternative medicines'];
      }
    } else if (intent === 'availability_check') {
      // Extract medicine name
      const medicineMatch = message.match(/(?:have|available)\s+([a-zA-Z]+)/i);
      if (medicineMatch) {
        const medicineName = medicineMatch[1];
        response = `Let me check... Yes, ${medicineName} is currently in stock. We have 50 tablets available.`;
        suggestions = ['Check price', 'Add to cart', 'Alternative options'];
      }
    } else if (intent === 'price_inquiry') {
      const medicineMatch = message.match(/(?:price|cost|much)\s+(?:of\s+)?([a-zA-Z]+)/i);
      if (medicineMatch) {
        const medicineName = medicineMatch[1];
        response = `The current price for ${medicineName} is $2.50 per tablet. Would you like to know about any discounts available?`;
        suggestions = ['Apply senior discount', 'Check insurance coverage', 'Generic alternatives'];
      }
    }
    
    // Store conversation history (in production, save to database)
    const conversationEntry = {
      sessionId,
      userId,
      timestamp: new Date().toISOString(),
      userMessage: message,
      botResponse: response,
      intent: intent
    };
    
    res.json({
      success: true,
      data: {
        response: response,
        intent: intent,
        suggestions: suggestions,
        timestamp: new Date().toISOString(),
        sessionId: sessionId
      }
    });
    
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, I encountered an error processing your request.',
      error: error.message
    });
  }
});

// GET /api/chatbot/suggestions - Get conversation suggestions
router.get('/suggestions', (req, res) => {
  const suggestions = [
    'What medicines do you have for headache?',
    'Is Paracetamol available?',
    'What\'s the price of Crocin?',
    'Tell me about Amoxicillin side effects',
    'Do you have any discounts for seniors?',
    'Can you help me understand my prescription?'
  ];
  
  res.json({
    success: true,
    data: suggestions
  });
});

// POST /api/chatbot/feedback - Store user feedback
router.post('/feedback', (req, res) => {
  const { sessionId, messageId, rating, feedback } = req.body;
  
  // In production, store in database for improving chatbot
  const feedbackEntry = {
    sessionId,
    messageId,
    rating,
    feedback,
    timestamp: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Thank you for your feedback!',
    data: feedbackEntry
  });
});

// GET /api/chatbot/history/:sessionId - Get conversation history
router.get('/history/:sessionId', (req, res) => {
  // In production, fetch from database
  res.json({
    success: true,
    data: {
      sessionId: req.params.sessionId,
      messages: [
        {
          id: 1,
          type: 'user',
          message: 'Hello',
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          type: 'bot',
          message: 'Hello! I\'m your pharmacy assistant. How can I help you today?',
          timestamp: new Date().toISOString()
        }
      ]
    }
  });
});

module.exports = router;