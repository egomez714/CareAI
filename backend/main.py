# Run with uvicorn main:app --reload

import os
import asyncio
import requests
from fastapi import FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from datetime import datetime
import json
import re
from google import genai

# 1. Import your MongoDB Functions
from database.mongo_config import (
    create_or_update_patient, 
    get_patient_by_mrn, 
    record_call_attempt, 
    record_call_completion,
    patients_collection
)


# Load your secret keys from .env
load_dotenv()

app = FastAPI()

# 2. Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- WEBSOCKET MANAGER ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"✅ Client Connected. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        print(f"❌ Client Disconnected. Total: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        print(f"📡 Broadcasting: {message.get('type')} for {message.get('mrn')}")
        # Increase delay to 1.5s to ensure frontend hot-reload is finished
        await asyncio.sleep(1.5) 
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Error broadcasting: {e}")

manager = ConnectionManager()

# 3. Define the Data Model
class PatientPlan(BaseModel):
    patient_mrn: str
    patient_name: str
    patient_phone: str
    risk_level: str           # "Low", "Moderate", "High"
    si_hi_risk: bool
    action_plan_details: str

# --- HELPER: JSON SERIALIZATION ---
def serialize_doc(doc):
    if not doc: return None
    doc["_id"] = str(doc["_id"])
    
    # Recursively convert datetimes to strings
    def convert_dates(item):
        if isinstance(item, dict):
            return {k: convert_dates(v) for k, v in item.items()}
        elif isinstance(item, list):
            return [convert_dates(i) for i in item]
        elif isinstance(item, datetime):
            return item.isoformat()
        return item

    doc = convert_dates(doc)

    # MAP AI ANALYSIS TO FRONTEND TAGS
    if "latest_analysis" in doc:
        ai = doc["latest_analysis"]
        doc["riskLevel"] = ai.get("risk_level", doc.get("risk_level", "Low"))
        doc["mood"] = ai.get("mood", doc.get("mood", "Stable"))
    else:
        doc["riskLevel"] = doc.get("risk_level", "Low")
        doc["mood"] = doc.get("mood", "Stable")

    doc["missedCalls"] = doc.get("consecutive_missed_calls", 0)
    doc["active_warnings"] = doc.get("active_warnings", [])
    doc["name"] = doc.get("patient_name", "Unknown Patient")
    doc["mrn"] = doc.get("patient_mrn", "MRN-UNKNOWN")
    return doc

# 4. API Endpoints

@app.websocket("/ws/updates")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/api/patients")
async def get_all_patients():
    """Returns all patients stored in MongoDB."""
    cursor = patients_collection.find({})
    return [serialize_doc(p) for p in cursor]

@app.get("/api/patients/{mrn}")
async def get_patient(mrn: str):
    patient = get_patient_by_mrn(mrn)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return serialize_doc(patient)

@app.post("/api/trigger-call")
async def trigger_call(request: PatientPlan):
    try:
        patient_data = request.model_dump()
        create_or_update_patient(patient_data)
        record_call_attempt(request.patient_mrn)
        
        risk_guidance = {
            "High": "Please be very direct and check for safety concerns immediately.",
            "Moderate": "Check in warmly but ensure they are following the plan.",
            "Low": "A friendly check-in on their general well-being."
        }
        guidance = risk_guidance.get(request.risk_level, "Standard check-in.")

        eleven_labs_url = "https://api.elevenlabs.io/v1/convai/twilio/outbound-call"
        headers = {
            "xi-api-key": os.getenv("ELEVEN_LABS_KEY"),
            "Content-Type": "application/json"
        }
        
        payload = {
            "agent_id": os.getenv("ELEVEN_LABS_AGENT_ID"),
            "to_number": request.patient_phone,
            "agent_phone_number_id": "phnum_2701kk4vb81mf11vz1wygp7hj4j2",
            "conversation_initiation_client_data": {
                "dynamic_variables": {
                    "patient_mrn": request.patient_mrn,
                    "patient_name": request.patient_name,
                    "action_plan_details": request.action_plan_details,
                    "risk_level": request.risk_level,
                    "risk_guidance": guidance,
                    "si_hi_risk": "true" if request.si_hi_risk else "false"
                }
            }
        }
        
        response = requests.post(eleven_labs_url, json=payload, headers=headers)
        if response.status_code != 200:
            print(f"ElevenLabs Error: {response.text}")
        
        return {"status": "success", "message": f"Triggered {request.risk_level} Risk call for {request.patient_name}"}

    except Exception as e:
        print(f"API Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

@app.post("/api/webhook/transcript")
async def handle_transcript(request: Request):
    try:
        payload = await request.json()
        payload_type = payload.get("type")
        print(f"📩 Webhook Received: {payload_type}")
        
        # 1. FIND MRN FIRST
        patient_mrn = find_key_recursive(payload, "patient_mrn")
        patient_name = find_key_recursive(payload, "patient_name") or "Unknown"

        if not patient_mrn:
            print("⚠️ Critical: Could not find MRN in payload.")
            return {"status": "ignored"}

        # 2. HANDLE 'call_ended' or 'call_initiation_failed'
        if payload_type in ["call_ended", "call_initiation_failed"]:
            if payload_type == "call_initiation_failed":
                print(f"❌ Call failed to initiate for {patient_mrn}")
                record_call_completion(patient_mrn, success=False)
                await manager.broadcast({"type": "CALL_MISSED", "mrn": patient_mrn, "name": patient_name})
                return {"status": "success"}

            status = payload.get("call", {}).get("status", "unknown")
            print(f"📞 Call Ended with status: {status}")
            
            # Definitive missed call
            if status in ["no-answer", "busy", "failed"]:
                print(f"📉 Recording missed call for {patient_mrn}")
                record_call_completion(patient_mrn, success=False)
                await manager.broadcast({"type": "CALL_MISSED", "mrn": patient_mrn, "name": patient_name})
            
            return {"status": "success"}

        # 3. HANDLE 'post_call_transcription'
        if payload_type == "post_call_transcription":
            print(f"🔍 Processing Analysis for: {patient_name} (MRN: {patient_mrn})")
            transcript_data = payload.get("transcript", [])
            
            # DETECTION: Did they actually speak?
            if len(transcript_data) > 1:
                print(f"✅ Interaction detected. Resetting missed calls for {patient_mrn}")
                record_call_completion(patient_mrn, success=True)
            else:
                print(f"📉 Silent transcript. Recording missed call for {patient_mrn}")
                record_call_completion(patient_mrn, success=False)
                await manager.broadcast({"type": "CALL_MISSED", "mrn": patient_mrn, "name": patient_name})
                return {"status": "missed_call"}

            raw_text = "\n".join([f"{t['role'].upper()}: {t['message']}" for t in transcript_data])
            
            prompt = f"""
            Analyze this medical transcript between AI (Emily) and patient ({patient_name}).
            TRANSCRIPT: {raw_text}

            ### INSTRUCTIONS:
            Return a STRICT JSON object with these EXACT keys:
            "date": "{datetime.now().strftime('%b %d, %Y')}",
            "mood": "Stable/Improving/Declining",
            "depression_level": "NUMBER ONLY 1-10",
            "anxiety_level": "NUMBER ONLY 1-10",
            "si_status": "Flagged/Stable/Unknown",
            "adherence_score": "NUMBER ONLY 1-10",
            "clinical_summary": "One sentence summary",
            "risk_level": "Low/Medium/High"
            """
            
            try:
                print("🧠 Asking Gemini to analyze...")
                gemini_response = client.models.generate_content(model='gemini-2.0-flash', contents=prompt)
                response_text = gemini_response.text
                clean_json = re.sub(r'```json|```', '', response_text).strip()
                analysis_data = json.loads(clean_json)
                
                # Sanitize scores to be numbers
                analysis_data["depression_level"] = re.sub(r'[^0-9]', '', str(analysis_data.get("depression_level", "1")))
                analysis_data["anxiety_level"] = re.sub(r'[^0-9]', '', str(analysis_data.get("anxiety_level", "1")))

                create_or_update_patient({
                    "patient_mrn": patient_mrn,
                    "latest_analysis": analysis_data,
                    "raw_transcript": raw_text,
                    "call_status": "Completed"
                })

                await manager.broadcast({
                    "type": "NEW_ANALYSIS", 
                    "mrn": patient_mrn, 
                    "name": patient_name,
                    "analysis": analysis_data
                })
                print("✨ Successfully processed call.")
                return {"status": "success"}
            
            except Exception as e:
                print(f"❌ Analysis failed: {e}")
                fallback_analysis = {
                    "date": datetime.now().strftime('%b %d, %Y'),
                    "mood": "Unknown",
                    "depression_level": "1",
                    "anxiety_level": "1",
                    "si_status": "Unknown",
                    "clinical_summary": "Incomplete data from call.",
                    "risk_level": "Medium"
                }
                create_or_update_patient({
                    "patient_mrn": patient_mrn,
                    "latest_analysis": fallback_analysis,
                    "raw_transcript": raw_text,
                    "call_status": "Interrupted"
                })
                await manager.broadcast({"type": "NEW_ANALYSIS", "mrn": patient_mrn, "name": patient_name})
                return {"status": "parse_error"}

        return {"status": "ignored"}
    except Exception as e:
        print(f"🚨 Webhook Crash: {e}")
        return {"status": "error"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)