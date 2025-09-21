const { getAssessmentBySessionId, getAssessmentConfig, getValueByPath } = require('../../data');
const { generatePDF } = require('../utils/puppeteer');
const { PrismaClient } = require('../../generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Helper function to classify values based on ranges
const classifyValue = (value, ranges) => {
  if (!value || !ranges) return 'Unknown';
  const numValue = parseFloat(value);
  for (const [classification, [min, max]] of Object.entries(ranges)) {
    if (numValue >= min && numValue < max) {
      return classification;
    }
  }
  return 'Unknown';
};

const generateReportHTML = (assessmentData, config) => {
  const { sections, fieldMappings, classifications } = config;
  
  let sectionsHTML = '';
  
  sections.forEach(section => {
    let sectionContent = '';
    
    switch (section) {
      case 'Key Body Vitals':
        const heartRate = getValueByPath(assessmentData, fieldMappings['Heart Rate'] || '');
        const bpSys = getValueByPath(assessmentData, fieldMappings['Blood Pressure Systolic'] || '');
        const bpDia = getValueByPath(assessmentData, fieldMappings['Blood Pressure Diastolic'] || '');
        const oxygenSat = getValueByPath(assessmentData, fieldMappings['Oxygen Saturation'] || '');
        const respRate = getValueByPath(assessmentData, fieldMappings['Respiratory Rate'] || '');
        
        sectionContent = `
          <div class="vital-item">Heart Rate: ${heartRate || 'N/A'} bpm (${classifyValue(heartRate, classifications['Heart Rate'])})</div>
          <div class="vital-item">Blood Pressure: ${bpSys || 'N/A'}/${bpDia || 'N/A'} mmHg</div>
          ${oxygenSat ? `<div class="vital-item">Oxygen Saturation: ${oxygenSat}%</div>` : ''}
          ${respRate ? `<div class="vital-item">Respiratory Rate: ${respRate} breaths/min</div>` : ''}
        `;
        break;
        
      case 'Heart Health':
        const wellnessScore = getValueByPath(assessmentData, fieldMappings['Wellness Score'] || '');
        sectionContent = `<div class="vital-item">Wellness Score: ${wellnessScore || 'N/A'}</div>`;
        break;
        
      case 'Stress Level':
        const stressIndex = getValueByPath(assessmentData, fieldMappings['Stress Index'] || '');
        sectionContent = `<div class="vital-item">Stress Index: ${stressIndex || 'N/A'}</div>`;
        break;
        
      case 'Fitness Levels':
        const cardioEndurance = getValueByPath(assessmentData, fieldMappings['Cardiovascular Endurance'] || '');
        sectionContent = `<div class="vital-item">Cardiovascular Endurance: ${cardioEndurance || 'N/A'} seconds</div>`;
        break;
        
      case 'Posture':
        const postureAnalysis = assessmentData.exercises?.filter(ex => ex.id === 73 || ex.id === 74) || [];
        sectionContent = postureAnalysis.map(exercise => `
          <div class="posture-item">
            <h4>${exercise.name}</h4>
            <p>Score: ${exercise.analysisScore || 'N/A'}%</p>
            ${exercise.analysisList ? `<ul>${exercise.analysisList.map(item => `<li>${item}</li>`).join('')}</ul>` : ''}
            ${exercise.tipsList ? `<div class="tips"><strong>Tips:</strong><ul>${exercise.tipsList.map(tip => `<li>${tip}</li>`).join('')}</ul></div>` : ''}
          </div>
        `).join('');
        break;
        
      case 'Body Composition':
        const bmi = getValueByPath(assessmentData, fieldMappings['BMI'] || '');
        const bodyFat = getValueByPath(assessmentData, fieldMappings['Body Fat'] || '');
        const leanMass = getValueByPath(assessmentData, fieldMappings['Lean Mass'] || '');
        const bmr = getValueByPath(assessmentData, fieldMappings['BMR'] || '');
        
        sectionContent = `
          <div class="vital-item">BMI: ${bmi || 'N/A'} ${bmi ? `(${classifyValue(bmi, classifications['BMI'])})` : ''}</div>
          ${bodyFat ? `<div class="vital-item">Body Fat: ${bodyFat}%</div>` : ''}
          ${leanMass ? `<div class="vital-item">Lean Mass: ${leanMass} kg</div>` : ''}
          ${bmr ? `<div class="vital-item">BMR: ${bmr} calories/day</div>` : ''}
        `;
        break;
        
      case 'Cardiovascular Endurance':
        const cardioTime = getValueByPath(assessmentData, fieldMappings['Cardiovascular Endurance'] || '');
        sectionContent = `<div class="vital-item">Endurance Test Time: ${cardioTime || 'N/A'} seconds</div>`;
        break;
    }
    
    sectionsHTML += `
      <div class="section">
        <h3>${section}</h3>
        <div class="section-content">${sectionContent}</div>
      </div>
    `;
  });
  
  const overallScore = getValueByPath(assessmentData, fieldMappings['Overall Health Score'] || '');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${config.name} Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .overall-score { background: #f5f5f5; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
        .score { font-size: 48px; font-weight: bold; color: #007bff; }
        .section { margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .section h3 { color: #333; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .vital-item { padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
        .posture-item { margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 6px; }
        .tips { margin-top: 10px; padding: 10px; background: #e7f3ff; border-radius: 4px; }
        ul { margin: 5px 0; padding-left: 20px; }
        li { margin: 5px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${config.name}</h1>
        <p>Session ID: ${assessmentData.session_id}</p>
        <p>Assessment ID: ${assessmentData.assessment_id}</p>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div class="overall-score">
        <h2>Overall Health Score</h2>
        <div class="score">${overallScore || 'N/A'}%</div>
      </div>
      
      ${sectionsHTML}
    </body>
    </html>
  `;
};

const generateReport = async (sessionId, userId) => {
  const assessmentData = getAssessmentBySessionId(sessionId);
  if (!assessmentData) {
    throw new Error('Assessment data not found for the provided session ID');
  }
  
  const config = getAssessmentConfig(assessmentData.assessment_id);
  if (!config) {
    throw new Error('Configuration not found for assessment type: ' + assessmentData.assessment_id);
  }
  
  const htmlContent = generateReportHTML(assessmentData, config);
  const fileName = `${assessmentData.assessment_id}_${sessionId}_${Date.now()}.pdf`;
  const filePath = await generatePDF(htmlContent, fileName);
  
  try {
    const reportRecord = await prisma.pdfReport.create({
      data: {
        reportName: `${config.name} - ${sessionId}`,
        filePath: filePath,
        createdById: userId
      }
    });
    
    return {
      success: true,
      reportId: reportRecord.id,
      fileName: fileName,
      filePath: filePath,
      assessmentType: config.name
    };
  } catch (dbError) {
    // If database fails, still return success since PDF was generated
    console.warn('Database save failed, but PDF generated successfully:', dbError.message);
    return {
      success: true,
      fileName: fileName,
      filePath: filePath,
      assessmentType: config.name,
      note: 'PDF generated successfully, database logging failed'
    };
  }
};

module.exports = { generateReport };