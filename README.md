# RecruiterCheck
AI-powered recruiter scam detection — fine-tuned DistilBERT + LLM reasoning layer.

## The Problem
People that seek jobs lose money every year to fake recruiter/fake jobs scams. The FTC reports Americans lost over $490 million 
to fake jobs and business opportunities in 2023 alone. As students entering the job and co-op market ourselves, we've seen firsthand 
how easy it is for a convincing DM or email to slip past even a careful applicant.

## What It Does
RecruiterCheck takes in pasted messages from supposed recruiters or people offering a position at a company to you, and based on specific scam
patterns it provides you with an analysis and a score of how likely this message is legit or a scam. Furthermore, it has a scam escalation
feature which can be used in order to confirm if a person if scammer or not based on if the messages sent to you match that of the traditional
scammer playbook (in case the analysis is unsure of whether it is a scam or not).

## Tech Stack
- Frontend: Next.js, Tailwind
- Backend: FastAPI
- ML: Fine-tuned DistilBERT (PyTorch) for classification
- LLM: Groq (Llama 3.1) for explanation + simulation
- DB: SupaBase

## Fine-Tuning
We started with a base distilbert-base-uncased checkpoint and the EMSCAD dataset 
(~17,000 real-world fake/legitimate job postings). 
First training run overfit hard to one scam archetype. The model was nearly perfect on work-from-home/data-entry scams 
but completely missed task-scam messages framed as professional outreach 
(the "Naomi from AMZ Recruiting Department" pattern, app-rating scams with flat daily pay, fake invoice/equipment check fraud).
Overall, through fine-tuning the llm was trained to identify the specific patterns that it missed at the start due to not being
especially trained in patterns of fake recruiters and fake job postings.

## Architecture
User message
      │
      ├─▶  POST /api/classify  ──▶  DistilBERT (fine-tuned)
      │         Returns: is_scam, confidence 0–1, verdict_tier
      │
      ├─▶  POST /api/explain   ──▶  Groq llama-3.1-8b-instant
      │         Returns: red_flags[], green_flags[], verdict_reasoning
      │         (reconciliation logic overrides verdict if flags contradict classifier)
      │
      └─▶  POST /api/simulate  ──▶  Groq llama-3.1-8b-instant
                Returns: sender, content, playbook_focus
                (only activates if is_scam = true)



## Team
Medhansh Negi — Full Stack Lead. Built the entire FastAPI Backend and fine-tuned the LLM Model 
and handled all bug fixes including the flag-inversion LLM prompt engineering

Ryan Budwal - Front End Designer. Developed the Website's Next.JS frontend while ensuring all features still functions.
Also added animations and used TailwindCSS and designed all UI components.

## Setup / Run Locally
Setup / Run Locally
Prerequisites: Python 3.10+, Node.js 18+, a free Groq API key

1. Clone the repo
bash
git clone https://github.com/Med-NCoding/JobGuard.git
cd JobGuard
2. Backend (FastAPI + DistilBERT)
bash
# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
# Install dependencies
pip install fastapi uvicorn torch transformers groq python-dotenv pydantic
# Add your Groq API key
echo "GROQ_API_KEY=your_key_here" > .env
# Start the backend  (runs on http://localhost:8000)
uvicorn app:app --reload
The fine-tuned model weights live in /recruitcheck_model/. No retraining needed — they load automatically on startup.

3. Frontend (Next.js)
bash
cd frontend
npm install
npm run dev        # runs on http://localhost:3000
4. Open the app
Visit http://localhost:3000 — the frontend proxies API calls to localhost:8000 automatically.

Environment variable required:

Key	Where to get it
GROQ_API_KEY	console.groq.com — free tier, no credit card

## NOTE:

if you do not want to run this locally, here is the live demo link: 
