import "express-async-errors";

//  config env
import * as dotenv from "dotenv";
dotenv.config();

// create app
import express from "express";
const app = express();

// packages
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import cors from "cors";

//public
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import userRouter from "./routes/userRouter.js";
import errorHandlerMiddleware from "./middleware/errorhandlerMiddleware.js";
import contactQueryRouter from "./routes/contactQueryRouter.js";

// cloudinary setup
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(morgan("dev"));

app.use(express.static(path.resolve(__dirname, "./public")));
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        credentials: true,
    })
);

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/contact-query", contactQueryRouter);

app.use(errorHandlerMiddleware);

//not found
app.use("*", (req, res) => {
    res.status(404).json({ message: "Route not found " });
});

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./public", "index.html"));
});


const port = process.env.PORT || 5000;
try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(port, () => {
        console.log(`Server listening on ${port}...`);
    });
} catch (error) {
    console.log({ error });
    process.exit(1);
}