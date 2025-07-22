import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { loggedIn, loginUser, registerUser } from "../features/authSlice";
import { useAppDispatch } from "../store/hook";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import WifiPasswordIcon from '@mui/icons-material/WifiPassword';

interface IInitialValues {
    username?: string;
    email: string;
    password: string;
}

const validationSchema = Yup.object({
    username: Yup.string().optional(),
    email: Yup.string().email("Invalid Email").required("Email is required"),
    password: Yup.string().min(5, "Password atleast 6 character").required("Password is required")
});

const registerValidationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid Email").required("Email is required"),
    password: Yup.string().min(5, "Password atleast 6 character").required("Password is required")
});

const Login = () => {

    const [loginState, setLoginState] = useState(true);
    const dipatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const schema = loginState ? validationSchema : registerValidationSchema;
    const initialValues: IInitialValues = loginState
        ? { email: "", password: "" }
        : { username: "", email: "", password: "" };
    const formik = useFormik<IInitialValues>({
        initialValues,
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            if (loginState) {
                const response = await dipatch(loginUser({ ...values, enqueueSnackbar }));
                if (loginUser.fulfilled.match(response)) {
                    dipatch(loggedIn());
                    const role = response?.payload?.user.role === "admin" ? '/employee-details' : "/profile";
                    navigate(role);
                }
            } else {
                dipatch(registerUser({ ...values, enqueueSnackbar }));
            }
        }
    });
    const { handleSubmit, handleChange, values, handleBlur, errors, touched, handleReset } = formik;

    return (
        <div className="w-full h-screen flex items-center justify-center bg-[#34495e]">
            <div className="w-[40rem] shadow-xl px-8 py-10 rounded-md bg-[#fff] m-3">
                <h1 className="text-3xl font-bold text-center">{!loginState ? "Register page" : "Login Page"}</h1>
                <form onSubmit={handleSubmit}>
                    {!loginState && <TextField
                        fullWidth
                        id="username"
                        name="username"
                        label="Username"
                        margin="normal"
                        variant="standard"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.username && Boolean(errors.username)}
                        helperText={touched.username && errors.username}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />}
                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Email"
                        margin="normal"
                        variant="standard"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}                        
                          slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MailOutlineIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label="Password"
                        margin="normal"
                        type="password"
                        variant="standard"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                          slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <WifiPasswordIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <div className="flex flex-col items-center justify-end pt-5 gap-6">
                        <Button variant="contained" sx={{ bgcolor: "#34495e" }} size="large" type="submit">{loginState ? "Login" : "Register"} Now</Button>
                        <Typography>{!loginState ? "Already" : "Don't"} have an account?<span className="text-[#34495e] pl-1 cursor-pointer font-bold" onClick={() => { setLoginState(!loginState); handleReset(undefined) }}>{!loginState ? "Login now" : "Register now"}</span></Typography>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;