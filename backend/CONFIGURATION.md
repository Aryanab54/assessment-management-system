# Configuration System Documentation

This document explains how to add new assessment types and modify existing configurations without changing any code.

## Overview

The system uses a configuration-driven approach where all assessment types, field mappings, and classifications are defined in `config.js`. This allows for maximum flexibility without code modifications.

## Adding New Assessment Types

### Step 1: Add Configuration

In `config.js`, add a new entry to the `reportConfigurations` object:

```javascript
"your_new_assessment_id": {
  name: "Your New Assessment Name",
  sections: [
    "Section 1",
    "Section 2", 
    "Section 3"
  ],
  fieldMappings: {
    fieldName1: "jsonPath.to.field1",
    fieldName2: "nested.object.field2",
    fieldName3: "exercises[id=123].setList[0].value"
  },
  classifications: {
    fieldName1: {
      excellent: { min: 90, max: 100 },
      good: { min: 70, max: 89 },
      fair: { min: 50, max: 69 },
      poor: { min: 0, max: 49 }
    }
  }
}
```

### Step 2: Add Sample Data

In `data.js`, add sample data with the new `assessment_id`:

```javascript
{
  "session_id": "session_003",
  "assessment_id": "your_new_assessment_id",
  // ... your assessment data structure
}
```

### Step 3: Test

The system will automatically handle the new assessment type. Test with:

```bash
curl -X POST http://localhost:9000/api/reports/generate-report \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"session_id": "session_003"}'
```

## Field Mapping Examples

### Simple Fields
```javascript
"overallScore": "accuracy"  // Direct field access
```

### Nested Objects
```javascript
"heartRate": "vitalsMap.vitals.heart_rate"  // Nested object access
```

### Array with ID Filter
```javascript
"exerciseTime": "exercises[id=235].setList[0].time"  // Find exercise with id=235, get first setList item's time
```

### Complex Nested Paths
```javascript
"stressLevel": "vitalsMap.metadata.heart_scores.stress_index"
```

## Classification Ranges

Define value ranges for automatic classification:

```javascript
classifications: {
  bmi: {
    underweight: { min: 0, max: 18.5 },
    normal: { min: 18.5, max: 24.9 },
    overweight: { min: 25, max: 29.9 },
    obese: { min: 30, max: 100 }
  },
  heartRate: {
    excellent: { min: 60, max: 80 },
    good: { min: 50, max: 100 },
    concerning: { min: 100, max: 120 },
    critical: { min: 120, max: 200 }
  }
}
```

## Section Types

The system supports these predefined sections:

- **Key Body Vitals**: Heart rate, blood pressure, oxygen saturation, respiratory rate
- **Heart Health**: Wellness score and heart-related metrics
- **Stress Level**: Stress index and related measurements
- **Fitness Levels**: Cardiovascular endurance and fitness metrics
- **Posture**: Posture analysis from exercises with id 73 and 74
- **Body Composition**: BMI, body fat, lean mass, BMR
- **Cardiovascular Endurance**: Endurance test results

### Adding Custom Sections

To add a new section type, modify the `generateReportHTML` function in `pdf_reports.service.js`:

```javascript
case 'Your New Section':
  const customValue = getFieldValue(assessmentData, fieldMappings.customField);
  sectionContent = `
    <div class="vital-item">
      <span class="label">Custom Metric:</span>
      <span class="value">${customValue || 'N/A'}</span>
    </div>
  `;
  break;
```

## Example: Adding a Mental Health Assessment

### 1. Configuration
```javascript
"as_mental_01": {
  name: "Mental Health Assessment",
  sections: [
    "Stress Level",
    "Mood Analysis", 
    "Cognitive Performance"
  ],
  fieldMappings: {
    stressScore: "mentalHealth.stress.overall",
    moodRating: "mentalHealth.mood.current",
    cognitiveScore: "mentalHealth.cognitive.performance"
  },
  classifications: {
    stressScore: {
      low: { min: 0, max: 30 },
      moderate: { min: 31, max: 60 },
      high: { min: 61, max: 100 }
    },
    moodRating: {
      excellent: { min: 8, max: 10 },
      good: { min: 6, max: 7 },
      fair: { min: 4, max: 5 },
      poor: { min: 0, max: 3 }
    }
  }
}
```

### 2. Sample Data
```javascript
{
  "session_id": "session_mental_001",
  "assessment_id": "as_mental_01",
  "mentalHealth": {
    "stress": {
      "overall": 45
    },
    "mood": {
      "current": 7
    },
    "cognitive": {
      "performance": 85
    }
  }
}
```

## Benefits of This Approach

1. **No Code Changes**: Add new assessment types through configuration only
2. **Flexible Field Mapping**: Support any JSON structure with path-based mapping
3. **Dynamic Classifications**: Easily modify value ranges and categories
4. **Maintainable**: All assessment logic centralized in configuration files
5. **Scalable**: Support unlimited assessment types and complexity

## Testing New Configurations

Use the test script to verify your configuration:

```bash
node test-config.js
```

This will validate field mappings and classifications for all configured assessment types.

## Troubleshooting

### Field Not Found
- Check the JSON path in fieldMappings
- Verify the field exists in your sample data
- Use the test script to debug field access

### Classification Not Working
- Ensure numeric values for classification ranges
- Check min/max values don't overlap incorrectly
- Verify field value is numeric

### Section Not Displaying
- Check section name matches exactly in the sections array
- Verify the section is handled in generateReportHTML function
- Add custom section handling if needed