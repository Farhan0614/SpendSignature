from google import genai

GEMINI_API_KEY = "AIzaSyAOswlQwpJSC1IWhjKADYQFGyETlrFStU4"
client = genai.Client(api_key=GEMINI_API_KEY)

print("--- FETCHING GEMMA MODELS FOR YOUR KEY ---")
try:
    for model in client.models.list():
        # Changed to look for gemma instead of gemini
        if "gemma" in model.name:
            print(model.name)
except Exception as e:
    print(f"Error fetching models: {e}")
print("----------------------------------------------")