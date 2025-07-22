import LeaveTypeComp from "../../components/leaveType/LeaveTypeComp";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const LeaveType = () => {

  return (
    <div className="p-4">
      <h1 className="text-2xl text-center font-bold mb-3">Leave Type</h1>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <LeaveTypeComp />
      </LocalizationProvider>
    </div>
  )
}

export default LeaveType