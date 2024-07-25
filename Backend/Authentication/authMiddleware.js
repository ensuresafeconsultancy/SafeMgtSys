const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // token will be like Bearer rfeff89rvefv89erfver98vjev , so used this authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // Forbidden

    req.user = decoded; // Attach decoded data to request object
    next();
  });
};

module.exports = authMiddleware;
