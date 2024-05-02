const jwt = require('jsonwebtoken');

const verfiyToken = (token)=>{
    return jwt.verify(token , 'anykey' , (err , decoded)=>{
        if(err){
            return false
        } else{
            return decoded;
        }
    })
}

module.exports = verfiyToken;

