import os
from dotenv import load_dotenv
import pandas as pd
import numpy as np
from google import genai
from supabase import create_client, Client
from datetime import datetime
from dateutil.relativedelta import relativedelta
from sklearn.linear_model import LinearRegression

# Load the hidden keys from the .env file
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
client = genai.Client(api_key=GEMINI_API_KEY) 

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
        
        # --- THE BETTER ALTERNATIVE ---
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

    # --- REAL-TIME ADJUSTMENT VARS ---
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

        # CORRECT 3-MONTH PROJECTION REAL-TIME OVERRIDE
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
            model='gemma-3-27b-it',
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