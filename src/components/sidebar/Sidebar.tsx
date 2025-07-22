import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { persistor } from "../../store/store";
import { logout } from "../../features/authSlice";
import { CgProfile } from "react-icons/cg";
import { CiSquareQuestion } from "react-icons/ci";
import { AiOutlineLogout } from "react-icons/ai";

interface ISidebar {
    label: string;
    path: string;
    roles: string[];
    icon?: any;
}

const sidebarData: ISidebar[] = [
    { label: "Employee Details", path: "/employee-details", roles: ["admin"] },
    { label: "Leave Type", path: "/leave-type", roles: ["admin"] },
    { label: "Leave Request", path: "/leave-request", roles: ["admin"] },
    { label: "Profile", path: "/profile", roles: ["employee"], icon: CgProfile },
    { label: "Employee Leave Request", path: "/employee-leave", roles: ["employee"], icon: CiSquareQuestion },
    { label: "Logout", path: "/", roles: ["employee", "admin"], icon: AiOutlineLogout },
];

const Sidebar = () => {

    const state = useAppSelector(state => state.auth);
    const filteredSidebar = sidebarData.filter((val: ISidebar) => val.roles.includes(state.role));
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        dispatch(logout());
        await persistor.purge();
        navigate("/login", { replace: true });
    };

    return (
        <div className="w-[20rem] bg-[#34495e] min-h-screen">
            <h1 className="text-xl font-bold mb-4 p-2 bg-[#fff] border-r-[#34495e]  text-black text-center">Sidebar</h1>
            <ul className="space-y-2 p-2">
                {filteredSidebar.map((item, index) => (
                    <li key={index} className="mb-4 cursor-pointer">
                        {item.label === "Logout" ? (
                            <button
                                onClick={handleLogout}
                                className="text-xl font-bold text-[#e74c3c] cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon && <item.icon size={20} />} {item.label}
                                </div>
                            </button>
                        ) : (
                           <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `text-lg font-bold flex items-center gap-3 p-2 rounded ${
                                        isActive ? "bg-[#f1c40f] text-black" : "text-white"
                                    }`
                                }
                            >
                                {item.icon && <item.icon size={20} />} {item.label}
                            </NavLink>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Sidebar;