import jwt from "jsonwebtoken"
let token_generator=(target)=>{
  return  jwt.sign({userid:target},process.env.JWT_KEY,{expiresIn:"10d"})
}
export default token_generator