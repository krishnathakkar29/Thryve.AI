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
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

app = Flask(__name__)

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
    if not os.path.exists("faiss_index"):
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
    If the answer is not in the context, respond with: "Answer is not available in the context."
    
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
    You are an AI that classifies user questions into one of the following categories:
    - IT: If the question is related to IT policies, software, or technical support.
    - HR: If the question is related to employee benefits, policies, or HR-related queries.
    - SQL: If the question requires retrieving data from a SQL database.
    - Unknown: If the question doesn't fit into the above categories.

    Return only the category name (IT, HR, SQL, or Unknown) without any additional text.

    User question: {question}
    """

    model = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.3)
    prompt = PromptTemplate(template=classification_prompt, input_variables=["question"])
    
    # Generate the response
    response = model.predict(prompt.format(question=question))
    
    return response.strip().upper()

@app.route("/route_request", methods=["POST"])
def route_request():
    try:
        data = request.get_json()
        user_question = data.get("question", "").strip()
        
        if not user_question:
            return jsonify({"error": "No question provided"}), 400

        category = classify_intent(user_question)

        if category == "IT":
            forward_url = "http://localhost:5000/ITAgent"
        elif category == "HR":
            forward_url = "http://localhost:5000/HRAgent"
        elif category == "SQL":
            forward_url = "http://localhost:5000/sqlAgent"
        else:
            return jsonify({"error": "Unable to classify the question"}), 400

        # Forward request to the appropriate endpoint
        response = requests.post(forward_url, json={"question": user_question})
        return response.json(), response.status_code

    except Exception as e:
        import traceback
        traceback.print_exc()
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
    response = read_sql_query(sql_query, "Startup.db")
    return jsonify({"sql_query": sql_query, "response": response})

if __name__ == "__main__":
    initialize_vector_store()
    app.run(host="0.0.0.0", port=5000, debug=True)







