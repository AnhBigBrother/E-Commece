import { Navigate, Outlet } from 'react-router-dom';

const AuthLayout = () => {
  const user = localStorage.getItem('user');
  return <>{user ? <Navigate to='/home' /> : <Outlet />}</>;
};

export default AuthLayout;
