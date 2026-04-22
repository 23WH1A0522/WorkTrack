import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateId } from "../utils/generateId.js";

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

const serializeAuthUser = (user) => ({
  _id: user._id,
  id: user.Id,
  name: user.name,
  email: user.email,
  token: generateToken(user._id),
});

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      Id: generateId(),
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json(serializeAuthUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json(serializeAuthUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    id: req.user.Id,
    name: req.user.name,
    email: req.user.email,
  });
};

export const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find().select("Id name email createdAt updatedAt").sort({ name: 1 });
    res.status(200).json(
      users.map((user) => ({
        _id: user._id,
        id: user.Id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
