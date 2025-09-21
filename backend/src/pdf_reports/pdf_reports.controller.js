const { generateReport } = require('./pdf_reports.service');

const generateReportController = async (req, res) => {
  try {
    const { session_id } = req.body;
    const userId = req.user.userId;
    
    if (!session_id) {
      return res.status(400).json({ success: false, message: 'session_id is required' });
    }
    
    const result = await generateReport(session_id, userId);
    res.status(200).json({ success: true, message: 'Report generated successfully', data: result });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { generateReportController };