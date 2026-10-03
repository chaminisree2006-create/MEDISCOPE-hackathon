import os
import shutil
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import User, Patient, Report, TestResult, EmailReminder
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
    validate_email_format,
    validate_password_complexity,
)
from ocr_engine import extract_text_from_file, parse_lab_biomarkers, STANDARD_REFERENCE_RANGES
from rag_engine import generate_report_synthesis, calculate_longitudinal_deltas
from specialists import get_specialists_for_biomarkers
from outbreaks import get_live_outbreaks
from email_service import send_health_reminder_email

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Mediscope API",
    version="1.0.0",
    description="Production-grade AI Health Report Companion & Consultation Briefing Platform"
)

# Enable CORS for frontend development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directory and mount static assets
os.makedirs("uploads", exist_ok=True)
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ---------------------------------------------------------------------------
# Pydantic Request & Response Schemas
# ---------------------------------------------------------------------------
class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str
    consent_granted: bool = True
    communication_frequency: str = "ANNUAL"

class LoginRequest(BaseModel):
    email: str
    password: str

class CheckUserRequest(BaseModel):
    email: str

class PatientCreateRequest(BaseModel):
    full_name: str
    relationship: str
    date_of_birth: str
    gender: Optional[str] = "Unspecified"
    blood_group: Optional[str] = "Unknown"
    emergency_contact: Optional[str] = ""
    pre_existing_conditions: Optional[str] = ""
    primary_physician: Optional[str] = ""

class PatientUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    relationship: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    emergency_contact: Optional[str] = None
    pre_existing_conditions: Optional[str] = None
    primary_physician: Optional[str] = None

class ScheduleReminderRequest(BaseModel):
    patient_id: str
    reminder_type: str = "Annual Health Screening"
    scheduled_date: str
    notes: Optional[str] = None

class SendEmailTestRequest(BaseModel):
    patient_id: str
    reminder_type: str = "Annual Health Screening & Lab Follow-Up"
    scheduled_date: str = "2026-11-15"
    notes: Optional[str] = "Routine comprehensive checkup and fasting lipid panel."

class UpdatePreferencesRequest(BaseModel):
    communication_frequency: str # "ANNUAL", "SEMI_ANNUAL", "QUARTERLY"

# ---------------------------------------------------------------------------
# Auth Dependency
# ---------------------------------------------------------------------------
def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header"
        )
    token = authorization.replace("Bearer ", "").strip()
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token"
        )
    user_id = payload["sub"]
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User record not found in system"
        )
    return user

# ---------------------------------------------------------------------------
# Section 3: Authentication & Registration APIs
# ---------------------------------------------------------------------------
@app.post("/api/v1/auth/check-user")
def check_user_exists(req: CheckUserRequest, db: Session = Depends(get_db)):
    """Check if an email is already registered in Mediscope database."""
    email_clean = req.email.strip().lower()
    existing = db.query(User).filter(User.email == email_clean).first()
    return {
        "exists": existing is not None,
        "email": email_clean
    }

@app.post("/api/v1/auth/register")
def register_user(req: RegisterRequest, db: Session = Depends(get_db)):
    """
    Validates password complexity rules, verifies email syntax, checks duplicate,
    records consent_granted and consent_timestamp, and persists user.
    """
    email_clean = req.email.strip().lower()

    # 1. Strict Email Validation
    if not validate_email_format(email_clean):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format. Please provide a valid email address (e.g. name@domain.com)."
        )

    # 2. Live Password Complexity Checklist Validation
    pwd_check = validate_password_complexity(req.password)
    if not pwd_check["valid"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "message": "Password does not satisfy complexity requirements.",
                "checks": pwd_check["checks"]
            }
        )

    # 3. Email Duplicate Check
    existing_user = db.query(User).filter(User.email == email_clean).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists. Please log in."
        )

    # 4. Consent Requirement Check
    if not req.consent_granted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mandatory consent must be granted during registration to process health data."
        )

    # 5. Create and persist User record
    hashed = hash_password(req.password)
    user = User(
        id=str(uuid.uuid4()),
        full_name=req.full_name.strip(),
        email=email_clean,
        password_hash=hashed,
        consent_granted=True,
        consent_timestamp=datetime.utcnow(),
        communication_frequency=req.communication_frequency
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate JWT access token
    access_token = create_access_token(data={"sub": user.id, "email": user.email})

    return {
        "message": "User registered successfully",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "consent_granted": user.consent_granted,
            "consent_timestamp": user.consent_timestamp.isoformat() if user.consent_timestamp else None,
            "communication_frequency": user.communication_frequency
        }
    }

@app.post("/api/v1/auth/login")
def login_user(req: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticates user.
    If user email is NOT present in database, block authentication and trigger
    explicit error response with code: ACCOUNT_NOT_FOUND.
    """
    email_clean = req.email.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()

    if not user:
        # User not found -> specific structured error code for modal alert
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "code": "ACCOUNT_NOT_FOUND",
                "title": "Account Not Found",
                "detail": "No account is associated with this email address. Please register for a new account instead of signing in.",
                "suggest_action": "Switch to Registration"
            }
        )

    # Verify Password
    if not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password. Please verify your credentials and try again."
        )

    access_token = create_access_token(data={"sub": user.id, "email": user.email})
    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "consent_granted": user.consent_granted,
            "communication_frequency": user.communication_frequency
        }
    }

@app.get("/api/v1/auth/me")
def get_user_me(user: User = Depends(get_current_user)):
    """Returns currently authenticated user profile."""
    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "consent_granted": user.consent_granted,
        "communication_frequency": user.communication_frequency
    }

@app.put("/api/v1/users/preferences")
def update_user_preferences(
    req: UpdatePreferencesRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates user reminder frequency preference (Annual, Semi-Annual, Quarterly)."""
    user.communication_frequency = req.communication_frequency
    db.commit()
    db.refresh(user)
    return {
        "message": "Communication preferences updated successfully",
        "communication_frequency": user.communication_frequency
    }

# ---------------------------------------------------------------------------
# Section 7: Patient Management & Family Database (CRUD)
# Mandatory Initial Empty State for new users!
# ---------------------------------------------------------------------------
@app.get("/api/v1/patients")
def list_patients(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Returns all patients linked to the authenticated user.
    Starts COMPLETELY EMPTY ([]) for new registered users.
    """
    patients = db.query(Patient).filter(Patient.user_id == user.id).all()
    results = []
    for p in patients:
        report_count = db.query(Report).filter(Report.patient_id == p.id).count()
        results.append({
            "id": p.id,
            "full_name": p.full_name,
            "relationship": p.relationship,
            "date_of_birth": p.date_of_birth,
            "gender": p.gender,
            "blood_group": p.blood_group,
            "emergency_contact": p.emergency_contact,
            "pre_existing_conditions": p.pre_existing_conditions,
            "primary_physician": p.primary_physician,
            "report_count": report_count,
            "created_at": p.created_at.isoformat() if p.created_at else None
        })
    return results

@app.post("/api/v1/patients")
def create_patient(
    req: PatientCreateRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Creates a new family patient profile linked to current user."""
    patient = Patient(
        id=str(uuid.uuid4()),
        user_id=user.id,
        full_name=req.full_name.strip(),
        relationship=req.relationship,
        date_of_birth=req.date_of_birth,
        gender=req.gender,
        blood_group=req.blood_group,
        emergency_contact=req.emergency_contact,
        pre_existing_conditions=req.pre_existing_conditions,
        primary_physician=req.primary_physician
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return {
        "message": "Patient profile created successfully",
        "patient": {
            "id": patient.id,
            "full_name": patient.full_name,
            "relationship": patient.relationship,
            "date_of_birth": patient.date_of_birth,
            "gender": patient.gender,
            "blood_group": patient.blood_group,
            "emergency_contact": patient.emergency_contact,
            "pre_existing_conditions": patient.pre_existing_conditions,
            "primary_physician": patient.primary_physician,
            "report_count": 0
        }
    }

@app.put("/api/v1/patients/{patient_id}")
def update_patient(
    patient_id: str,
    req: PatientUpdateRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates an existing family patient profile."""
    patient = db.query(Patient).filter(Patient.id == patient_id, Patient.user_id == user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found.")

    if req.full_name is not None:
        patient.full_name = req.full_name.strip()
    if req.relationship is not None:
        patient.relationship = req.relationship
    if req.date_of_birth is not None:
        patient.date_of_birth = req.date_of_birth
    if req.gender is not None:
        patient.gender = req.gender
    if req.blood_group is not None:
        patient.blood_group = req.blood_group
    if req.emergency_contact is not None:
        patient.emergency_contact = req.emergency_contact
    if req.pre_existing_conditions is not None:
        patient.pre_existing_conditions = req.pre_existing_conditions
    if req.primary_physician is not None:
        patient.primary_physician = req.primary_physician

    db.commit()
    db.refresh(patient)
    return {
        "message": "Patient profile updated successfully",
        "patient": {
            "id": patient.id,
            "full_name": patient.full_name,
            "relationship": patient.relationship,
            "date_of_birth": patient.date_of_birth,
            "gender": patient.gender,
            "blood_group": patient.blood_group,
            "emergency_contact": patient.emergency_contact,
            "pre_existing_conditions": patient.pre_existing_conditions,
            "primary_physician": patient.primary_physician
        }
    }

@app.delete("/api/v1/patients/{patient_id}")
def delete_patient(
    patient_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletes patient profile and cascades deletion to reports and reminders."""
    patient = db.query(Patient).filter(Patient.id == patient_id, Patient.user_id == user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found.")

    db.delete(patient)
    db.commit()
    return {"message": f"Patient profile for '{patient.full_name}' and all associated records deleted."}

# ---------------------------------------------------------------------------
# Section 8: Patient Report Analysis, Comparison & Clinical Briefing
# ---------------------------------------------------------------------------
@app.get("/api/v1/reports/patient/{patient_id}")
def get_patient_reports(
    patient_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Returns all reports belonging to a selected patient."""
    patient = db.query(Patient).filter(Patient.id == patient_id, Patient.user_id == user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found.")

    reports = db.query(Report).filter(Report.patient_id == patient_id).order_by(Report.report_date.desc()).all()
    results = []
    for r in reports:
        biomarker_count = db.query(TestResult).filter(TestResult.report_id == r.id).count()
        out_of_range_count = db.query(TestResult).filter(
            TestResult.report_id == r.id,
            TestResult.status.in_(["HIGH", "LOW"])
        ).count()
        results.append({
            "id": r.id,
            "patient_id": r.patient_id,
            "report_name": r.report_name,
            "report_date": r.report_date,
            "file_url": r.file_url,
            "biomarker_count": biomarker_count,
            "out_of_range_count": out_of_range_count,
            "created_at": r.created_at.isoformat() if r.created_at else None
        })
    return results

@app.get("/api/v1/reports/{report_id}")
def get_report_detail(
    report_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Returns detailed report information with all biomarkers and multilingual synthesis."""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")

    # Verify patient ownership
    patient = db.query(Patient).filter(Patient.id == report.patient_id, Patient.user_id == user.id).first()
    if not patient:
        raise HTTPException(status_code=403, detail="Unauthorized access to this patient report.")

    test_results = db.query(TestResult).filter(TestResult.report_id == report_id).all()
    results_data = []
    for t in test_results:
        results_data.append({
            "id": t.id,
            "test_name": t.test_name,
            "value": float(t.value),
            "unit": t.unit,
            "reference_low": float(t.reference_low) if t.reference_low else None,
            "reference_high": float(t.reference_high) if t.reference_high else None,
            "status": t.status,
            "clinical_context": {
                "en": t.clinical_context_en,
                "hi": t.clinical_context_hi,
                "te": t.clinical_context_te
            }
        })

    # Synthesize doctor questions & specialists
    synthesis = generate_report_synthesis(results_data)
    specialists = get_specialists_for_biomarkers(results_data)

    return {
        "report": {
            "id": report.id,
            "patient_id": report.patient_id,
            "patient_name": patient.full_name,
            "report_name": report.report_name,
            "report_date": report.report_date,
            "file_url": report.file_url,
            "summary": {
                "en": report.summary_en,
                "hi": report.summary_hi,
                "te": report.summary_te
            },
            "second_opinion": {
                "en": report.second_opinion_en,
                "hi": report.second_opinion_hi,
                "te": report.second_opinion_te
            },
            "created_at": report.created_at.isoformat() if report.created_at else None
        },
        "biomarkers": results_data,
        "doctor_questions": synthesis["questions"],
        "recommended_specialists": specialists
    }

@app.post("/api/v1/reports/upload")
async def upload_patient_report(
    patient_id: str = Form(...),
    report_name: str = Form("Diagnostic Lab Panel"),
    report_date: str = Form(...),
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Stage Processing Stepper:
    1. Storage -> 2. PyMuPDF/OCR -> 3. Range Validation -> 4. Multilingual RAG Synthesis.
    """
    patient = db.query(Patient).filter(Patient.id == patient_id, Patient.user_id == user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Selected patient profile not found.")

    # 1. Storage Phase
    file_ext = os.path.splitext(file.filename)[1]
    saved_filename = f"{uuid.uuid4()}{file_ext}"
    local_path = os.path.join("uploads", saved_filename)
    
    with open(local_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_url = f"/uploads/{saved_filename}"

    # 2. PyMuPDF / OCR Phase
    raw_text = extract_text_from_file(local_path)

    # 3. Range Validation Phase
    biomarkers = parse_lab_biomarkers(raw_text)

    # 4. Multilingual RAG Synthesis Phase (English, Hindi, Telugu)
    synthesis = generate_report_synthesis(biomarkers)

    # Persist Report
    report = Report(
        id=str(uuid.uuid4()),
        patient_id=patient.id,
        report_name=report_name,
        report_date=report_date,
        file_url=file_url,
        raw_text=raw_text,
        summary_en=synthesis["summary"]["en"],
        summary_hi=synthesis["summary"]["hi"],
        summary_te=synthesis["summary"]["te"],
        second_opinion_en=synthesis["second_opinions"]["en"],
        second_opinion_hi=synthesis["second_opinions"]["hi"],
        second_opinion_te=synthesis["second_opinions"]["te"]
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    # Persist Biomarkers
    for b in biomarkers:
        tr = TestResult(
            id=str(uuid.uuid4()),
            report_id=report.id,
            test_name=b["test_name"],
            value=b["value"],
            unit=b.get("unit"),
            reference_low=b.get("reference_low"),
            reference_high=b.get("reference_high"),
            status=b["status"],
            clinical_context_en=f"{b['test_name']} value: {b['value']} {b.get('unit', '')} ({b['status']})",
            clinical_context_hi=f"{b['test_name']} मान: {b['value']} {b.get('unit', '')} ({b['status']})",
            clinical_context_te=f"{b['test_name']} ఫలితం: {b['value']} {b.get('unit', '')} ({b['status']})"
        )
        db.add(tr)
    db.commit()

    return {
        "message": "Report processed successfully through 4-stage pipeline",
        "report_id": report.id,
        "stages_completed": [
            "1. Secure Storage & Asset Indexing",
            "2. PyMuPDF Text & Spectral Parsing",
            "3. Clinical Reference Range Validation",
            "4. Multilingual RAG Synthesis & Doctor Questions"
        ],
        "biomarkers_extracted_count": len(biomarkers),
        "out_of_range_count": synthesis["out_of_range_count"]
    }

@app.get("/api/v1/reports/{patient_id}/trends")
def get_patient_trends(
    patient_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Computes exact historical deltas between prior and current lab reports.
    Example: Fasting Glucose: June 128 mg/dL -> Current 115 mg/dL | Delta: -13 mg/dL
    """
    patient = db.query(Patient).filter(Patient.id == patient_id, Patient.user_id == user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found.")

    reports = db.query(Report).filter(Report.patient_id == patient_id).order_by(Report.report_date.desc()).all()
    if len(reports) < 2:
        return {
            "has_comparison": False,
            "message": "At least two chronological reports are required to calculate historical deltas.",
            "deltas": []
        }

    current_report = reports[0]
    prior_report = reports[1]

    curr_results = db.query(TestResult).filter(TestResult.report_id == current_report.id).all()
    prior_results = db.query(TestResult).filter(TestResult.report_id == prior_report.id).all()

    curr_list = [{"test_name": r.test_name, "value": float(r.value), "unit": r.unit, "status": r.status} for r in curr_results]
    prior_list = [{"test_name": r.test_name, "value": float(r.value), "unit": r.unit, "status": r.status} for r in prior_results]

    deltas = calculate_longitudinal_deltas(prior_list, curr_list)

    return {
        "has_comparison": True,
        "current_report": {
            "id": current_report.id,
            "name": current_report.report_name,
            "date": current_report.report_date
        },
        "prior_report": {
            "id": prior_report.id,
            "name": prior_report.report_name,
            "date": prior_report.report_date
        },
        "deltas": deltas
    }

@app.get("/api/v1/reports/{patient_id}/doctor-questions")
def get_doctor_questions(
    patient_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Synthesizes tailored, patient-centric questions based on latest report out-of-range values."""
    patient = db.query(Patient).filter(Patient.id == patient_id, Patient.user_id == user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    latest_report = db.query(Report).filter(Report.patient_id == patient_id).order_by(Report.report_date.desc()).first()
    if not latest_report:
        return {
            "has_report": False,
            "message": "No reports found for this patient yet.",
            "questions": {"en": [], "hi": [], "te": []}
        }

    results = db.query(TestResult).filter(TestResult.report_id == latest_report.id).all()
    results_data = [{"test_name": r.test_name, "value": float(r.value), "unit": r.unit, "status": r.status} for r in results]

    synthesis = generate_report_synthesis(results_data)
    return {
        "has_report": True,
        "report_id": latest_report.id,
        "report_name": latest_report.report_name,
        "report_date": latest_report.report_date,
        "questions": synthesis["questions"]
    }

@app.get("/api/v1/doctors/specialists")
def get_local_specialists(
    patient_id: Optional[str] = None,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns local area specialists categorized by out-of-range lab categories.
    """
    biomarkers = []
    if patient_id:
        latest = db.query(Report).filter(Report.patient_id == patient_id).order_by(Report.report_date.desc()).first()
        if latest:
            trs = db.query(TestResult).filter(TestResult.report_id == latest.id).all()
            biomarkers = [{"test_name": t.test_name, "status": t.status} for t in trs]

    specialists = get_specialists_for_biomarkers(biomarkers)
    return {
        "matched_specialties_count": len(specialists),
        "specialists": specialists
    }

# ---------------------------------------------------------------------------
# Section 5: Health & Infection Statistics Tracker
# ---------------------------------------------------------------------------
@app.get("/api/v1/health/outbreaks")
def get_outbreak_statistics():
    """Live dynamic dashboard displaying current regional/global viral and infection statistics."""
    return get_live_outbreaks()

# ---------------------------------------------------------------------------
# Section 9: Automated Email Health Reminders
# ---------------------------------------------------------------------------
@app.get("/api/v1/reminders")
def list_user_reminders(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Returns scheduled health reminders for all user family members."""
    reminders = db.query(EmailReminder).filter(EmailReminder.user_id == user.id).order_by(EmailReminder.scheduled_date.asc()).all()
    output = []
    for r in reminders:
        patient = db.query(Patient).filter(Patient.id == r.patient_id).first()
        output.append({
            "id": r.id,
            "patient_id": r.patient_id,
            "patient_name": patient.full_name if patient else "Family Member",
            "relationship": patient.relationship if patient else "Family",
            "reminder_type": r.reminder_type,
            "scheduled_date": r.scheduled_date,
            "status": r.status,
            "sent_at": r.sent_at.isoformat() if r.sent_at else None,
            "email_recipient": r.email_recipient or user.email,
            "created_at": r.created_at.isoformat() if r.created_at else None
        })
    return output

@app.post("/api/v1/reminders/schedule")
def schedule_health_reminder(
    req: ScheduleReminderRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Schedules an automated periodic health checkup reminder."""
    patient = db.query(Patient).filter(Patient.id == req.patient_id, Patient.user_id == user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found.")

    reminder = EmailReminder(
        id=str(uuid.uuid4()),
        user_id=user.id,
        patient_id=patient.id,
        reminder_type=req.reminder_type,
        scheduled_date=req.scheduled_date,
        status="PENDING",
        email_recipient=user.email,
        email_subject=f"Mediscope Reminder: {req.reminder_type} for {patient.full_name}",
        email_body=req.notes or f"Upcoming {req.reminder_type} scheduled for {patient.full_name} ({patient.relationship})."
    )
    db.add(reminder)
    db.commit()
    db.refresh(reminder)

    return {
        "message": f"Reminder successfully scheduled for {patient.full_name} on {req.scheduled_date}",
        "reminder_id": reminder.id
    }

@app.post("/api/v1/reminders/send-test-email")
def trigger_test_email(
    req: SendEmailTestRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Triggers an actual formatted HTML checkup reminder email dispatch to user's registered email address.
    """
    patient = db.query(Patient).filter(Patient.id == req.patient_id, Patient.user_id == user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found.")

    dispatch_res = send_health_reminder_email(
        to_email=user.email,
        patient_name=patient.full_name,
        relationship=patient.relationship,
        scheduled_date=req.scheduled_date,
        reminder_type=req.reminder_type,
        notes=req.notes
    )

    # Save to reminders history as SENT
    reminder = EmailReminder(
        id=str(uuid.uuid4()),
        user_id=user.id,
        patient_id=patient.id,
        reminder_type=req.reminder_type,
        scheduled_date=req.scheduled_date,
        status="SENT" if dispatch_res["success"] else "FAILED",
        sent_at=datetime.utcnow() if dispatch_res["success"] else None,
        email_recipient=user.email,
        email_subject=dispatch_res["subject"],
        email_body=dispatch_res["html_preview"]
    )
    db.add(reminder)
    db.commit()

    return {
        "message": f"Email successfully dispatched to {user.email}",
        "dispatch_details": dispatch_res
    }

# ---------------------------------------------------------------------------
# Health Check & Root
# ---------------------------------------------------------------------------
@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "platform": "Mediscope",
        "copyright": "Copyright © 2026 Akhila Meesa. All rights reserved.",
        "owner": "Akhila Meesa",
        "timestamp": datetime.utcnow().isoformat()
    }

# ---------------------------------------------------------------------------
# Serve Production Frontend Distribution & SPA Fallback
# ---------------------------------------------------------------------------
from fastapi.responses import FileResponse
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="frontend_assets")
    
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = os.path.join(frontend_dist, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
