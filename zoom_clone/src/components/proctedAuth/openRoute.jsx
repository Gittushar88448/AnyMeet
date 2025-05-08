import { Navigate } from "react-router-dom";

const OpenRoute = ({children}) => {
    let token = localStorage.getItem('token');
    if(token === ''){
        return children;
    }else{
        return <Navigate to={'/dashboard'}/>
    }
}

export default OpenRoute;
