import express from 'express';

import authRoutes from "./routes/auth.route.js"
import movieRoutes from "./routes/movie.route.js"
import tvShowRoutes from "./routes/tvShow.route.js"
import searchRoutes from "./routes/search.route.js"

import mongoose from 'mongoose';
import { protectRoute } from './middleware/protectRoute.js';
import cookieParser from 'cookie-parser';
import path from "path";
process.loadEnvFile()

const app = express();

const Puerto = process.env.PORT;
const MongoURL = process.env.MONGO_URL
const __dirname = path.resolve();
app.use(express.json()); // Req.Body
app.use(cookieParser());

export const connectDB = async () => {
    try {

        const conn = await mongoose.connect(MongoURL);
        console.log("MongoDB PORT connected: " + conn.connection.port);


    } catch (error) {
        console.log();
        process.exit(1);


    }
}





app.use("/api/auth", authRoutes);
app.use("/api/movie",  movieRoutes);
app.use("/api/tv", protectRoute, tvShowRoutes);
app.use("/api/search", protectRoute, searchRoutes);

app.listen(Puerto, () => {
    console.log(`Server en el puerto ${Puerto}`);
    connectDB();

})



