import mongoose from "mongoose";
let pattern=new mongoose.Schema ({
name:{
    type:String,
    trim:true,
    required:[true,"name requird"]
},
slug:{
    type:String,
    lowercase:true
},
email:{
    type:String,
    required:[true,"email is requird"],
    lowercase:true,
    unique:true
},
active:{
type:Boolean,
default:true
},
phone:String,
img_cover:String,
password:{
    type:String,
    minlength:[8,"short password"],
    required:true
},
address:
  {
    country: String,
    governorate:  String,
    district: String,
    village:String,
    street: String,
    apartment:String,
    phone:Number
  }
,
password_changed_date:Date,
///////////////////////
password_reset_code:String,
password_reset_expires:Date,
password_reset_verified:Boolean,
///////////////////////
role:{
    type:String,
    enum:["user","admin"],
    default:"user"
},
favorits:[
{
    type:mongoose.Schema.ObjectId,
    ref:'product'
}
],
},{timestamps:true})
pattern.set('toJSON',{virtuals:true})
pattern.virtual("imageUrl").get(function () {
    if (this.img_cover) {
        return `${process.env.WEBURL}/user/${this.img_cover}`;
    }
    return null;
});
let userModel=mongoose.model("user",pattern)
export {userModel}
