import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

cred = credentials.Certificate("service-account.json")

firebase_admin.initialize_app(cred)

db = firestore.client()

def create_or_update_patient(patient_data: dict):
    """
    Saves 'Action Plan' and demographic info to Firestore.
    Uses the patient's phone number as the Document ID for easy lookup.
    """
    try:
        phone_number = patient_data.get("patient_phone")

        doc_ref = db.collection("patients").document(phone_number)
        patient_data["last_updated"] = firestore.SERVER_TIMESTAMP

        doc_ref.set(patient_data, merge=True)
        print(f"Successfully saved patient: {patient_data.get('patient_name')}")
        return True
    except Exception as e:
        print(f"Error saving to Firebase: {e}")
        return False

def save_call_log(phone_number: str, risk_level: str, call_status: str, summary: str, is_warning: bool = False):
    """
    Saves the result of the AI call. This is what your frontend will read
    to show the Physician Dashboard.
    """
    try:
        doc_ref = db.collection("call_logs").document()
        log_data = {
            "patient_phone": phone_number,
            "risk_level": risk_level,
            "call_status": call_status,
            "summary": summary,
            "is_warning_flagged": is_warning,
            "timestamp": firestore.SERVER_TIMESTAMP
        }
        doc_ref.set(log_data)
        print("Successfuly logged call results.")
        return True
    
    except Exception as e:
        print(f"Error logging call: {e}")
        return False