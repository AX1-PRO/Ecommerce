import { check } from "express-validator";
import { msgValidator } from "./errorMsgexpressValidator.js";
//create product
let createproductValidator=[
    check('name').notEmpty().withMessage("name is empty")
    .isLength({min:3}).withMessage("name is short")
    ,check('description')
    .notEmpty().withMessage("describtion is empty")
    .isLength({ min: 20}).withMessage("you short descri")
    ,check('count').notEmpty().withMessage('count is empty')
    .isNumeric().withMessage("count is not a number")
    ,check('price')
    .notEmpty().withMessage("price is empty")
    .isNumeric().withMessage("price must me number")
    .isLength({max:32}).withMessage(" price higher 32 char")
    ,check('discount').optional()
    .isInt({ min: 0 }).withMessage("price after discount must be number")
    .toFloat()
    .custom((value,{req})=>{
    if (Number(req.body.price) <= value){
        throw new Error("discount must be lower than price")
    }
    return true
     })
    ,check('img_cover')
    .optional()
    ,check('imgs')
    .optional()
    ,check('category')
    .notEmpty().withMessage("category is empty")
    .isMongoId().withMessage("category is not found")
    ,check('subcategory')
    .notEmpty().withMessage("subcategory is empty")
    .isMongoId().withMessage("subcategory is not found"),
    check('brand')
    .optional()
    .isMongoId().withMessage("Invalid brand id")
    ,check('rating')
    .optional()
    .isNumeric().withMessage("rating must be anumber ")
   .isFloat({ min: 1, max: 5 })
    ,check('count_rating').optional().isNumeric().withMessage('count wrating must be anumber')
,msgValidator
]
let specificproductValidator=[
    check('id').isMongoId().withMessage("product is not found"),
    msgValidator
]
let updateproductValidator=[
    check('id').isMongoId().withMessage("product is not found"),
    msgValidator
]
let deleteproductValidator=[
    check('id').isMongoId().withMessage("product is not found"),
    msgValidator
]
export{createproductValidator,specificproductValidator,updateproductValidator,deleteproductValidator}
