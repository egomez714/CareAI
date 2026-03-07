# Run with uvicorn main:app --reload   

import os
import requests
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import json
import google.generativeai as genai

# 1. Import your MongoDB Function 
# (We keep this separate just so your database logic is clean)
from database.mongo_config import create_or_update_patient


# Load your secret keys from .env
load_dotenv()

app = FastAPI()

# 2. Enable CORS (Crucial so your teammate's React app isn't blocked)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Define the Data Model directly in main.py
class PatientPlan(BaseModel):
    patient_name: str
    patient_phone: str        # Must include +1
    risk_level: str           # "Low", "Moderate", "High"
    si_hi_risk: bool          # true or false
    action_plan_details: str  # e.g., "5-4-7 Breathing"

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash')

# 4. The API Endpoint
@app.post("/api/trigger-call")
async def trigger_call(request: PatientPlan):
    try:
        # --- PHASE 1: SAVE TO MONGODB ---
        patient_data = request.model_dump()
        db_success = create_or_update_patient(patient_data)
        
        if not db_success:
            raise HTTPException(status_code=500, detail="Database save failed.")

        # --- PHASE 2: TRIGGER THE AI CALL ---
        eleven_labs_url = "https://api.elevenlabs.io/v1/convai/twilio/outbound-call"
        headers = {
            "xi-api-key": os.getenv("ELEVEN_LABS_KEY"),
            "Content-Type": "application/json"
        }
        
        payload = {
            "agent_id": os.getenv("ELEVEN_LABS_AGENT_ID"),
            "to_number": "+18056703413",
            "agent_phone_number_id": "phnum_2701kk4vb81mf11vz1wygp7hj4j2",
            "conversation_initiation_client_data": {
                "dynamic_variables": {
                    "patient_name": request.patient_name,
                    "action_plan_details": request.action_plan_details,
                    "si_hi_risk": "true" if request.si_hi_risk else "false"
                }
            }
        }
        
        # Uncomment this to actually make the phone ring!
        response = requests.post(eleven_labs_url, json=payload, headers=headers)
        if response.status_code != 200:
            print(f"ElevenLabs Error: {response.text}")
        
        return {
            "status": "success", 
            "message": f"Saved {request.patient_name} to MongoDB and triggered AI."
        }

    except Exception as e:
        print(f"API Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

import json
import re

@app.post("/api/webhook/transcript")
async def handle_transcript(request: Request):
    payload = await request.json()
    
    if payload.get("type") == "post_call_transcription":
        # 1. GET PATIENT NAME FIRST (So the prompt can use it)
        vars = payload.get("conversation_initiation_client_data", {}).get("dynamic_variables", {})
        patient_name = vars.get("patient_name", "Unknown Patient")
        
        # 2. Format the raw transcript
        transcript_data = payload.get("transcript", [])
        raw_text = "\n".join([f"{t['role'].upper()}: {t['message']}" for t in transcript_data])
        
        # 3. The Clinical Prompt
        prompt = f"""
        You are an expert clinical medical scribe. 
        Analyze the following transcript between an AI assistant (Emily) and a patient ({patient_name}).

        ### TRANSCRIPT:
        {raw_text}

        ### INSTRUCTIONS:
        Return the analysis in STRICT JSON format with these keys:
        "mood", "adherence_score", "risk_level", "clinical_summary", "red_flags", "next_steps".
        Return ONLY the raw JSON. No markdown, no preamble.
        """
        
        # 4. Get Gemini's Brainpower
        gemini_response = model.generate_content(prompt)
        response_text = gemini_response.text
        
        # 5. Clean & Parse JSON (Safety first!)
        clean_json = re.sub(r'```json|```', '', response_text).strip()
        
        try:
            analysis_data = json.loads(clean_json)
            
            # 6. SAVE TO MONGODB 
            # This is where you connect back to your database
            db_success = create_or_update_patient({
                "patient_name": patient_name,
                "latest_analysis": analysis_data,
                "raw_transcript": raw_text,
                "call_status": "Completed"
            })
            
            print(f"✨ Gemini Analysis Saved for {patient_name}")
            return {"status": "success", "analysis": analysis_data}

        except Exception as e:
            print(f"❌ Failed to parse Gemini JSON: {e}")
            return {"status": "error", "message": "JSON Parse Failure"}

    return {"status": "ignored"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)