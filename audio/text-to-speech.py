from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
import os
import subprocess

load_dotenv()

elevenlabs = ElevenLabs(
  api_key=os.getenv("ELEVENLABS_API_KEY"),
)

text = input("Enter the text to speak: ")

audio = elevenlabs.text_to_speech.convert(
    text=text,
    voice_id="JBFqnCBsd6RMkjVDRZzb",
    model_id="eleven_multilingual_v2",
    output_format="mp3_44100_128",
)

# Collect the audio data from the generator
audio_data = b"".join(audio)

# Save audio to a temporary file
with open("temp_audio.mp3", "wb") as f:
    f.write(audio_data)

# Play using afplay (built-in on macOS)
subprocess.run(["afplay", "temp_audio.mp3"])

# Clean up
os.remove("temp_audio.mp3")