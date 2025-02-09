import requests

url = "https://loctest090224.s3.eu-north-1.amazonaws.com/uploads/1739068327563-C0753_exp9[1].pdf"  # Replace with your file URL
response = requests.get(url)

with open("file.pdf", "wb") as file:
    file.write(response.content)

print("Download complete!")