const admin = require("./firebase");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  console.log("Authorization header:", authHeader); // Log the incoming header

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    console.log("Decoded token:", decodedToken); // Log the decoded token
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
module.exports = verifyToken;
