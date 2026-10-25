import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import fileRoutes from "./routes/file.routes.js";
import mailRoutes from "./routes/mail.routes.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/mails", mailRoutes);

// app.use("/api/extractions", require("./routes/extraction.routes.js"));
// app.use("/api/users", require("./routes/user.routes.js"));
// app.use("/api/feedbacks", require("./routes/feedback.routes.js"));


connectDB();





app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Coldmailer server is running");
});