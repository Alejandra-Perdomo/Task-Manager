const jwt = require('jsonwebtoken');
const User = require('../models/user');


const auth = async (req, res, next) =>{
    try{
        const token = await req.header('Authorization').replace('Bearer ','');
        const decoded = jwt.verify(token,'thisismynewcourse');
        const user = await User.findOne({_id:decoded._id,'tokens.token':token});
        console.log(user.user_name) 

        if(!user){
            throw new Error;
        }

        req.token = token;
        req.user = user;

        next();
    }catch(error){
        console.log('err')
        res.status(401).send({error:'Please authenticate'})
    }
}

module.exports = auth;