import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Access token is missing",
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({
            message: error.message || "Invalid or expired token",
            success: false
        });
    } 
};

export const verifyAdmin = (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Access token is missing",
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admin privileges required",
                success: false
            });
        }

        req.userId = decoded.id;
        req.role = decoded.role;
        next();
    } catch (error) {
        return res.status(401).json({
            message: error.message || "Invalid or expired token",
            success: false
        });
    }
};
