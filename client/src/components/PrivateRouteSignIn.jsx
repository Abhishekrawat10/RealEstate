import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRouteSignIn = () => {
 const { currentUser } = useSelector((state) => state.user);
 return !currentUser ? <Outlet /> : <Navigate to="/"/>
};

export default PrivateRouteSignIn;
