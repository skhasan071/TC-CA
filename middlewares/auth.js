import jwt from "jsonwebtoken";

const ensureAuthenticated = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ message: "Token is required" });
  }

  const token = authHeader.split(" ")[1]; // Remove "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.authenticatedUser = decoded; // Set to use in controller
    next();
  } catch (err) {

    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`);
      const data = await response.json();

      if (data.error) {
        throw new Error("Invalid Access Token");
      }

      req.authenticatedUser = data;
      next();

    } catch (error) {

      console.error("Error verifying access token:", error);
      return res.status(403).json({ message: "Token is not valid or it's expired" });

    }
  }
};

export default ensureAuthenticated;