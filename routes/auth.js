import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ success: false, message: "Missing fields" });

  try {
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }

    return res.json({
      success: true,
      message: "Logged in successfully",
      user: { _id: user._id, username: user.username, isAdmin: user.isAdmin },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
