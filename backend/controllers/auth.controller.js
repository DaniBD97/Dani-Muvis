import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";


export async function signup(req, res) {
    try {
        const { email, password, username } = req.body;

        // Validación de campos obligatorios
        if (!email || !password || !username) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        // Validación de contraseña
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
        }

        // Validación de email existente
        const existingUserEmail = await User.findOne({ email });
        if (existingUserEmail) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        // Validación de username existente
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }

        // Hash de la contraseña
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Selección de imagen de perfil aleatoria
        const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        // Creación del nuevo usuario
        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            image,
        });

        await newUser.save();

        // Generación de token y configuración de cookies
        generateTokenAndSetCookie(newUser._id, res);

        // Respuesta exitosa
        const { password: _, ...userWithoutPassword } = newUser._doc; // Excluir contraseña
        res.status(201).json({ success: true, user: userWithoutPassword });
    } catch (error) {
        console.error("Error in signup controller:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


export async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Validación de campos obligatorios
        if (!email || !password ) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

       

        // Validación de username existente
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User Doesnt Exist" });
        }

        const correctPass = await bcryptjs.compare(password, existingUser.password);
        
        if(!correctPass){
            return res.status(400).json({ success: false, message: "wrong password" });
        }
        
        generateTokenAndSetCookie(existingUser._id, res);


        // Excluir contraseña y otros datos sensibles
        const { password: _, sensitiveField: __, ...userWithoutSensitiveFields } = existingUser._doc;
        res.status(200).json({ success: true, user: userWithoutSensitiveFields });
      


        
    } catch (error) {
        console.error("Error in signup controller:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie("jwt-pelis");
        res.status(200).json({ success: true, message: "Logged Out Success" });


    } catch (error) {

        console.log("Error in logout controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });



    }
}

export async function authCheck(req, res) {
	try {
		console.log("req.user:", req.user);
		res.status(200).json({ success: true, user: req.user });
	} catch (error) {
		console.log("Error in authCheck controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
}