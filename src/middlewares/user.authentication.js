const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const authenticateMiddleware = (req, res, next) => {
    if (req.path === '/login' || req.path === '/sign-up') {
        const token = req.cookies.token;
        if (token) {
            return res.redirect('/');
        }
        return next();
    }

    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login');
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.redirect('/login');
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateMiddleware;