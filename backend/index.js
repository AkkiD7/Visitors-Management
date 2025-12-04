import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import connectDB from "./src/config/db.js";
import User from "./src/models/User.js";
import app from "./app.js";

const PORT = process.env.PORT || 6000;

async function createDefaultAdmin() {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
        const passwordHash = await bcrypt.hash("Admin@123", 10);

        await User.create({
            username: 'admin',
            password: passwordHash,
            role: 'admin',
        });
        console.log('Default admin created');
    }
}

const startServer = async () => {
    try {
        await connectDB();
        await createDefaultAdmin();
        console.log("MongoDB Connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server failed to start:", error.message);
    }
};

startServer();
