const admin = require('firebase-admin');

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify the Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    if (!decodedToken) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check if user has admin role
    const customClaims = decodedToken.custom_claims || {};
    
    if (!customClaims.admin && !customClaims.role === 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Add user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: customClaims.role || 'user',
      isAdmin: true
    };

    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({ error: 'Token revoked' });
    }
    
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = adminAuthMiddleware; 