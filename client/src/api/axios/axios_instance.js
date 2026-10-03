import axios from "axios";
let api=axios.create({  baseURL:"http://localhost:8000/api/v1"});
export default api