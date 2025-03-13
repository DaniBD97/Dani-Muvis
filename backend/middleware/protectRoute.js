import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

process.loadEnvFile();
const jwtKey = process.env.JWT_SECRET;

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies["jwt-pelis"]; 

        if(!token)
        {
            return res.status(401).json({success: false, message: "Unauthorized - No Token Provided"}  )


          
        }

        const decoded = jwt.verify(token, jwtKey );

        if(!decoded)
        {
            return res.status(401).json({success: false, message: "Unauthorized - invalid Token"});


        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user)
        {
            return res.status(404).json({success: false, message: "User not found"});
        }

        req.user = user;

        next();




    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({success: false, message: "Internal Server Error"});

        
    }
};