const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BEARER_PREFIX = 'Bearer ';

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
      return res.status(401).json({ message: 'Not authorized.' });
    }
    const token = authHeader.slice(BEARER_PREFIX.length);
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        //The select() method is used to exclude the password field from the document, 
        //which is not necessary for further processing and should not be leaked to clients.
        req.user = await User.findById(decoded.id).select('-password');
        next();
    }catch(err){
        res.status(401);
        throw new Error("Not authorized, token failed");
    }

};

module.exports = protect;