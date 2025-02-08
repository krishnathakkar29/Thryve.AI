import streamlit as st
import requests

BACKEND_URL = "http://127.0.0.1:5000"  # Change this if the backend is hosted elsewhere

def main():
    st.set_page_config(page_title="Chat PDF", layout="wide")
    st.header("Chat with PDF using Gemini 💁")

    user_question = st.text_input("Ask a Question from the PDF Files")

    if user_question:
        response = requests.post(f"{BACKEND_URL}/ask_question", json={"question": user_question})
        if response.status_code == 200:
            st.write("Reply:", response.json()["response"])
        else:
            st.error("Error fetching response")

    with st.sidebar:
        st.title("Menu:")
        uploaded_files = st.file_uploader("Upload your PDF Files", accept_multiple_files=True)
        
        if st.button("Submit & Process"):
            if uploaded_files:
                with st.spinner("Processing..."):
                    files = [("files", (file.name, file.getvalue(), "application/pdf")) for file in uploaded_files]
                    response = requests.post(f"{BACKEND_URL}/process_pdfs", files=files)
                    if response.status_code == 200:
                        st.success("Processing Complete")
                    else:
                        st.error("Error in processing PDFs")
            else:
                st.error("Please upload at least one PDF file")

if __name__ == "__main__":
    main()
