import jwt from "jsonwebtoken";

/* =========================================
   STRICT USER AUTH (Protected Routes)
========================================= */
export const userAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Not authorized",
        });
    }

    try {
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.USER_JWT_SECRET
        );

        req.user = decoded; // { userId }
        next();
    } catch (err) {
        return res.status(401).json({
            error: "Invalid or expired token",
        });
    }
};

/* =========================================
   OPTIONAL USER AUTH (Guest Allowed)
========================================= */
export const userAuthOptional = (req, _res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        req.user = null;
        return next();
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(
            token,
            process.env.USER_JWT_SECRET
        );
        req.user = decoded;
    } catch {
        req.user = null;
    }

    next();
};