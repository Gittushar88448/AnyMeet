import { Navigate } from "react-router-dom";

const OpenRoute = ({children}) => {
    let token = JSON.parse(localStorage.getItem('token'));
    console.log("open route token", token);
    
    if(token == null || token == undefined){
        return children;
    }else{
        return <Navigate to={'/dashboard'}/>
    }
}

export default OpenRoute;
