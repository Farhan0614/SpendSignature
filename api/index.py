from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.ensemble import IsolationForest
import numpy as np
from report_generator import generate_future_report

app = Flask(__name__)

# --- CORS CONFIGURATION ---
# This line is critical. It allows your React app (running on localhost:5173) 
# to send data to this Python server (running on localhost:5328).
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        # --- 1. GET DATA FROM REACT ---
        data = request.json
        amount = data.get('amount')
        history = data.get('history', [])
        
        # DEBUG LOG: Print incoming data to terminal
        print(f"\n--- NEW REQUEST ---")
        print(f"Amount: {amount}")
        print(f"History Length: {len(history)}")

        # --- 2. HANDLE EMPTY HISTORY (Cold Start) ---
        # If the user is new (0 expenses), we can't do math/AI.
        # We just check for massive typos (e.g., > 100,000).
        if not history:
            if float(amount) > 100000:
                 print("Result: BLOCKED (Empty History Hard Limit)")
                 return jsonify({"alert": True, "message": "This is a very large amount for a new account."})
            
            # If under 100k, let it pass (we don't have enough data to judge)
            print("Result: PASSED (Empty History)")
            return jsonify({"alert": False})

        # --- 3. DATA CONVERSION ---
        # Convert strings to numbers to prevent crashes
        history = [float(h) for h in history]
        amount = float(amount)

        # --- PHASE 1: HARD RULES (Small History: < 10 items) ---
        # Not enough data for statistics. We use simple "If/Then" rules.
        if len(history) < 10:
            print(f"Logic Used: PHASE 1 (Hard Rules)")
            
            if amount > 100000:
                print("Result: ANOMALY (> 100k limit)")
                return jsonify({"alert": True, "message": "High value detected via Rule."})
            
            print("Result: NORMAL")
            return jsonify({"alert": False})

        # --- PHASE 2: STATISTICS (Medium History: 10-49 items) ---
        # We use Z-Score (Standard Deviation) to find outliers.
        elif len(history) < 50:
            print(f"Logic Used: PHASE 2 (Z-Score Statistics)")
            
            mean = np.mean(history) # Average
            std = np.std(history)   # Wobble (Standard Deviation)
            
            # Safety check: Avoid dividing by zero if all expenses are identical
            if std == 0: 
                print("Result: SKIPPED (Standard Deviation is 0)")
                return jsonify({"alert": False})
            
            # Z-Score Formula: (Value - Average) / Wobble
            z_score = (amount - mean) / std
            
            print(f"Mean: {mean:.2f} | StdDev: {std:.2f}")
            print(f"Calculated Z-Score: {z_score:.2f}")
            
            # If Z-Score is > 3, it's statistically rare (happens < 0.3% of the time)
            if abs(z_score) > 3:
                print("Result: ANOMALY (Z-Score > 3)")
                return jsonify({"alert": True, "message": f"Unusual spend. This is {round(z_score, 1)}x your average."})
            
            print("Result: NORMAL")
            return jsonify({"alert": False})

        # --- PHASE 3: AI (Large History: 50+ items) ---
        # We use Isolation Forest (Machine Learning) to find complex anomaly patterns.
        else:
            print(f"Logic Used: PHASE 3 (Isolation Forest AI)")
            
            # 1. Setup the Model
            # contamination=0.1 means we expect roughly 10% of data to be outliers
            clf = IsolationForest(contamination=0.1, random_state=42)
            
            # 2. Reshape data for the AI (it expects a column of numbers)
            X = np.array(history).reshape(-1, 1)
            
            # 3. Train the Brain (Fit)
            clf.fit(X)
            
            # 4. Predict
            # Returns -1 for Anomaly, 1 for Normal
            prediction = clf.predict([[amount]])
            
            # Optional: Get the raw "Anomaly Score" for debugging
            raw_score = clf.decision_function([[amount]])
            
            print(f"AI Prediction Code: {prediction[0]} (-1 is bad, 1 is good)")
            print(f"AI Raw Score: {raw_score[0]:.4f}")
            
            if prediction[0] == -1:
                print("Result: ANOMALY DETECTED BY AI")
                return jsonify({"alert": True, "message": "AI detected an anomaly pattern."})
            
            print("Result: NORMAL")
            return jsonify({"alert": False})

    except Exception as e:
        # FAIL SAFE: If anything crashes, print error and allow the save
        print(f"CRITICAL ERROR: {e}")
        return jsonify({"alert": False, "error": str(e)})

@app.route('/api/forecast', methods=['POST'])
def forecast():
    try:
        data = request.json
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({"success": False, "error": "User ID is required"}), 400
            
        print(f"--- GENERATING FORECAST FOR: {user_id} ---")
        
        # Call our heavy processor
        result = generate_future_report(user_id)
        
        if "error" in result:
            return jsonify({"success": False, "error": result["error"]})
            
        return jsonify(result)

    except Exception as e:
        print(f"FORECAST ERROR: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    # Run on port 5328 to avoid conflict with React (5173)
    app.run(port=5328, debug=True)