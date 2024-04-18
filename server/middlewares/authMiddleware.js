// authMiddleware.js
export const authMiddleware = (req, res, next) => {
  const currentUser = req.session.currentUser;

  if (!currentUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.userId = currentUser.userId;
  req.userRole = currentUser.role;
  next();
};