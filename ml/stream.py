import streamlit as st
import requests

# Streamlit page setup
st.set_page_config(page_title="Gemini Chatbot")

st.header("Gemini LLM Chatbot")

# Initialize session state for chat history
if 'chat_history' not in st.session_state:
    st.session_state['chat_history'] = []

# Input field for user query
input_text = st.text_input("Enter your question:", key="input")
submit = st.button("Ask")

# Flask API URL (Ensure Flask is running)
FLASK_API_URL = "http://127.0.0.1:5000/ask"

if submit and input_text:
    try:
        response = requests.post(FLASK_API_URL, json={"question": input_text})
        response_data = response.json()

        if "error" in response_data:
            st.error(response_data["error"])
        else:
            # Append to chat history
            bot_response = response_data["response"]
            st.session_state['chat_history'].append(("You", input_text))
            st.session_state['chat_history'].append(("Bot", bot_response))

    except requests.exceptions.RequestException as e:
        st.error(f"Error connecting to backend: {e}")

# Display chat history
st.subheader("Chat History")
for role, text in st.session_state['chat_history']:
    st.write(f"**{role}**: {text}")
