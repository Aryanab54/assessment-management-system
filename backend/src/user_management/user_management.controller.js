const { getAllUsers, getUserById, updateUser, deleteUser } = require('./user_management.service');

const getUsers = async (req, res) => {
  try {
    const result = await getAllUsers();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getUserById(id);
    
    if (!result) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updateUser(id, req.body);
    res.status(200).json({ success: true, message: 'User updated successfully', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteUser(id);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUserController,
  deleteUserController
};