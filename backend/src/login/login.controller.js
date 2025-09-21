const { registerUser, loginUser } = require('./login.service');

const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully', 
      user: { ...result.user, token: result.token }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json({ 
      success: true, 
      message: 'Login successful', 
      user: { ...result.user, token: result.token }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

module.exports = { register, login };