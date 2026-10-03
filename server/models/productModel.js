import mongoose from "mongoose";
let pattern=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:[3,"too short word"],
        maxlength:[100,"to long txt"]
    },
    slug:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    count:{
        type:Number,
        required:true,
    },
    sold_count:{
        type:Number,
        default:0
    },
   price:{
        type: Number,
        required: true,
       min: [0, "price must be positive"]
    },
    discount:{
        type:Number
    },
    colors:[String],
    img_cover:{
        type:String,
        required:true
    },
    imgs:[String],
    category:{
        type:mongoose.Schema.ObjectId,
        ref:"category",
        required:true
    },
    subcategory:{
        type:mongoose.Schema.ObjectId,
        ref:"subcategory",
        required:true
    },
    brand:{
        type:mongoose.Schema.ObjectId,
        ref:"brand"
    },
    rating:{
        type:Number,
        min:[1,"less"],
        max:[5,"higher"],
       default:1
    },
    count_rating:{
     type:Number,
     default:0
    },
    avg_rating:{
        type:Number,
        min:1,
        max:5
    }
},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})
pattern.virtual("img_cover_url").get(function () {
    if (this.img_cover) {
        return `${process.env.WEBURL}/product/${this.img_cover}`;
    }
    return null;
});
pattern.virtual("imgs_url").get(function () {
  if (this.imgs && this.imgs.length > 0) {
    return this.imgs.map((img) => `${process.env.WEBURL}/product/${img}`);
  }
  return [];
});
pattern.virtual("reviews",{
    ref:"review",
    foreignField:"product",
    localField:"_id"
})
let productModel=mongoose.model("product",pattern)
export{productModel}
