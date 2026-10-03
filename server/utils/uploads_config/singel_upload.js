import multer from "multer"
let handelupload=multer.memoryStorage()
let upload=multer({storage:handelupload})
export {upload}