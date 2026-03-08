import os
from pymongo import MongoClient
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["VoiceCareDB"]
patients_collection = db["patients"]
call_logs_collection = db["call_logs"]

def create_or_update_patient(patient_data: dict):
    try:
        mrn = patient_data.get("patient_mrn")
        if not mrn:
            print("Error: MRN is required.")
            return False

        patient_data["last_updated"] = datetime.now(timezone.utc)
        
        # Initialize missed calls if not present
        patients_collection.update_one(
            {"patient_mrn": mrn},
            {"$set": patient_data},
            upsert=True
        )
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

def record_call_attempt(mrn: str):
    """Marks that a call was just triggered."""
    patients_collection.update_one(
        {"patient_mrn": mrn},
        {"$set": {"last_call_attempt": datetime.now(timezone.utc)},
         "$inc": {"total_attempts_count": 1}}
    )

def record_call_completion(mrn: str, success: bool):
    """Reset missed calls on success, increment on failure."""
    now = datetime.now(timezone.utc)
    if success:
        patients_collection.update_one(
            {"patient_mrn": mrn},
            {"$set": {"consecutive_missed_calls": 0, "last_successful_call": now}}
        )
    else:
        patients_collection.update_one(
            {"patient_mrn": mrn},
            {"$inc": {"consecutive_missed_calls": 1}}
        )

def get_patient_by_mrn(mrn: str):
    try:
        patient = patients_collection.find_one({"patient_mrn": mrn})
        if patient:
            # Calculate dynamic warnings
            now = datetime.now(timezone.utc)
            missed = patient.get("consecutive_missed_calls", 0)
            last_success = patient.get("last_successful_call")
            
            warnings = []
            if missed >= 3:
                warnings.append("URGENT: 3+ Missed Calls")
            
            if last_success:
                # Check if it's been more than 3 days (using native datetime comparison)
                if now - last_success > timedelta(days=3):
                    warnings.append("INACTIVE: No check-in for 3+ days")
            
            patient["active_warnings"] = warnings
            
        return patient
    except Exception as e:
        print(f"Error: {e}")
        return None