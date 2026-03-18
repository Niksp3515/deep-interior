import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);
      
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({
        _id: user._id,
        username: user.username,
      });
    } else {
      res.status(401);
      throw new Error('Invalid username or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new admin user (Run once to create admin)
// @route   POST /api/auth/register
// @access  Private (or Public temporarily to set up)
export const registerUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      password: hashedPassword,
    });

    if (user) {
      const token = generateToken(user._id);

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        _id: user._id,
        username: user.username,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: true,
    sameSite: 'none',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile (Verify token)
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};
