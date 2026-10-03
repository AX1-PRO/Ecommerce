import { useEffect, useState } from 'react';
import { UploadCloud, ImagePlus, X } from 'lucide-react';
import {useSelector,useDispatch} from 'react-redux'
import {get_subcategory} from '../../../store/sub_category/sub_category_api'
import {get_category} from '../../../store/category/category_api'
import {get_brand} from '../../../store/brand/brand_api'
import {create_product} from '../../../store/Product/Product_api'
/* داخل component */
export default function CreateProduct() {
   let {loading:loadcat, categorys } = useSelector((e) => {return e.category_slice;});//category
   let {loading:loadbra, brands } = useSelector((e) => {return e.brand_slice;}); //brands
   let {loading:loadsub, subcategories } = useSelector((e) => {return e.subcategory_slice;}); //subcategorry
   let {loading_product,error_product}=useSelector((e)=>{return e.product_slice})

   let dispatch=useDispatch()
  const [colors, setColors] = useState([]);
  const [colorInput, setColorInput] = useState("#0000000");
  const [cover, setCover] = useState({imgurl:'',file:null});
  const [images, setImages] = useState([]);
  const [data,setdata]=useState({name:'',description:'',count:'',normal_price:'',discount:''})
  const [selected,setselected]=useState({categors:'',subcategory:'',brand:''})
useEffect(()=>{
 dispatch(get_category())
    dispatch(get_subcategory())
    dispatch(get_brand())
},[dispatch])
  const handleCover = (e) => {
    setCover({imgurl:URL.createObjectURL(e.target.files[0]),file:e.target.files[0]});
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    const preview = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages([...images, ...preview]);
  };
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };
  let handelsubmit=async(e)=>{
    e.preventDefault();
    try{
      let formdata=new FormData()
      formdata.append("name",data.name)
           formdata.append("description",data.description)
           formdata.append("count",data.count)
           formdata.append("price",data.normal_price)
           formdata.append("discount",data.discount)
           formdata.append("colors",colors)
           formdata.append("img_cover",cover.file)
           images.forEach((el)=>{
            formdata.append('imgs',el.file)
           })
           formdata.append("category",selected.categors)
           formdata.append("subcategory",selected.subcategory)
           formdata.append("brand",selected.brand)
         dispatch(create_product(formdata))
  }catch(err){
    console.error(err)
  }
  }
 if(loadcat?.getall||loadsub?.getall||loadbra?.getall){
  return (<p>LOading......</p>)
 }
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Create Product</h1>
          <p className="text-gray-500 mt-2">Add a new product to your store</p>
        </div>

        <form onSubmit={handelsubmit} className="space-y-8">
          {/* Basic Information */}

          <div className="bg-white rounded-3xl shadow p-8">
            <h2 className="text-2xl font-semibold mb-6">Product Information</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">Product Name</label>
                <input value={data.name} onChange={(e)=>{setdata({...data,name:e.target.value})}} type="text" placeholder="Nike Air Max..." className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                <p className='captalize text-red-500'>{error_product.when_create?.name?error_product.when_create.name:''}</p>
              </div>

              <div>
                <label className="block mb-2 font-medium">Product Count</label>
                <input value={data.count} onChange={(e)=>{setdata({...data,count:e.target.value})}} type="number" className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                 <p className='captalize text-red-500'>{error_product.when_create?.count?error_product.when_create.count:''}</p>
              </div>
              <div>
                <label className="block mb-2 font-medium">Normal Price</label>
                <input value={data.normal_price} onChange={(e)=>{setdata({...data,normal_price:e.target.value})}} type="number" className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                 <p className='captalize text-red-500'>{error_product.when_create?.normal_price?error_product.when_create.normal_price:''}</p>
              </div>
              <div>
                <label className="block mb-2 font-medium">Discount Price</label>
                <input  value={data.discount} onChange={(e)=>{setdata({...data,discount:e.target.value})}} type="number" className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                 <p className='captalize text-red-500'>{error_product.when_create?.discount?error_product.when_create.discount:''}</p>

              </div>
            </div>

            <div className="mt-6">
              <label className="block mb-2 font-medium">Description</label>
              <textarea value={data.description} onChange={(e)=>{setdata({...data,description:e.target.value})}} rows={6} className="w-full border rounded-xl p-4 outline-none resize-none focus:ring-2 focus:ring-blue-500" placeholder="Write product description..." />
              <p className='captalize text-red-500'>{error_product.when_create?.description?error_product.when_create.description:''}</p>

            </div>
          </div>

          {/* Category */}

          <div className="bg-white rounded-3xl shadow p-8">
            <h2 className="text-2xl font-semibold mb-6">Product Details</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block mb-2 font-medium">Category</label>
                <select value={selected.categors} onChange={(e)=>{setselected({...selected,categors:e.target.value})}} className="w-full border rounded-xl px-4 py-3">
                  <option>Select category</option>
                    {categorys?.data?.map((c) => (
                       <option key={c._id} value={c._id}>
                          {c.name}
                       </option>
                   ))}
                </select>
               <p className='captalize text-red-500'>{error_product.when_create?.category?error_product.when_create.category:''}</p>

              </div>
           {/**subcategory */}
              <div>
                <label className="block mb-2 font-medium">SubCategory</label>
                <select value={selected.subcategory} onChange={(e)=>{setselected({...selected,subcategory:e.target.value})}} className="w-full border rounded-xl px-4 py-3">
                  <option value="">Select sub Category</option>
                    {subcategories?.data?.map((c) => (
                       <option key={c._id} value={c._id}>
                          {c.name}
                       </option>
                   ))}
                </select>
               <p className='captalize text-red-500'>{error_product.when_create?.subcategory?error_product.when_create.subcategory:''}</p>
              </div>
              {/**brands */}
              <div>
                <label className="block mb-2 font-medium">Brand</label>
                <select value={selected.brand} onChange={(e)=>{setselected({...selected,brand:e.target.value})}} className="w-full border rounded-xl px-4 py-3">
                  <option>Select Brand</option>
                    {brands?.data?.map((c) => (
                       <option key={c._id} value={c._id}>
                          {c.name}
                       </option>
                   ))}
                </select>
               <p className='captalize text-red-500'>{error_product.when_create?.brand?error_product.when_create.brand:''}</p>

              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="bg-white rounded-3xl shadow p-6 sm:p-8">
            <h2 className="text-2xl font-semibold mb-6">Colors</h2>

            {/* ADD COLOR */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="color" value={colorInput} onChange={(e) => setColorInput(e.target.value)} className="w-full sm:w-20 h-12 border rounded-xl cursor-pointer" />

              <button
                type="button"
                onClick={(e) => {
                  if (!colorInput) return;
                  if (colors.includes(colorInput)) return;

                  setColors([...colors, colorInput]);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
              > Add Color
              </button>
            </div>

            {/* SELECTED COLORS */}
            <div className="flex flex-wrap gap-3 mt-5">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-full shadow bg-white border">
                  <span className="w-5 h-5 rounded-full border" style={{ backgroundColor: color }} />

                  <span className="text-sm">{color}</span>

                  <button onClick={() => setColors(colors.filter((c) => c !== color))} className="text-red-500 hover:text-red-700">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cover Image */}

          <div className="bg-white rounded-3xl shadow p-8">
            <h2 className="text-2xl font-semibold mb-6">Cover Image</h2>
            <label className="border-2 border-dashed border-blue-300 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition">
              <UploadCloud size={50} className="text-blue-500 mb-3" />
              <p className="font-semibold">Upload Cover Image</p>
              <span className="text-gray-500 text-sm">PNG JPG WEBP</span>
              <input hidden type="file" onChange={handleCover} />
            </label>
            {cover.imgurl && <img src={cover.imgurl} className="mt-6 w-52 rounded-2xl shadow" alt="" />}
          </div>

          {/* Gallery */}

          <div className="bg-white rounded-3xl shadow p-8">
            <h2 className="text-2xl font-semibold mb-6">Product Gallery</h2>

            <label className="border-2 border-dashed border-blue-300 rounded-2xl p-10 flex flex-col items-center cursor-pointer hover:bg-slate-50">
              <ImagePlus size={50} className="text-blue-500 mb-3" />

              <p>Add Product Images</p>

              <input hidden multiple type="file" onChange={handleImages} />
            </label>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 mt-8">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img.url} alt="" className="rounded-xl h-36 w-full object-cover" />

                  <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <p className=' capitalize text-green-600'>{error_product.when_create?.message?error_product.when_create?.message:''}</p>
          <div className="flex justify-end gap-4">
            <button type="button" className="px-8 py-3 rounded-xl border"> Cancel </button>
            <button  type="submit" className="px-8 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700"> Save Product </button>
          </div>
        </form>
      </div>
    </div>
  );
}
