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

    const verificationToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      fullName,
      employeeId,
      email,
      password,
      role: role || 'Employee',
      verificationToken,
      otp,
      otpExpiry,
      isVerified: false,
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    const emailMessage = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Dayflow</h1>
            <p>Every workday, perfectly aligned.</p>
          </div>
          <div class="content">
            <h2>Verify Your Account</h2>
            <p>Hello <strong>${fullName}</strong>,</p>
            <p>Thank you for registering with Dayflow HRMS. To complete your registration, please verify your email address.</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p style="text-align: center; margin: 20px 0;">OR</p>
            
            <p>Use this OTP code to verify your account:</p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
              <p style="margin-top: 10px; color: #666;">This OTP is valid for 10 minutes</p>
            </div>
            
            <p><strong>Account Details:</strong></p>
            <ul>
              <li>Employee ID: ${employeeId}</li>
              <li>Email: ${email}</li>
              <li>Role: ${role || 'Employee'}</li>
            </ul>
            
            <p style="color: #666; font-size: 14px;">If you didn't create this account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Dayflow HRMS. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify your Dayflow account',
        message: emailMessage,
      });
    } catch (emailError) {
      console.log('Email sending failed, but user created');
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      data: {
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
        otp: otp,
        verificationToken: verificationToken,
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

    // Email verification disabled for development
    // if (!user.isVerified) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Please verify your email before logging in',
    //   });
    // }

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
