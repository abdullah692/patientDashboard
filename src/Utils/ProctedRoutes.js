import { Navigate, Outlet } from "react-router-dom";
export const ProtectedRoute = ({
  user,
  redirectPath = '/',
  children,
}) => {
  console.log(user,'aaaaaaaaaaaUser');
  if (!user) {
    return <Navigate to={redirectPath} replace={true}  />;
  }
  return children ;
};