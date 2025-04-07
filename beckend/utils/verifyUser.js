import jwt from 'jsonwebtoken';
import { errorhandler } from './error.js';

export const verifyToken =(req,res,next)=>{
    const token = req.cookies.access_token;
    if(!token) return next(errorhandler(403, 'Token is not valid!'));

    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err) return next(errorhandler(403,'Token is not Valid!'))
       
            req.user = user;
             next();
    })
}