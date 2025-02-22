import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  console.log("Received Token: ", token);

  if (!token) return res.status(403).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Verified User: ", verified);

    req.user = verified;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    res.status(400).json({ message: "Invalid Token" });
  }
};

export { verifyToken };
