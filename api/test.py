from google import genai
import os

client = genai.Client(api_key='AIzaSyAOswlQwpJSC1IWhjKADYQFGyETlrFStU4')

models = client.models.list()

for model in models:
    print("NAME:", model.name)
    print("DISPLAY:", getattr(model, "display_name", None))
    print("INPUT TOKENS:", getattr(model, "input_token_limit", None))
    print("OUTPUT TOKENS:", getattr(model, "output_token_limit", None))
    print("METHODS:", getattr(model, "supported_generation_methods", None))
    print("-" * 60)
