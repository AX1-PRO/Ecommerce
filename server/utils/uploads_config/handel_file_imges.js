import { v4 as uuid } from "uuid"
import sharp from "sharp"
import {unlink} from "fs/promises"
import path from "path"
import {fileURLToPath} from "url"
let __filename=fileURLToPath(import.meta.url)
let __dirname=path.dirname(__filename)
 //when create img category-subcategory-brand////
 let Create_img=async(req,target)=>{
     if(req.file){
         let name=`${target.toUpperCase().slice(0,3)}-${uuid()}-BX!.jpeg`
         await sharp(req.file.buffer) .resize(500,600).toFormat('jpeg').jpeg({quality:90}) .toFile(`uploads_files/${target}/${name}`)
         return name
        }
    }
    //when delete img category-subcategory-brand////
let Delete_img=async(link,target)=>{
      let old_path_DELETED=path.join(__dirname,`../../uploads_files/${target}`,link)
      await unlink(old_path_DELETED)
}
/////////////all proses product //////////////
//DELETE
let Delete_Product_img=async(target)=>{
    let imgs_DEL=[target.img_cover,...target.imgs]
    await Promise.all(
        imgs_DEL.map(async(img)=>{
            try{
            let old_path_DELETED=path.join(__dirname,`../../uploads_files/product`,img)
            await unlink(old_path_DELETED)
            }
            catch(err){
               console.error(err)
            }
        })
    )
    
}
export {Create_img,Delete_img,Delete_Product_img}