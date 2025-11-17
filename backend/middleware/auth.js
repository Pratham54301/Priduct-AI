import jwt from 'jsonwebtoken';

export default function (req, res, next) {
  // Check for token in Authorization header
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];
  
  // If no token in header, check cookies
  if (!token) {
    token = req.cookies?.token;
  }
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No token, authorization denied' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false,
      message: 'Token is not valid' 
    });
  }
} 