import { productModel } from "../models/productModel.js";
import slugify from "slugify";
import AsyncHandler from "express-async-handler";
import {Handel_ERROR_GLOBAL_APP} from "../utils/Handel_ERROR_GLOBAL_APP.js"
import { v4 as uuid } from "uuid"
import sharp from "sharp"
import { Delete_img, Delete_Product_img,Create_img } from "../utils/uploads_config/handel_file_imges.js";
 //////////////////////////////////////////
// create a new product
// method  :  post
// route : /api/v1/products/
// role : admin

let create_product=AsyncHandler(async(req,res)=>{
    let slug=slugify(req.body.name)
     req.body.slug=slug
     ////////////handel create img_cover product//////////
     if(req.files.img_cover){
         let name=`PRO_cover-${uuid()}-BX!.jpeg`
         await sharp(req.files.img_cover[0].buffer).resize(500,600).toFormat('jpeg').jpeg({quality:90}) .toFile(`uploads_files/product/${name}`)
         req.body.img_cover=name
        }
        ////////////handel create product imgs//////////
   if(req.files.imgs){
    req.body.imgs=[]
        await Promise.all(
             req.files.imgs.map(async(img,index)=>{
            let name=`PRO-${uuid()}-${index+1}-BX!.jpeg`
            await sharp(img.buffer).resize(500,600).toFormat('jpeg').jpeg({quality:90}) .toFile(`uploads_files/product/${name}`)
            req.body.imgs.push(name)
         })
        )
    }
    console.log(req.body)
     /////////done ///////////////
    let data= await productModel.create(req.body)
    res.status(200).json({message:"product created"})
})
//get allproducts
//method  :  get
// route : /api/v1/products/
let get_products=AsyncHandler(async(req,res)=>{
    //filtration
    let queriees={...req.query}
    let excludefailds=['page','sort','limit','fields','keyword']
   excludefailds.forEach(el => delete queriees[el]);
    let querieeststring=JSON.stringify(queriees)
    querieeststring=querieeststring.replace(/\b(gte|gt|lte|lt)\b/g,(Match)=>`$${Match}`)
     const queryObj = JSON.parse(querieeststring);
     let filter = { ...queryObj };
//search
 if (req.query.keyword) {
  filter.$or = [
    {
      name: {
        $regex: req.query.keyword,
        $options: "i",
      },
    },
    {
      description: {
        $regex: req.query.keyword,
        $options: "i",
      },
    },
  ];
    }
     //pagination
     let page=Number(req.query.page) || 1
     let limit=Number(req.query.limit) || 10
     let skip=(page-1)*limit
     //quieres
    let query = productModel.find(filter).skip(skip).limit(limit)
    .populate({path:"category",select:"name -_id"})
    .populate({path:"subcategory",select:"name -_id"})
    .populate({path:"brand",select:"name -_id"})
    //sorting
     if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(' ');
        query = query.sort(sortBy);
    }
    //selection
    if(req.query.fields){
        let selectby=req.query.fields.split(',').join(' ')
        query=query.select(selectby)
    }

    let products=await query
    const totalProducts = await productModel.countDocuments(filter);
    res.status(200).json({products_count: totalProducts, page_count: Math.ceil(totalProducts / limit),length:products.length,page,data:products})
})
//get specfic product
//method : get
// route : /api/v1/products/id
let get_specfic_product=AsyncHandler(async(req,res,next)=>{
    let {id}=req.params
    let product=await productModel.findById(id)
    .populate('reviews')
    .populate({
        path:"category",
        select:"name _id"
    })
    .populate({
        path:"brand",
        select:"name _id"
    })
    .populate({
        path:"subcategory",
        select:"name _id"
    })
    if(!product){
       return next(new Handel_ERROR_GLOBAL_APP("product not found "))
    }else{
        res.status(200).json(product)
    }
})
//update product
//* method : put
//route: /api/v1/products/id
// role : admin
let update_product=AsyncHandler(async(req,res,next)=>{
    console.log(req.body);
console.log(req.file);
    let {id}=req.params
    let existing=await productModel.findById(id)
          if(!existing){
            return next(new Handel_ERROR_GLOBAL_APP("not found name",404)) }
        if(req.body.name){
     req.body.slug=slugify(req.body.name)
    }
     //  create img with multer
     let img;
     if(req.file){
         let handel_create_img=await Create_img(req,"product")
         req.body.img_cover=handel_create_img
        img=req.body.img_cover
     }
     let next_img_cover=img||existing.img_cover
     ////////////
    let product=await productModel.findByIdAndUpdate(id,{...req.body,img_cover:next_img_cover},{new:true})
    if (product) {

             if (img && existing.img_cover) {
                 await Delete_img(existing.img_cover, "product");
             }
                res.status(200).json({message: "updated Done"});
    }
          if(!product){
                return next(new Handel_ERROR_GLOBAL_APP("updated faild ",404))
          }
})
//delete product full
// method : delete
//route : /api/v1/products/id
//body : id
let delete_product=AsyncHandler(async(req,res,next)=>{
    let {id}=req.params
    let product=await productModel.findByIdAndDelete(id)
    if(!product){
        return next(new Handel_ERROR_GLOBAL_APP("FAILD DELETED"))
    }else{
        await Delete_Product_img(product)
      res.status(200).json({message:"product deleted",})
    }
})
///////////////////////////////////////////////////////////

/**
 * delete img in product
 * method/delete
 * route//api/v1/products/:idProduct/:img name
 * role : admin
 */
let delete_product_img=AsyncHandler(async(req,res,next)=>{
    let {id,imgname}=req.params
    let check_product=await productModel.findById(id)
    if(!check_product){
                return next(new Handel_ERROR_GLOBAL_APP("product not found",400))
    }else{
        let check_img=check_product.imgs.includes(imgname)
        if(check_img){
            let deleteitem=await productModel.updateOne(
                {_id:id},{$pull:{imgs:imgname}}
            )
            if(deleteitem){
                await Delete_img(imgname,"product")
                res.status(200).json({message:"img deleted Done"})
            }else{
                  res.status(400).json({message:"deleted failed"})
            }
        }else{
            return next(new Handel_ERROR_GLOBAL_APP("img is not hear my product",400))
        }
    }
})
/**
 * add img in product
 * method/put
 * route /api/v1/products/:idProduct/addimg
 *  role : admin
 */
let add_product_img=AsyncHandler(async(req,res,next)=>{
    let {id}=req.params
    let check_product=await productModel.findById(id)
    if(!check_product){
         return next(new Handel_ERROR_GLOBAL_APP("product is not Hear",400))
    }else{
      if(req.file){
        //handel img with multer
          let handel_create_img=await Create_img(req,"product")
          req.body.img=handel_create_img
      }
      let addimg_indb=await productModel.updateOne({_id:id},{$push:{imgs:req.body.img}})
      if(addimg_indb){
        res.status(200).json({message:"img added Done"})

      }else{
          return next(new Handel_ERROR_GLOBAL_APP("img added faild",400))
      }
    }
})
export{create_product,get_products,get_specfic_product,delete_product,update_product,delete_product_img,add_product_img}
