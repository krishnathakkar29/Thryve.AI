import streamlit as st
import requests

BACKEND_URL = "http://localhost:5000/route_request"

st.title("AI-Powered Query & Meeting Minutes Generator")

# File Upload for Meeting Minutes
st.header("Upload a PDF for Meeting Minutes")
uploaded_file = st.file_uploader("Choose a PDF file", type=["pdf"])

if uploaded_file:
    st.write("Processing your file...")

    # Send the file to the backend
    files = {"file": (uploaded_file.name, uploaded_file, "application/pdf")}
    response = requests.post(BACKEND_URL, files=files)

    if response.status_code == 200:
        st.success("Meeting minutes generated successfully!")
        st.download_button(
            label="Download Minutes PDF",
            data=response.content,
            file_name="meeting_minutes.pdf",
            mime="application/pdf",
        )
    else:
        st.error("Error generating minutes: " + response.text)

# Text Input for Query Classification
st.header("Ask a Question")
user_question = st.text_input("Enter your query:")

if st.button("Submit Query"):
    if user_question.strip():
        # Send the query to the backend
        response = requests.post(BACKEND_URL, json={"question": user_question})
        
        if response.status_code == 200:
            st.success("Response Received:")
            st.json(response.json())
        else:
            st.error("Error: " + response.text)
    else:
        st.warning("Please enter a valid question.")

st.write("🚀 Powered by AI & Flask Backend")
