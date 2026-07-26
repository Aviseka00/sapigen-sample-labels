import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sapigen-label-secret-change-in-prod';

export function signToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username, displayName: user.displayName || user.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
