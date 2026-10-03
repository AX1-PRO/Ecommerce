import mongoose from "mongoose";
let pattern=new mongoose.Schema({
    name:{
    type:String,
    required:true,
    unique: true,
    minlength: [5, "short text"],
    maxlength: [30, "long text"]
},
slug:{
    type:String,
    lowercase:true
},
img:{
    type:String,
    }
},{timestamps:true})
//add url img
pattern.set('toJSON',{virtuals:true})
pattern.virtual("imageUrl").get(function () {
    if (this.img) {
        return `${process.env.WEBURL}/category/${this.img}`;
    }
    return null;
});
let categoryModel=mongoose.model("category",pattern)
export{categoryModel}
