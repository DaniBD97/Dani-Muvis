import jwt from "jsonwebtoken"

process.loadEnvFile()

const jwtSecret = process.env.JWT_SECRET;
const Node = process.env.NODE_ENV;

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, jwtSecret, {expiresIn: "15d"});

    res.cookie("jwt-pelis", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in MS
        httpOnly:true, //prevent XSS attacks cross-site scripting attacks
        sameSite:"strict",
        secure: Node !== "dev"
    });

    return token;

}