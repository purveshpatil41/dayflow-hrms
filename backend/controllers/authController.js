import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const register = async (req, res) => {
  try {
    const { fullName, employeeId, email, password, role } = req.body;

    if (!fullName || !employeeId || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const userExists = await User.findOne({
      where: {
        [Op.or]: [{ email }, { employeeId }],
      },
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or employee ID',
      });
    }

    // Create user with verified status (no email verification needed)
    const user = await User.create({
      fullName,
      employeeId,
      email,
      password,
      role: role || 'Employee',
      isVerified: true, // Set to true immediately
      verificationToken: null,
      otp: null,
      otpExpiry: null,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! You can now login.',
      data: {
        employeeId: user.employeeId,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    const user = await User.findOne({
      where: {
        email: decoded.email,
        verificationToken: token,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified',
      });
    }

    await user.update({
      isVerified: true,
      verificationToken: null,
      otp: null,
      otpExpiry: null,
    });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now login.',
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification',
      error: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP',
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified',
      });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.',
      });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    await user.update({
      isVerified: true,
      verificationToken: null,
      otp: null,
      otpExpiry: null,
    });

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully! You can now login.',
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTP verification',
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for:', email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Email verification disabled - users can login directly
    
    const isPasswordMatch = await user.matchPassword(password);
    
    console.log('Password match result:', isPasswordMatch);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user.id);
    
    console.log('Login successful for:', email);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          employeeId: user.employeeId,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          phone: user.phone,
          address: user.address,
          profilePicture: user.profilePicture,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, address, profilePicture } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update fields if provided
    if (fullName !== undefined) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update',
      error: error.message,
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    console.log('Delete account request for user ID:', req.user.id);
    
    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.log('User not found for deletion:', req.user.id);
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    console.log('Deleting user:', user.email);

    // Delete the user account from database
    const deletedRows = await User.destroy({
      where: { id: req.user.id }
    });

    console.log('Deleted rows:', deletedRows);

    if (deletedRows > 0) {
      console.log('Account successfully deleted for:', user.email);
      res.status(200).json({
        success: true,
        message: 'Your account has been permanently deleted',
        deletedUser: {
          id: user.id,
          email: user.email,
          employeeId: user.employeeId
        }
      });
    } else {
      console.log('No rows deleted for user:', req.user.id);
      res.status(400).json({
        success: false,
        message: 'Account could not be deleted',
      });
    }
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during account deletion',
      error: error.message,
    });
  }
};
