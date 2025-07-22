import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, MenuItem
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../store/hook";
import { createEmployee } from "../../features/employeeSlice";
import { useSnackbar } from "notistack";
import { useEffect } from "react";

const roles = ["employee", "admin"];

const getValidationSchema = (isUpdate: boolean) => Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: isUpdate
        ? Yup.string()
        : Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
    confirmPassword: isUpdate
        ? Yup.string()
        : Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Confirm Password is required"),
    role: Yup.string().oneOf(roles).required("Role is required"),
});

interface FormValues {
    id: number;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
}

const EmployeeDetailsModal = ({ open, onClose, handleFunc, editModalFunc }: { open: boolean; onClose: () => void, handleFunc?: (payload: Partial<FormValues>) => void, editModalFunc?: Partial<FormValues> }) => {
console.log("editModalFunc",editModalFunc);

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "",
        },
        validationSchema: getValidationSchema(!!handleFunc),
        onSubmit: (values) => {
            const { confirmPassword, ...payload } = values;
            if (editModalFunc && handleFunc) {
                handleFunc(payload);
            } else {
                dispatch(createEmployee({ ...payload, enqueueSnackbar }));
            }
            formik.resetForm();
            onClose();
        },
    });

  useEffect(() => {
    if (!open) return; // Only act when modal is open

    if (editModalFunc) {
        formik.setValues({
            name: editModalFunc.name || "",
            email: editModalFunc.email || "", 
            password: editModalFunc.password || "",
            confirmPassword: editModalFunc.confirmPassword || "",
            role: editModalFunc.role || ""
        });
    } else {
        formik.resetForm(); 
    }
}, [editModalFunc, open]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>{editModalFunc ? "Update" : "Create New"} User</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        name="name"
                        label="Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && !!formik.errors.name}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="email"
                        label="Email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && !!formik.errors.email}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    {!editModalFunc && <><TextField
                        fullWidth
                        margin="normal"
                        name="password"
                        label="Password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && !!formik.errors.password}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                        <TextField
                            fullWidth
                            margin="normal"
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        /></>}
                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        name="role"
                        label="Role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.role && !!formik.errors.role}
                        helperText={formik.touched.role && formik.errors.role}
                    >
                        {roles.map((role) => (
                            <MenuItem key={role} value={role}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary" variant="outlined">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" sx={{ bgcolor: "#34495e" }}>
                        {editModalFunc ? "Update" : "Submit"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EmployeeDetailsModal;
