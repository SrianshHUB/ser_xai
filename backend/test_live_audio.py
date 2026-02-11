
import requests
import numpy as np
import scipy.io.wavfile as wav
import io

def create_dummy_wav():
    sample_rate = 16000
    duration = 3  # seconds
    frequency = 440  # Hz
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    audio = 0.5 * np.sin(2 * np.pi * frequency * t)
    
    byte_io = io.BytesIO()
    wav.write(byte_io, sample_rate, audio.astype(np.float32))
    byte_io.seek(0)
    return byte_io

def test_api():
    url = "http://localhost:5000/api/predict"
    audio_file = create_dummy_wav()
    
    # Simulate the frontend sending "live_recording.webm" (which is actually wav)
    files = {'audio': ('live_recording.webm', audio_file, 'audio/webm')}
    
    try:
        print(f"Sending request to {url}...")
        response = requests.post(url, files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api()
