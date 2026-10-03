import sys
import os
import json
import time
import urllib.request
import urllib.error

BASE_URL = "http://127.0.0.1:8000/api/v1"

def http_req(method, url, data=None, headers=None):
    if headers is None:
        headers = {}
    body = None
    if data is not None and not isinstance(data, (bytes, bytearray)):
        body = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"
    elif isinstance(data, (bytes, bytearray)):
        body = data

    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode("utf-8")
            return resp.status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        err_content = e.read().decode("utf-8")
        try:
            return e.code, json.loads(err_content)
        except Exception:
            return e.code, {"detail": err_content}

def run_tests():
    print("==================================================")
    print("      MEDISCOPE AUTOMATED VERIFICATION SUITE       ")
    print("==================================================")

    # 1. Health check
    status, health_data = http_req("GET", f"{BASE_URL}/health")
    assert status == 200, f"Health check failed: {health_data}"
    print("[PASS] Health Check Passed:", health_data["platform"], "-", health_data["copyright"])

    # 2. Test Registration with weak password (Must fail checklist)
    weak_payload = {
        "full_name": "Test User",
        "email": "test.weak@example.com",
        "password": "password",
        "consent_granted": True
    }
    status, resp = http_req("POST", f"{BASE_URL}/auth/register", weak_payload)
    assert status == 400, "Weak password was unexpectedly accepted"
    print("[PASS] Password Complexity Validation Passed: Weak password blocked successfully")

    # 3. Test Registration with missing consent (Must fail)
    no_consent_payload = {
        "full_name": "Test User",
        "email": "test.noconsent@example.com",
        "password": "SecurePassword123!",
        "consent_granted": False
    }
    status, resp = http_req("POST", f"{BASE_URL}/auth/register", no_consent_payload)
    assert status == 400, "Missing consent was unexpectedly accepted"
    print("[PASS] Mandatory Permission Consent Validation Passed")

    # 4. Successful Registration
    test_email = f"akhila.test.{int(time.time())}@gmail.com"
    valid_payload = {
        "full_name": "Akhila Meesa",
        "email": test_email,
        "password": "Mediscope2026!#Secure",
        "consent_granted": True,
        "communication_frequency": "ANNUAL"
    }
    status, reg_data = http_req("POST", f"{BASE_URL}/auth/register", valid_payload)
    assert status == 200, f"Registration failed: {reg_data}"
    token = reg_data["access_token"]
    auth_headers = {"Authorization": f"Bearer {token}"}
    print("[PASS] User Registration Passed. User ID:", reg_data["user"]["id"])

    # 5. Duplicate Email check during Registration (Must fail)
    status, resp = http_req("POST", f"{BASE_URL}/auth/register", valid_payload)
    assert status == 409, "Duplicate email registration was unexpectedly permitted"
    print("[PASS] Email Duplicate Check Passed: 409 Conflict returned")

    # 6. Sign-In User Lookup & Modal Alert: Non-existent email (Must return ACCOUNT_NOT_FOUND)
    not_found_payload = {
        "email": "nonexistent.user.2026@gmail.com",
        "password": "RandomPassword123!"
    }
    status, err_json = http_req("POST", f"{BASE_URL}/auth/login", not_found_payload)
    assert status == 404, f"Non-existent user was not handled with 404: {status}"
    assert err_json.get("code") == "ACCOUNT_NOT_FOUND", "Error code was not ACCOUNT_NOT_FOUND"
    print("[PASS] Account Not Found Modal Alert Check Passed:", err_json["detail"])

    # 7. Successful Login
    status, login_res = http_req("POST", f"{BASE_URL}/auth/login", {
        "email": test_email,
        "password": "Mediscope2026!#Secure"
    })
    assert status == 200, "Login failed"
    print("[PASS] Login Passed with JWT issuance")

    # 8. Initial Empty State check (Mandatory for newly registered users)
    status, patients = http_req("GET", f"{BASE_URL}/patients", headers=auth_headers)
    assert status == 200
    assert len(patients) == 0, "Patient database must start completely empty for new users"
    print("[PASS] Mandatory Initial Empty State Confirmed: 0 patients found")

    # 9. Create Family Patient Profile
    patient_payload = {
        "full_name": "Saraswathi Meesa",
        "relationship": "Mother",
        "date_of_birth": "1968-08-14",
        "gender": "Female",
        "blood_group": "O+",
        "emergency_contact": "+91 98490 11223",
        "pre_existing_conditions": "Borderline Fasting Glucose, Mild Hypercholesterolemia",
        "primary_physician": "Dr. V. Rao"
    }
    status, p_res = http_req("POST", f"{BASE_URL}/patients", patient_payload, headers=auth_headers)
    assert status == 200, f"Patient creation failed: {p_res}"
    patient = p_res["patient"]
    patient_id = patient["id"]
    print("[PASS] Patient Creation Passed. Created profile for:", patient["full_name"])

    # 10. Multi-part upload test using standard urllib
    boundary = "----MediscopeBoundaryXYZ123"
    lines = [
        f"--{boundary}",
        'Content-Disposition: form-data; name="patient_id"',
        '',
        patient_id,
        f"--{boundary}",
        'Content-Disposition: form-data; name="report_name"',
        '',
        'Autumn Comprehensive Metabolic Panel',
        f"--{boundary}",
        'Content-Disposition: form-data; name="report_date"',
        '',
        '2026-10-04',
        f"--{boundary}",
        'Content-Disposition: form-data; name="file"; filename="sample_panel.txt"',
        'Content-Type: text/plain',
        '',
        """CENTRAL DIAGNOSTIC PATHOLOGY LABORATORY
Patient: Saraswathi Meesa
Fasting Blood Glucose: 126.0 mg/dL
HbA1c (Glycated Hemoglobin): 6.3 %
Total Cholesterol: 218.0 mg/dL
LDL Cholesterol: 138.0 mg/dL
Triglycerides: 172.0 mg/dL
TSH (Thyroid Stimulating Hormone): 4.6 uIU/mL
Vitamin D (25-OH): 18.2 ng/mL
""",
        f"--{boundary}--",
        ''
    ]
    body_data = "\r\n".join(lines).encode("utf-8")
    upload_headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": f"multipart/form-data; boundary={boundary}"
    }
    status, upload_res = http_req("POST", f"{BASE_URL}/reports/upload", data=body_data, headers=upload_headers)
    assert status == 200, f"Upload failed: {upload_res}"
    report_id = upload_res["report_id"]
    print("[PASS] Report 4-Stage OCR & RAG Pipeline Passed:", upload_res["stages_completed"])

    # 11. Inspect Report Details & Multilingual Output (EN, HI, TE)
    status, report_detail = http_req("GET", f"{BASE_URL}/reports/{report_id}", headers=auth_headers)
    assert status == 200
    print("[PASS] Multilingual AI Report Inspection Passed:")
    print("   [EN Summary Length]:", len(report_detail["report"]["summary"]["en"]), "characters")
    print("   [HI Summary Length]:", len(report_detail["report"]["summary"]["hi"]), "characters")
    print("   [TE Summary Length]:", len(report_detail["report"]["summary"]["te"]), "characters")
    print("[PASS] Second Treatment Opinions (EN):", len(report_detail["report"]["second_opinion"]["en"]), "characters")

    # 12. Local Specialists Directory check
    status, spec_data = http_req("GET", f"{BASE_URL}/doctors/specialists?patient_id={patient_id}", headers=auth_headers)
    assert status == 200
    assert spec_data["matched_specialties_count"] > 0
    print(f"[PASS] Local Specialist Directory Passed: {spec_data['matched_specialties_count']} clinical specialties matched")

    # 13. Live Outbreaks & Infectious Disease Tracker
    status, outbreaks = http_req("GET", f"{BASE_URL}/health/outbreaks")
    assert status == 200
    assert len(outbreaks["outbreaks"]) >= 4
    print(f"[PASS] Live Outbreak Sentinel Passed: {len(outbreaks['outbreaks'])} pathogens tracked")

    # 14. Actual HTML Email Dispatch Engine
    status, email_res = http_req("POST", f"{BASE_URL}/reminders/send-test-email", {
        "patient_id": patient_id,
        "reminder_type": "Annual Comprehensive Health Screening",
        "scheduled_date": "2026-11-15",
        "notes": "Verify fasting glucose and vitamin D levels."
    }, headers=auth_headers)
    assert status == 200
    assert email_res["dispatch_details"]["success"] is True
    print("[PASS] Actual HTML Email Dispatch Engine Passed. Recipient:", email_res["dispatch_details"]["recipient"])

    print("\n==================================================")
    print("  ALL 14 PRODUCTION ARCHITECTURE TESTS PASSED!    ")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
