const reportConfigurations = {
  "as_hr_02": {
    name: "Health & Fitness Assessment",
    sections: ["Key Body Vitals", "Heart Health", "Stress Level", "Fitness Levels", "Posture", "Body Composition"],
    fieldMappings: {
      overallHealthScore: "accuracy",
      heartRate: "vitalsMap.vitals.heart_rate",
      bloodPressureSys: "vitalsMap.vitals.bp_sys",
      bloodPressureDia: "vitalsMap.vitals.bp_dia",
      oxygenSaturation: "vitalsMap.vitals.oxy_sat_prcnt",
      respiratoryRate: "vitalsMap.vitals.resp_rate",
      stressIndex: "vitalsMap.metadata.heart_scores.stress_index",
      wellnessScore: "vitalsMap.wellness_score",
      cardiovascularEndurance: "exercises[id=235].setList[0].time",
      bmi: "bodyCompositionData.BMI",
      bodyFat: "bodyCompositionData.BFC",
      leanMass: "bodyCompositionData.LM",
      bmr: "bodyCompositionData.BMR"
    },
    classifications: {
      overallHealthScore: {
        excellent: { min: 90, max: 100 },
        good: { min: 70, max: 89 },
        fair: { min: 50, max: 69 },
        poor: { min: 0, max: 49 }
      },
      heartRate: {
        excellent: { min: 60, max: 80 },
        good: { min: 50, max: 100 },
        fair: { min: 40, max: 120 },
        poor: { min: 0, max: 200 }
      },
      bmi: {
        underweight: { min: 0, max: 18.5 },
        normal: { min: 18.5, max: 24.9 },
        overweight: { min: 25, max: 29.9 },
        obese: { min: 30, max: 100 }
      }
    }
  },
  "as_card_01": {
    name: "Cardiac Assessment",
    sections: ["Key Body Vitals", "Cardiovascular Endurance", "Body Composition"],
    fieldMappings: {
      overallHealthScore: "accuracy",
      heartRate: "vitalsMap.vitals.heart_rate",
      bloodPressureSys: "vitalsMap.vitals.bp_sys",
      bloodPressureDia: "vitalsMap.vitals.bp_dia",
      cardiovascularEndurance: "exercises[id=235].setList[0].time",
      bmi: "bodyCompositionData.BMI",
      bodyFat: "bodyCompositionData.BFC"
    },
    classifications: {
      overallHealthScore: {
        excellent: { min: 90, max: 100 },
        good: { min: 70, max: 89 },
        fair: { min: 50, max: 69 },
        poor: { min: 0, max: 49 }
      }
    }
  }
};

const getFieldValue = (data, path) => {
  if (path.includes('[id=')) {
    const parts = path.split('[id=');
    const arrayPath = parts[0];
    const idMatch = parts[1].match(/(\d+)\]\.(.+)/);
    if (idMatch) {
      const targetId = parseInt(idMatch[1]);
      const remainingPath = idMatch[2];
      const arrayData = getNestedValue(data, arrayPath);
      if (Array.isArray(arrayData)) {
        const targetItem = arrayData.find(item => item.id === targetId);
        if (targetItem) return getNestedValue(targetItem, remainingPath);
      }
    }
    return null;
  }
  return getNestedValue(data, path);
};

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

const classifyValue = (value, classifications) => {
  if (!value || !classifications) return 'unknown';
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 'unknown';
  for (const [category, range] of Object.entries(classifications)) {
    if (numValue >= range.min && numValue <= range.max) return category;
  }
  return 'unknown';
};

module.exports = { reportConfigurations, getFieldValue, classifyValue };