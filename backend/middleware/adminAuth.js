import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    /* ===============================
       NO TOKEN
    ================================ */
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Authentication required",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.ADMIN_JWT_SECRET
        );

        /* ===============================
           ROLE CHECK
        ================================ */
        if (decoded.role !== "admin") {
            return res.status(403).json({
                error: "Admin access only",
            });
        }

        req.admin = decoded;
        next();
    } catch (err) {
        /* ===============================
           TOKEN EXPIRED / INVALID
        ================================ */
        return res.status(401).json({
            error: "Token expired",
        });
    }
};

export default adminAuth;