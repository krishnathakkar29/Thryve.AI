from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import sqlite3
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure Gemini API Key
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

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    question = data.get("question")
    if not question:
        return jsonify({"error": "No question provided"}), 400
    
    sql_query = get_gemini_response(question, PROMPT)
    response = read_sql_query(sql_query, "Startup.db")
    return jsonify({"sql_query": sql_query, "response": response})

if __name__ == "__main__":
    app.run(debug=True)
