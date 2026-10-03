-- ============================================================================
-- Mediscope Database Schema (PostgreSQL + pgvector)
-- Proprietary Owner & Legal Copyright Holder: Akhila Meesa
-- Copyright © 2026 Akhila Meesa. All rights reserved.
-- ============================================================================

-- Enable UUID extension and Vector extension for pgvector
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    consent_granted BOOLEAN DEFAULT TRUE,
    consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    communication_frequency VARCHAR(50) DEFAULT 'ANNUAL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for rapid email lookups during authentication
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. patients Table
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(50),
    blood_group VARCHAR(10),
    emergency_contact VARCHAR(100),
    pre_existing_conditions TEXT,
    primary_physician VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);

-- 3. reports Table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    report_name VARCHAR(255) NOT NULL,
    report_date DATE NOT NULL,
    file_url TEXT,
    raw_text TEXT,
    summary_en TEXT,
    summary_hi TEXT,
    summary_te TEXT,
    second_opinion_en TEXT,
    second_opinion_hi TEXT,
    second_opinion_te TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reports_patient_id ON reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_reports_date ON reports(report_date);

-- 4. test_results Table
CREATE TABLE IF NOT EXISTS test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    test_name VARCHAR(255) NOT NULL,
    value NUMERIC NOT NULL,
    unit VARCHAR(50),
    reference_low NUMERIC,
    reference_high NUMERIC,
    status VARCHAR(20) NOT NULL, -- 'HIGH', 'LOW', 'NORMAL'
    clinical_context_en TEXT,
    clinical_context_hi TEXT,
    clinical_context_te TEXT
);

CREATE INDEX IF NOT EXISTS idx_test_results_report_id ON test_results(report_id);
CREATE INDEX IF NOT EXISTS idx_test_results_status ON test_results(status);

-- 5. email_reminders Table
CREATE TABLE IF NOT EXISTS email_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    reminder_type VARCHAR(100) NOT NULL, -- 'ANNUAL_CHECKUP', 'LAB_FOLLOWUP'
    scheduled_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'SENT'
    sent_at TIMESTAMP WITH TIME ZONE NULL,
    email_recipient VARCHAR(255),
    email_subject VARCHAR(255),
    email_body TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reminders_status_date ON email_reminders(status, scheduled_date);

-- 6. medical_knowledge_vectors Table (pgvector)
CREATE TABLE IF NOT EXISTS medical_knowledge_vectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    source_name VARCHAR(255) NOT NULL,
    embedding VECTOR(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cosine distance index for rapid vector retrieval in pgvector
CREATE INDEX IF NOT EXISTS idx_medical_vectors_cosine ON medical_knowledge_vectors 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
