from typing import List, Dict, Any

SPECIALIST_DATABASE = {
    "Endocrinology": {
        "specialty": "Endocrinology & Diabetology",
        "description": "Specialists focusing on hormonal imbalances, diabetes management, thyroid disorders, and metabolic health.",
        "doctors": [
            {
                "id": "doc-endo-1",
                "name": "Dr. Ananya Sharma, MD, DM (Endocrinology)",
                "hospital": "Apex Center for Diabetes & Hormone Health",
                "location": "Banjara Hills / Central Healthcare District",
                "experience": "16+ years experience",
                "rating": "4.9/5 (340 reviews)",
                "phone": "+91 98450 12345",
                "email": "dr.sharma@apexhealth.org",
                "consultation_fee": "$45 / ₹1,200",
                "prep_tips": "Bring 90-day fasting and post-meal glucose logs, recent HbA1c report, and list of ongoing medications."
            },
            {
                "id": "doc-endo-2",
                "name": "Dr. Rajiv Menon, FRCP, DM",
                "hospital": "Metropolitan Endocrinology Institute",
                "location": "Suite 402, Care Medical Tower",
                "experience": "22+ years experience",
                "rating": "4.8/5 (510 reviews)",
                "phone": "+91 98230 54321",
                "email": "rmenon@metroendo.com",
                "consultation_fee": "$50 / ₹1,500",
                "prep_tips": "Fast for 8 hours prior to appointment if fasting blood draw or OGTT is requested."
            }
        ]
    },
    "Cardiology": {
        "specialty": "Cardiology & Preventive Heart Care",
        "description": "Specialists treating hyperlipidemia, coronary risks, hypertension, and cardiovascular health.",
        "doctors": [
            {
                "id": "doc-cardio-1",
                "name": "Dr. Vikramaditya Rao, MD, DM (Cardiology)",
                "hospital": "Global Heart & Vascular Foundation",
                "location": "Cardiology Wing, Jubilee Hills Medical Enclave",
                "experience": "19+ years experience",
                "rating": "4.95/5 (620 reviews)",
                "phone": "+91 99001 88765",
                "email": "dr.rao@globalheart.org",
                "consultation_fee": "$60 / ₹1,800",
                "prep_tips": "Bring full lipid panel, ECG traces if available, and any family history notes of premature CAD."
            },
            {
                "id": "doc-cardio-2",
                "name": "Dr. Sunita Deshmukh, FACC",
                "hospital": "Cardio-Metabolic Care Clinic",
                "location": "HealthCity Boulevard",
                "experience": "14+ years experience",
                "rating": "4.85/5 (290 reviews)",
                "phone": "+91 97112 33445",
                "email": "deshmukh@cardiocare.org",
                "consultation_fee": "$55 / ₹1,400",
                "prep_tips": "Avoid high caffeine 4 hours before consultation for accurate resting blood pressure and heart rate."
            }
        ]
    },
    "Hematology": {
        "specialty": "Clinical Hematology & Blood Disorders",
        "description": "Specialists diagnosing anemia, hemoglobinopathies, platelet disorders, and bone marrow conditions.",
        "doctors": [
            {
                "id": "doc-hem-1",
                "name": "Dr. Meera Nambiar, MD, DNB (Hematology)",
                "hospital": "Institute of Blood Sciences & Oncology",
                "location": "Academic Medical Center, Sector 9",
                "experience": "15+ years experience",
                "rating": "4.9/5 (210 reviews)",
                "phone": "+91 98400 66778",
                "email": "mnambiar@bloodsciences.org",
                "consultation_fee": "$50 / ₹1,500",
                "prep_tips": "Bring complete serial CBC / hemogram reports, iron panel, and Vitamin B12 / Folate results."
            }
        ]
    },
    "Nephrology": {
        "specialty": "Nephrology & Renal Medicine",
        "description": "Specialists treating kidney function anomalies, elevated creatinine, BUN, and proteinuria.",
        "doctors": [
            {
                "id": "doc-neph-1",
                "name": "Dr. Pradeep Kulkarni, MD, DM (Nephrology)",
                "hospital": "Premier Kidney Care & Dialysis Institute",
                "location": "Midtown Medical Plaza, 5th Floor",
                "experience": "18+ years experience",
                "rating": "4.88/5 (380 reviews)",
                "phone": "+91 98880 11223",
                "email": "dr.kulkarni@kidneycare.net",
                "consultation_fee": "$55 / ₹1,600",
                "prep_tips": "Bring urine routine analysis, serum creatinine trends, and record daily fluid intake."
            }
        ]
    },
    "Gastroenterology": {
        "specialty": "Gastroenterology & Hepatology",
        "description": "Specialists treating liver enzymes (SGPT/SGOT), bilirubin elevation, and digestive conditions.",
        "doctors": [
            {
                "id": "doc-gastro-1",
                "name": "Dr. Harish Varma, MD, DM (Gastroenterology)",
                "hospital": "Digestive & Liver Sciences Pavilion",
                "location": "Riverside Healthcare Campus",
                "experience": "20+ years experience",
                "rating": "4.92/5 (490 reviews)",
                "phone": "+91 99887 77665",
                "email": "hvarma@liversciences.org",
                "consultation_fee": "$50 / ₹1,500",
                "prep_tips": "Bring ultrasound whole abdomen reports and full Liver Function Test (LFT) profiles."
            }
        ]
    }
}

def get_specialists_for_biomarkers(biomarkers: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Returns recommended specialist categories and doctors matched
    to the patient's out-of-range biomarkers.
    """
    matched_specialties = set()
    for b in biomarkers:
        name = b.get("test_name", "")
        status = b.get("status", "")
        
        # Match based on test name or category
        if "Glucose" in name or "HbA1c" in name or "TSH" in name or "Thyroid" in name or "Vitamin" in name:
            matched_specialties.add("Endocrinology")
        if "Cholesterol" in name or "LDL" in name or "Triglycerides" in name:
            matched_specialties.add("Cardiology")
        if "Hemoglobin" in name or "Platelet" in name or "WBC" in name or "B12" in name:
            matched_specialties.add("Hematology")
        if "Creatinine" in name or "BUN" in name or "Urea" in name:
            matched_specialties.add("Nephrology")
        if "Bilirubin" in name or "SGPT" in name or "SGOT" in name or "ALT" in name or "AST" in name:
            matched_specialties.add("Gastroenterology")

    # If all normal or no specific match, default to Endocrinology & Cardiology for preventive health
    if not matched_specialties:
        matched_specialties = {"Endocrinology", "Cardiology"}

    results = []
    for spec in matched_specialties:
        if spec in SPECIALIST_DATABASE:
            data = SPECIALIST_DATABASE[spec]
            results.append({
                "specialty_key": spec,
                "specialty_title": data["specialty"],
                "description": data["description"],
                "doctors": data["doctors"]
            })
    return results
