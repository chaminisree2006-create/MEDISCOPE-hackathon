from typing import List, Dict, Any, Optional

# Multilingual Clinical Knowledge Base for Mediscope
CLINICAL_KNOWLEDGE = {
    "Fasting Blood Glucose": {
        "description_en": "Measures blood sugar levels after an overnight fast (minimum 8-10 hours). Key indicator for prediabetes and Type 2 diabetes.",
        "description_hi": "रात भर उपवास (कम से कम 8-10 घंटे) के बाद रक्त शर्करा के स्तर को मापता है। यह प्रीडायबिटीज और टाइप 2 डायबिटीज की जांच के लिए महत्वपूर्ण है।",
        "description_te": "రాత్రిపూట ఉపవాసం (కనీసం 8-10 గంటలు) తర్వాత రక్తంలో చక్కెర స్థాయిలను కొలుస్తుంది. ప్రీడయాబెటిస్ మరియు టైప్ 2 డయాబెటిస్ గుర్తించడానికి ఇది కీలకం.",
        "high_explanation_en": "Elevated fasting glucose suggests insulin resistance or impaired glucose tolerance. Requires metabolic evaluation.",
        "high_explanation_hi": "उच्च उपवास ग्लूकोज इंसुलिन प्रतिरोध या असंतुलित ग्लूकोज सहनशीलता का संकेत देता है। मेटाबॉलिक मूल्यांकन की आवश्यकता है।",
        "high_explanation_te": "అధిక ఫాస్టింగ్ గ్లూకోజ్ ఇన్సులిన్ రెసిస్టెన్స్ లేదా గ్లూకోజ్ అసమతుల్యతను సూచిస్తుంది. మెటబాలిక్ పరీక్ష అవసరం.",
        "low_explanation_en": "Low fasting glucose (hypoglycemia) can cause dizziness, sweating, and weakness. Usually related to medication timing or prolonged fasting.",
        "high_questions_en": [
            "What target fasting blood sugar should I aim for over the next 3 months?",
            "Do my current HbA1c and glucose levels indicate prediabetes or early diabetes?",
            "Would dietary carbohydrate timing and moderate aerobic exercise be sufficient, or should we consider medication?",
            "How often should I monitor my blood glucose at home?"
        ],
        "high_questions_hi": [
            "अगले 3 महीनों में मुझे किस फास्टिंग ब्लड शुगर स्तर का लक्ष्य रखना चाहिए?",
            "क्या मेरा HbA1c और ग्लूकोज स्तर प्रीडायबिटीज या शुरुआती डायबिटीज की ओर संकेत करता है?",
            "क्या आहार में बदलाव और व्यायाम पर्याप्त होगा या मुझे दवा की आवश्यकता है?",
            "मुझे घर पर कितनी बार ब्लड ग्लूकोज की जांच करनी चाहिए?"
        ],
        "high_questions_te": [
            "రాబోయే 3 నెలల్లో నేను ఎంత ఫాస్టింగ్ షుగర్ స్థాయిని లక్ష్యంగా పెట్టుకోవాలి?",
            "నా HbA1c మరియు గ్లూకోజ్ స్థాయిలు ప్రీడయాబెటిస్ లేదా ప్రారంభ డయాబెటిస్‌ను సూచిస్తున్నాయా?",
            "ఆహార నియమాలు మరియు వ్యాయామం సరిపోతాయా లేక మందులు వాడాలా?",
            "ఇంట్లో నేను ఎంత తరచుగా బ్లడ్ షుగర్ పరీక్షించుకోవాలి?"
        ],
        "second_opinion_en": "Second Treatment Opinion: In pre-diabetic ranges (100-125 mg/dL), international clinical guidelines (ADA/EASD) prioritize an intensive 3-month lifestyle modification trial (Mediterranean or low-glycemic load diet, 150 mins weekly aerobic activity, and 5-7% weight reduction) before initiating oral hypoglycemic agents like Metformin. A continuous glucose monitor (CGM) trial for 14 days may provide granular insight into postprandial glucose excursions.",
        "second_opinion_hi": "द्वितीय चिकित्सा राय: प्रीडायबिटीज स्तर (100-125 मिलीग्राम/डीएल) में, अंतरराष्ट्रीय दिशानिर्देश मेटफॉर्मिन जैसी दवाएं शुरू करने से पहले 3 महीने के गहन जीवनशैली संशोधन (कम ग्लाइसेमिक आहार, प्रति सप्ताह 150 मिनट व्यायाम और 5-7% वजन घटाना) की सलाह देते हैं।",
        "second_opinion_te": "రెండవ వైద్య అభిప్రాయం: ప్రీడయాబెటిస్ పరిధిలో (100-125 mg/dL), మెట్‌ఫార్మిన్ వంటి మందులను ప్రారంభించే ముందు 3 నెలల పాటు కఠినమైన జీవనశైలి మార్పులు (తక్కువ గ్లైసెమిక్ ఆహారం, వారానికి 150 నిమిషాల వ్యాయామం మరియు 5-7% బరువు తగ్గడం) చేయాలని అంతర్జాతీయ మార్గదర్శకాలు సిఫార్సు చేస్తున్నాయి."
    },
    "HbA1c (Glycated Hemoglobin)": {
        "description_en": "Reflects the 3-month average blood glucose concentration attached to hemoglobin in red blood cells.",
        "description_hi": "यह लाल रक्त कोशिकाओं में हीमोग्लोबिन से जुड़ी पिछले 3 महीनों की औसत रक्त शर्करा को दर्शाता है।",
        "description_te": "గత 3 నెలల సగటు రక్తంలో చక్కెర స్థాయిని ఇది తెలియజేస్తుంది.",
        "high_explanation_en": "Levels >= 5.7% indicate prediabetes; >= 6.5% indicate diabetes. Signifies chronic systemic exposure to elevated glucose.",
        "high_questions_en": [
            "Does this HbA1c result warrant initiation of Metformin or SGLT2 inhibitors?",
            "Are there specific microvascular screenings (kidney microalbumin, retinal exam) we should schedule now?",
            "Can we re-evaluate my HbA1c in 90 days following targeted nutritional interventions?"
        ],
        "high_questions_hi": [
            "क्या इस HbA1c स्तर के लिए मेटफॉर्मिन या अन्य दवा शुरू करने की आवश्यकता है?",
            "क्या मुझे किडनी और आंखों (रेटिना) की जांच करवानी चाहिए?",
            "क्या हम खान-पान में सुधार के बाद 90 दिनों में दोबारा HbA1c जांच सकते हैं?"
        ],
        "high_questions_te": [
            "ఈ HbA1c ఫలితం ఆధారంగా మందులు ప్రారంభించాల్సిన అవసరం ఉందా?",
            "నేను కిడ్నీ మరియు కంటి రెటీనా పరీక్షలు చేయించుకోవాలా?",
            "ఆహారంలో మార్పులు చేసుకున్న తర్వాత 90 రోజుల తర్వాత మళ్లీ ఈ పరీక్ష చేయవచ్చా?"
        ],
        "second_opinion_en": "Second Treatment Opinion: When HbA1c is between 5.7% and 6.4%, conservative dual-approach is standard. If >= 6.5%, evaluate cardiovascular and renal status to determine if modern protective agents (e.g. SGLT2i or GLP-1 RA) offer superior outcomes compared to sulfonylureas. Always confirm with a repeat fasting plasma glucose before definitive diagnosis.",
        "second_opinion_hi": "द्वितीय चिकित्सा राय: यदि HbA1c 5.7% से 6.4% के बीच है, तो जीवनशैली में बदलाव मुख्य कदम है। 6.5% से ऊपर होने पर हृदय और गुर्दे की सुरक्षा करने वाली दवाओं पर विचार किया जा सकता है। अंतिम निदान से पहले एक बार फिर फास्टिंग प्लाज्मा ग्लूकोज की पुष्टि करें।",
        "second_opinion_te": "రెండవ వైద్య అభిప్రాయం: HbA1c 5.7% నుండి 6.4% మధ్య ఉంటే జీవనశైలి మార్పులు ప్రాథమిక చికిత్స. 6.5% దాటితే గుండె మరియు మూత్రపిండాలను రక్షించే ఆధునిక ఔషధాల గురించి సంప్రదించండి."
    },
    "Total Cholesterol": {
        "description_en": "The total amount of cholesterol circulating in the bloodstream, combining LDL, HDL, and VLDL components.",
        "description_hi": "रक्तप्रवाह में परिसंचारी कुल कोलेस्ट्रॉल, जिसमें एलडीएल, एचडीएल और वीएलडीएल शामिल हैं।",
        "description_te": "రక్తంలో ఉండే మొత్తం కొలెస్ట్రాల్ (LDL, HDL మరియు VLDL కలయిక).",
        "high_explanation_en": "Hypercholesterolemia increases atherosclerotic cardiovascular disease (ASCVD) risk.",
        "high_questions_en": [
            "What is my calculated 10-year ASCVD (Cardiovascular Disease) risk score?",
            "Would a Coronary Artery Calcium (CAC) scan help decide whether statin therapy is necessary?",
            "What specific dietary adjustments (e.g., soluble fiber, reducing saturated fats) should I prioritize?"
        ],
        "high_questions_hi": [
            "मेरा 10-वर्षीय हृदय रोग (ASCVD) जोखिम स्कोर क्या है?",
            "क्या स्टेटिन दवा शुरू करने से पहले कोरोनरी आर्टरी कैल्शियम (CAC) स्कैन करवाना उपयोगी होगा?",
            "मुझे अपने आहार में सैचुरेटेड फैट कम करने और फाइबर बढ़ाने के लिए क्या करना चाहिए?"
        ],
        "high_questions_te": [
            "నా 10 సంవత్సరాల గుండె జబ్బుల (ASCVD) రిస్క్ స్కోర్ ఎంత?",
            "స్టాటిన్ మందులు అవసరమో లేదో తెలుసుకోవడానికి కొరోనరీ ఆర్టరీ కాల్షియం (CAC) స్కాన్ చేయించాలా?",
            "నా ఆహారంలో కొవ్వును తగ్గించడానికి మరియు పీచు పదార్థాలను పెంచడానికి ఏ మార్పులు చేయాలి?"
        ],
        "second_opinion_en": "Second Treatment Opinion: Elevated total cholesterol must be evaluated in context of ApoB and LDL particle count. For borderline cases without established atherosclerosis, non-pharmacologic intervention (plant sterols, 30g daily fiber, omega-3 fatty acids) for 8-12 weeks is a recognized conservative alternative before lifelong statin commitment.",
        "second_opinion_hi": "द्वितीय चिकित्सा राय: केवल कुल कोलेस्ट्रॉल देखकर दवा शुरू करने के बजाय ApoB और LDL कणों की जांच करें। 8-12 सप्ताह तक ओमेगा-3, 30 ग्राम फाइबर और आहार नियंत्रण एक सुरक्षित प्राथमिक विकल्प है।",
        "second_opinion_te": "రెండవ వైద్య అభిప్రాయం: మొత్తం కొలెస్ట్రాల్‌తో పాటు ApoB మరియు LDL స్థాయిలను సమగ్రంగా చూడాలి. స్టాటిన్ మందులు వాడే ముందు 8-12 వారాల పాటు ఒమేగా-3 మరియు ఫైబర్ ఆహార మార్పులను పరిశీలించవచ్చు."
    },
    "TSH (Thyroid Stimulating Hormone)": {
        "description_en": "Pituitary hormone that regulates the synthesis of thyroid hormones (T3 and T4) which control metabolism.",
        "description_hi": "पिट्यूटरी ग्रंथि द्वारा निर्मित हार्मोन जो थायरॉइड हार्मोन (टी3 और टी4) और चयापचय को नियंत्रित करता है।",
        "description_te": "మెటబాలిజంను నియంత్రించే థైరాయిడ్ హార్మోన్లను ప్రేరేపించే పిట్యూటరీ హార్మోన్.",
        "high_explanation_en": "Elevated TSH typically signals primary hypothyroidism or subclinical thyroid insufficiency.",
        "high_questions_en": [
            "Should we test Free T3, Free T4, and Anti-TPO antibodies to check for Hashimoto's thyroiditis?",
            "At my current TSH level, do clinical guidelines recommend Levothyroxine replacement now or watchful waiting?",
            "Could my symptoms (fatigue, weight changes, cold intolerance) be directly linked to this value?"
        ],
        "high_questions_hi": [
            "क्या हमें हाशिमोटो थायरॉयडिटिस की जांच के लिए फ्री T3, फ्री T4 और एंटी-TPO एंटीबॉडीज की जांच करनी चाहिए?",
            "क्या मेरे वर्तमान TSH स्तर पर लेवोथायरोक्सिन दवा शुरू करनी चाहिए या कुछ समय इंतजार करके दोबारा जांचना चाहिए?",
            "क्या मेरी थकान और वजन में बदलाव इस स्तर से संबंधित हैं?"
        ],
        "high_questions_te": [
            "హషిమోటోస్ థైరాయిడిటిస్ ఉందో లేదో తెలుసుకోవడానికి ఫ్రీ T3, ఫ్రీ T4 మరియు యాంటీ-TPO యాంటీబాడీ పరీక్షలు చేయించాలా?",
            "నా ప్రస్తుత TSH స్థాయికి థైరాయిడ్ మందులు అవసరమా లేదా వేచి చూసి మళ్లీ పరీక్షించాలా?",
            "నా నీరసం మరియు బరువు మార్పులకు ఈ ఫలితం కారణమా?"
        ],
        "second_opinion_en": "Second Treatment Opinion: In mild subclinical hypothyroidism (TSH 4.5 - 9.9 uIU/mL with normal Free T4), routine levothyroxine therapy is controversial unless the patient is pregnant, symptomatic, or Anti-TPO antibody positive. American Thyroid Association (ATA) suggests repeating TSH in 6 to 8 weeks to exclude transient thyroiditis.",
        "second_opinion_hi": "द्वितीय चिकित्सा राय: हल्के सबक्लिनिकल हाइपोथायरायडिज्म (TSH 4.5 - 9.9 uIU/mL) में तुरंत दवा शुरू करने के बजाय 6 से 8 सप्ताह बाद TSH और एंटी-TPO टेस्ट दोहराने की सलाह दी जाती है।",
        "second_opinion_te": "రెండవ వైద్య అభిప్రాయం: TSH కొద్దిగా పెరిగినప్పుడు (4.5 - 9.9 uIU/mL) వెంటనే మందులు మొదలుపెట్టకుండా 6-8 వారాల తర్వాత మళ్లీ పరీక్షించి, యాంటీబాడీలను నిర్ధారించుకోవడం ఉత్తమం."
    },
    "Vitamin D (25-OH)": {
        "description_en": "Essential fat-soluble pro-hormone crucial for calcium absorption, bone mineralization, and immune modulation.",
        "description_hi": "हड्डियों की मजबूती, कैल्शियम अवशोषण और प्रतिरक्षा प्रणाली के लिए आवश्यक महत्वपूर्ण विटामिन।",
        "description_te": "ఎముకల బలం, కాల్షియం గ్రహణ శక్తి మరియు రోగనిరోధక శక్తికి అత్యంత ముఖ్యమైన విటమిన్.",
        "high_explanation_en": "Toxicity is rare unless excessive pharmacological supplementation has occurred.",
        "high_questions_en": [
            "What weekly therapeutic dose of Cholecalciferol (e.g. 60,000 IU) is appropriate for replenishment?",
            "Should I take Vitamin D with dietary fats and co-factors like Magnesium or Vitamin K2?",
            "When should we re-test to confirm optimal serum levels (above 30-40 ng/mL)?"
        ],
        "high_questions_hi": [
            "विटामिन डी के सामान्य स्तर के लिए मुझे कौन सी साप्ताहिक खुराक (जैसे 60,000 IU) लेनी चाहिए?",
            "क्या मुझे इसे मैग्नीशियम या विटामिन K2 के साथ लेना चाहिए?",
            "सामान्य स्तर की पुष्टि के लिए मुझे कितने सप्ताह बाद दोबारा जांच करानी चाहिए?"
        ],
        "high_questions_te": [
            "విటమిన్ డి లోపాన్ని సరిదిద్దడానికి నేను ఏ వారపు డోస్ (ఉదాహరణకు 60,000 IU) తీసుకోవాలి?",
            "దీనిని మెగ్నీషియం లేదా విటమిన్ K2 తో కలిపి తీసుకోవడం మంచిదా?",
            "సరైన స్థాయిని నిర్ధారించడానికి ఎన్ని వారాల తర్వాత మళ్లీ పరీక్ష చేయించుకోవాలి?"
        ],
        "second_opinion_en": "Second Treatment Opinion: Deficiency (< 20 ng/mL) responds reliably to 60,000 IU oral cholecalciferol weekly for 8 weeks, followed by monthly maintenance. Co-administration of elemental magnesium (200-400 mg) improves enzyme activation. Monitor serum calcium periodically during intensive repletion.",
        "second_opinion_hi": "द्वितीय चिकित्सा राय: 20 ng/mL से कम स्तर होने पर 8 सप्ताह तक प्रति सप्ताह 60,000 IU विटामिन D3 और मैग्नीशियम लेना एक मानक और प्रभावी उपचार है।",
        "second_opinion_te": "రెండవ వైద్య అభిప్రాయం: 20 ng/mL కంటే తక్కువగా ఉన్నప్పుడు 8 వారాల పాటు వారానికి 60,000 IU విటమిన్ D3 తీసుకోవడం ప్రామాణిక చికిత్స."
    }
}

def generate_report_synthesis(biomarkers: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Synthesizes multilingual summaries, doctor questions, next-step guidance,
    and second treatment opinions based on the extracted biomarkers.
    """
    out_of_range = [b for b in biomarkers if b.get("status") in ["HIGH", "LOW"]]
    
    questions_en = []
    questions_hi = []
    questions_te = []
    
    second_opinions_en = []
    second_opinions_hi = []
    second_opinions_te = []

    guidance_en = []
    guidance_hi = []
    guidance_te = []

    for b in out_of_range:
        name = b["test_name"]
        status = b["status"]
        val = b["value"]
        unit = b.get("unit", "")
        
        info = CLINICAL_KNOWLEDGE.get(name)
        if info:
            if "high_questions_en" in info:
                questions_en.extend(info["high_questions_en"][:2])
            if "high_questions_hi" in info:
                questions_hi.extend(info["high_questions_hi"][:2])
            if "high_questions_te" in info:
                questions_te.extend(info["high_questions_te"][:2])
            
            if "second_opinion_en" in info:
                second_opinions_en.append(f"**{name} ({val} {unit} - {status})**: {info['second_opinion_en']}")
            if "second_opinion_hi" in info:
                second_opinions_hi.append(f"**{name} ({val} {unit} - {status})**: {info['second_opinion_hi']}")
            if "second_opinion_te" in info:
                second_opinions_te.append(f"**{name} ({val} {unit} - {status})**: {info['second_opinion_te']}")
        else:
            questions_en.append(f"My {name} returned {val} {unit} ({status}). What clinical follow-up panel do you recommend?")
            questions_hi.append(f"मेरी {name} रिपोर्ट {val} {unit} ({status}) आई है। आप कौन सी आगे की जांच की सलाह देते हैं?")
            questions_te.append(f"నా {name} నివేదిక {val} {unit} ({status}) వచ్చింది. మీరు తదుపరి ఏ పరీక్షలను సిఫార్సు చేస్తారు?")

            second_opinions_en.append(f"**{name}**: Verify lab calibration, rule out acute transient confounders (hydration, viral state), and repeat test in 4-6 weeks before pharmacological escalation.")
            second_opinions_hi.append(f"**{name}**: दवाएं शुरू करने से पहले लैब कैलिब्रेशन और 4-6 सप्ताह बाद दोबारा टेस्ट की पुष्टि करने की सलाह दी जाती है।")
            second_opinions_te.append(f"**{name}**: మందులు వాడే ముందు 4-6 వారాల తర్వాత మళ్లీ ఈ పరీక్ష చేయించి నిర్ధారించుకోవడం మంచిది.")

    if not questions_en:
        questions_en = [
            "All tested biomarkers are within standard reference intervals. What preventive health milestones should I track for the coming year?",
            "Are there any baseline screenings appropriate for my age group that we haven't checked yet?"
        ]
        questions_hi = [
            "सभी परीक्षण मानक सीमा के भीतर हैं। आने वाले वर्ष के लिए मुझे किन निवारक स्वास्थ्य आदतों का पालन करना चाहिए?",
            "क्या मेरी आयु वर्ग के लिए कोई अतिरिक्त स्क्रीनिंग आवश्यक है?"
        ]
        questions_te = [
            "అన్ని పరీక్షలు సాధారణ పరిధిలోనే ఉన్నాయి. రాబోయే సంవత్సరంలో నేను ఏ ఆరోగ్య జాగ్రత్తలు తీసుకోవాలి?",
            "నా వయస్సు ప్రకారం మరేవైనా స్క్రీనింగ్ పరీక్షలు చేయించాలా?"
        ]

        second_opinions_en = [
            "Standard Wellness Pathway: Continue annual comprehensive metabolic panels, maintain balanced nutrition with cardioprotective physical conditioning."
        ]
        second_opinions_hi = [
            "सामान्य स्वास्थ्य सलाह: नियमित वार्षिक जांच जारी रखें, संतुलित आहार और दैनिक व्यायाम बनाए रखें।"
        ]
        second_opinions_te = [
            "సాధారణ ఆరోగ్య సలహా: వార్షిక ఆరోగ్య పరీక్షలు కొనసాగించండి, సమతుల్య ఆహారం మరియు వ్యాయామం అలవర్చుకోండి."
        ]

    # Summaries
    summary_en = f"Analysis identified {len(biomarkers)} laboratory biomarkers with {len(out_of_range)} out-of-range flag(s). Key parameters requiring primary clinical review include: {', '.join([f'{b['test_name']} ({b['status']})' for b in out_of_range]) if out_of_range else 'None (All Normal)'}."
    summary_hi = f"विश्लेषण में {len(biomarkers)} प्रयोगशाला बायोमार्कर शामिल हैं, जिनमें {len(out_of_range)} मानक सीमा से बाहर हैं। डॉक्टर से परामर्श योग्य मुख्य पैरामीटर: {', '.join([f'{b['test_name']} ({b['status']})' for b in out_of_range]) if out_of_range else 'कोई नहीं (सभी सामान्य)'}."
    summary_te = f"విశ్లేషణలో {len(biomarkers)} బయోమార్కర్లు పరిశీలించబడ్డాయి, ఇందులో {len(out_of_range)} సాధారణ పరిధికి భిన్నంగా ఉన్నాయి. ముఖ్యంగా సమీక్షించవలసిన అంశాలు: {', '.join([f'{b['test_name']} ({b['status']})' for b in out_of_range]) if out_of_range else 'ఏమీ లేవు (అన్నీ సాధారణం)'}."

    return {
        "summary": {
            "en": summary_en,
            "hi": summary_hi,
            "te": summary_te
        },
        "questions": {
            "en": questions_en,
            "hi": questions_hi,
            "te": questions_te
        },
        "second_opinions": {
            "en": "\n\n".join(second_opinions_en),
            "hi": "\n\n".join(second_opinions_hi),
            "te": "\n\n".join(second_opinions_te)
        },
        "out_of_range_count": len(out_of_range)
    }

def calculate_longitudinal_deltas(prior_results: List[Dict[str, Any]], current_results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Computes exact historical deltas between prior and current lab reports.
    Example: Fasting Glucose: June 128 mg/dL -> Current 115 mg/dL | Delta: -13 mg/dL
    """
    prior_map = {r["test_name"]: r for r in prior_results}
    deltas = []

    for curr in current_results:
        name = curr["test_name"]
        curr_val = float(curr["value"])
        unit = curr.get("unit", "")

        if name in prior_map:
            prev = prior_map[name]
            prev_val = float(prev["value"])
            delta_val = round(curr_val - prev_val, 2)
            pct_change = round(((curr_val - prev_val) / prev_val) * 100, 1) if prev_val != 0 else 0
            
            # Trend direction: IMPROVED, WORSENED, STABLE
            # For cholesterol, glucose, TSH, lower is often improved if previously high
            if curr.get("status") == "NORMAL" and prev.get("status") in ["HIGH", "LOW"]:
                direction = "IMPROVED"
            elif curr.get("status") in ["HIGH", "LOW"] and prev.get("status") == "NORMAL":
                direction = "WORSENED"
            elif delta_val == 0:
                direction = "STABLE"
            else:
                direction = "CHANGED"

            deltas.append({
                "test_name": name,
                "prior_value": prev_val,
                "current_value": curr_val,
                "unit": unit,
                "delta": delta_val,
                "percentage_change": pct_change,
                "status_prior": prev.get("status", "NORMAL"),
                "status_current": curr.get("status", "NORMAL"),
                "trend_direction": direction
            })
    return deltas
