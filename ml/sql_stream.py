import streamlit as st
import requests

# Streamlit UI
st.set_page_config(page_title="SQL Query Generator & Retriever")
st.header("Gemini App to Retrieve SQL Data")

# Input field
question = st.text_input("Ask a question related to SQL data:", key="input")

if st.button("Submit"):
    if question:
        response = requests.post("http://127.0.0.1:5000/ask", json={"question": question})
        if response.status_code == 200:
            data = response.json()
            st.subheader("Generated SQL Query:")
            st.code(data["sql_query"], language="sql")

            st.subheader("Query Result:")
            if data["response"]:
                for row in data["response"]:
                    st.write(row)
            else:
                st.write("No results found.")
        else:
            st.error("Error fetching response from API")
