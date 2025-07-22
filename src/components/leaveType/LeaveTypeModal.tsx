import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../store/hook";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { createLeaveType } from "../../features/leaveTypeSlice";

const validationSchema = Yup.object({
    leaveType: Yup.string().required("Leave type is required"),
    maxDays: Yup.number()
        .min(1, "Must be at least 1")
        .required("Max days is required")
});

interface FormValues {
    leaveType: string;
    maxDays: number;
}

const LeaveTypeModal = ({ open, onClose, handleFunc, editModalFunc }: { open: boolean; onClose: () => void, handleFunc?: (payload: Partial<FormValues>) => void, editModalFunc?: Partial<FormValues> }) => {
    
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const formik = useFormik<FormValues>({
        initialValues: {
            leaveType: "",
            maxDays: 1  
        },
        validationSchema,
        onSubmit: (values) => {
            if (editModalFunc && handleFunc) {
                handleFunc(values);
            } else {
                dispatch(createLeaveType({ leaveType: values?.leaveType, maxDays: values.maxDays, enqueueSnackbar }));
            }
            formik.resetForm();
            onClose();
        }
    });

  useEffect(() => {
    if (!open) return; // Only act when modal is open

    if (editModalFunc) {
        formik.setValues({
            leaveType: editModalFunc.leaveType || "",
            maxDays: editModalFunc.maxDays ?? 0, // safer than `||`
        });
    } else {
        formik.resetForm(); // clean for "Create" mode
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
                        name="leaveType"
                        label="Leave Type"
                        value={formik.values.leaveType}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.leaveType && !!formik.errors.leaveType}
                        helperText={formik.touched.leaveType && formik.errors.leaveType}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="maxDays"
                        label="Max Days"
                        value={formik.values.maxDays}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.maxDays && !!formik.errors.maxDays}
                        helperText={formik.touched.maxDays && formik.errors.maxDays}
                    />
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

export default LeaveTypeModal;