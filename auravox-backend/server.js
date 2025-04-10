// 1. Import required packages
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

// 2. Create the Express app
const app = express();

// 3. Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// 4. Serve static files from Python's output directory
app.use('/outputs', express.static(path.join(__dirname, '../auravox-ai/outputs')));

// 5. Create the main API endpoint
app.post('/generate-voice', async (req, res) => {
  try {
    const { text, emotion } = req.body;
    
    // Simple validation
    if (!text || !emotion) {
      return res.status(400).json({ error: 'Text and emotion are required' });
    }

    // Call Python AI service
    const aiResponse = await axios.post('http://localhost:5001/generate', {
      text,
      emotion
    });

    // Return the AI service response with additional processing if needed
    res.json({
      ...aiResponse.data,
      // You can add any additional fields here
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Service Error:', error);
    
    // Return error response
    res.status(500).json({ 
      error: 'Failed to generate voice',
      details: error.message,
      // Fallback mock response if AI service is down
      fallback: {
        text: req.body.text,
        emotion: req.body.emotion,
        audio: "outputs/fallback_audio.wav",
        settings: {
          speed: 1.0,
          pitch: 1.0
        }
      }
    });
  }
});

// 6. Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    services: {
      nodejs: 'running',
      python: 'http://localhost:5001' 
    }
  });
});

// 7. Start the server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Python AI service expected at http://localhost:5001`);
});