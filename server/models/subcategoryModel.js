import mongoose from "mongoose";
let pattern=new mongoose.Schema ({
name:{
    type:String,
    required:true,
    trim:true,
    unique:[true,"must be unique"],
    minlength:[4,"short name"],
    maxlength:[30,"long name"],
},
slug:{
    type:String,
    lowercase:true
}
,
category:{
    type:mongoose.Schema.ObjectId,
    ref:"category",
    required:[true,"must be belon any category"]
},
img:String
} ,
{timestamps:true})
pattern.set('toJSON',{virtuals:true})
pattern.virtual("imageUrl").get(function () {
    if (this.img) {
        return `${process.env.WEBURL}/subcategory/${this.img}`;
    }
    return null;
});
let subcategoryModel=mongoose.model("subcategory",pattern)
export{subcategoryModel}
