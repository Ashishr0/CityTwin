const jwt = require("jsonwebtoken");
const User = require("../models/User");


/* =========================================
   CHECK LOGIN
========================================= */

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id)
            .select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};


/* =========================================
   ROLE AUTHORIZATION
========================================= */

const authorizeRoles = (...allowedRoles) => {

    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message:
                    "You do not have permission to perform this action"
            });
        }

        next();
    };
};


/* =========================================
   ADMIN ONLY
========================================= */

const adminOnly = (req, res, next) => {

    if (!req.user) {
        return res.status(401).json({
            message: "Not authorized"
        });
    }

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            message: "Admin access required"
        });
    }

    next();
};


module.exports = {
    protect,
    authorizeRoles,
    adminOnly
};