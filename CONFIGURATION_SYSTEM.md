# Assessment Management System - Configuration System

## Overview
This system is designed with maximum flexibility to handle different assessment types without code modifications. All configurations are data-driven and can be modified through configuration files.

## Configuration Structure

### 1. Assessment Configuration Location
- **Primary Config**: `backend/data.js` (assessmentConfig object)
- **Alternative Config**: `backend/config/report-config.json` (for external configuration)

### 2. Configuration Schema

```javascript
{
  "assessment_id": {
    "name": "Assessment Display Name",
    "sections": ["Section1", "Section2", ...],
    "fieldMappings": {
      "Display Name": "data.path.to.field"
    },
    "classifications": {
      "Field Name": {
        "Category1": [min, max],
        "Category2": [min, max]
      }
    }
  }
}
```

## Adding New Assessment Types

### Step 1: Add Assessment Data
Add new assessment data to `backend/data.js` in the `assessmentData` array:

```javascript
{
  "session_id": "session_003",
  "assessment_id": "as_new_01",
  "accuracy": 85,
  // ... other assessment data
}
```

### Step 2: Add Configuration
Add configuration for the new assessment type:

```javascript
"as_new_01": {
  "name": "New Assessment Type",
  "sections": [
    "Key Metrics",
    "Performance Analysis",
    "Recommendations"
  ],
  "fieldMappings": {
    "Overall Score": "accuracy",
    "Heart Rate": "vitals.heart_rate",
    "Custom Metric": "customData.metric"
  },
  "classifications": {
    "Overall Score": {
      "Poor": [0, 40],
      "Fair": [40, 70],
      "Good": [70, 85],
      "Excellent": [85, 100]
    }
  }
}
```

## Field Mapping System

### Supported Path Formats
- **Simple field**: `"fieldName"`
- **Nested object**: `"object.field"`
- **Deep nesting**: `"level1.level2.level3"`
- **Array access**: `"exercises[0].name"`
- **Complex path**: `"vitalsMap.metadata.heart_scores.stress_index"`

### Examples
```javascript
"fieldMappings": {
  "Heart Rate": "vitalsMap.vitals.heart_rate",
  "BMI": "bodyCompositionData.BMI",
  "Exercise Time": "exercises[2].setList[0].time",
  "Analysis Score": "exercises[0].analysisScore"
}
```

## Section Configuration

### Available Sections
- **Key Body Vitals**: Basic health metrics
- **Heart Health**: Cardiovascular data
- **Stress Level**: Stress-related metrics
- **Fitness Levels**: Physical fitness data
- **Posture**: Posture analysis results
- **Body Composition**: Body composition metrics
- **Cardiovascular Endurance**: Endurance test results

### Adding Custom Sections
1. Add section name to the `sections` array
2. Update `generateReportHTML` function in `pdf_reports.service.js`
3. Add case for new section in the switch statement

## Classification System

### Range-Based Classification
```javascript
"classifications": {
  "BMI": {
    "Underweight": [0, 18.5],
    "Normal": [18.5, 25],
    "Overweight": [25, 30],
    "Obese": [30, 50]
  }
}
```

### Usage
The system automatically classifies values based on defined ranges and displays them in reports.

## Configuration Examples

### Health & Fitness Assessment (as_hr_02)
```javascript
"as_hr_02": {
  "name": "Health & Fitness Assessment",
  "sections": [
    "Key Body Vitals",
    "Heart Health", 
    "Stress Level",
    "Fitness Levels",
    "Posture",
    "Body Composition"
  ],
  "fieldMappings": {
    "Overall Health Score": "accuracy",
    "Heart Rate": "vitalsMap.vitals.heart_rate",
    "Blood Pressure Systolic": "vitalsMap.vitals.bp_sys",
    "Blood Pressure Diastolic": "vitalsMap.vitals.bp_dia",
    "BMI": "bodyCompositionData.BMI"
  }
}
```

### Cardiac Assessment (as_card_01)
```javascript
"as_card_01": {
  "name": "Cardiac Assessment",
  "sections": [
    "Key Body Vitals",
    "Cardiovascular Endurance",
    "Body Composition"
  ],
  "fieldMappings": {
    "Heart Rate": "vitalsMap.vitals.heart_rate",
    "Cardiovascular Endurance": "exercises[2].setList[0].time"
  }
}
```

## Modifying Existing Configurations

### Change Data Sources
Update field mappings to point to different data paths:
```javascript
// Before
"Heart Rate": "vitalsMap.vitals.heart_rate"

// After (if data structure changes)
"Heart Rate": "newVitals.heartRate"
```

### Update Classification Ranges
Modify ranges without code changes:
```javascript
"BMI": {
  "Underweight": [0, 18.5],
  "Normal": [18.5, 24.9],      // Changed from 25
  "Overweight": [24.9, 29.9],  // Changed ranges
  "Obese": [29.9, 50]          // Changed from 30
}
```

### Add/Remove Sections
Simply modify the sections array:
```javascript
"sections": [
  "Key Body Vitals",
  "Heart Health",
  "New Custom Section"  // Added new section
  // Removed "Stress Level"
]
```

## Best Practices

1. **Consistent Naming**: Use descriptive names for assessments and fields
2. **Logical Sections**: Group related metrics in appropriate sections
3. **Meaningful Classifications**: Define ranges that make clinical/practical sense
4. **Data Validation**: Ensure field paths exist in your data structure
5. **Documentation**: Document any custom sections or special configurations

## Testing New Configurations

1. Add test data with new assessment_id
2. Add configuration for the assessment type
3. Test report generation via API endpoint
4. Verify PDF output contains expected sections and data
5. Check field mappings and classifications work correctly

## Troubleshooting

### Common Issues
- **Field not found**: Check if the field path exists in your data
- **Classification not working**: Verify ranges don't overlap and cover expected values
- **Section not displaying**: Ensure section name matches exactly in switch statement
- **PDF generation fails**: Check HTML template syntax and field mappings

### Debug Tips
- Use `getValueByPath` function to test field paths
- Log assessment data structure to verify paths
- Test with sample data before production use