// hash password
const bcrypt = require("bcryptjs");

const hashPassword = async(password)=>{
   const salt = await bcrypt.genSalt(10);
   const hash = await bcrypt.hash(password , salt)
   return hash
};

const isPasswordMatch = async(password ,hashed )=>{
  return bcrypt.compare(password,hashed)
}
module.exports = {hashPassword , isPasswordMatch}