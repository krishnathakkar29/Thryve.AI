import streamlit as st
import requests

FLASK_BACKEND_URL = "http://127.0.0.1:5000/generate_minutes"  # Update if hosted elsewhere

st.title("Meeting Minutes Generator")

uploaded_file = st.file_uploader("Upload a PDF file", type=["pdf"])

if uploaded_file is not None:
    if st.button("Generate Meeting Minutes"):
        with st.spinner("Processing..."):
            files = {"file": uploaded_file.getvalue()}
            response = requests.post(FLASK_BACKEND_URL, files=files)
            
            if response.status_code == 200:
                st.success("Meeting minutes generated successfully!")
                st.download_button(
                    label="Download Meeting Minutes PDF",
                    data=response.content,
                    file_name="meeting_minutes.pdf",
                    mime="application/pdf"
                )
            else:
                st.error("Failed to generate meeting minutes. Please try again.")
