import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { updateUserProfile } from "../../features/profileSlice";

interface IInitialValues {
  id: string;
  username?: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
}

const validationSchema = Yup.object({
  username: Yup.string().optional(),
  email: Yup.string().email("Invalid Email").optional(),
  newPassword: Yup.string().optional(),
  oldPassword: Yup.string().optional()
});

const Profile = () => {

  const [inputDisabled, setInputDisabled] = useState(true);
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const initialValues: IInitialValues = { id: "", username: user?.name, email: user?.email, oldPassword: "", newPassword: "" };
  const formik = useFormik<IInitialValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!user?._id) return;
      const payload = {
        ...values,
        id: user._id,
        enqueueSnackbar, // make sure this is passed
      };
      const response = await dispatch(updateUserProfile(payload));
      if (updateUserProfile.fulfilled.match(response)) {
        handleResetForm();
      }
    }
  });
  const { handleSubmit, handleChange, values, handleBlur, errors, touched, setFieldValue } = formik;

  const handleResetForm = () => {
    setFieldValue("oldPassword", "");
    setFieldValue("newPassword", "");
    setInputDisabled(true);
  }

  return (
    <div className="py-2 px-4">
      <h1 className="text-3xl font-bold text-center">Profile</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          id="username"
          name="username"
          label="Username"
          margin="normal"
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={inputDisabled}
          error={touched.username && Boolean(errors.username)}
          helperText={touched.username && errors.username}
        />
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          margin="normal"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={inputDisabled}
          error={touched.email && Boolean(errors.email)}
          helperText={touched.email && errors.email}
        />
        <TextField
          fullWidth
          id="oldPassword"
          name="oldPassword"
          label="Old Password"
          margin="normal"
          type="password"
          value={values.oldPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={inputDisabled}
          error={touched.oldPassword && Boolean(errors.oldPassword)}
          helperText={touched.oldPassword && errors.oldPassword}
        />
        <TextField
          fullWidth
          id="newPassword"
          name="newPassword"
          label="New Password"
          margin="normal"
          type="password"
          value={values.newPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={inputDisabled}
          error={touched.newPassword && Boolean(errors.newPassword)}
          helperText={touched.newPassword && errors.newPassword}
        />
        <div className="flex items-center justify-end pt-5 gap-6">
          <Button variant="outlined" size="large" color="error" onClick={() => setInputDisabled(!inputDisabled)}>Edit</Button>
          <Button variant="contained" color="success" size="large" disabled={inputDisabled} type="submit">Update</Button>
        </div>
      </form>
    </div>
  )
}

export default Profile;