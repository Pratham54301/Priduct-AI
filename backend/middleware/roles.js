import User from '../models/User.js';

export const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user).select('role');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (String(user.role || '').toLowerCase() !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Authorization check failed' });
  }
};
