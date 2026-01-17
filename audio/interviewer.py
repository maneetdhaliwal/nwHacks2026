import os
from dotenv import load_dotenv
import google.genai as genai
import sounddevice as sd
import speech_recognition as sr
import threading
import time
import subprocess
import numpy as np
import queue

load_dotenv()

# Configure Gemini
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
chat = client.chats.create(model='gemini-2.5-flash-lite')

# Initialize STT
recognizer = sr.Recognizer()
sample_rate = 16000

# Shared variables
q = queue.Queue()
stop_stt = False

def audio_callback(indata, frames, time, status):
    if status:
        print(f"Audio status: {status}")
    q.put(indata.copy())

def stt_thread():
    global stop_stt
    stream = sd.InputStream(callback=audio_callback, channels=1, samplerate=sample_rate, dtype='int16')
    with stream:
        while not stop_stt:
            time.sleep(0.01)

def speak_text(text):
    # Use ElevenLabs TTS
    from elevenlabs.client import ElevenLabs
    elevenlabs = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))
    audio = elevenlabs.text_to_speech.convert(
        text=text,
        voice_id="JBFqnCBsd6RMkjVDRZzb",
        model_id="eleven_multilingual_v2",
        output_format="mp3_44100_128",
    )
    audio_data = b"".join(audio)
    with open("temp_audio.mp3", "wb") as f:
        f.write(audio_data)
    subprocess.run(["afplay", "temp_audio.mp3"])
    os.remove("temp_audio.mp3")

# Start the interview
print("Starting mock interview...")

# Initial prompt
initial_prompt = "You are a mock interviewer for a software engineering job. Start by asking the first question."
response = chat.send_message(initial_prompt)
question = response.text.strip()
print(f"AI: {question}")
speak_text(question)

while True:
    print("\nSpeak your response. Type 'done' when finished.")
    
    # Start STT thread
    while not q.empty():
        q.get()  # Clear queue
    stop_stt = False
    stt_t = threading.Thread(target=stt_thread)
    stt_t.start()
    
    # Wait for user to type 'done'
    user_input = input().strip().lower()
    if user_input == 'done':
        stop_stt = True
        stt_t.join()
        
        # Collect audio data
        audio_data = []
        while not q.empty():
            audio_data.append(q.get())
        
        if audio_data:
            full_audio = np.concatenate(audio_data, axis=0)
            audio_bytes = full_audio.tobytes()
            audio = sr.AudioData(audio_bytes, sample_rate, 2)
            try:
                full_response = recognizer.recognize_google(audio)
                print(f"Your response: {full_response}")
            except sr.UnknownValueError:
                full_response = "Sorry, I couldn't understand the audio."
                print(full_response)
            except sr.RequestError as e:
                full_response = f"STT Request Error: {e}"
                print(full_response)
        else:
            full_response = "No audio recorded."
            print(full_response)
        
        # Send to Gemini
        ai_prompt = f"User's response: {full_response}. Provide a short remark on their answer and ask the next question."
        ai_response = chat.send_message(ai_prompt)
        next_text = ai_response.text.strip()
        print(f"AI: {next_text}")
        speak_text(next_text)
    else:
        print("Please type 'done' to continue.")