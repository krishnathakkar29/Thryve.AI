import sqlite3
from flask import Flask, request, jsonify
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import json
app = Flask(__name__)

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


if __name__ == "__main__":
    app.run(debug=True, port= 5050)
