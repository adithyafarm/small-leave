import { useAppSelector } from '../../store/hook';
import { Navigate, Outlet } from 'react-router-dom';

interface IAllowedRoles {
    allowedRoles: string[];
}

const ProtectedRoutes = ({ allowedRoles }: IAllowedRoles) => {
    const { isLoggedIn,role } = useAppSelector(state => state.auth);
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    const userRole = role as string;

    if (userRole && allowedRoles.includes(userRole)) {
        return <Outlet />
    }
}

export default ProtectedRoutes;