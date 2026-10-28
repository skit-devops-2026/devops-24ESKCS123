const jwt = require('jsonwebtoken');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is missing');
  }

  return secret;
}

function createToken(userId) {
  return jwt.sign({ userId: userId.toString() }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function requireAuth(request, response, next) {
  const authorization = request.get('authorization');
  const token = authorization && authorization.startsWith('Bearer ') ? authorization.slice(7) : null;

  if (!token) {
    response.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    request.userId = payload.userId;
    next();
  } catch {
    response.status(401).json({ error: 'Invalid or expired token' });
  }
}

function toPublicUser(user) {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    goal: user.goal,
    updates: user.updates,
    createdAt: user.createdAt,
  };
}

module.exports = { createToken, requireAuth, toPublicUser };
