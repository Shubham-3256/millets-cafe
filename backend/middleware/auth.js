import jwt from "jsonwebtoken";

export const auth = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ error: "No token provided" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // role-based access
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };
};
