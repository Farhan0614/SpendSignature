import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from isolation_forest import IsolationForest
import numpy as np
from report_generator import generate_future_report, supabase

app = Flask(__name__)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,https://spendsignature.vercel.app"
    ).split(",")
    if origin.strip()
]

CORS(app, resources={r"/*": {"origins": allowed_origins}})

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"alert": False, "error": "Missing or invalid security token"}), 401

        token = auth_header.split(' ')[1]
        user_response = supabase.auth.get_user(token)
        verified_user_id = user_response.user.id

        data = request.json or {}
        amount = float(data.get('amount', 0))
        category_id = data.get('category_id')

        if not category_id:
            return jsonify({"alert": False, "error": "category_id is required"}), 400

        history_res = (
            supabase.table("expenses")
            .select("amount")
            .eq("user_id", verified_user_id)
            .eq("category_id", category_id)
            .order("date", desc=True)
            .limit(100)
            .execute()
        )


        history = [float(item["amount"]) for item in (history_res.data or [])]

        print(history)
        
        if not history:
            if amount > 100000:
                return jsonify({
                    "alert": True,
                    "message": "This is a very large amount for a new category."
                })
            return jsonify({"alert": False})

        if len(history) < 10:
            if amount > 100000:
                return jsonify({"alert": True, "message": "High value detected via Rule."})
            return jsonify({"alert": False})

        elif len(history) < 50:
            mean = np.mean(history)
            std = np.std(history)

            if std == 0:
                return jsonify({"alert": False})

            z_score = (amount - mean) / std

            if abs(z_score) > 3:
                return jsonify({
                    "alert": True,
                    "message": f"Unusual spend. This is {round(z_score, 1)}x your average."
                })

            return jsonify({"alert": False})

        else:
            clf = IsolationForest(contamination=0.05, random_state=42)
            X = np.array(history).reshape(-1, 1)
            clf.fit(X)
            prediction = clf.predict([[amount]])

            if prediction[0] == -1:
                return jsonify({
                    "alert": True,
                    "message": "AI detected an anomaly pattern."
                })

            return jsonify({"alert": False})

    except Exception as e:
        print(f"CRITICAL AI ERROR: {e}")
        return jsonify({"alert": False, "error": str(e)}), 500


@app.route('/api/forecast', methods=['POST'])
def forecast():
    try:
        # --- 1. SECURE TOKEN VERIFICATION ---
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"success": False, "error": "Missing or invalid security token"}), 401
            
        token = auth_header.split(' ')[1]
        
        # Ask Supabase to verify if this token is real and hasn't expired
        user_response = supabase.auth.get_user(token)
        verified_user_id = user_response.user.id
        
        print(f"--- GENERATING FORECAST FOR VERIFIED USER: {verified_user_id} ---")
        
        # --- 2. GENERATE REPORT (Using the verified ID, not the requested one) ---
        result = generate_future_report(verified_user_id)
        
        if "error" in result:
            return jsonify({"success": False, "error": result["error"]})
            
        return jsonify(result)

    except Exception as e:
        print(f"FORECAST SECURITY/SERVER ERROR: {e}")
        return jsonify({"success": False, "error": "Unauthorized or Server Error"}), 401

if __name__ == '__main__':
    app.run(port=5328, debug=os.getenv("FLASK_DEBUG", "false").lower() == "true")
