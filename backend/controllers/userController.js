import PortfolioUserModel from "../models/userModel.js";
import { StatusCodes } from "http-status-codes";
import { comparePassword, hashpasword } from "../utils/passwordUtils.js";
import { generateJWTToken } from "../utils/tokenUtils.js";
import { badRequestErr, NotFoundErr } from "../errors/customErors.js";
const TOKEN_EXPIRE_IN = 24 * 60 * 60 * 1000;

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
    const userExists = await PortfolioUserModel.findOne({ email: req.body.email });
    if (userExists) {
        throw new badRequestErr("User already exists");
    }

    const isFirstUser = (await PortfolioUserModel.countDocuments() === 0);
    req.body.role = isFirstUser ? "admin" : "user";


    const hashedPassword = await hashpasword(req.body.password);
    req.body.password = hashedPassword;


    req.body.isVerified = true

    const user = await PortfolioUserModel.create(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, message: "User registered successfully", user });
};

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
    const user = await PortfolioUserModel.findOne({ email: req.body.email });
    if (!user) {
        throw new NotFoundErr("User not found");
    }
    const isMatch = await comparePassword(req.body.password, user.password);
    if (!isMatch) {
        throw new badRequestErr("Invalid password or email");
    }
    const token = generateJWTToken({ userId: user._id.toString(), role: user.role });
    const oneDay = 1000 * 60 * 60 * 24;
    console.log({ token, userId: user._id.toString(), role: user.role });
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV == "production",
    });
    console.log({ cookies: res.cookie });
    res.status(StatusCodes.OK).json({ success: true, message: "User logged in successfully", user });
}

// @desc    Logout a user
// @route   POST /api/users/logout
// @access  Public
export const logout = (req, res) => {
    res.cookie("token", "logout", {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ success: true, message: "User logged out successfully" });
};
