from flask import Flask, request, jsonify, send_file
from PyPDF2 import PdfReader
from fpdf import FPDF
import os
from dotenv import load_dotenv
from langchain.docstore.document import Document
from langchain.prompts import PromptTemplate
from langchain.chains.summarize import load_summarize_chain
from langchain_google_genai import ChatGoogleGenerativeAI
import google.generativeai as genai

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
RESULT_FOLDER = "results"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

def extract_text_from_pdf(pdf_path):
    """Extracts text from the PDF file."""
    text = ""
    with open(pdf_path, "rb") as file:
        reader = PdfReader(file)
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
    return text

def generate_meeting_minutes(transcript: str) -> str:
    """
    Generates meeting minutes by summarizing the provided transcript using 
    Google's Gemini 2.0 Flash LLM via Langchain.
    """
    prompt_template = """
    You are an expert meeting summarizer. Based on the meeting transcript provided, generate comprehensive and detailed meeting minutes.
    Include the key discussion points, decisions made, and any action items. Format the minutes in clear bullet points.
    
    Transcript:
    {text}
    
    Meeting Minutes:
    """
    # Initialize the Gemini 2.0 Flash model
    model = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.3)
    
    prompt = PromptTemplate(template=prompt_template, input_variables=["text"])
    
    # Create a summarization chain using the provided prompt and model
    chain = load_summarize_chain(model, chain_type="stuff", prompt=prompt)
    
    # Wrap the transcript in a Document object for the chain
    docs = [Document(page_content=transcript)]
    minutes = chain.run(docs)
    return minutes

def save_minutes_as_pdf(minutes_text, pdf_filename="meeting_minutes.pdf"):
    """Saves the meeting minutes text to a formatted PDF."""
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    
    # Add title
    pdf.set_font("Arial", "B", 16)
    pdf.cell(200, 10, "Meeting Minutes", ln=True, align="C")
    pdf.ln(10)
    
    # Add meeting minutes content line by line
    pdf.set_font("Arial", size=12)
    for line in minutes_text.split("\n"):
        pdf.multi_cell(0, 10, line)
    
    pdf.output(pdf_filename)
    return pdf_filename

@app.route("/generate_minutes", methods=["POST"])
def generate_minutes_endpoint():
    """
    Endpoint to generate meeting minutes from an uploaded PDF.
    1. Extracts text from the uploaded PDF.
    2. Uses the Gemini 2.0 Flash LLM to summarize the transcript.
    3. Saves the summarized meeting minutes as a PDF and returns it.
    """
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Save the uploaded PDF to disk
    pdf_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(pdf_path)
    
    # Extract the full transcript from the PDF
    transcript = extract_text_from_pdf(pdf_path)
    
    # Generate meeting minutes by summarizing the transcript
    minutes = generate_meeting_minutes(transcript)
    
    # Convert the meeting minutes to a PDF
    minutes_pdf_filename = f"minutes_{file.filename}.pdf"
    minutes_pdf_path = os.path.join(RESULT_FOLDER, minutes_pdf_filename)
    save_minutes_as_pdf(minutes, minutes_pdf_path)
    
    # Return the generated PDF
    return send_file(minutes_pdf_path, as_attachment=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
