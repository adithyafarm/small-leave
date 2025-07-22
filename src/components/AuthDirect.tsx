// components/AuthRedirect.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const AuthRedirect = () => {
  const { isLoggedIn, token } = useSelector((state: RootState) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn && !token) {
        navigate("/login");
        enqueueSnackbar("Session expired. Please log in again.", { variant: "error" });
    }
  }, [isLoggedIn, token, enqueueSnackbar, navigate]);

  return null;
};

export default AuthRedirect;
