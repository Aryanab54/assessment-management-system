// Sample assessment data for demonstration
export const sampleAssessmentData = [
  {
    "session_id": "session_001",
    "accuracy": 80,
    "assessmentResultId": "-OK76ANqAq9pvKSl3ZoN",
    "assessment_id": "as_hr_02",
    "bodyCompositionData": {
      "AGR": "1.687",
      "Age": "43",
      "BFC": "29.754",
      "BMI": "33.145",
      "BMR": "2054.217",
      "FM": "33.027",
      "FMI": "9.862",
      "HeightM": "184.091",
      "LM": "77.973",
      "LMI": "23.283",
      "M_Age": "48",
      "WHGR": "0.564",
      "WHR": "0.926"
    },
    "exercises": [
      {
        "analysisList": [
          "Shoulders slightly uneven, affecting posture balance.",
          "Head alignment slightly off-center.",
          "Feet aligned properly under shoulders.",
          "Arms hang naturally by the sides."
        ],
        "analysisScore": 75,
        "assignReps": 1,
        "correctReps": 1,
        "id": 73,
        "name": "Frontal body view",
        "setList": [
          {
            "additionalFields": [
              {
                "fieldName": "accuracy",
                "fieldText": "Score",
                "fieldUnit": "%",
                "fieldValue": "0.0",
                "shouldDisplay": false
              }
            ],
            "correctReps": 1,
            "incorrectReps": 0,
            "isSkipped": false,
            "time": 10,
            "totalReps": 1
          }
        ],
        "side": "left",
        "tipsList": [
          "Practice shoulder alignment exercises daily.",
          "Focus on maintaining head center alignment."
        ],
        "totalReps": 1,
        "totalSets": 1,
        "variationId": "",
        "variationName": ""
      }
    ],
    "gender": "male",
    "height": 183,
    "vitalsMap": {
      "vitals": {
        "bp_dia": 82,
        "bp_sys": 124,
        "heart_rate": 75,
        "oxy_sat_prcnt": 96,
        "resp_rate": 21
      },
      "wellness_score": 84
    },
    "weight": 111
  },
  {
    "session_id": "session_002",
    "accuracy": 17,
    "assessmentResultId": "-OTafA4SqUgE6Y5xrqiI",
    "assessment_id": "as_card_01",
    "bodyCompositionData": {
      "AGR": "0.90",
      "BFC": "-0.90",
      "BMI": "9.51",
      "BMR": "995.39",
      "FM": "-0.18",
      "FMI": "-0.09",
      "LM": "20.18",
      "LMI": "9.60",
      "M_Age": "15",
      "WHGR": "0.37",
      "WHR": "1.01"
    },
    "exercises": [
      {
        "assignReps": 10,
        "correctReps": 0,
        "id": 235,
        "name": "Jog test",
        "setList": [
          {
            "additionalFields": [
              {
                "fieldName": "accuracy",
                "fieldText": "Score",
                "fieldUnit": "%",
                "fieldValue": "15.164222764530614",
                "shouldDisplay": false
              }
            ],
            "correctReps": 0,
            "incorrectReps": 0,
            "isSkipped": false,
            "time": 47,
            "totalReps": 0
          }
        ],
        "side": "left",
        "totalReps": 0,
        "totalSets": 1,
        "variationId": "",
        "variationName": ""
      }
    ],
    "gender": "male",
    "height": 145,
    "vitalsMap": {
      "vitals": {
        "bp_dia": 75,
        "bp_sys": 110,
        "heart_rate": 66,
        "oxy_sat_prcnt": 95,
        "resp_rate": 19
      },
      "wellness_score": 84
    },
    "weight": 20
  }
];

export const assessmentTypes = {
  "as_hr_02": {
    name: "Health & Fitness Assessment",
    sections: ["Key Body Vitals", "Heart Health", "Stress Level", "Fitness Levels", "Posture", "Body Composition"],
    icon: "🏃♂️",
    color: "success"
  },
  "as_card_01": {
    name: "Cardiac Assessment", 
    sections: ["Key Body Vitals", "Cardiovascular Endurance", "Body Composition"],
    icon: "❤️",
    color: "danger"
  }
};