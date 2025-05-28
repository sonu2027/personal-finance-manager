import nodemailer from "nodemailer";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existedUser = await User.findOne({ email });

  let userExist = false;
  if (existedUser) {
    userExist = true;
    return res.status(201).json({
      userExist,
      message: "User alreday exist",
    });
  }

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  const createdUser = await User.findById(user._id);

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  let users = createdUser;

  return res.status(201).json({
    data: createdUser,
    userExist,
    message: "User registered Successfully",
  });
};

const loginUser = async (req, res) => {
  console.log("req.body in login: ", req.body);
  const { email, password } = req.body;

  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(401).json({ message: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      {
        id: foundUser._id,
        fullName: foundUser.fullName,
        email: foundUser.email,
        income: foundUser.income,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: foundUser._id,
        fullName: foundUser.fullName,
        role: foundUser.role,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateIncome = async (req, res) => {
  console.log("req.user: ", req.user);
  const { income } = req.body;
  try {
    const response = await User.updateOne({ _id: req.user.id }, { income });
    if (response) {
      res.status(200).json({ message: "Income updated successfully" });
    } else {
      res.status(500).json({ message: "Income updation failed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getIncome = async (req, res) => {
  try {
    const response = await User.findById({ _id: req.user.id });
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(500).json(response);
    }
  } catch (error) {
    res.status(400).json({ message: "Internal server error" });
  }
};

const sendEmailVerificationOTP = async (req, res) => {
  const { OTP, email } = req.body;
  console.log("req.body: ", req.body);

  // Create a transporter object using SMTP transport
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "sonu.mondal.2027@gmail.com",
      pass: "ghfs wdlk pkwd pjmg",
    },
  });

  // Setup email data
  let mailOptions = {
    from: "sonu.mondal.2027@gmail.com",
    to: email,
    subject: "Verify your email",
    text: `Welcome to the personal finance manager. Please, verify your email by entering the OTP. Your OTP is: ${OTP}`,
  };

  console.log("mailOptions: ", mailOptions);

  try {
    await transporter.sendMail(mailOptions);
    res.send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
};

const verifyEmail = async (req, res) => {
  const { email } = req.body;
  console.log("req.body: ", req.body);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePassword = async (req, res) => {
  const { email, password } = req.body;
  console.log("req.body: ", req.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await User.updateOne(
      { email },
      { password: hashedPassword }
    );

    console.log(response);
    

    if (response.modifiedCount > 0) {
      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res.status(400).json({ message: "Password update failed" });
    }
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  registerUser,
  sendEmailVerificationOTP,
  loginUser,
  updateIncome,
  getIncome,
  verifyEmail,
  updatePassword,
};
