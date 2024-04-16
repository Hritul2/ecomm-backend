import dotenv from "dotenv";
import connectDB from "./config/db.config";
import app from "./app";

dotenv.config({
    path: "./.env",
});

const PORT: number = parseInt(process.env.PORT as string, 10) || 8000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        });
    })
    .catch((error: Error) => {
        console.error("Error connecting to database: ", error.message);
    });
