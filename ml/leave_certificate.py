import streamlit as st
import requests

# Flask API URL
FLASK_API_URL = "http://127.0.0.1:5050/leave_request"

def main():
    st.title("Leave Request Analyzer")
    
    emp_name = st.text_input("Enter Employee Name:")
    user_request = st.text_area("Enter Leave Request:")

    if st.button("Analyze Leave Request"):
        if not emp_name or not user_request:
            st.error("Please provide all required inputs.")
        else:
            # Call Flask API
            response = requests.post(FLASK_API_URL, json={"employee_name": emp_name, "question": user_request})
            if response.status_code == 200:
                data = response.json()
                if data["approved"]:
                    st.success("Leave Approved!")
                    st.text_area("Generated Leave Certificate:", data["response"], height=200)
                else:
                    st.error(data["response"])
            else:
                st.error("Error processing request. Please try again.")

if __name__ == "__main__":
    main()
