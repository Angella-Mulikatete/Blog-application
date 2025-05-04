const jwt = require('jsonwebtoken');

exports.protect = async(req, res, next) => {
    try{
        
        //get token from header
        const token = req.header('Authorization').replace('Bearer', '');

        //decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    }catch(error){
        res.status(401).json({
            error: 'Authentication failed'
        })
    }
}

exports.authorizationRoles = (...roles) => {
    return(req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                error: 'Unauthorized role'
            })
        }
        next();
    };
};
