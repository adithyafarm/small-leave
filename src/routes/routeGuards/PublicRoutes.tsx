import type { ReactNode } from 'react';
import { useAppSelector } from '../../store/hook';
import { Navigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

const PublicOnlyRoute = ({ children }: Props) => {
  const { isLoggedIn,role } = useAppSelector((state) => state.auth);

  const userRole = role === "admin" ? "/employee-details" : "/profile";

  if (isLoggedIn) {
    return <Navigate to={userRole} replace />;
  }

  return <>{children}</>;
};

export default PublicOnlyRoute;
