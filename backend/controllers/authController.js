const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'hirehub_super_secret_jwt_key_2026_spec', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user (Applicant or Recruiter)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, headline, companyName, companyWebsite } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'applicant',
      headline: headline || '',
      companyName: companyName || '',
      companyWebsite: companyWebsite || ''
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        headline: user.headline,
        companyName: user.companyName,
        companyWebsite: user.companyWebsite,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user email (explicitly selecting password)
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        headline: user.headline,
        bio: user.bio,
        location: user.location,
        skills: user.skills,
        experience: user.experience,
        education: user.education,
        resumeUrl: user.resumeUrl,
        companyName: user.companyName,
        companyWebsite: user.companyWebsite,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.headline = req.body.headline !== undefined ? req.body.headline : user.headline;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.location = req.body.location !== undefined ? req.body.location : user.location;
      
      // Applicant updates
      if (req.body.skills !== undefined) {
        user.skills = Array.isArray(req.body.skills)
          ? req.body.skills
          : req.body.skills.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (req.body.experience !== undefined) user.experience = req.body.experience;
      if (req.body.education !== undefined) user.education = req.body.education;
      if (req.body.resumeUrl !== undefined) user.resumeUrl = req.body.resumeUrl;

      // Recruiter updates
      if (req.body.companyName !== undefined) user.companyName = req.body.companyName;
      if (req.body.companyWebsite !== undefined) user.companyWebsite = req.body.companyWebsite;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        headline: updatedUser.headline,
        bio: updatedUser.bio,
        location: updatedUser.location,
        skills: updatedUser.skills,
        experience: updatedUser.experience,
        education: updatedUser.education,
        resumeUrl: updatedUser.resumeUrl,
        companyName: updatedUser.companyName,
        companyWebsite: updatedUser.companyWebsite,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile
};
