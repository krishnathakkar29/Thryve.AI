from flask import Flask, request, jsonify
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
import os
import sqlite3
import requests
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
from langchain.chains.summarize import load_summarize_chain
import sqlite3
from flask import Flask, request, jsonify
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import json
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
def get_gemini_response(question, prompt):
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content([prompt, question])
    return response.text.strip()

def read_sql_query(sql, db):
    conn = sqlite3.connect(db)
    cur = conn.cursor()
    cur.execute(sql)
    rows = cur.fetchall()
    conn.commit()
    conn.close()
    return rows

# SQL Prompt


def get_local_pdf_text(pdf_path: str) -> str:
    """Extract text from a local PDF file."""
    text = ""
    with open(pdf_path, "rb") as pdf_file:
        pdf_reader = PdfReader(pdf_file)
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text
    return text

def get_text_chunks(text: str):
    """Split the text into manageable chunks."""
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    return text_splitter.split_text(text)

def get_vector_store(text_chunks):
    """Create a FAISS vector store from text chunks and save it locally."""
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local("faiss_index")
def initialize_vector_store():
    """
    Check if a local FAISS vector store exists.
    If not, process the local employee handbook PDF and create one.
    """
    if os.path.exists("faiss_index"):
        print("Vector store not found. Processing local PDF: employee handbook.pdf")
        pdf_path = "employee handbook.pdf"  # Ensure this file is available locally.
        text = get_local_pdf_text(pdf_path)
        text_chunks = get_text_chunks(text)
        get_vector_store(text_chunks)
    else:
        print("Vector store found. Skipping PDF processing.")
def get_gemini_response(question, prompt):
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content([prompt, question])
    return response.text.strip()

def read_sql_query(sql, db):
    conn = sqlite3.connect(db)
    cur = conn.cursor()
    cur.execute(sql)
    rows = cur.fetchall()
    conn.commit()
    conn.close()
    return rows

def HR_conversational_chain():
    """Set up the conversational QA chain using a custom prompt."""
    prompt_template = """
    You are the HR Agent for this company, and your purpose is to cater to the employees' HR questions.
    Answer the question as detailed as possible from the provided context. 
    If the answer is not in the context, respond with: "This information isnt available at the moment, kindly contact your HR."
    
    Context:
    {context}
    
    Question:
    {question}
    
    Answer:
    """
    model = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.3)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    return load_qa_chain(model, chain_type="stuff", prompt=prompt)

def IT_conversational_chain():
    prompt_template = """
    You are the IT support for this company, and your purpose is to cater to the employees' IT questions.
    Provide IT needs help to your best capabilities, and if they keep on asking the same over and over again ask them to consult an IT specialist.
    Explain the user step by step on how to solve their problem.
    Dont add any unnecessary * and -.
    Context:
    {context}
    
    Question:
    {question}
    
    Answer:
    """
    model = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.3)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    return load_qa_chain(model, chain_type="stuff", prompt=prompt)

def classify_intent(question):
    classification_prompt = """
    You are an AI that classifies user queries into these categories:
    - IT: Related to IT policies, software, or technical support.
    - HR: About employee benefits, policies, or HR-related queries.
    - SQL: Queries requiring data retrieval from a SQL database.
    - Minutes: Request for generating meeting minutes from an uploaded document.
    - Leave: if the word leave is there in the question classify it as this. Requests for leave (casual, sick, vacation, emergency, etc.).
    - Payroll: Questions about salary, deductions, or payroll processing.
    - General: Apart from Leave, Greetings or non-office-related questions.
    
    User Question: {question}
    
    Return ONLY the category name (IT, HR, SQL, Minutes, Leave, Payroll, General).
    """

    model = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.3)
    prompt = PromptTemplate(template=classification_prompt, input_variables=["question"])
    
    # Generate the response
    response = model.predict(prompt.format(question=question))
    
    return response.strip().upper()
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


def get_employee_leave_details(emp_name):
    """Fetch employee details from the database."""
    conn = sqlite3.connect("CompanyDB.db")
    cursor = conn.cursor()
    
    query = """
    SELECT Name, paidLeaves, daysWorked, daysSinceLeave 
    FROM EmployeeTable 
    WHERE Name = ?
    """
    cursor.execute(query, (emp_name,))
    result = cursor.fetchone()
    conn.close()
    return result

import json

def extract_leave_details(user_request):
    """Extract start date, end date, and reason from the user's request using Gemini AI."""
    model = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.3)
    prompt = PromptTemplate(template="""
    Extract the leave start date, end date, and reason from the following leave request:
    "{user_request}"
    
    Return the result in this JSON format:
    {{"start_date": "YYYY-MM-DD", "end_date": "YYYY-MM-DD", "reason": "reason text"}}
    """, input_variables=["user_request"])
    
    chain = LLMChain(llm=model, prompt=prompt)
    response = chain.run({"user_request": user_request})

    # Debugging: Print the raw response
    print("Gemini raw response:", response)

    # Ensure response is a valid JSON string and extract the relevant part
    try:
        response_cleaned = response.strip("```json").strip("```").strip()
        leave_details = json.loads(response_cleaned)  # Safe JSON parsing
        return leave_details
    except json.JSONDecodeError:
        print("JSON parsing error. Invalid format received.")
        return None


def evaluate_leave_request(emp_name, start_date, end_date):
    """Evaluate leave eligibility based on company policy."""
    emp_details = get_employee_leave_details(emp_name)
    
    if not emp_details:
        return {"approved": False, "reason": f"Employee {emp_name} not found."}
    
    name, paid_leaves, days_worked, days_since_leave = emp_details
    
    approval = True
    reason = ""
    
    if paid_leaves <= 0:
        approval = False
        reason = "No paid leaves remaining."
    elif days_since_leave < 30:
        approval = False
        reason = "Leave taken too recently."
    elif days_worked < 240:
        approval = False
        reason = "Not enough days worked to be eligible."
    
    return {"approved": approval, "reason": reason}

def generate_leave_certificate(name, start_date, end_date, reason):
    """Generate a leave certificate if approved."""
    return f"""
    LEAVE CERTIFICATE
    
    To Whom It May Concern,
    
    This is to certify that {name} was granted leave from {start_date} to {end_date} due to {reason}.
    
    During this period, they were officially excused from their duties.
    
    Authorized Signatory,
    [Company Name]
    """

@app.route("/leave_request", methods=["POST"])
def leave_request_handler():
    """API Endpoint to process leave requests."""
    data = request.get_json()
    
    # Debugging: Print received request data
    print("Received data:", data)

    emp_name = data.get("employee_name")
    user_request = data.get("question")

    # Validate input fields
    if not emp_name or not user_request:
        return jsonify({"error": "Missing 'employee_name' or 'question' in request."}), 400
    
    # Extract leave details from request using Gemini
    leave_details = extract_leave_details(user_request)
    
    # Debugging: Print extracted leave details
    print("Extracted leave details:", leave_details)

    if not leave_details or "start_date" not in leave_details or "end_date" not in leave_details or "reason" not in leave_details:
        return jsonify({"error": "Could not extract valid leave details (start_date, end_date, reason)."}), 400
    
    # Evaluate leave eligibility
    evaluation = evaluate_leave_request(emp_name, leave_details['start_date'], leave_details['end_date'])

    if evaluation["approved"]:
        certificate = generate_leave_certificate(emp_name, leave_details['start_date'], leave_details['end_date'], leave_details['reason'])
        return jsonify({"approved": True, "response": certificate}), 200
    else:
        return jsonify({"approved": False, "response": f"Leave Request Denied: {evaluation['reason']}"}), 200
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
    minutes = minutes.replace("*", "")
    return minutes
def general_conversational_chain():
    prompt_template = """
    You are a corporate AI agent designed to ease up employee queries and tasks. Answer politely to greetings and general corporate related questions.
    if anything not related to corporate is asked, just say 'Sorry, I can't answer that.' 
    Context:
    {context}
    
    Question:
    {question}
    
    Answer:
    """
    model = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.3)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    return load_qa_chain(model, chain_type="stuff", prompt=prompt)
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
import boto3


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
    return jsonify({'response':minutes})
    # Convert the meeting minutes to a PDF
    # minutes_pdf_filename = f"minutes_{file.filename}"
    # print(minutes_pdf_filename)
    # minutes_pdf_path = os.path.join(RESULT_FOLDER, minutes_pdf_filename)
    # print(minutes_pdf_path)
    # save_minutes_as_pdf(minutes, minutes_pdf_path)
    # data = request.get_json()
    # s3 = boto3.client('s3', region_name='eu-north-1')
    # print(file.filename)
    # print(minutes_pdf_filename)
    # s3.upload_file(minutes_pdf_path,data[bucketname],minutes_pdf_filename)
    # return jsonify({"FILELINK": f"https://loctest090224.s3.eu-north-1.amazonaws.com/uploads/{minutes_pdf_filename}"})

@app.route("/route_request", methods=["POST"])
def route_request():
    forward_url = None  # Initialize forward_url
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request payload"}), 400

        first_key = next(iter(data.keys()), None)

        if first_key == "FILELINK":  # Handle S3 PDF retrieval
            url = data["FILELINK"]
            response = requests.get(url)

            with open("file.pdf", "wb") as file:
                file.write(response.content)

            print("Download complete!")
            with open('file.pdf', "rb") as pdf_file:
                files = {"file": ('file.pdf', pdf_file, "application/pdf")}
                forward_url = "http://localhost:5000/generate_minutes"
                response = requests.post(forward_url, files=files, json=data)
                return response.content, response.status_code

        user_question = data.get("question", "").strip()
        if not user_question:
            return jsonify({"error": "No question provided"}), 400

        category = classify_intent(user_question)
        employee_name = data.get("employee_name", "").strip()
        if category == "IT":
            forward_url = "http://localhost:5000/ITAgent"
        elif category == "HR":
            forward_url = "http://localhost:5000/HRAgent"
        elif category == "SQL":
            forward_url = "http://localhost:5000/sqlAgent"
        elif category == "Leave":
            forward_url = "http://localhost:5000/leave_request"
            return response.json(), response.status_code
        elif category == "Minutes":
            return jsonify({"error": "Minutes category requires a PDF file"}), 400
        else:
            forward_url = "http://localhost:5000/GpAgent"

        response = requests.post(forward_url, json={"employee_name": employee_name, "question": user_question})
        return response.json(), response.status_code

    except Exception as e:
        # Use forward_url safely, knowing it might be None.
        if forward_url:
            print(f"Error while forwarding request to {forward_url}: {e}")
        else:
            print(f"Error before determining forward_url: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/GpAgent", methods=["POST"])
def GP_ask():
    """
    Endpoint to answer questions based on the content of the employee handbook.
    The request JSON should include a key "question" with the user's query.
    """
    try:
        data = request.get_json()
        user_question = data.get("question", "")
        if 'leave' in user_question.lower():
            employee_name = data.get("employee_name", "").strip()
            print(employee_name,user_question)
            response = requests.post("http://localhost:5000/leave_request", json={"employee_name": employee_name, "question": user_question})
            return response.json(), response.status_code
        if not user_question:
            return jsonify({"error": "No question provided"}), 400

        # Load the vector store built from the employee handbook PDF
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        vector_store = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
        
        # Perform similarity search for relevant document chunks
        docs = vector_store.similarity_search(user_question)

        # Get the QA chain and generate an answer
        chain = general_conversational_chain()
        response = chain({"input_documents": docs, "question": user_question}, return_only_outputs=True)

        return jsonify({"response": response["output_text"]}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()  # Log the full error to the Flask console.
        return jsonify({"error": str(e)}), 500
@app.route("/ITAgent", methods=["POST"])
def IT_ask():
    """
    Endpoint to answer questions based on the content of the employee handbook.
    The request JSON should include a key "question" with the user's query.
    """
    try:
        data = request.get_json()
        user_question = data.get("question", "")
        
        if not user_question:
            return jsonify({"error": "No question provided"}), 400

        # Load the vector store built from the employee handbook PDF
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        vector_store = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
        
        # Perform similarity search for relevant document chunks
        docs = vector_store.similarity_search(user_question)

        # Get the QA chain and generate an answer
        chain = IT_conversational_chain()
        response = chain({"input_documents": docs, "question": user_question}, return_only_outputs=True)

        return jsonify({"response": response["output_text"]}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()  # Log the full error to the Flask console.
        return jsonify({"error": str(e)}), 500
@app.route("/HRAgent", methods=["POST"])
def HR_ask():
    """
    Endpoint to answer questions based on the content of the employee handbook.
    The request JSON should include a key "question" with the user's query.
    """
    try:
        data = request.get_json()
        user_question = data.get("question", "")
        
        if not user_question:
            return jsonify({"error": "No question provided"}), 400

        # Load the vector store built from the employee handbook PDF
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        vector_store = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
        
        # Perform similarity search for relevant document chunks
        docs = vector_store.similarity_search(user_question)

        # Get the QA chain and generate an answer
        chain = HR_conversational_chain()
        response = chain({"input_documents": docs, "question": user_question}, return_only_outputs=True)

        return jsonify({"response": response["output_text"]}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()  # Log the full error to the Flask console.
        return jsonify({"error": str(e)}), 500
@app.route("/sqlAgent", methods=["POST"])
def ask():
    PROMPT = """
    You are an expert in converting English questions to SQL queries!
    The SQL database consists of the following tables:

    EmployeeTable with columns: EmpID, Name, Age, Role, TeamID
    Teams with columns: id, name, teamIcon, manager_id
    TeamMembers with columns: team_id, member_id
    Projects with columns: project_id, project_name, location, client_name, team_id
    For example:

    Example 1 - How many employees are there in the company?
    The SQL command will be:
    SELECT COUNT(*) FROM EmployeeTable;

    Example 2 - List all employees who are Managers.
    The SQL command will be:
    SELECT * FROM EmployeeTable WHERE Role="Manager";

    Example 3 - Show all projects handled by the Cyber Security team.
    The SQL command will be:
    SELECT project_name FROM Projects
    JOIN Teams ON Projects.team_id = Teams.id
    WHERE Teams.name="Cyber Security";

    The generated SQL code should be structured properly and should not include unnecessary symbols like ``` at the beginning or end.
    """
    data = request.json
    question = data.get("question")
    if not question:
        return jsonify({"error": "No question provided"}), 400
    
    sql_query = get_gemini_response(question, PROMPT)
    response = read_sql_query(sql_query, "CompanyABC.db")
    return jsonify({"sql_query": sql_query, "response": response})

if __name__ == "__main__":
    initialize_vector_store()
    app.run(host="0.0.0.0", port=5000, debug=True)







