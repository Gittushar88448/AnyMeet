import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {
    try{
        let token = localStorage.getItem('token');
        
        if(token !== ""){
            return children;
        }else{
            return <Navigate to={'/'}/>
        }
    }catch(err){
        console.log(err)
    }
}

export default ProtectedRoute;