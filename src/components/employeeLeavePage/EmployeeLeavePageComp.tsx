import { Button, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { getAllLeaveType } from "../../features/leaveTypeSlice";
import LeaveRequestDatatable from "./LeaveRequestDatatable";
import { createEmployeeLeaveRequest, updateEmployeeLeaveRequest } from "../../features/employeeLeaveRequest";
import { useSnackbar } from "notistack";

interface IInitialValues {
  leaveType: string;
  reason: string;
  fromDate: Date | null;
  toDate: Date | null;
  _id?: string;
  employeeID?: string;
}

const validationSchema = Yup.object({
  leaveType: Yup.string().required("Please mention the leave type"),
  reason: Yup.string().required("reason is required"),
  fromDate: Yup.date().required("From date is required").typeError("Invalid from date"),
  toDate: Yup.date().required("To date is required").typeError("Invalid from date").min(Yup.ref("fromDate")),
});

const EmployeeLeavePageComp = () => {

  const [getData, setGetData] = useState<IInitialValues | null>();
  const today = new Date();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { enqueueSnackbar } = useSnackbar();

  const initialValues = useMemo(() => ({
    leaveType: "",
    reason: "",
    fromDate: today,
    toDate: today
  }), []);

  const formik = useFormik<IInitialValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {

      if (getData) {
        const payload = { ...values };
        if (!getData?._id || !getData.employeeID) {
          enqueueSnackbar("Invalid leave request data", { variant: "error" });
          return;
        }
        const resultAction = await dispatch(updateEmployeeLeaveRequest({
          id: getData._id,
          employeeID: getData.employeeID,
          leaveType: payload.leaveType,
          reason: payload.reason,
          fromDate: payload?.fromDate ? new Date(payload.fromDate).toISOString() : "",
          toDate: payload?.toDate ? new Date(payload.toDate).toISOString() : "",
          enqueueSnackbar,
        }));
        if (updateEmployeeLeaveRequest.fulfilled.match(resultAction)) {
          resetForm();
          setGetData(null);
        }
      } else {
        const payload = { employeeID: user?._id, ...values };
        const resultAction = await dispatch(createEmployeeLeaveRequest({
          ...payload,
          fromDate: payload.fromDate?.toISOString() ?? "",
          toDate: payload.toDate?.toISOString() ?? "",
          employeeID: payload.employeeID!,
          enqueueSnackbar
        }));
        if (createEmployeeLeaveRequest.fulfilled.match(resultAction)) {
          resetForm();
        }
      }
    }
  });

  const { handleSubmit, handleChange, values, handleBlur, errors, touched, setFieldValue } = formik;

  const { leaveType: leaveTypes } = useAppSelector(state => state.leaveType);

  useEffect(() => {
    dispatch(getAllLeaveType());
    setGetData(null);
  }, []);

  useEffect(() => {
    if (getData) {
      setFieldValue("leaveType", getData.leaveType);
      setFieldValue("reason", getData.reason);
      setFieldValue("fromDate", getData?.fromDate ? new Date(getData.fromDate) : null);
      setFieldValue("toDate", getData?.toDate ? new Date(getData.toDate) : null);
    }
  }, [getData]);

  return (
    <div className="p-5">
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="grid grid-cols-2 py-3.5 gap-5">
          <TextField
            select
            fullWidth
            name="leaveType"
            label="Leave Type"
            variant="outlined"
            margin="normal"
            value={values.leaveType}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.leaveType && Boolean(errors.leaveType)}
            helperText={touched.leaveType && errors.leaveType}
            sx={{ margin: "0" }}
          >
            {leaveTypes?.map((option, index) => (
              <MenuItem key={index} value={option?._id}>
                {option?.leaveType}
              </MenuItem>
            ))}
          </TextField>
          <div className="grid grid-cols-2 gap-x-3">
            <DatePicker
              label="From Date"
              value={values.fromDate}
              onChange={(date) => setFieldValue("fromDate", date)}
              disablePast
              slotProps={{
                textField: {
                  name: "fromDate",
                  onBlur: handleBlur,
                  error: touched.fromDate && Boolean(errors.fromDate),
                  helperText: touched.fromDate && errors.fromDate,
                },
              }}
            />

            <DatePicker
              label="To Date"
              value={values.toDate}
              onChange={(date) => setFieldValue("toDate", date)}
              disablePast
              slotProps={{
                textField: {
                  name: "toDate",
                  onBlur: handleBlur,
                  error: touched.toDate && Boolean(errors.toDate),
                  helperText: touched.toDate && errors.toDate,
                },
              }}
            />
          </div>
        </div>
        <TextField
          fullWidth
          id="reason"
          name="reason"
          label="Reason"
          margin="normal"
          multiline
          minRows={4}
          value={values.reason}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.reason && Boolean(errors.reason)}
          helperText={touched.reason && errors.reason}
        />
        <div className="w-full mt-5 flex justify-end">
          <Button type="submit" variant="contained" sx={{ bgcolor: "#34495e" }}>{getData ? "Update" : "Submit"}</Button>
        </div>
      </form>
      <LeaveRequestDatatable setGetData={setGetData} />
    </div>
  )
}

export default EmployeeLeavePageComp;