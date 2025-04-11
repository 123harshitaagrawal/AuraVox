import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

function App() {
  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState("happy");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setAudioUrl(""); // Reset previous audio
  
    try {
      const response = await fetch('http://localhost:5000/generate-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, emotion })
      });
  
      if (!response.ok) throw new Error('Voice generation failed');
      
      const data = await response.json();
      setAudioUrl(`http://localhost:5000/${data.file}`); // Set the new audio URL
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header as="h2" className="text-center bg-primary text-white">
          AuraVox - AI Voice Cloning
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Enter Text</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type something..."
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Select Emotion</Form.Label>
              <Form.Select 
                value={emotion} 
                onChange={(e) => setEmotion(e.target.value)}
              >
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="angry">Angry</option>
                <option value="excited">Excited</option>
              </Form.Select>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Voice'}
            </Button>
          </Form>

  {audioUrl && (
    <div className="mt-3">
      <audio controls src={audioUrl} />
      <a href={audioUrl} download className="ms-3 btn btn-sm btn-success">
        Download Audio
      </a>
    </div>
  )}

        </Card.Body>
      </Card>
    </Container>
  );
}

export default App;

