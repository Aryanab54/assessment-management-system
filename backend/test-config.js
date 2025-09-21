// Test script to verify configuration system
const { getAssessmentBySessionId } = require('./data');
const { reportConfigurations, getFieldValue, classifyValue } = require('./config');

console.log('=== Testing Configuration System ===\n');

// Test with Health & Fitness Assessment
console.log('1. Testing Health & Fitness Assessment (session_001):');
const healthData = getAssessmentBySessionId('session_001');
const healthConfig = reportConfigurations[healthData.assessment_id];

console.log(`Assessment Type: ${healthConfig.name}`);
console.log(`Sections: ${healthConfig.sections.join(', ')}`);

// Test field mappings
const heartRate = getFieldValue(healthData, healthConfig.fieldMappings.heartRate);
const bmi = getFieldValue(healthData, healthConfig.fieldMappings.bmi);
const overallScore = getFieldValue(healthData, healthConfig.fieldMappings.overallHealthScore);

console.log(`Heart Rate: ${heartRate} (${classifyValue(heartRate, healthConfig.classifications.heartRate)})`);
console.log(`BMI: ${bmi} (${classifyValue(bmi, healthConfig.classifications.bmi)})`);
console.log(`Overall Score: ${overallScore}% (${classifyValue(overallScore, healthConfig.classifications.overallHealthScore)})`);

console.log('\n2. Testing Cardiac Assessment (session_002):');
const cardiacData = getAssessmentBySessionId('session_002');
const cardiacConfig = reportConfigurations[cardiacData.assessment_id];

console.log(`Assessment Type: ${cardiacConfig.name}`);
console.log(`Sections: ${cardiacConfig.sections.join(', ')}`);

// Test field mappings
const cardiacHeartRate = getFieldValue(cardiacData, cardiacConfig.fieldMappings.heartRate);
const cardiacScore = getFieldValue(cardiacData, cardiacConfig.fieldMappings.overallHealthScore);

console.log(`Heart Rate: ${cardiacHeartRate} (${classifyValue(cardiacHeartRate, cardiacConfig.classifications.heartRate)})`);
console.log(`Overall Score: ${cardiacScore}% (${classifyValue(cardiacScore, cardiacConfig.classifications.overallHealthScore)})`);

console.log('\n=== Configuration System Test Complete ===');