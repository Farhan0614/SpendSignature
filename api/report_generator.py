# backend/report_generator.py
import pandas as pd
import numpy as np
from google import genai
from supabase import create_client, Client
from datetime import datetime
from dateutil.relativedelta import relativedelta
from sklearn.linear_model import LinearRegression

# --- CONFIGURATION ---
SUPABASE_URL = "https://xfbmcnrjqxwkxshxpxoc.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmYm1jbnJqcXh3a3hzaHhweG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzMxMjA5NCwiZXhwIjoyMDcyODg4MDk0fQ.NfhauLTwQ2oSety6N1EAt2J-krsaHLyL1X1fRt9Pe6U"
GEMINI_API_KEY = "AIzaSyAOswlQwpJSC1IWhjKADYQFGyETlrFStU4"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
client = genai.Client(api_key=GEMINI_API_KEY) 

def generate_future_report(user_id: str):
    # 1. FETCH DATA
    expenses_res = supabase.table("expenses").select("amount, date, categories(name)").eq("user_id", user_id).execute()
    incomes_res = supabase.table("wallet").select("income, date").eq("user_id", user_id).execute()
    
    exp_data = expenses_res.data
    inc_data = incomes_res.data

    if len(exp_data) < 5:
        return {"error": "We need a little more data! Log a few more expenses across different dates so our AI can accurately predict your future trends."}

    # 2. PROCESS WITH PANDAS
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

    avg_monthly_exp = df_merged['amount'].mean()
    avg_monthly_inc = df_merged['income'].mean()
    total_balance = df_merged['income'].sum() - df_merged['amount'].sum()
    runway_months = round(total_balance / avg_monthly_exp, 1) if avg_monthly_exp > 0 and total_balance > 0 else 0

    # --- NEW: CATEGORY MOMENTUM MATH ---
    # Find the top category of the MOST RECENT month, and compare it to the month before
    last_month_str = df_merged['month'].iloc[-1]
    prev_month_str = df_merged['month'].iloc[-2] if len(df_merged) >= 2 else None

    last_month_exp = df_exp[df_exp['month'] == last_month_str]
    prev_month_exp = df_exp[df_exp['month'] == prev_month_str] if prev_month_str else pd.DataFrame()

    last_totals = last_month_exp.groupby('category')['amount'].sum()
    prev_totals = prev_month_exp.groupby('category')['amount'].sum() if not prev_month_exp.empty else pd.Series()

    if not last_totals.empty:
        top_category = last_totals.idxmax()
        top_cat_amount = last_totals.max()
        prev_cat_amount = prev_totals.get(top_category, 0)
        
        if prev_cat_amount > 0:
            pct_change = ((top_cat_amount - prev_cat_amount) / prev_cat_amount) * 100
            if pct_change > 0:
                momentum_text = f"Up {pct_change:.0f}% from last month"
            else:
                momentum_text = f"Down {abs(pct_change):.0f}% from last month"
        else:
            momentum_text = "New spending spike this month"
    else:
        top_category = df_exp.groupby('category')['amount'].sum().idxmax()
        momentum_text = "Highest overall historical spend"


    # --- 3. ADVANCED MACHINE LEARNING FORECASTING ---
    chart_data = []
    df_merged['time_idx'] = np.arange(len(df_merged))
    X = df_merged[['time_idx']].values
    y_exp = df_merged['amount'].values
    y_inc = df_merged['income'].values

    trend_exp = 0
    trend_inc = 0

    if len(df_merged) >= 2:
        model_exp = LinearRegression().fit(X, y_exp)
        model_inc = LinearRegression().fit(X, y_inc)
        trend_exp = model_exp.coef_[0]
        trend_inc = model_inc.coef_[0]
    else:
        model_exp = None
        model_inc = None

    last_month_date = datetime.strptime(df_merged['month'].iloc[-1], '%Y-%m')
    last_idx = df_merged['time_idx'].iloc[-1]
    
    for _, row in df_merged.tail(3).iterrows():
        chart_data.append({
            "month": row['month'],
            "expense": float(row['amount']),
            "income": float(row['income']),
            "isPrediction": False
        })

    projected_net_savings = 0

    for i in range(1, 4):
        future_idx = last_idx + i
        next_month = (last_month_date + relativedelta(months=i)).strftime('%Y-%m')
        
        if model_exp is not None:
            pred_exp = max(0, float(model_exp.predict([[future_idx]])[0]))
            pred_inc = max(0, float(model_inc.predict([[future_idx]])[0]))
        else:
            pred_exp = float(avg_monthly_exp)
            pred_inc = float(avg_monthly_inc)
            
        projected_net_savings += (pred_inc - pred_exp)

        chart_data.append({
            "month": next_month,
            "expense": round(pred_exp, 2),
            "income": round(pred_inc, 2),
            "isPrediction": True
        })

    # 4. GENERATE AI INSIGHTS VIA GEMINI
    prompt = f"""
    You are a friendly, easy-to-understand personal finance coach. 
    Analyze this user's data and provide a 3-paragraph future financial outlook.
    
    CRITICAL RULES:
    1. Use simple, everyday language. Do not use complex financial jargon.
    2. DO NOT use any currency symbols anywhere in your response. Just write the raw numbers.
    3. Do not use markdown headers. Use plain text paragraphs.
    
    User Data Context:
    - Average Monthly Income: {avg_monthly_inc:.2f} (Growing/Shrinking by: {trend_inc:.2f} per month)
    - Average Monthly Expense: {avg_monthly_exp:.2f} (Growing/Shrinking by: {trend_exp:.2f} per month)
    - Current Total Savings: {total_balance:.2f}
    - Top Burn Risk right now: {top_category} ({momentum_text})
    - Runway: {runway_months} months.
    
    Write an encouraging financial assessment. Point out their specific Income and Expense trends, and mention their top burn risk by name.
    """

    try:
        response = client.models.generate_content(
            model='gemma-3-27b-it',
            contents=prompt
        )
        ai_text = response.text
    except Exception as e:
        print(f"\n--- CRITICAL GEMINI ERROR ---\n{str(e)}\n-----------------------------\n")
        ai_text = "Your financial data has been processed, but the AI advisor is currently unavailable. Please check your charts for insights."

    # 5. RETURN STRUCTURED PAYLOAD
    return {
        "success": True,
        "metrics": {
            "runway": runway_months,
            "topCategory": top_category,
            "momentumText": momentum_text,
            "avgExpense": float(avg_monthly_exp),
            "projectedSavings": round(float(projected_net_savings), 2),
            "incomeVelocity": float(trend_inc),
            "expenseVelocity": float(trend_exp)
        },
        "chartData": chart_data,
        "aiSummary": ai_text
    }