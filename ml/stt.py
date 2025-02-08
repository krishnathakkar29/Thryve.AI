from openai import OpenAI
client = OpenAI(api_key='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')
audio_file= open("output.mp3", "rb")
transcription = client.audio.transcriptions.create(
    model="whisper-1", 
    file=audio_file
)

print(transcription.text)