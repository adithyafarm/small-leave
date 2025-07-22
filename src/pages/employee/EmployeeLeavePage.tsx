import { LocalizationProvider } from "@mui/x-date-pickers"
import EmployeeLeavePageComp from "../../components/employeeLeavePage/EmployeeLeavePageComp"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"

const EmployeeLeavePage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center pt-3">Employee Leave Page</h1>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <EmployeeLeavePageComp />
      </LocalizationProvider>
    </div>
  )
}

export default EmployeeLeavePage