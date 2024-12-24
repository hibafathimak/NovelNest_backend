const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
    console.log("Inside jwtMiddleware");

    const token = req.headers["authorization"].split(" ")[1];

    if (token) {
        try {
            const jwtResponse = jwt.verify(token, process.env.JWTPASSWORD);
            req.userId = jwtResponse.userId;
            req.role = jwtResponse.role
            next();
        } catch (err) {
            res.status(401).json("Authorization failed... please login");
        }
    } else {
        res.status(401).json("Authorization failed... token is missing");
    }
};

module.exports = jwtMiddleware;