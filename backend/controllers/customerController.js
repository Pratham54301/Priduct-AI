import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isProfileComplete = !!(user.phone && user.address && user.gender && user.dateOfBirth);
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      avatar: user.avatar,
      membership: user.membership,
      isProfileComplete,
      savedStocks: user.savedStocks || [],
      notifications: user.notifications || [],
      loginHistory: user.loginHistory || []
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, gender, dateOfBirth, avatar } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (gender) updateData.gender = gender;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (avatar) updateData.avatar = avatar;
    
    // Check if profile is now complete
    if (phone && address && gender && dateOfBirth) {
      updateData.isProfileComplete = true;
    }
    
    const user = await User.findByIdAndUpdate(
      req.user,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isProfileComplete = !!(user.phone && user.address && user.gender && user.dateOfBirth);
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        avatar: user.avatar,
        membership: user.membership,
        isProfileComplete
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }
    
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPredictions = async (req, res) => {
  try {
    // This would typically fetch from a predictions collection
    // For now, returning mock data
    const mockPredictions = [
      {
        id: '1',
        ticker: 'AAPL',
        date: new Date('2024-01-15'),
        prediction: 'Bullish',
        accuracy: 85,
        result: 'Target reached',
        price: 150.25
      },
      {
        id: '2',
        ticker: 'TSLA',
        date: new Date('2024-01-14'),
        prediction: 'Bearish',
        accuracy: 72,
        result: 'Target missed',
        price: 245.80
      }
    ];
    
    res.json(mockPredictions);
  } catch (err) {
    console.error('Get predictions error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOffers = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('membership');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Personalized offers based on membership
    const offers = [
      {
        id: '1',
        title: 'Upgrade to Premium',
        description: 'Get unlimited predictions and advanced analytics',
        price: 29.99,
        originalPrice: 49.99,
        discount: '40%',
        validUntil: new Date('2024-02-15'),
        isRecommended: user.membership === 'Free'
      },
      {
        id: '2',
        title: 'Lifetime Access',
        description: 'One-time payment for lifetime access to all features',
        price: 299.99,
        originalPrice: 599.99,
        discount: '50%',
        validUntil: new Date('2024-03-01'),
        isRecommended: user.membership === 'Premium'
      }
    ];
    
    res.json(offers);
  } catch (err) {
    console.error('Get offers error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('notifications');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.notifications || []);
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const notification = user.notifications.id(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    notification.isRead = true;
    await user.save();
    
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Mark notification as read error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.notifications = user.notifications.filter(
      notification => notification._id.toString() !== notificationId
    );
    await user.save();
    
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    console.error('Delete notification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addSavedStock = async (req, res) => {
  try {
    const { symbol, name } = req.body;
    
    if (!symbol || !name) {
      return res.status(400).json({ message: 'Symbol and name are required' });
    }
    
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if stock already saved
    const existingStock = user.savedStocks.find(stock => stock.symbol === symbol);
    if (existingStock) {
      return res.status(400).json({ message: 'Stock already saved' });
    }
    
    user.savedStocks.push({ symbol, name });
    await user.save();
    
    res.json({ message: 'Stock saved successfully', savedStocks: user.savedStocks });
  } catch (err) {
    console.error('Add saved stock error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeSavedStock = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.savedStocks = user.savedStocks.filter(stock => stock.symbol !== symbol);
    await user.save();
    
    res.json({ message: 'Stock removed successfully', savedStocks: user.savedStocks });
  } catch (err) {
    console.error('Remove saved stock error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
