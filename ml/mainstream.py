import streamlit as st
import requests

# Backend API URL (Replace with your actual Flask API URL)
API_URL = "http://localhost:5000/route_request"

st.title("AI Assistant Router")

st.write("Enter your question below, and the system will determine the appropriate agent.")

# User input
user_question = st.text_area("Your Question")

if st.button("Get Answer"):
    if user_question.strip():
        try:
            response = requests.post(API_URL, json={"question": user_question})
            if response.status_code == 200:
                data = response.json()
                st.success("Response:")
                st.json(data)
            else:
                st.error(f"Error: {response.json().get('error', 'Unknown error')}")
        except Exception as e:
            st.error(f"Request failed: {str(e)}")
    else:
        st.warning("Please enter a question before submitting.")
