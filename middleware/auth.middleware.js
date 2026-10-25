import jwt from "jsonwebtoken";
import User from "../model/auth.model.js";

export const authMiddleware = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({
            success: false,
            message: "Authorization token is required"
        });
    }

    const [scheme, token, ...extra] = authorization.trim().split(/\s+/);
    if (scheme?.toLowerCase() !== "bearer" || !token || extra.length > 0) {
        return res.status(401).json({
            success: false,
            message: "Invalid authorization header"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if(!user) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized access" 
            });
        }
        req.user = user;
        next();
    } 
    catch (error) {
        console.log("auth error:", error.message);
        return res.status(401).json({ 
            success: false,
            message: "Invalid token" 
        });
    }
}