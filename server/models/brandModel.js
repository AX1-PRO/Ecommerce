import mongoose from "mongoose";
let pattern=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"fill in the field"],
        unique:[true,"requird"],
        minlength:[5,"short text"],
        maxlength:[30,"long text"]
    },
    slug:{
        type:String,
        lowercase:true
    },
    img:{
        type:String,
    }

},{timestamps:true})
pattern.set('toJSON',{virtuals:true})
pattern.virtual("imageUrl").get(function () {
    if (this.img) {
        return `${process.env.WEBURL}/brand/${this.img}`;
    }
    return null;
});
let brandModel=mongoose.model("brand",pattern)
export{brandModel}
