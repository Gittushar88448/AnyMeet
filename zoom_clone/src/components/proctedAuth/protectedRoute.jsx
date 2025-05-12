import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {
    try{
        let token = JSON.parse(localStorage.getItem('token'));
        console.log(token+ "tokenn")
    if(token != null || token != undefined){
            return children;
        }else{
            return <Navigate to={'/'}/>
        }
    }catch(err){
        console.log(err)
    }
}

export default ProtectedRoute;