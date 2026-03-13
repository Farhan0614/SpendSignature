# backend/report_generator.py
import pandas as pd
import numpy as np
from google import genai
from supabase import create_client, Client
from datetime import datetime
from dateutil.relativedelta import relativedelta
from sklearn.linear_model import LinearRegression

# Supabase and Google GenAI Configuration
SUPABASE_URL = "https://xfbmcnrjqxwkxshxpxoc.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmYm1jbnJqcXh3a3hzaHhweG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzMxMjA5NCwiZXhwIjoyMDcyODg4MDk0fQ.NfhauLTwQ2oSety6N1EAt2J-krsaHLyL1X1fRt9Pe6U"
GEMINI_API_KEY = "AIzaSyAOswlQwpJSC1IWhjKADYQFGyETlrFStU4"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
client = genai.Client(api_key=GEMINI_API_KEY) 

def generate_future_report(user_id: str):
    """
    Analyzes historical transaction data to generate a 3-month predictive forecast 
    and personalized AI financial coaching using Gemma 3 27B.
    """
    
    # 1. Data Retrieval & Validation
    expenses_res = supabase.table("expenses").select("amount, date, categories(name)").eq("user_id", user_id).execute()
    incomes_res = supabase.table("wallet").select("income, date").eq("user_id", user_id).execute()
    
    exp_data = expenses_res.data
    inc_data = incomes_res.data

    # Prevent ML/Statistical failures if the user lacks sufficient historical data
    if len(exp_data) < 5:
        return {"error": "We need a little more data! Log a few more expenses across different dates so our AI can accurately predict your future trends."}

    # 2. Data Aggregation (Pandas)
    # Convert raw JSON into DataFrames and standardize dates to group by YYYY-MM
    df_exp = pd.DataFrame(exp_data)
    df_inc = pd.DataFrame(inc_data)

    df_exp['category'] = df_exp['categories'].apply(lambda x: x['name'] if isinstance(x, dict) else 'Unknown')
    df_exp['date'] = pd.to_datetime(df_exp['date'])
    df_inc['date'] = pd.to_datetime(df_inc['date']) if not df_inc.empty else pd.Series(dtype='datetime64[ns]')

    df_exp['month'] = df_exp['date'].dt.strftime('%Y-%m')
    df_inc['month'] = df_inc['date'].dt.strftime('%Y-%m') if not df_inc.empty else pd.Series(dtype='object')

    # Sum all transactions per month and merge income/expenses into a single timeline
    monthly_exp = df_exp.groupby('month')['amount'].sum().reset_index()
    monthly_inc = df_inc.groupby('month')['income'].sum().reset_index() if not df_inc.empty else pd.DataFrame(columns=['month', 'income'])

    df_merged = pd.merge(monthly_exp, monthly_inc, on='month', how='outer').fillna(0)
    df_merged = df_merged.sort_values('month')

    # Core Financial Metrics
    avg_monthly_exp = df_merged['amount'].mean()
    avg_monthly_inc = df_merged['income'].mean()
    total_balance = df_merged['income'].sum() - df_merged['amount'].sum()
    runway_months = round(total_balance / avg_monthly_exp, 1) if avg_monthly_exp > 0 and total_balance > 0 else 0

    # 3. Category Momentum Analysis
    # Isolate the two most recent months to calculate percentage shifts in spending habits
    last_month_str = df_merged['month'].iloc[-1]
    prev_month_str = df_merged['month'].iloc[-2] if len(df_merged) >= 2 else None

    last_month_exp = df_exp[df_exp['month'] == last_month_str]
    prev_month_exp = df_exp[df_exp['month'] == prev_month_str] if prev_month_str else pd.DataFrame()

    last_totals = last_month_exp.groupby('category')['amount'].sum()
    prev_totals = prev_month_exp.groupby('category')['amount'].sum() if not prev_month_exp.empty else pd.Series()

    # Format the recent breakdown for the LLM prompt (e.g., "Food: 40%, Transport: 20%")
    category_breakdown_str = "No expenses logged recently."
    if not last_totals.empty:
        total_spent_last_month = last_totals.sum()
        cat_pcts = (last_totals / total_spent_last_month * 100).round(1).sort_values(ascending=False)
        category_breakdown_str = ", ".join([f"{cat}: {pct}%" for cat, pct in cat_pcts.items()])

    # Identify the top spending category and calculate its recent growth/shrinkage
    if not last_totals.empty:
        top_category = last_totals.idxmax()
        top_cat_amount = last_totals.max()
        prev_cat_amount = prev_totals.get(top_category, 0)
        
        if prev_cat_amount > 0:
            pct_change = ((top_cat_amount - prev_cat_amount) / prev_cat_amount) * 100
            momentum_text = f"Up {pct_change:.0f}% from last month" if pct_change > 0 else f"Down {abs(pct_change):.0f}% from last month"
        else:
            momentum_text = "New spending spike this month"
    else:
        top_category = df_exp.groupby('category')['amount'].sum().idxmax()
        momentum_text = "Highest overall historical spend"


    # 4. Machine Learning Trend Forecasting
    # Use Linear Regression to find the "velocity" of income/expenses over time
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

    # Append Historical Data to Chart Payload
    last_month_date = datetime.strptime(df_merged['month'].iloc[-1], '%Y-%m')
    last_idx = df_merged['time_idx'].iloc[-1]
    
    for _, row in df_merged.tail(3).iterrows():
        chart_data.append({
            "month": row['month'],
            "expense": float(row['amount']),
            "income": float(row['income']),
            "isPrediction": False
        })

    # Predict and append Future Data (Next 3 Months)
    projected_net_savings = 0

    for i in range(1, 4):
        future_idx = last_idx + i
        next_month = (last_month_date + relativedelta(months=i)).strftime('%Y-%m')
        
        if model_exp is not None:
            # max(0, prediction) clamps negative predictions to prevent charting errors
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

    # 5. AI Advisor Generation (Gemma 3 27B)
    # Pass calculated metrics into the LLM context to formulate personalized advice
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
    - Recent Spending Breakdown: {category_breakdown_str}
    - Top Burn Risk Category: {top_category} ({momentum_text})
    
    YOUR MISSION:
    - Paragraph 1 (Health Summary): Warmly assess their general financial health, acknowledging their runway and savings.
    - Paragraph 2 (Trend & Category Diagnosis): Analyze their Income/Expense Velocity (are expenses growing faster than income?) and comment specifically on the percentages in their Recent Spending Breakdown.
    - Paragraph 3 (Action Plan): Provide 1 or 2 specific, actionable suggestions based on their Top Burn Risk or spending ratios to improve their next 3 months.
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

    # 6. Response Construction
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