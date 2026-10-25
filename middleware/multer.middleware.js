import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

export default upload;