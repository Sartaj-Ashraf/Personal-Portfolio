import PortfolioUserModel from "../models/userModel.js";
import StatusCodes from "http-status-codes";
import { comparePassword, hashpasword } from "../utils/passwordUtils.js";
import { generateJWTToken } from "../utils/tokenUtils.js";

export const registerUser = async (req, res) => {
    if (!req.body.username || !req.body.email || !req.body.password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "username, email and password fields are required" });
    }

    const userExists = await PortfolioUserModel.findOne({ email: req.body.email });
    if (userExists) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "User already exists" });
    }

    const isFirstUser = (await PortfolioUserModel.countDocuments() === 0);
    req.body.role = isFirstUser ? "admin" : "user";


    const hashedPassword = await hashpasword(req.body.password);
    req.body.password = hashedPassword;


    req.body.isVerified = true

    const user = await PortfolioUserModel.create(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, message: "User registered successfully", user });
};


export const loginUser = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "email and password fields are required" });
    }

    const user = await PortfolioUserModel.findOne({ email: req.body.email });
    if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "User not found" });
    }
    console.log(user);
    console.log(req.body.password);
    const isMatch = await comparePassword(req.body.password, user.password);
    if (!isMatch) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid password" });
    }
    const token = generateJWTToken({id:user._id});
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 60 * 1000,
    });
    res.status(StatusCodes.OK).json({ success: true, message: "User logged in successfully", user });
    
    
}