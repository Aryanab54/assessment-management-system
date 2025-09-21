const { createUploadHistory, getUploadHistory, getAllUploadHistory } = require('./upload_history.service');

const uploadFile = async (req, res) => {
  try {
    const { fileName, filePath } = req.body;
    const userId = req.user.userId;
    
    if (!fileName || !filePath) {
      return res.status(400).json({ success: false, message: 'fileName and filePath are required' });
    }
    
    const result = await createUploadHistory(fileName, filePath, userId);
    res.status(201).json({ success: true, message: 'File uploaded successfully', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserUploadHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await getUploadHistory(userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUploadHistoryAll = async (req, res) => {
  try {
    const result = await getAllUploadHistory();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadFile,
  getUserUploadHistory,
  getUploadHistoryAll
};