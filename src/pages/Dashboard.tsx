import Mainbar from "../components/mainbar/Mainbar"
import Sidebar from "../components/sidebar/Sidebar"

const Dashboard = () => {
  return (
    <div className="flex">
        <Sidebar/>
        <Mainbar />
    </div>
  )
}

export default Dashboard