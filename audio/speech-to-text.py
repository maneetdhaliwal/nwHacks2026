# example.py
import sounddevice as sd
import speech_recognition as sr
import numpy as np
import time

recognizer = sr.Recognizer()
sample_rate = 16000
chunk_duration = 5  # seconds

print("Starting real-time transcription. Speak into the microphone.")

while True:
    print("Recording...")
    audio_data = sd.rec(int(chunk_duration * sample_rate), samplerate=sample_rate, channels=1, dtype='int16')
    sd.wait()
    
    # Convert to bytes
    audio_bytes = audio_data.tobytes()
    
    # Create AudioData
    audio = sr.AudioData(audio_bytes, sample_rate, 2)  # sample_width=2 for int16
    
    try:
        text = recognizer.recognize_google(audio)
        print("Transcribed: " + text)
    except sr.UnknownValueError:
        print("Could not understand audio")
    except sr.RequestError as e:
        print("Request error: {0}".format(e))
    
    time.sleep(0.1)  # small delay
