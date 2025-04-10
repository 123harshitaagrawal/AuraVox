import pyttsx3
import time
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Create outputs directory if it doesn't exist
os.makedirs('outputs', exist_ok=True)

# Voice settings for different emotions
VOICE_SETTINGS = {
    'happy': {'rate': 200, 'volume': 1.0},
    'sad': {'rate': 100, 'volume': 0.8},
    'angry': {'rate': 180, 'volume': 1.2},
    'excited': {'rate': 220, 'volume': 1.1}
}

@app.route('/generate', methods=['POST'])
def generate_voice():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data received'}), 400
            
        text = data.get('text')
        emotion = data.get('emotion', 'happy')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400

        # Initialize TTS engine
        engine = pyttsx3.init()
        
        # Apply emotion settings
        settings = VOICE_SETTINGS.get(emotion, VOICE_SETTINGS['happy'])
        engine.setProperty('rate', settings['rate'])
        engine.setProperty('volume', settings['volume'])
        
        # Generate unique filename
        timestamp = int(time.time())
        output_file = f'outputs/voice_{timestamp}.wav'
        
        # Generate and save voice
        engine.save_to_file(text, output_file)
        engine.runAndWait()
        
        return jsonify({
            'status': 'success',
            'file': output_file,
            'emotion': emotion
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)