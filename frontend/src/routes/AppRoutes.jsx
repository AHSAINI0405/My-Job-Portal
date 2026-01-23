import {Routes, Route} from "react-router-dom";
import Home  from "../components/pages/Home"
import Login  from "../components/pages/Login"
import Register from "../components/pages/Register"
const AppRoutes = () =>{
    return(
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
        </Routes>
    )
}
export default AppRoutes;