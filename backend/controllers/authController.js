import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Validation helper functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

export const register = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, address, gender, role } = req.body;

    // Validate all fields are provided
    if (!fullName || !email || !password || !phoneNumber || !address || !gender) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all fields'
      });
    }

    // Validate gender
    if (gender !== 'male' && gender !== 'female') {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid gender'
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate phone number (10 digits)
    if (!validatePhone(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be exactly 10 digits'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if email already exists
    const existingUserByEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Check if phone number already exists
    const existingUserByPhone = await User.findOne({ phoneNumber });
    if (existingUserByPhone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine user role (default to 'user', only allow 'admin' if explicitly set and validated)
    const userRole = role === 'admin' ? 'admin' : 'user';

    // Create new user
    const user = new User({
      fullName: fullName.trim(),
      name: fullName.trim(), // Keep name for backward compatibility
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phoneNumber: phoneNumber.trim(),
      phone: phoneNumber.trim(), // Keep phone for backward compatibility
      address: address.trim(),
      gender: gender.toLowerCase(),
      role: userRole,
      isProfileComplete: true
    });

    // Save user to database
    await user.save();

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration error:', error);

    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      if (field === 'email') {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      } else if (field === 'phoneNumber' || field === 'phone') {
        return res.status(400).json({
          success: false,
          message: 'Phone number already registered'
        });
      }
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0] || 'Validation error'
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      message: 'Server error, please try again later'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    // If user not found, return generic error (for security)
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    // If password invalid, return generic error (for security)
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '90d' }
    );

    // Prepare user data (without password)
    const userData = {
      id: user._id,
      fullName: user.fullName || user.name,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber || user.phone,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar,
      role: user.role || 'user',
      isProfileComplete: user.isProfileComplete || false
    };

    // Determine redirect path based on role
    const redirectTo = user.role === 'admin' ? '/admin/dashboard' : '/dashboard';

    // Set HTTP-only cookie with JWT token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 90 * 24 * 60 * 60 * 1000 // 90 days
    });

    // Return success response with user data and redirect path
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userData,
        redirectTo
      }
    });

  } catch (error) {
    console.error('Login error:', error);

    // Generic server error (don't expose internal details)
    return res.status(500).json({
      success: false,
      message: 'Server error, please try again later'
    });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isProfileComplete = !!(user.phoneNumber || user.phone) && !!user.address;

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        fullName: user.fullName || user.name,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || user.phone,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
        role: user.role || 'user',
        isProfileComplete
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error, please try again later'
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isProfileComplete = !!(user.phoneNumber || user.phone) && !!user.address;

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        fullName: user.fullName || user.name,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || user.phone,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
        role: user.role || 'user',
        isProfileComplete
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error, please try again later'
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, fullName, phone, phoneNumber, address, avatar } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (fullName) {
      updateData.fullName = fullName;
      updateData.name = fullName; // Keep name in sync
    }
    if (phone) {
      updateData.phone = phone;
      updateData.phoneNumber = phone;
    }
    if (phoneNumber) {
      updateData.phoneNumber = phoneNumber;
      updateData.phone = phoneNumber;
    }
    if (address) updateData.address = address;
    if (avatar) updateData.avatar = avatar;

    // Check if profile is now complete
    if ((phone || phoneNumber) && address) {
      updateData.isProfileComplete = true;
    }

    const user = await User.findByIdAndUpdate(
      req.user,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isProfileComplete = !!(user.phoneNumber || user.phone) && !!user.address;

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        fullName: user.fullName || user.name,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || user.phone,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
        role: user.role || 'user',
        isProfileComplete
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error, please try again later'
    });
  }
};
