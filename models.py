import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Boolean, DateTime, Date, Numeric, Text, ForeignKey
from sqlalchemy.orm import relationship as orm_relationship
from database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    consent_granted = Column(Boolean, default=True)
    consent_timestamp = Column(DateTime, default=datetime.utcnow)
    communication_frequency = Column(String(50), default="ANNUAL")
    created_at = Column(DateTime, default=datetime.utcnow)

    patients = orm_relationship("Patient", back_populates="user", cascade="all, delete-orphan")
    reminders = orm_relationship("EmailReminder", back_populates="user", cascade="all, delete-orphan")

class Patient(Base):
    __tablename__ = "patients"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    relationship = Column(String(100), nullable=False)
    date_of_birth = Column(String(20), nullable=False)
    gender = Column(String(50), nullable=True)
    blood_group = Column(String(10), nullable=True)
    emergency_contact = Column(String(100), nullable=True)
    pre_existing_conditions = Column(Text, nullable=True)
    primary_physician = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = orm_relationship("User", back_populates="patients")
    reports = orm_relationship("Report", back_populates="patient", cascade="all, delete-orphan")
    reminders = orm_relationship("EmailReminder", back_populates="patient", cascade="all, delete-orphan")

class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    patient_id = Column(String(36), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    report_name = Column(String(255), nullable=False)
    report_date = Column(String(20), nullable=False)
    file_url = Column(Text, nullable=True)
    raw_text = Column(Text, nullable=True)
    summary_en = Column(Text, nullable=True)
    summary_hi = Column(Text, nullable=True)
    summary_te = Column(Text, nullable=True)
    second_opinion_en = Column(Text, nullable=True)
    second_opinion_hi = Column(Text, nullable=True)
    second_opinion_te = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = orm_relationship("Patient", back_populates="reports")
    test_results = orm_relationship("TestResult", back_populates="report", cascade="all, delete-orphan")

class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    report_id = Column(String(36), ForeignKey("reports.id", ondelete="CASCADE"), nullable=False, index=True)
    test_name = Column(String(255), nullable=False)
    value = Column(Numeric(10, 2), nullable=False)
    unit = Column(String(50), nullable=True)
    reference_low = Column(Numeric(10, 2), nullable=True)
    reference_high = Column(Numeric(10, 2), nullable=True)
    status = Column(String(20), nullable=False, index=True) # HIGH, LOW, NORMAL
    clinical_context_en = Column(Text, nullable=True)
    clinical_context_hi = Column(Text, nullable=True)
    clinical_context_te = Column(Text, nullable=True)

    report = orm_relationship("Report", back_populates="test_results")

class EmailReminder(Base):
    __tablename__ = "email_reminders"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    patient_id = Column(String(36), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    reminder_type = Column(String(100), nullable=False) # 'ANNUAL_CHECKUP', 'LAB_FOLLOWUP'
    scheduled_date = Column(String(20), nullable=False)
    status = Column(String(20), default="PENDING") # 'PENDING', 'SENT'
    sent_at = Column(DateTime, nullable=True)
    email_recipient = Column(String(255), nullable=True)
    email_subject = Column(String(255), nullable=True)
    email_body = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = orm_relationship("User", back_populates="reminders")
    patient = orm_relationship("Patient", back_populates="reminders")

class MedicalKnowledgeVector(Base):
    __tablename__ = "medical_knowledge_vectors"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    content = Column(Text, nullable=False)
    source_name = Column(String(255), nullable=False)
    embedding_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
