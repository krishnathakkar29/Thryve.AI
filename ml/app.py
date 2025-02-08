from flask import Flask, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai
import os

# Load environment variables
load_dotenv()

# Configure the Gemini API
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
model = genai.GenerativeModel("gemini-2.0-flash")
chat = model.start_chat(history=[])

# Initialize Flask app
app = Flask(__name__)

@app.route("/ask", methods=["POST"])
def ask_gemini():
    try:
        data = request.json
        question = data.get("question")

        if not question:
            return jsonify({"error": "No question provided"}), 400

        # Generate response from Gemini
        response = chat.send_message(question, stream=False)

        return jsonify({"response": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
