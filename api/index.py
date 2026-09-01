import os
from dotenv import load_dotenv
import pandas as pd
import numpy as np
from google import genai
from supabase import create_client, Client
from datetime import datetime
from dateutil.relativedelta import relativedelta
from flask import Flask, request, jsonify
from flask_cors import CORS

# ---------- env & clients (created once at import) ----------
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
client = genai.Client(api_key=GEMINI_API_KEY)

"""
Pure-Python Isolation Forest (no scikit-learn / scipy dependency).

Behaviorally mirrors sklearn.ensemble.IsolationForest for the single-feature
case used by SpendSignature's anomaly detector:
  - fits `n_estimators` random trees on the training sample
  - scores a candidate point by its average path length
  - flags it as an anomaly when its score is below the contamination quantile
    of the training scores (same contract as sklearn's predict() == -1).
"""

import random
import math


def _c(n):
    """Average path length of an unsuccessful search in a BST (sklearn's c(n))."""
    if n <= 1:
        return 0.0
    return 2.0 * (math.log(n - 1) + 0.5772156649) - 2.0 * (n - 1) / n


class _IsolationTree:
    __slots__ = ("split_value", "size", "left", "right")

    def __init__(self):
        self.split_value = None
        self.size = 0
        self.left = None
        self.right = None


def _build_tree(X, rng, height, height_limit):
    n = len(X)
    node = _IsolationTree()
    node.size = n
    if n <= 1 or height >= height_limit:
        return node

    lo = min(X)
    hi = max(X)
    if hi <= lo:  # all identical values -> cannot split
        return node

    split = rng.uniform(lo, hi)
    left = [x for x in X if x < split]
    right = [x for x in X if x >= split]
    if not left or not right:
        return node

    node.split_value = split
    node.left = _build_tree(left, rng, height + 1, height_limit)
    node.right = _build_tree(right, rng, height + 1, height_limit)
    return node


def _path_length(x, node, height):
    if node.split_value is None:
        return height + _c(node.size)
    if x < node.split_value:
        return _path_length(x, node.left, height + 1)
    return _path_length(x, node.right, height + 1)


class IsolationForest:
    """Drop-in replacement for sklearn's IsolationForest (1-D case)."""

    def __init__(self, n_estimators=100, contamination=0.05, random_state=42):
        self.n_estimators = n_estimators
        self.contamination = contamination
        self.random_state = random_state
        self._trees = []
        self._threshold = None
        self._n = 0

    def fit(self, X):
        X = np.asarray(X, dtype=float).reshape(-1).tolist()
        self._n = len(X)
        rng = random.Random(self.random_state)
        height_limit = math.ceil(math.log2(max(2, self._n)))
        self._trees = [
            _build_tree(X, rng, 0, height_limit)
            for _ in range(self.n_estimators)
        ]
        # threshold = lower contamination quantile of training path lengths
        scores = sorted(self._score_point(x) for x in X)
        idx = int(self.contamination * len(scores))
        idx = min(max(idx, 0), len(scores) - 1)
        self._threshold = scores[idx]
        return self

    def _score_point(self, x):
        avg_path = (
            sum(_path_length(x, t, 0) for t in self._trees) / self.n_estimators
        )
        return avg_path  # lower path length = more anomalous

    def predict(self, X):
        X = np.asarray(X, dtype=float).reshape(-1).tolist()
        return [self._flag(x) for x in X]

    def _flag(self, x):
        score = self._score_point(x)
        # anomaly = path length at or below the contamination threshold
        return -1 if score <= self._threshold else 1

class LinearRegression:
    """Minimal single-feature linear regression (numpy only, sklearn-compatible API)."""
    def __init__(self):
        self.coef_ = None
        self.intercept_ = 0.0

    def fit(self, X, y):
        X = np.asarray(X, dtype=float).reshape(-1)
        y = np.asarray(y, dtype=float)
        x_mean = X.mean()
        y_mean = y.mean()
        denom = ((X - x_mean) ** 2).sum()
        slope = ((X - x_mean) * (y - y_mean)).sum() / denom if denom != 0 else 0.0
        self.coef_ = np.array([slope])
        self.intercept_ = y_mean - slope * x_mean
        return self

    def predict(self, X):
        X = np.asarray(X, dtype=float).reshape(-1)
        return self.intercept_ + self.coef_[0] * X

def generate_future_report(user_id: str):
    # 1. Fetch Data
    expenses_res = supabase.table("expenses").select("amount, date, categories(name)").eq("user_id", user_id).execute()
    incomes_res = supabase.table("wallet").select("income, date").eq("user_id", user_id).execute()
    
    exp_data = expenses_res.data
    inc_data = incomes_res.data

    if len(exp_data) < 5:
        return {"error": "We need a little more data! Log a few more expenses across different dates so our AI can accurately predict your future trends."}

    # 2. Process Pandas
    df_exp = pd.DataFrame(exp_data)
    df_inc = pd.DataFrame(inc_data)

    df_exp['category'] = df_exp['categories'].apply(lambda x: x['name'] if isinstance(x, dict) else 'Unknown')
    df_exp['date'] = pd.to_datetime(df_exp['date'])
    df_inc['date'] = pd.to_datetime(df_inc['date']) if not df_inc.empty else pd.Series(dtype='datetime64[ns]')

    df_exp['month'] = df_exp['date'].dt.strftime('%Y-%m')
    df_inc['month'] = df_inc['date'].dt.strftime('%Y-%m') if not df_inc.empty else pd.Series(dtype='object')

    monthly_exp = df_exp.groupby('month')['amount'].sum().reset_index()
    monthly_inc = df_inc.groupby('month')['income'].sum().reset_index() if not df_inc.empty else pd.DataFrame(columns=['month', 'income'])

    df_merged = pd.merge(monthly_exp, monthly_inc, on='month', how='outer').fillna(0)
    df_merged = df_merged.sort_values('month')

    current_month_str = datetime.now().strftime('%Y-%m')
    df_train = df_merged[df_merged['month'] < current_month_str]
    if df_train.empty:
        df_train = df_merged 

    avg_monthly_exp = df_train['amount'].mean()
    avg_monthly_inc = df_train['income'].mean()
    total_balance = df_merged['income'].sum() - df_merged['amount'].sum()
    runway_months = round(total_balance / avg_monthly_exp, 1) if avg_monthly_exp > 0 and total_balance > 0 else 0

    # --- BURN RISK & CATEGORY (Uses Till-Date Data) ---
    current_month_exp = df_exp[df_exp['month'] == current_month_str]
    
    if not current_month_exp.empty:
        current_totals = current_month_exp.groupby('category')['amount'].sum()
        top_category = current_totals.idxmax()
        top_cat_amount = current_totals.max()
        total_spent_current = current_totals.sum()
        
        # Calculate exactly what percentage of this month's pie this category is eating
        top_cat_pct = (top_cat_amount / total_spent_current) * 100
        momentum_text = f"{top_cat_pct:.0f}% of this month's spending"
        
        cat_pcts = (current_totals / total_spent_current * 100).round(1).sort_values(ascending=False)
        category_breakdown_str = ", ".join([f"{cat}: {pct}%" for cat, pct in cat_pcts.items()])
    else:
        top_category = "No data yet"
        momentum_text = "Log an expense to see your top category"
        category_breakdown_str = "No expenses logged this month yet."

    # 4. Overall Burn Rate (Completed Months)
    if len(df_train) >= 2:
        last_month_total = df_train['amount'].iloc[-1]
        prev_month_total = df_train['amount'].iloc[-2]
        if prev_month_total > 0:
            pct_change = ((last_month_total - prev_month_total) / prev_month_total) * 100
            overall_burn_rate = f"Overall spending was {'Up' if pct_change > 0 else 'Down'} {abs(pct_change):.0f}% last month"
        else:
            overall_burn_rate = "Stable"
    else:
        overall_burn_rate = "Tracking..."

    # 5. Machine Learning (Linear Regression)
    chart_data = []
    df_train = df_train.copy()
    df_train['time_idx'] = np.arange(len(df_train))
    
    X = df_train[['time_idx']].values
    y_exp = df_train['amount'].values
    y_inc = df_train['income'].values

    if len(df_train) >= 2:
        model_exp = LinearRegression().fit(X, y_exp)
        model_inc = LinearRegression().fit(X, y_inc)
        trend_exp = model_exp.coef_[0]
        trend_inc = model_inc.coef_[0]
    else:
        model_exp = None
        model_inc = None
        trend_exp = 0
        trend_inc = 0

    last_train_date = datetime.strptime(df_train['month'].iloc[-1], '%Y-%m')
    last_idx = df_train['time_idx'].iloc[-1]
    
    for _, row in df_train.tail(3).iterrows():
        chart_data.append({
            "month": row['month'],
            "expense": int(round(row['amount'], 0)),
            "income": int(round(row['income'], 0)), 
            "isPrediction": False
        })

    current_month_exp_actual = df_exp[df_exp['month'] == current_month_str]['amount'].sum() if not df_exp.empty else 0
    current_month_inc_actual = df_inc[df_inc['month'] == current_month_str]['income'].sum() if not df_inc.empty else 0

    projected_net_savings = 0

    for i in range(1, 4):
        future_idx = last_idx + i
        future_month = (last_train_date + relativedelta(months=i)).strftime('%Y-%m')
        
        if model_exp is not None:
            pred_exp = max(0, float(model_exp.predict([[future_idx]])[0]))
            pred_inc = max(0, float(model_inc.predict([[future_idx]])[0]))
        else:
            pred_exp = float(avg_monthly_exp)
            pred_inc = float(avg_monthly_inc)

        # 3-MONTH PROJECTION REAL-TIME OVERRIDE
        if i == 1: 
            pred_exp = max(pred_exp, float(current_month_exp_actual))
            pred_inc = max(pred_inc, float(current_month_inc_actual))
            
        projected_net_savings += (pred_inc - pred_exp)

        chart_data.append({
            "month": future_month,
            "expense": int(round(pred_exp, 0)), 
            "income": int(round(pred_inc, 0)),  
            "isPrediction": True
        })

    prompt = f"""
    You are an elite, highly empathetic personal finance coach. 
    Analyze the user's financial data and provide a personalized, actionable financial outlook.
    
    CRITICAL RULES:
    1. Tone: Friendly, highly professional, encouraging. Avoid complex banking jargon.
    2. NO CURRENCY SYMBOLS: Do not use $, €, £, ₨, or any other currency symbol anywhere. Just write the raw numbers.
    3. FORMATTING: Return exactly 3 separate plain-text paragraphs. Do not use Markdown headers or asterisks. 
    
    USER DATA CONTEXT:
    - Current Total Savings: {total_balance:.2f}
    - Runway (Survival without income): {runway_months} months
    - Average Monthly Income: {avg_monthly_inc:.2f} (Velocity: {trend_inc:.2f} per month)
    - Average Monthly Expense: {avg_monthly_exp:.2f} (Velocity: {trend_exp:.2f} per month)
    - THIS Month's Spending Breakdown So Far: {category_breakdown_str}
    - Top Burn Risk Category Right Now: {top_category}
    - Historical Momentum: {overall_burn_rate}
    
    YOUR MISSION:
    - Paragraph 1 (Health Summary): Warmly assess their general financial health, acknowledging their runway and savings.
    - Paragraph 2 (Trend Diagnosis): Analyze their Income/Expense Velocity (are expenses growing faster than income?) and comment on their current month's spending breakdown and historical momentum.
    - Paragraph 3 (Action Plan): Provide 1 or 2 specific, actionable suggestions based on their Top Burn Risk to finish the current month strong.
    """

    try:
        response = client.models.generate_content(
            # model='gemma-3-27b-it',
            # model='gemini-2.5-flash',
             model='gemma-4-31b-it',
            # model='gemma-4-26b-a4b-it',
            contents=prompt
        )
        ai_text = response.text
    except Exception as e:
        print(f"\n--- CRITICAL GEMMA ERROR ---\n{str(e)}\n-----------------------------\n")
        ai_text = "Your financial data has been processed, but the AI advisor is currently unavailable. Please check your charts for insights."

    return {
        "success": True,
        "metrics": {
            "runway": runway_months,
            "topCategory": top_category,
            "momentumText": momentum_text,
            "overallBurnRate": overall_burn_rate, # INCLUDED FOR THE UI
            "avgExpense": float(avg_monthly_exp),
            "projectedSavings": round(float(projected_net_savings), 2),
            "incomeVelocity": float(trend_inc),
            "expenseVelocity": float(trend_exp)
        },
        "chartData": chart_data,
        "aiSummary": ai_text
    }

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

@app.route('/api/health', methods=['GET'])
def health():
    try:
        env_ok = all(os.getenv(k) for k in
                     ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "GEMINI_API_KEY"])
        return jsonify({"ok": True, "env_ok": env_ok})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 200

if __name__ == '__main__':
    app.run(port=5328, debug=os.getenv("FLASK_DEBUG", "false").lower() == "true")
