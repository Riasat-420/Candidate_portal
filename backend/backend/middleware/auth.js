/**
 * Authentication Middleware
 * Enhanced version that properly verifies JWT tokens and handles roles
 * Also includes debugging to help troubleshoot auth issues
 */
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { User } = require('../models');

// Debug log
console.log('Loading enhanced authentication middleware');

// Function to configure passport
const configurePassport = (passportInstance) => {
  console.log('Configuring passport JWT strategy');

  // Configure passport JWT strategy
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    passReqToCallback: true
  };

  // Define JWT strategy
  passportInstance.use(
    new JwtStrategy(options, async (req, jwt_payload, done) => {
      try {
        // console.log('Authenticating JWT token:', jwt_payload.id);

        // Standard user validation
        const user = await User.findOne({ where: { id: jwt_payload.id } });

        if (!user) {
          // console.log('JWT authentication failed: User not found');
          return done(null, false);
        }

        // console.log(`JWT authentication successful for ${user.email}`);
        return done(null, user);
      } catch (error) {
        console.error('JWT authentication error:', error);
        return done(error, false);
      }
    })
  );

  console.log('Passport JWT strategy configured successfully');
};

// Configure passport immediately
configurePassport(passport);

/**
 * Middleware to authenticate requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticate = (req, res, next) => {
  // console.log(`Auth middleware processing request to ${req.originalUrl}`);

  // Check if token can be extracted
  const authHeader = req.headers.authorization;

  // console.log('Auth header present:', !!authHeader);

  // Check if token can be extracted
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // const token = authHeader.substring(7);
    // console.log('Token extracted');
  } else {
    // console.log('No Bearer token in header');
  }

  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    console.log('Passport callback - err:', err, 'user:', user, 'info:', info);

    if (err) {
      console.error('Auth middleware error:', err);
      return res.status(500).json({
        success: false,
        message: 'Authentication error'
      });
    }

    if (!user) {
      console.log('Auth middleware: No user found');
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Add user to request object
    req.user = user;
    console.log(`Request authenticated as ${user.email} with role ${user.role}`);
    return next();
  })(req, res, next);
};

/**
 * Middleware to check if user has admin role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const isAdmin = (req, res, next) => {
  console.log(`isAdmin check for user with role: ${req.user?.role}`);

  if (req.user && req.user.role === 'admin') {
    return next();
  }

  console.log('Admin access denied');
  return res.status(403).json({
    success: false,
    message: 'Access denied'
  });
};

/**
 * Middleware to check if user is a candidate
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const isCandidate = (req, res, next) => {
  if (req.user && req.user.role === 'candidate') {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied'
  });
};

/**
 * Extracts token from various sources
 * For troubleshooting authentication issues
 */
const extractToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
  if (req.query && req.query.token) {
    return req.query.token;
  }
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
};

/**
 * Debug middleware to log token information
 * Helpful for troubleshooting auth issues
 */
const debugToken = (req, res, next) => {
  const token = extractToken(req);
  console.log(`[DEBUG] Request to ${req.originalUrl}`);
  console.log(`[DEBUG] Token present: ${!!token}`);
  if (token) {
    try {
      const decoded = require('jsonwebtoken').decode(token);
      console.log('[DEBUG] Token payload:', decoded);
    } catch (e) {
      console.log('[DEBUG] Invalid token format');
    }
  }
  next();
};

module.exports = {
  authenticate,
  isAdmin,
  isCandidate,
  debugToken
};
