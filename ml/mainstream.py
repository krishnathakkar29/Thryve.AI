import streamlit as st
import requests

# URL for your Flask backend's route_request endpoint
BACKEND_URL = "http://localhost:5000/route_request"

st.title("Flask Backend Test")

# --- Section: Test Text-Based Request ---
st.subheader("Test Text-Based Request")
employee_name = st.text_input("Employee Name (if applicable):")
question = st.text_input("Enter your question:")

if st.button("Submit Question"):
    if question.strip():
        try:
            # Send both question and employee_name to the backend
            payload = {"employee_name": employee_name, "question": question}
            response = requests.post(BACKEND_URL, json=payload)
            if response.ok:
                try:
                    result = response.json()
                    st.success("Response:")
                    st.json(result)
                except Exception:
                    st.text("Response: " + response.text)
            else:
                st.error("Error: " + response.text)
        except Exception as e:
            st.error("Exception: " + str(e))
    else:
        st.error("Please enter a question.")

# --- Section: Test PDF Upload for Minutes Generation ---
st.subheader("Test PDF Upload (Minutes Generation)")
uploaded_file = st.file_uploader("Upload a PDF file", type=["pdf"])

if st.button("Submit File"):
    if uploaded_file is not None:
        try:
            files = {"file": (uploaded_file.name, uploaded_file, "application/pdf")}
            response = requests.post(BACKEND_URL, files=files)
            if response.ok:
                st.success("File processed successfully!")
                # If the response is a PDF file (meeting minutes), offer a download button
                if "application/pdf" in response.headers.get("Content-Type", ""):
                    st.download_button("Download Generated PDF",
                                       data=response.content,
                                       file_name="generated_minutes.pdf",
                                       mime="application/pdf")
                else:
                    st.write("Response:", response.text)
            else:
                st.error("Error: " + response.text)
        except Exception as e:
            st.error("Exception: " + str(e))
    else:
        st.error("Please upload a PDF file.")
