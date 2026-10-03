import mongoos from 'mongoose'
import {productModel} from './productModel.js'
let pattern=new mongoos.Schema({
    title:String,
    rating:{
        type:Number,
        min:[1,"min rating 1"]
        ,max:[5,"max rating is 5"],
        required:true
    },
    user:{
        type:mongoos.Schema.ObjectId,
        ref:'user',
        required:true
    },
    product:{
        type:mongoos.Schema.ObjectId,
        ref:'product',
        required:true
    }
},{timestamps:true})
pattern.pre(/^find/,function(){
    this.populate({path:"user",select:"name"})
})
//calc avrg and count rating
pattern.statics.calcavgandrat=async function(productid){
    let result=await this.aggregate([
        {$match:{product:productid}},
        {$group:{_id:"$product",avg_rating:{$avg:"$rating"},count_rating:{$sum:1}}}
    ])
    console.log(result)
    if(result.length>0){
        await productModel.findByIdAndUpdate(productid,{
            count_rating:result[0].count_rating,
            avg_rating:result[0].avg_rating
        })
    }else{
        await productModel.findByIdAndUpdate(productid,{
            count_rating:0,
            avg_rating:0
        })

    }
}
//save calc when get and update
pattern.post('save',function(){
    this.constructor.calcavgandrat(this.product)
})
//save calc when deleta
pattern.post("findOneAndDelete", async function(doc){
    if(doc){
        await doc.constructor.calcavgandrat(doc.product);
    }
});
pattern.post("findOneAndUpdate", async function(doc){
    if(doc){
        await doc.constructor.calcavgandrat(doc.product);
    }
});

let reviewModel=mongoos.model('review',pattern)
export {reviewModel}
