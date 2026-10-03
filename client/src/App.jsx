import {Outlet, Route,Routes,Navigate} from "react-router"
import { useEffect } from "react"
import { Suspense,lazy } from "react"
import Home from "./pages/Home/Home"
import Swap_Header from "./components/protect_routes/swap_header"
import Main_footer from './Layout/Footer/Main_footer'
/////////auth get me/////////
import { useDispatch } from "react-redux"
import { getMe } from "./store/auth/atuh.api"
import { get_all_cart } from "./store/Cart/cart_api"
////////////////////////////
//user account
import Register from './pages/Register/Signup'
import Login from './pages/Register/Login'
import Forgetpassword from "./pages/Register/Forgetpassword"
import VerifyCode from "./pages/Register/Verify_code"
import Resetpassword from "./pages/Register/Resetpassword"
/////////////
import Cart from './pages/cart/index'
import Favorit from "./pages/favorit/favorit"
import Notfoundpage from "./pages/notfound/Notfoundpage"
import AboutPage from "./pages/about/About"
import Protect_auth from "./components/protect_routes/protect_auth"
import Protect_profile from './components/protect_routes/protect_profile'
import Protect_admin from './components/protect_routes/Protect_admin'
import Protect_reset from './components/protect_routes/Protect_reset'
//admin routes
import Admin from './Admin/index'
let Product =lazy(()=>import('./Admin/pages/Product'))
let Users =lazy(()=>import("./Admin/pages/Users"))
let Category =lazy(()=>import("./Admin/pages/Category"))
let Subcategory =lazy(()=>import("./Admin/pages/Subcategory"))
let Orders =lazy(()=>import('./Admin/pages/Orders'))
let Brand =lazy(()=>import("./Admin/pages/Brand"))
let Coupon=lazy(()=>import('./Admin/pages/coupon'))
//product
let Allproduct=lazy(()=>import('./Admin/componenet/product/allproduct'))
let Createproduct=lazy(()=>import('./Admin/componenet/product/create_product'))
let Editproduct=lazy(()=>import('./Admin/componenet/product/edit_product'))
//category
let Allcategory=lazy(()=>import('./Admin/componenet/category/Allcategory'))
let Createcategory=lazy(()=>import('./Admin/componenet/category/Createcategory'))
let Editcategory=lazy(()=>import('./Admin/componenet/category/Editcategory'))
//subcategory
let Allsubcategory=lazy(()=>import('./Admin/componenet/sub_category/Allsubcategory'))
let Createsubcategory=lazy(()=>import('./Admin/componenet/sub_category/Createsubcategory'))
let Editsubcategory=lazy(()=>import('./Admin/componenet/sub_category/Editsubcategory'))
//brand
let Allbrand=lazy(()=>import('./Admin/componenet/Brand/Allbrand'))
let Createbrand=lazy(()=>import('./Admin/componenet/Brand/Createbrand'))
let Editbrand=lazy(()=>import('./Admin/componenet/Brand/Editbrand'))
//user
let Alluser=lazy(()=>import('./Admin/componenet/users/Allusers'))
let Edituser=lazy(()=>import('./Admin/componenet/users/Edituser'))
//location
let Location=lazy(()=>import('./pages/Profile/editLocation'))
//profile
import Profile_manager from './pages/Profile/index'
let Profile=lazy(()=>import('./pages/Profile/Profile'))
let Change_password_profile=lazy(()=>import('./pages/Profile/Changepassword'))
let Profileedit=lazy(()=>import('./pages/Profile/Profileedit'))
let Orderdetails=lazy(()=>import('./pages/Profile/orderDetails'))
//all users anybody
import Products from './pages/products/index'
import AllProducts from './pages/products/products'
import Productedit from "./pages/products/Productdetails"
//category page
import Categorys from './pages/category/category'
//coupon
let Allcoupons=lazy(()=>import('./Admin/componenet/coupon/coupons'))
let Createcoupons=lazy(()=>import('./Admin/componenet/coupon/createCoupon'))
//payment
import Cartuser from "./pages/cart/Cart"
import Pay from "./pages/cart/pay/CashPayment"
function App() {
  let dispatch=useDispatch()
 useEffect(() => {
    const getUserData = async () => {
        try {
            await dispatch(getMe()).unwrap();
            await dispatch(get_all_cart()).unwrap();
        } catch (error) {
            console.log(error);
        }
    };

    getUserData();
}, [dispatch]);
 return (
  <>
   <Swap_Header />
     <Suspense>
        <Routes>
           <Route path="/" element={<Home/>}></Route>
           <Route path="products" element={<Products/>}>
                <Route index element={<AllProducts/>}></Route>
                <Route path={"productEdit/:id"} element={<Productedit/>}></Route>
           </Route>
           <Route path="/categorys" element={<Categorys/>}></Route>
           <Route element={<Protect_auth/>}>{/**protect auth */}
                  <Route path="/Register" element={<Register/>}></Route>
                  <Route path="/login" element={<Login/>}></Route>
                  <Route path="/Forgetpassword" element={<Forgetpassword/>}></Route>
                  <Route path="/VerifyCode" element={<Protect_reset requiredState={false}>< VerifyCode/></Protect_reset>}></Route>
                  <Route path="/Resetpassword" element={<Protect_reset requiredState={true}>< Resetpassword/></Protect_reset>}></Route>
           </Route>
            <Route element={<Protect_profile/>}>{/**protect profile */}
                  <Route path="/Cart" element={<Cart/>}>
                         <Route index element={<Cartuser/>}></Route>
                         <Route path="pay" element={<Pay/>}></Route>
                </Route>
                  <Route path="/Favorit" element={<Favorit/>}></Route>
                  <Route path="/About" element={<AboutPage/>}></Route>
                  <Route path="/profile" element={<Profile_manager/>}>
                    <Route index element={<Profile/>}></Route>
                    <Route path="changepassword" element={<Change_password_profile/>}></Route>
                    <Route path="profileedit" element={<Profileedit/>}></Route>
                    <Route path="LocationEdit" element={<Location/>}></Route>
                    <Route path="OrderDetails" element={<Orderdetails/>}></Route>
                  </Route>
            </Route>
           <Route element={<Protect_admin/>}>
                   <Route path="/admin" element={<Admin/>}>
                   <Route index element={<Navigate to="orders" replace />} />
                                {/**category */}
                             <Route path="category" element={<Category/>}>
                                 <Route index element={<Allcategory/>}></Route>
                                 <Route path="Createcategory" element={<Createcategory/>}></Route>
                                 <Route path="Editcategory/:id" element={<Editcategory/>}></Route>
                             </Route>
                               {/**product */}
                             <Route path="Products" element={<Product/>}>
                                 <Route index element={<Allproduct/>}></Route>
                                 <Route path="Createproduct" element={<Createproduct/>}></Route>
                                 <Route path="Editproduct/:id" element={<Editproduct/>}></Route>
                             </Route>
                               {/**subcategory */}
                             <Route path="Subcategory" element={<Subcategory/>}>
                                 <Route index element={<Allsubcategory/>}></Route>
                                 <Route path="Createsubcategory" element={<Createsubcategory/>}></Route>
                                 <Route path="Editsubcategory/:id" element={<Editsubcategory/>}></Route>
                             </Route>
                                 {/**brand */}
                             <Route path="Brand" element={<Brand/>}>
                                 <Route index element={<Allbrand/>}></Route>
                                 <Route path="Editbrand/:id" element={<Editbrand/>}></Route>
                                 <Route path="Createbrand" element={<Createbrand/>}></Route>
                             </Route>
                                 {/**User */}
                             <Route path="Users" element={<Users/>}>
                                  <Route index element={<Alluser/>}></Route>
                                  <Route path="Edituser/:id" element={<Edituser/>}></Route>
                             </Route>
                             {/**Orders */}
                             <Route path="orders" element={<Orders/>}></Route>
                             <Route path="coupons" element={<Coupon/>}>
                                 <Route index element={<Allcoupons/>}></Route>
                                 <Route path="Createcoupon" element={<Createcoupons/>}></Route>
                             </Route>
                      </Route> {/**end Admin */}
           </Route>
                 <Route path="*" element={<Notfoundpage/>}></Route>
        </Routes>
     </Suspense>
  <Main_footer/>
  </>
 )
}

export default App
