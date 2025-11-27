const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET =
  process.env.JWT_SECRET ||
  (() => {
    console.warn(
      'Warning: JWT_SECRET is not set. Falling back to an insecure default value for development.'
    );
    return 'development-secret';
  })();

async function register(req, res) {
  try {
    const { email } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already registered' });
    const user = new User(req.body);
    await user.save();
    
    // Generate token for automatic login after registration
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
    res.status(201).json({ message: 'Registered', token, id: user._id });
  } catch (err) {
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message).join(', ');
      return res.status(400).json({ message: messages });
    }
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    console.error('Registration error:', err);
    res.status(500).json({ message: err.message || 'Registration failed. Please try again.' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
    const requireApproval = process.env.REQUIRE_ACCOUNT_APPROVAL === 'true';
    const approvalRoles = (process.env.APPROVAL_REQUIRED_ROLES || 'doctor,patient')
      .split(',')
      .map(role => role.trim())
      .filter(Boolean);

    if (requireApproval && approvalRoles.includes(user.role) && !user.approved) {
      return res.status(403).json({ message: 'Account not approved' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { register, login };
