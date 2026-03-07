import os
from pymongo import MongoClient
from datetime import datetime, timezone
from dotenv import load_dotenv

# Load environment variables (like your connection string)
load_dotenv()

# 1. Connect to your MongoDB Atlas Cluster
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    print(" Warning: MONGO_URI not found in .env file!")

client = MongoClient(MONGO_URI)

# 2. Select Database and Collections
db = client["VoiceCareDB"]  # You can name this whatever you want
patients_collection = db["patients"]
call_logs_collection = db["call_logs"]

def create_or_update_patient(patient_data: dict):
    """
    Saves 'Action Plan' and demographic info to MongoDB.
    Uses the patient's phone number to find and update the document.
    """
    try:
        phone_number = patient_data.get("patient_phone")
        
        # MongoDB doesn't have a built-in server timestamp constant like Firebase,
        # so we generate a UTC datetime object right now.
        patient_data["last_updated"] = datetime.now(timezone.utc)

        # upsert=True means: If it finds the phone number, it updates the doc.
        # If it doesn't find it, it creates a new one.
        patients_collection.update_one(
            {"patient_phone": phone_number}, # The filter to find the right patient
            {"$set": patient_data},          # The data to update
            upsert=True                      # Create it if it doesn't exist!
        )
        
        print(f"Successfully saved patient to MongoDB: {patient_data.get('patient_name')}")
        return True
    except Exception as e:
        print(f"Error saving to MongoDB: {e}")
        return False

def save_call_log(phone_number: str, risk_level: str, call_status: str, summary: str, is_warning: bool = False):
    """
    Saves the result of the AI call. This is what your frontend will read
    to show the Physician Dashboard.
    """
    try:
        log_data = {
            "patient_phone": phone_number,
            "risk_level": risk_level,
            "call_status": call_status,
            "summary": summary,
            "is_warning_flagged": is_warning,
            "timestamp": datetime.now(timezone.utc)
        }
        
        # insert_one automatically generates a unique _id for this log
        call_logs_collection.insert_one(log_data)
        
        print("Successfully logged call results to MongoDB.")
        return True
    
    except Exception as e:
        print(f"Error logging call: {e}")
        return False