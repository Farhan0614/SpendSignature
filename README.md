# 💰 SpendSignature — AI-Powered Personal Finance Tracker

[🔗 Live Demo](https://spendsignature.vercel.app)

SpendSignature is a full-stack web app that helps you understand, track, and predict your spending. It combines real-time dashboards with AI-powered anomaly detection and a 3-month financial forecast — turning raw transactions into actionable insights.

## Features

- **📊 Smart Dashboard** — income vs. expense trend chart, category spending breakdown, budget-health bar, and recent activity at a glance
- **🧠 AI Anomaly Detection** — automatically flags unusual transactions:
  - Rule-based check for brand-new categories
  - Z-score detection for small histories (10–49 expenses)
  - Isolation Forest for mature categories (50+ expenses)
- **🔮 AI Future Forecast** — predicts runway, burn rate, projected savings, and income/expense velocity, with a Gemini-powered financial advisor that explains your situation in plain language
- **💳 Subscription Tracking** — recurring bills (rent, Netflix, SaaS…) created and synced automatically with next-due dates
- **👛 Wallet & Income** — monthly/yearly income tracking with lifetime balance summaries
- **🗂️ Category Deep-Dives** — per-category pages with pagination, sorting, and one-click PDF export
- **🌍 Multi-Currency** — country-based currency selection with live symbol formatting
- **🌙 Dark Mode** — full light/dark theme support
- **🔐 Secure Auth** — Supabase email/password authentication with Row-Level Security

## Tech Stack

**Frontend**

- React 19 + Vite 7
- Tailwind CSS 4
- Recharts (data visualization)
- React Router 7 · React Hook Form · TanStack Query
- jsPDF + jspdf-autotable (PDF reports)

**Backend & Data**

- Supabase (Postgres, Auth, Storage, Row-Level Security)
- Python Flask API deployed as Vercel serverless functions
- Google Gemini (AI advisor summaries)
- Pure-Python Isolation Forest + NumPy linear regression — no heavy ML dependencies, optimized for serverless limits

## How the AI Works

**Anomaly detection** (`POST /api/predict`):

1. New category (no history) → flags amounts above a fixed threshold
2. 1–9 expenses → rule-based high-value check
3. 10–49 expenses → z-score test (`|z| > 3` flagged)
4. 50+ expenses → **Isolation Forest** (contamination 0.05) trained on the category's history

**Forecast** (`POST /api/forecast`):

1. Aggregates monthly income and expenses
2. Fits single-feature linear regression to extrapolate the next 3 months
3. Computes runway, burn rate, category momentum, and projected savings
4. Sends a structured summary to Gemini for a friendly, 3-paragraph action plan

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+ (only if running the API locally)
- A Supabase project (free tier is fine)
- A Google Gemini API key

### Setup

```bash
git clone https://github.com/Farhan0614/SpendSignature.git
cd SpendSignature
npm install
```
