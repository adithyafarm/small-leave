import { Outlet } from 'react-router-dom'

const Mainbar = () => {
  return (
    <div className='p-2 w-full h-screen bg-[#ecf0f1]'>
      <div className="m-5 bg-white rounded-b-sm h-[calc(100vh-50px)] shadow">
        <Outlet />
      </div>
    </div>
  )
}

export default Mainbar;